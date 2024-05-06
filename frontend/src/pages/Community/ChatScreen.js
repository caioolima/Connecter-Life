import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import "./chat.css";
import SidebarMenu from "../perfil/SidebarMenu/index";
import { AiOutlineCamera } from "react-icons/ai"; // Importa o ícone de câmera
import { storage } from "../../components/Firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AiOutlineUser } from "react-icons/ai"; // Importando o ícone de usuário padrão

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

  const [mediaFile, setMediaFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(""); // Novo estado para armazenar o nome do arquivo selecionado
  const [usernames, setUsernames] = useState({});
  const [sendingMessage, setSendingMessage] = useState(false);
  const [firstUnreadMessageIndex, setFirstUnreadMessageIndex] = useState(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setCurrentUserProfileImage(user.profileImageUrl);
      loadCommunityMessages(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      fetchAllUserProfileImages();
    }
  }, [messages]);

  // No useEffect que carrega as mensagens da comunidade
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

      // Atualize a função para buscar nome de usuário
      const fetchUsernames = async () => {
        const userIds = data.map((message) => message.userId);
        const uniqueUserIds = [...new Set(userIds)];
        const fetchedUsernames = {};
        for (const userId of uniqueUserIds) {
          const response = await fetch(
            `http://localhost:3000/auth/user/${userId}/username`,
            {
              method: "GET",
            }
          );
          if (response.ok) {
            const userData = await response.json();
            fetchedUsernames[userId] = userData.username;
          }
        }
        return fetchedUsernames;
      };

      const usernames = await fetchUsernames();

      const newMessages = data.map((message, index) => ({
        ...message,
        username: usernames[message.userId] || "",
      }));

      setMessages(newMessages);
      setFirstUnreadMessageIndex(
        newMessages.findIndex(
          (message) => !message.isSending && !message.userId && !message.media
        )
      ); // Encontra o índice da primeira mensagem não lida

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
            // Verifica se a mensagem recebida não é do usuário atual
            if (newMessage.userId !== userId) {
              setUnreadMessages((prevUnread) => prevUnread + 1);
              fetchUserProfileImage(newMessage.userId);
              // Adiciona a mensagem apenas se não for duplicada
              if (!messages.find((msg) => msg.message === newMessage.message)) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
              }
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

          // Verifica se a mensagem recebida não é do usuário atual
          if (newMessage.userId !== userId) {
            setUnreadMessages((prevUnread) => prevUnread + 1);
            fetchUserProfileImage(newMessage.userId);
            // Adiciona a mensagem apenas se não for duplicada
            if (!messages.find((msg) => msg.message === newMessage.message)) {
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
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

      // Se houver uma primeira mensagem não lida, rolar até ela
      if (firstUnreadMessageIndex !== null) {
        const unreadMessageRef = document.querySelector(
          `.message-list .message:nth-child(${firstUnreadMessageIndex + 1})`
        );
        if (unreadMessageRef) {
          unreadMessageRef.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  // Função para enviar mensagens pendentes
  const sendPendingMessages = async () => {
    // Verifica se há conexão de internet
    if (navigator.onLine) {
      // Obter mensagens pendentes do armazenamento local
      const pendingMessages =
        JSON.parse(localStorage.getItem("pendingMessages")) || [];
      // Limpa as mensagens pendentes do armazenamento local
      localStorage.removeItem("pendingMessages");
      // Envie cada mensagem pendente
      for (const pendingMessage of pendingMessages) {
        await sendMessage(pendingMessage);
      }
    }
  };

  // Verifique a conexão de internet quando o componente é montado
  useEffect(() => {
    window.addEventListener("online", sendPendingMessages);
    return () => {
      window.removeEventListener("online", sendPendingMessages);
    };
  }, []);

  const sendMessage = async () => {
    setSendingMessage(true);
    if (messageInput.trim() !== "" && ws.readyState === WebSocket.OPEN) {
      const newMessage = {
        userId: userId,
        message: messageInput,
        username: usernames[userId] || "",
        profileImage: currentUserProfileImage || "",
        timestamp: new Date(),
        media: mediaFile ? URL.createObjectURL(mediaFile) : null,
        isSending: true,
      };

      // Armazene a mensagem localmente se o usuário estiver offline
      if (!navigator.onLine) {
        const pendingMessages =
          JSON.parse(localStorage.getItem("pendingMessages")) || [];
        localStorage.setItem(
          "pendingMessages",
          JSON.stringify([...pendingMessages, newMessage])
        );
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Adicione a mensagem localmente para exibição imediata
        setMessageInput("");
        setMediaFile(null);
        setSelectedFileName("");
        return;
      }

      // Envie a mensagem pelo WebSocket
      ws.send(JSON.stringify(newMessage));
      setSendingMessage(true); // Define o estado de envio da mensagem como verdadeiro

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
        newMessage.isSending = false;
        setSendingMessage(false); // Define o estado de envio da mensagem como falso após o envio bem-sucedido
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageInput("");
        setMediaFile(null);
        setSelectedFileName("");
        await loadCommunityMessages();
      } catch (error) {
        console.error("Erro:", error.message);
        setSendingMessage(false);
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

  const handleMediaModalClose = () => {
    setShowMediaModal(false);
  };

  const handleMediaUpload = async () => {
    if (mediaFile) {
      // Verifica se o arquivo é uma imagem ou um vídeo
      const mediaType = mediaFile.type.startsWith("video/") ? "video" : "image";
      const fileName = `${mediaType}_${mediaFile.name}`;
      setMediaUploading(true);
      // Crie uma referência para o local de armazenamento da mídia
      const storageRef = ref(storage, `media/${fileName}`);

      try {
        // Faça o upload do arquivo para o Firebase Storage
        await uploadBytesResumable(storageRef, mediaFile);

        // Obtenha a URL da mídia após o upload
        const url = await getDownloadURL(storageRef);

        // Enviar a URL da mídia para o backend
        await enviarUrlParaBackEnd(url);
        // Inicialize o objeto newMessage antes de usá-lo
        const newMessage = {
          userId: userId,
          message: messageInput,
          media: url, // Adiciona a URL da mídia à mensagem
          profileImage: currentUserProfileImage || "",
          timestamp: new Date(),
        };

        // Envie a mensagem para o chat
        ws.send(JSON.stringify(newMessage));

        // Limpe a mídia selecionada e o nome do arquivo
        setMediaFile(null);
        setSelectedFileName("");
        setShowMediaModal(false);

        setMessages((prevMessages) => [
          ...prevMessages,
          { ...newMessage, message: messageInput }, // Garanta que a mensagem inclua o texto digitado
        ]);

        setMessageInput(""); // Limpe a entrada de mensagem
        setMediaFile(null); // Limpe a mídia selecionada
        setSelectedFileName(""); // Limpe o nome do arquivo selecionado
        setShowMediaModal(false); // Feche o modal de mídia
        setMediaUploading(false);
      } catch (error) {
     
        setMediaUploading(false);
      }
    }
  };

  const enviarUrlParaBackEnd = async (url) => {
    try {
      const response = await fetch(
        `http://localhost:3000/communities/comunidade/enviar-mensagem/${userId}/${communityId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageInput,
            media: url, // Envie a URL da mídia para o backend
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const responseData = await response.json();
     
    } catch (error) {
      console.error("Erro ao enviar URL da mídia para o backend:", error);
    }
  };

  const handleMediaFileChange = (event) => {
    const file = event.target.files[0];
    setMediaFile(file);
    setSelectedFileName(file.name); // Define o nome do arquivo selecionado
  };

  const handleCancel = () => {
    // Limpa a mídia selecionada e o nome do arquivo
    setMediaFile(null);
    setSelectedFileName("");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setMediaFile(file);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Garante que os minutos tenham dois dígitos
    return `${hours}:${minutes}`;
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
              <div>
                 {/* Renderiza o nome de usuário apenas para mensagens do lado esquerdo */}
                 <p className="name-info-chat">
                  {message.userId !== userId ? message.username : "Eu"}
                </p>
                {/* Renderiza a foto do perfil apenas para mensagens do lado esquerdo */}
                {message.userId !== userId && (
                  <div>
                    
                    {profileImages[message.userId] ? (
                      <img
                        src={profileImages[message.userId]}
                        alt="Profile"
                        className="rounded-image-message"
                      />
                    ) : (
                      <div className="profile-icon-container">
                        <AiOutlineUser className="profile-icon-profile" />
                      </div>
                    )}
                  
                  </div>
                )}
               
              </div>
            ) : null}
            <div
              className={`message-content ${
                message.userId === userId ? "right" : "left"
              }`}
            >
              {message.media ? (
                message.media.includes("mp4") ||
                message.media.includes("avi") ? (
                  <video
                    controls
                    className="attached-media"
                    autoPlay={!message.videoPlayed} // Reproduz automaticamente se o vídeo ainda não foi reproduzido
                    onPlay={() => {
                      message.videoPlayed = true; // Define a propriedade videoPlayed da mensagem como verdadeira após a primeira reprodução
                    }}
                  >
                    <source src={message.media} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                ) : (
                  <img
                    src={message.media}
                    alt="Mídia anexada"
                    className="attached-media"
                  />
                )
              ) : (
                <p>{message.message}</p>
              )}
            </div>
            <span className="message-time">
              {formatMessageTime(message.timestamp)}
              <span style={{ marginLeft: "5px" }}>
                {message.isSending && message.userId === userId
                  ? "Enviando..."
                  : "Enviado"}
              </span>
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        {unreadMessages > 0 && lastMessageSeenIndex !== messages.length - 1 && (
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
        {/* Ícone de câmera para abrir o modal */}
        <AiOutlineCamera
          className="camera-icon"
          onClick={() => setShowMediaModal(true)}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>

      {/* Modal de upload de mídia */}
      {showMediaModal && (
        <div className="media-modal">
          <div
            className="media-modal-content"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <span className="close-media-modal" onClick={handleMediaModalClose}>
              &times;
            </span>
            <h2 className="upload-name-media">Enviar Mídia</h2>
            {/* Mostrar conteúdo após anexar mídia */}
            {mediaFile && (
              <div>
                {mediaFile.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(mediaFile)}
                    controls
                    className="attached-media"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(mediaFile)}
                    alt="Mídia anexada"
                    className="attached-media"
                  />
                )}
                <div className="button-group">
                  <button className="cancel-button" onClick={handleCancel}>
                    Cancelar
                  </button>
                  <button
                    className={`send-button ${
                      messageInput.trim() === "" && !mediaFile
                        ? "disabled-message"
                        : ""
                    }`}
                    onClick={() => {
                      if (!mediaUploading) {
                        handleMediaUpload();
                        setSendingMessage(true);
                        sendMessage();
                      }
                    }}
                    disabled={messageInput.trim() === "" && !mediaFile}
                  >
                    {mediaUploading ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </div>
            )}
            {/* Renderizar apenas se não houver mídia selecionada */}
            {!mediaFile && (
              <>
                <input
                  type="file"
                  id="media-file-input"
                  accept="image/*, video/*" // Aceita tanto imagens quanto vídeos
                  onChange={handleMediaFileChange}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="media-file-input"
                  className="custom-file-upload-media"
                >
                  <AiOutlineCamera className="camera-icon-media" />{" "}
                  <span className="upload-midia-name">Anexar mídia</span>
                </label>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatScreen;
