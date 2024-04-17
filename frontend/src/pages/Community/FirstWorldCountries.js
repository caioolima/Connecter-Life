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

const FirstWorldCountries = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [comunidades, setComunidades] = useState([]);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    fetchComunidades();
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
          <h2>Comunidades</h2>
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
      </article>
      <Footer />
    </main>
  );
};

export default FirstWorldCountries;
