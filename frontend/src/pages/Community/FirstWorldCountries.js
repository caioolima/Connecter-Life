import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/use-auth";
import { Link } from "react-router-dom";
import "./FirstWorldCountries.css";
import SidebarMenu from "../perfil/SidebarMenu/index";
import Footer from "../../components/Footer/footer.jsx";

import BrasilFlag from "./flags/brasil.jpeg";
import AlemanhaFlag from "./flags/alemanha.png";
import JapaoFlag from "./flags/japao.png";
import { AiOutlineUser } from "react-icons/ai";
const FirstWorldCountries = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [comunidades, setComunidades] = useState([]);
  const [topFollowedUsers, setTopFollowedUsers] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    fetchComunidades();
    fetchTopFollowedUsers();
    fetchTopLikedPosts();
  }, []);

  const fetchComunidades = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/communities/comunidade/listar"
      );
      const data = await response.json();
      setComunidades(data);
    } catch (error) {
      console.error("Erro ao buscar comunidades:", error);
    }
  };

  const [numeroMembros, setNumeroMembros] = useState({});

  useEffect(() => {
    const fetchNumeroMembros = async (communityId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/communities/comunidade/contarMembros/${communityId}`
        );
        const data = await response.json();
        setNumeroMembros((prevNumeroMembros) => ({
          ...prevNumeroMembros,
          [communityId]: data.numberOfMembers,
        }));
      } catch (error) {
        console.error(
          "Erro ao buscar o número de membros da comunidade:",
          error
        );
        setNumeroMembros((prevNumeroMembros) => ({
          ...prevNumeroMembros,
          [communityId]: 0,
        }));
      }
    };

    comunidades.forEach((comunidade) => {
      fetchNumeroMembros(comunidade._id);
    });
  }, [comunidades]);

  const fetchTopFollowedUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/top-followed");
      const data = await response.json();
      setTopFollowedUsers(data.topFollowedUsers);
    } catch (error) {
      console.error(
        "Erro ao buscar os top usuários com mais seguidores:",
        error
      );
    }
  };

  const fetchTopLikedPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/users/gallery-image/top-liked-images",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data); // Verifique os dados retornados no console
      setTopLikedPosts(data.topLikedImages);
    } catch (error) {
      console.error("Erro ao buscar as top publicações mais curtidas:", error);
    }
  };

  const flagMappings = {
    brasil: BrasilFlag,
    alemanha: AlemanhaFlag,
    japão: JapaoFlag,
  };

  return (
    <main>
      <SidebarMenu />
      <section className="images-field-top">
        <div className="img a1"></div>
        <div className="img a2"></div>
        <div className="img a3"></div>
      </section>
      <article className="container">
        <section className="cards-contain">
          <h2 className="title-comunidade">{t("Countries List")}</h2>
          <hr />
          <section className="cards">
            {comunidades.map((comunidade) => (
              <section key={comunidade._id} className="card-community">
                <div
                  className="image-country"
                  style={{
                    backgroundImage: `url(${
                      flagMappings[comunidade.country.toLowerCase()]
                    })`,
                  }}
                ></div>

                <span>{t(`${comunidade.country}`)}</span>
                <p>
                  {numeroMembros[comunidade._id] !== undefined
                    ? numeroMembros[comunidade._id] === 1
                      ? t("member", { count: numeroMembros[comunidade._id] })
                      : t("members", { count: numeroMembros[comunidade._id] })
                    : t("loading")}
                </p>

                <Link
                  to={`/community/${encodeURIComponent(comunidade.country)}/${
                    comunidade._id
                  }`}
                >
                  <button className="sign-button-sign">{t("join")}</button>
                </Link>
              </section>
            ))}
          </section>
        </section>
        <section className="users-container">
          <h2>{t("userMoreFollow")}</h2>

          <hr />
          <div className="users-list-list">
            {topFollowedUsers.map((follower) => (
              <div key={follower} className="user-item-user">
                {/* Lógica para renderizar a imagem de perfil ou o ícone de perfil padrão */}
                {follower.profileImageUrl ? (
                  <img src={follower.profileImageUrl} alt="Profile" />
                ) : (
                  <AiOutlineUser className="profile-icon-profile" />
                )}
                <span className="user-name-user">{follower.username}</span>
                <p>
                  {follower.numberOfFollowers}{" "}
                  {follower.numberOfFollowers === 1
                    ? t("follower-user")
                    : t("followers-user")}
                </p>
                <a
                  href={`/profile/${follower.userId}`}
                  className="profile-link"
                >
                  <button className="sign-button-sign">
                    {t("viewProfile")}
                  </button>
                </a>
              </div>
            ))}
          </div>
        </section>
        <section className="post-wrapper">
          <h2>{t("topLikedPosts")}</h2>
          {topLikedPosts.map((post) => (
            <div key={post.imageUrl} className="post-item">
              <img
                src={post.imageUrl}
                alt="Top Liked Post"
                className="post-image"
              />

              <span className="post-name">{post.username}</span>
              <p className="post-content">
                {t("numberOfLikes")}: {post.numberOfLikes}
              </p>
              <a href={`/profile/${post.userId}`} className="post-link">
                <button className="post-button-post">{t("viewProfile")}</button>
              </a>
            </div>
          ))}
        </section>
        <Footer />
      </article>
    </main>
  );
};

export default FirstWorldCountries;
