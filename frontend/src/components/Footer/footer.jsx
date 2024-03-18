// components/Footer/footer.js
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../Language/i18n"; // Ajuste o caminho conforme a estrutura real
import { Link } from "react-router-dom";
import "../Footer/footer.css";
import "../css/main.css";
import "../css/resets.css";

function Footer() {
  const { t } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <footer className="footer">
      <div className="footer-terms">
      <Link to="/terms">{t("terms_of_service")}</Link>
        <a href="#">{t("help")}</a>
        <a href="#">{t("about")}</a>
      </div>

      <div className="language-buttons">
        <button
          className={i18n.language === "pt-BR" ? "active" : ""}
          onClick={() => changeLanguage("pt-BR")}
        >
          {t("portuguese")}
        </button>
        <button
          className={i18n.language === "en-US" ? "active" : ""}
          onClick={() => changeLanguage("en-US")}
        >
          {t("english")}
        </button>
        <button
          className={i18n.language === "es-ES" ? "active" : ""}
          onClick={() => changeLanguage("es-ES")}
        >
          {t("spanish")}
        </button>
      </div>

      <div className="footer-info">
        <p>&copy; 2023 TravelConnect</p>
      </div>
    </footer>
  );
}

export default Footer;
