import React from "react";
import "./introduction.css";
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";
import i18n from "../../components/Language/i18n"; // Ajuste o caminho conforme a estrutura real
import "../../components/Footer/footer.css";
import Footer from "../../components/Footer/footer";


const Introduction = () => {
  const { t } = useTranslation();
  return (
    <div className="abc">
      <h1 className="abcd">{t("title")}</h1>
      <div className="background-image">
        <div className="intro-content">
          <div className="intro-info">
            <h2 className="intro-h2">
              {t("question")}
            </h2>

            <p className="intro-p">
              {t("description")}
            </p>
            <Link to="/home">
              <button className="vamos-nessa-button">
                {t("button")}
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="explore-info">
        <h2 className="title-infos main-title">
          {t("explore_title")}
        </h2>
        <h2 className="title-infos sub-title">{t("how_it_works")}</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">#1</div>
            <div className="step-text">
              {t("step1")}
            </div>
          </div>
          <div className="step">
            <div className="step-number">#2</div>
            <div className="step-text">
              {t("step2")}
            </div>
          </div>
          <div className="step">
            <div className="step-number">#3</div>
            <div className="step-text">
              {t("step3")}
            </div>
          </div>
          <div className="step">
            <div className="step-number">#4</div>
            <div className="step-text">
              {t("step4")}
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
        <h2 className="connect-text-h2">{t("connect_with_travelers")}</h2>
        <p className="connect-text-p">
          {t("connect_text")}
        </p>
      </div>
      <div className="cta-section">
        <div className="cta-content">
          <p>{t("cta_text")}</p>
        </div>
        <Link to="/home">
          <button className="vamo-comigo-button">
            {t("button")}
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Introduction;
