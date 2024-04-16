import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/use-auth";
import { Link } from "react-router-dom";
import "./FirstWorldCountries.css";
import SidebarMenu from "../perfil/SidebarMenu/index";
import Footer from "../../components/Footer/footer.jsx";

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

  return (
    <div className="container">
      <SidebarMenu />
      <div className="comunidades-list">
        <h2 className="comunidades-list-h2">{t("Countries List")}</h2>
        <ul className="comunidades-list-ul">
          {comunidades.map((comunidade) => (
            <li key={comunidade._id} className="comunidades-list-item">
              <Link
                to={`/community/${encodeURIComponent(comunidade.country)}/${
                  comunidade._id
                }`}
              >
                {t(`${comunidade.country}`)}
              </Link>
            </li>
          ))}
        </ul>
        <Footer />
      </div>
    </div>
  );
};

export default FirstWorldCountries;
