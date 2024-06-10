// src/pages/Community/World Community/FirstWorldCountries.js
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../hooks/use-auth.js";
import SidebarMenu from "../../perfil/SidebarMenu/index.jsx";
import Footer from "../../../components/Footer/footer.jsx";
import Articles from "./ImageField.jsx"; // Não há necessidade de desestruturar o import
import CommunityCard from "./CommunityCard";
import TopFollowedUsers from "./TopFollowedUsers";
import TopLikedPosts from "./TopLikedPosts";
import { fetchComunidades, fetchNumeroMembros, fetchTopFollowedUsers, fetchTopLikedPosts } from "./communityService.jsx";


import BrasilFlag from "../Community Services/flags/brasil.jpeg";
import AlemanhaFlag from "../Community Services/flags/alemanha.png";
import JapaoFlag from "../Community Services/flags/japao.png";
import "./FirstWorldCountries.css";

const FirstWorldCountries = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [comunidades, setComunidades] = useState([]);
  const [topFollowedUsers, setTopFollowedUsers] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [numeroMembros, setNumeroMembros] = useState({});

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedComunidades = await fetchComunidades();
      setComunidades(fetchedComunidades);
      const fetchedTopFollowedUsers = await fetchTopFollowedUsers();
      setTopFollowedUsers(fetchedTopFollowedUsers);
      const fetchedTopLikedPosts = await fetchTopLikedPosts();
      setTopLikedPosts(fetchedTopLikedPosts);
    };
    fetchData();
  }, []);

  useEffect(() => {
    comunidades.forEach(async (comunidade) => {
      const numMembros = await fetchNumeroMembros(comunidade._id);
      setNumeroMembros((prevNumeroMembros) => ({
        ...prevNumeroMembros,
        [comunidade._id]: numMembros,
      }));
    });
  }, [comunidades]);

  const flagMappings = {
    brasil: BrasilFlag,
    alemanha: AlemanhaFlag,
    japão: JapaoFlag,
  };

  return (
    <main>
      <SidebarMenu />
      <div className="main-content">
        <section className="images-field-top">
        <Articles />
        </section>

        <article className="container-cards">
          <section className="cards-contain">
            <h2 className="title-comunidade">{t("Countries List")}</h2>
            <hr />
            <section className="cards">
              {comunidades.map((comunidade) => (
                <CommunityCard
                  key={comunidade._id}
                  comunidade={comunidade}
                  numeroMembros={numeroMembros}
                  flagMappings={flagMappings}
                  t={t}
                />
              ))}
            </section>
          </section>
          <TopFollowedUsers topFollowedUsers={topFollowedUsers} t={t} />
          <TopLikedPosts topLikedPosts={topLikedPosts} t={t} />
        </article>
        <div className="footer-world">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default FirstWorldCountries;
