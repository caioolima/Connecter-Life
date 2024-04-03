import React from "react";
import { Link } from "react-router-dom";
import "./introduction.css";
import { useTranslation } from "react-i18next";
import i18n from "../Language/i18n"; // Ajuste o caminho conforme a estrutura real
import "../Footer/footer.css";

const Footer = () => {
  const { t } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <footer className="footer-2">
      <div className="footer-links">
        <Link to="/terms" className="footer-link">
          {t("terms_of_service")}
        </Link>
        <a href="/#" className="footer-link">
          {t("help")}
        </a>
        <a href="/#" className="footer-link">
          {t("about")}
        </a>
      </div>

      <div className="footer-languages">
        <button
          className={
            i18n.language === "pt-BR"
              ? "footer-language active"
              : "footer-language"
          }
          onClick={() => changeLanguage("pt-BR")}
        >
          {t("portuguese")}
        </button>
        <button
          className={
            i18n.language === "en-US"
              ? "footer-language active"
              : "footer-language"
          }
          onClick={() => changeLanguage("en-US")}
        >
          {t("english")}
        </button>
        <button
          className={
            i18n.language === "es-ES"
              ? "footer-language active"
              : "footer-language"
          }
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
};

const Introduction = () => {
  return (
    <div className="abc">
      <h1 className="abcd">ConnecterLife</h1>
      <div className="background-image">
        <div className="intro-content">
          <div className="intro-info">
            <h2 className="intro-h2">
              Já se perguntou como é emocionante explorar o mundo ao lado de
              outros aventureiros?
            </h2>

            <p className="intro-p">
              O Connecter Life está aqui para ajudar você a descobrir
              comunidades de viajantes em diferentes países, além de oferecer
              dicas, recomendações e conexões locais.
            </p>
            <Link to="/home">
              <button className="vamos-nessa-button">
                VAMOS NESSA?
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="explore-info">
        <h2 className="title-infos main-title">
          Explore o mundo, compartilhe suas experiências e conecte-se com outros
          viajantes apaixonados no Connecter Life.
        </h2>
        <h2 className="title-infos sub-title">Como funciona?</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">#1</div>
            <div className="step-text">
              Descubra comunidades de viajantes em diferentes países
            </div>
          </div>
          <div className="step">
            <div className="step-number">#2</div>
            <div className="step-text">
              Encontre pessoas que compartilham de seus interesses e paixões por
              viagens
            </div>
          </div>
          <div className="step">
            <div className="step-number">#3</div>
            <div className="step-text">
              Conecte-se e compartilhe experiências com outros viajantes
            </div>
          </div>
          <div className="step">
            <div className="step-number">#4</div>
            <div className="step-text">
              Explore novos lugares juntos, crie roteiros e vivencie aventuras
              inesquecíveis
            </div>
          </div>
          <div className="lines">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
      </div>
      <div className="connect-with-travelers">
        <div className="background-image2"></div>
        <h2 className="connect-text-h2">Conecte-se com viajantes pelo mundo</h2>
        <p className="connect-text-p">
          Encontre companhia para suas aventuras e descubra novos destinos
          juntos!
        </p>
      </div>
      <div className="cta-section">
        <div className="cta-content">
          <p>CLIQUE AO LADO E COMECE JÁ!</p>
        </div>
        <Link to="/home">
          <button className="vamo-comigo-button">
            VAMOS NESSA?
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Introduction;