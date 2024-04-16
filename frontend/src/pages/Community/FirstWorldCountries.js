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
                    <div className="cards">
                        {comunidades.map(comunidade => (
                            <section className="card-community">
                                <div className="image-country"></div>
                                <Link
                                    to={`/community/${encodeURIComponent(
                                        comunidade.country
                                    )}`}>
                                    {t(`${comunidade.country}`)}
                                </Link>
                                <p>100 membros</p>
                                <button
                                    key={comunidade._id}
                                    className="comunidades-list-item">
                                    <span>Fazer parte</span>
                                </button>
                            </section>
                        ))}
                    </div>
                    <div className="more-btn-flex">
                        <button className="more-btn">Ver mais</button>
                    </div>
                </section>
            </article>
            <Footer />
        </main>
    );
};

export default FirstWorldCountries;
