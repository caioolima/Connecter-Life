import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import "./chat.css";
import SidebarMenu from "../perfil/SidebarMenu/index";

const ChatScreen = () => {
  const { countryId, communityId } = useParams();
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [ws, setWs] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const [currentUserProfileImage, setCurrentUserProfileImage] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [scrollToBottomNeeded, setScrollToBottomNeeded] = useState(false);
  const [lastMessageSeenIndex, setLastMessageSeenIndex] = useState(null); // Novo estado para armazenar o índice da última mensagem vista pelo usuário

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setCurrentUserProfileImage(user.profileImageUrl);
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      fetchAllUserProfileImages();
    }
  }, [messages]);

  const loadCommunityMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/communities/comunidade/mensagens/${communityId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar mensagens da comunidade");
      }

      const data = await response.json();

      setMessages(data);
      scrollToLastMessageSeen();
    } catch (error) {
      console.error("Erro:", error.message);
    }
  };

  useEffect(() => {
    loadCommunityMessages();
    fetchAllUserProfileImages();

    const ws = new WebSocket("ws://localhost:3002");
    ws.onopen = () => {
      console.log("Conexão WebSocket estabelecida");
      setWs(ws);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [userId, communityId]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        let newMessage;
        if (event.data instanceof Blob) {
          event.data.text().then((text) => {
            try {
              newMessage = JSON.parse(text);
            } catch (error) {
              console.error("Erro ao analisar a mensagem JSON:", error.message);
              return;
            }
            console.log("Nova mensagem recebida:", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
  
            // Verifica se a mensagem recebida não é do usuário atual
            if (newMessage.userId !== userId) {
              setUnreadMessages((prevUnread) => prevUnread + 1);
              fetchUserProfileImage(newMessage.userId);
            }
          });
        } else {
          try {
            newMessage =
              typeof event.data === "string"
                ? JSON.parse(event.data)
                : event.data;
          } catch (error) {
            console.error("Erro ao analisar a mensagem JSON:", error.message);
            return;
          }
          console.log("Nova mensagem recebida:", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
  
          // Verifica se a mensagem recebida não é do usuário atual
          if (newMessage.userId !== userId) {
            setUnreadMessages((prevUnread) => prevUnread + 1);
            fetchUserProfileImage(newMessage.userId);
          }
        }
      };
    }
  }, [ws, userId]);
  

  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [messages, scrollToBottomNeeded, unreadMessages]);

  const scrollToBottomIfNeeded = () => {
    if (scrollToBottomNeeded) {
      scrollToBottom();
      setScrollToBottomNeeded(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleUnreadMessageClick = () => {
    if (unreadMessages > 0) {
      setScrollToBottomNeeded(true);
      setUnreadMessages(0);
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim() !== "" && ws.readyState === WebSocket.OPEN) {
      const newMessage = {
        userId: userId,
        message: messageInput,
        profileImage: currentUserProfileImage || "",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setScrollToBottomNeeded(true);

      ws.send(JSON.stringify(newMessage));
      setUnreadMessages(0);

      try {
        const response = await fetch(
          `http://localhost:3000/communities/comunidade/enviar-mensagem/${userId}/${communityId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao enviar mensagem");
        }

        setMessageInput("");
      } catch (error) {
        console.error("Erro:", error.message);
      }
    }
  };

  const fetchAllUserProfileImages = async () => {
    try {
      const userIds = messages.map((message) => message.userId);
      const uniqueUserIds = [...new Set(userIds)];
      for (const userId of uniqueUserIds) {
        if (!profileImages[userId]) {
          const response = await fetch(
            `http://localhost:3000/users/${userId}/profile-images`,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error("Erro ao obter a imagem de perfil do usuário");
          }

          const data = await response.json();
          setProfileImages((prevProfileImages) => ({
            ...prevProfileImages,
            [userId]: data.profileImageUrl,
          }));
        }
      }
    } catch (error) {
      console.error("Erro:", error.message);
    }
  };

  const fetchUserProfileImage = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${userId}/profile-images`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao obter a imagem de perfil do usuário");
      }

      const data = await response.json();
      setProfileImages((prevProfileImages) => ({
        ...prevProfileImages,
        [userId]: data.profileImageUrl,
      }));
    } catch (error) {
      console.error("Erro:", error.message);
    }
  };

  useEffect(() => {
    const lastSeenIndex = localStorage.getItem("lastMessageSeenIndex");
    if (lastSeenIndex !== null) {
      setLastMessageSeenIndex(parseInt(lastSeenIndex));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("lastMessageSeenIndex", messages.length - 1);
    }
  }, [messages]);

  const scrollToLastMessageSeen = () => {
    if (lastMessageSeenIndex !== null) {
      const lastMessageRef = document.querySelector(
        `.message-list .message:nth-child(${lastMessageSeenIndex + 1})`
      );
      if (lastMessageRef) {
        lastMessageRef.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      scrollToBottom();
    }
  };

  return (
    <div className="chat-screen">
      <SidebarMenu />
      <h2 className="chat-name">Chat</h2>
      <div className="message-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.userId === userId ? "right" : "left"
            }`}
          >
            {index === 0 || messages[index - 1].userId !== message.userId ? (
              <div className="user-info">
                {profileImages[message.userId] ? (
                  <img
                    src={profileImages[message.userId]}
                    alt="Profile"
                    className="rounded-image-message"
                  />
                ) : (
                  <div className="placeholder-image" />
                )}
                <h3 className="user-name">{message.username}</h3>
              </div>
            ) : null}
            <div
              className={`message-content ${
                message.userId === userId ? "right" : "left"
              }`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        {unreadMessages > 0 && (
          <p className="unread-messages" onClick={handleUnreadMessageClick}>
            {unreadMessages} mensagens não lidas
          </p>
        )}
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Digite sua mensagem"
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatScreen;
