import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../Language/i18n"; // Ajuste o caminho conforme a estrutura real
import { Link } from "react-router-dom";
import "../Footer/footer.css";
import "../css/main.css";
import "../css/resets.css";

function Footer({ userId }) {
  const { t } = useTranslation();
  const [userLanguage, setUserLanguage] = useState(null);

  useEffect(() => {
    // Verifica se já existe um idioma salvo no localStorage
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage) {
      // Se existir, atualiza o estado com o idioma salvo
      setUserLanguage(savedLanguage);
      // Atualiza o idioma no i18n
      i18n.changeLanguage(savedLanguage);
    } else {
      // Se não houver idioma salvo, busca no servidor
      getUserLanguage();
    }
  }, []);

  const changeLanguage = async (language) => {
    await syncLanguageWithBackend(language);
    // Atualiza o estado com a nova linguagem
    setUserLanguage(language);
    // Atualiza a linguagem no i18n
    i18n.changeLanguage(language);
    // Salva o idioma selecionado no localStorage
    localStorage.setItem("userLanguage", language);
  };

  const getUserLanguage = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/auth/${userId}/language`
      );
      if (response.ok) {
        const data = await response.json();
        setUserLanguage(data.language);
        // Atualiza a linguagem padrão do i18n
        i18n.changeLanguage(data.language);
        // Salva o idioma obtido no localStorage
        localStorage.setItem("userLanguage", data.language);
      } else {
        console.error("Failed to get user language");
      }
    } catch (error) {
      console.error("Error fetching user language:", error);
    }
  };

  const syncLanguageWithBackend = async (language) => {
    if (userId && navigator.onLine) {
      try {
        const response = await fetch(`http://localhost:3000/auth/language`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, language }),
        });
        if (!response.ok) {
          console.error("Failed to sync language with backend");
        }
      } catch (error) {
        console.error("Error syncing language with backend:", error);
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-terms">
        <Link to="/terms">{t("terms_of_service")}</Link>
        <a href="/#">{t("help")}</a>
        <a href="/#">{t("about")}</a>
      </div>

      <div className="language-buttons">
        <button
          className={userLanguage === "pt-BR" ? "active" : ""}
          onClick={() => changeLanguage("pt-BR")}
        >
          {t("portuguese")}
        </button>
        <button
          className={userLanguage === "en-US" ? "active" : ""}
          onClick={() => changeLanguage("en-US")}
        >
          {t("english")}
        </button>
        <button
          className={userLanguage === "es-ES" ? "active" : ""}
          onClick={() => changeLanguage("es-ES")}
        >
          {t("spanish")}
        </button>
      </div>

      <div className="footer-info">
        <p className="footer-copy">&copy; 2023 ConnecterLife</p>
      </div>
    </footer>
  );
}

export default Footer;
