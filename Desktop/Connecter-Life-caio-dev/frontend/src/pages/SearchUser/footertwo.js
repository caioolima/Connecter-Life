import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../components/Language/i18n";

const Footer = () => {
  const { t } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <footer className="footer-class">
      <div className="footer-terms-footer">
        <Link to="/terms">{t("terms_of_service")}</Link>
        <a href="/#">{t("help")}</a>
        <a href="/#">{t("about")}</a>
      </div>

      <div className="language-buttons-language">
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

      <div className="footer-copyright-footer">
        <p>&copy; 2023 ConnecterLife</p>
      </div>
    </footer>
  );
};

export default Footer;
