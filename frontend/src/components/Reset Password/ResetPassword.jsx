import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Reset Password/resets_password.css";

const ResetPassword = ({ onClose }) => {
  const { t } = useTranslation();
  console.log(t("reset_password_title"));
  const navigate = useNavigate();

  const resetPassword = (event) => {
    event.preventDefault();
    // Lógica para redefinir a senha
    // ...

    // Feche o modal após a conclusão
    onClose();
    navigate("/");
  };

  return (
    <div>
      <div className="logo_term">
        <Link to="/home">Connecter Life</Link>
      </div>
      <hr />
      <div className="container-form ">
        <h1 className="title">{t("reset_password_title")}</h1>
        <p className="description">{t("reset_password_description")}</p>

        <form onSubmit={resetPassword}>
          <input
            className="email-input"
            id="email-reset"
            type="email"
            placeholder={t("email_placeholder")}
            required
          />
          <button id="submit-button" type="submit">
            {t("send_recovery_email")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
