import { useCallback, useEffect } from "react";
import { useMyContext } from "../../../contexts/profile-provider";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/use-auth";

const useGetdata = () => {
    const {
        setFullName,
        setUsername,
        setModalFullName,
        setModalDateOfBirth,
        setPhoneNumber,
        setProfileImage,
        setCountryCode,
        setBiography,
        setUserDataLoaded,
        setNumberOfFollowing,
        userPhotos,
        currentImageIndex,
        setNextButtonDisabled,
        setIsOwnProfile,
        setIsFollowing,
        setPreviousButtonDisabled,
        setIsModalOpen,
        myProfileLink,
        setUserPhotos
    } = useMyContext();

    const { userId } = useParams();
    const { user } = useAuth();
    const location = useLocation();

    const getDataUser = useCallback(async () => {
        try {
            setUserDataLoaded(false);
            const token = localStorage.getItem("token");
            const storedBiography = localStorage.getItem("biography");

            if (storedBiography) {
                setBiography(storedBiography);
            } else {
                const res = await fetch(
                    `http://localhost:3000/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (res.ok) {
                    const responseBody = await res.json();
                    if (responseBody) {
                        setFullName(
                            `${responseBody.firstName} ${responseBody.lastName}`
                        );
                        setUsername(responseBody.username);
                        setModalFullName(
                            `${responseBody.firstName} ${responseBody.lastName}`
                        );
                        setModalDateOfBirth(responseBody.dob);
                        const ddd = extractDDD(responseBody.phone);
                        const countryCode = getCountryCodeFromDDD(ddd);
                        setCountryCode(countryCode);

                        if (responseBody.profileImageUrl) {
                            setProfileImage(responseBody.profileImageUrl);
                        } else {
                            setProfileImage("");
                        }

                        setBiography(responseBody.biography);
                        setPhoneNumber(responseBody.phone);
                        setUserDataLoaded(true);
                    } else {
                        console.error(
                            "Erro ao obter os dados do usuário: responseBody não definido"
                        );
                    }
                } else {
                    console.error(
                        "Erro ao obter os dados do usuário:",
                        res.status
                    );
                }
            }
        } catch (error) {
            console.error("Erro ao obter os dados do usuário:", error);
        }
    }, [
        userId,
        setFullName,
        setUsername,
        setModalFullName,
        setModalDateOfBirth,
        setPhoneNumber,
        setProfileImage,
        setCountryCode,
        setBiography,
        setUserDataLoaded
    ]);
    
    const getGalleryImages = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3000/users/${userId}/gallery-image`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setUserPhotos(data.galleryImageUrls); // Define o estado userPhotos com as URLs das imagens da galeria do usuário
            } else {
                console.error(
                    "Falha ao obter as imagens da galeria:",
                    response.status
                );
            }
        } catch (error) {
            console.error("Erro ao obter as imagens da galeria:", error);
        }
    };
    
    useEffect(() => {
        getGalleryImages();
    }, [setUserPhotos, userId]);


    useEffect(() => {
        const fetchFollowingCount = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/user/${userId}/following-count`
                );
                if (response.ok) {
                    const data = await response.json();
                    setNumberOfFollowing(data.numberOfFollowing);
                } else {
                    console.error(
                        "Erro ao obter o número de usuários seguidos:",
                        response.status
                    );
                }
            } catch (error) {
                console.error(
                    "Erro ao obter o número de usuários seguidos:",
                    error
                );
            }
        };

        fetchFollowingCount();
    }, [userId, setNumberOfFollowing]);

    // Função para extrair o DDD do número de telefone
    function extractDDD(phoneNumber) {
        // Extraindo os primeiros dígitos que representam o DDD
        return phoneNumber.substring(0, 2); // Assumindo que o DDD tem 2 dígitos
    }

    // Função para mapear o DDD para o código do país
    function getCountryCodeFromDDD(ddd) {
        // Mapeando o DDD para o código do país
        switch (ddd) {
            case "11":
                return "BR"; // Se o DDD for 11, assumimos que é do Brasil (código BR)
            case "1":
                return "US"; // Se o DDD for 1, assumimos que é dos Estados Unidos (código US)
            // Adicione mais casos conforme necessário para outros DDDs e códigos de país
            default:
                return ""; // Retornar vazio se o DDD não for reconhecido
        }
    }

    useEffect(() => {
        if (
            location.pathname === myProfileLink &&
            !localStorage.getItem("profileModalOpened")
        ) {
            setIsModalOpen(true);
            localStorage.setItem("profileModalOpened", "true");
        } else {
            setIsModalOpen(false);
        }
    }, [location.pathname, myProfileLink, setIsModalOpen]);

    useEffect(() => {
        const handlePopState = () => {
            window.location.reload();
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const handleLogoClick = () => {
        window.location.reload();
    };

    const handleProfileClick = () => {
        // Redirecionar para a página do perfil do usuário autenticado
        window.location.href = user ? `/profile/${user.id}` : "/";
    };

    useEffect(() => {
        const loggedInUserId = localStorage.getItem("userId");
        setIsOwnProfile(loggedInUserId === userId);
    }, [userId, setIsOwnProfile]);

    useEffect(() => {
        // Verifica se a lista de fotos do usuário está vazia ou se a foto atual é a última
        const isLastPhoto =
            userPhotos.length === 0 ||
            currentImageIndex === userPhotos.length - 1;
        setNextButtonDisabled(isLastPhoto);
    }, [userPhotos, currentImageIndex, setNextButtonDisabled]);

    useEffect(() => {
        // Verifica se a lista de fotos do usuário está vazia ou se a foto atual é a primeira
        const isFirstPhoto = userPhotos.length === 0 || currentImageIndex === 0;
        setPreviousButtonDisabled(isFirstPhoto);
    }, [userPhotos, currentImageIndex, setPreviousButtonDisabled]);

    const verifyRelationship = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            // Verifica se user é nulo antes de acessar sua propriedade id
            if (!user) {
                console.error("Usuário não definido.");
                return;
            }
            const url = `http://localhost:3000/relationship/${user.id}/${userId}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.exists); // Define isFollowing com base na resposta da API
            } else {
                console.error(
                    "Erro ao verificar a relação de seguimento:",
                    response.status
                );
            }
        } catch (error) {
            console.error("Erro ao verificar a relação de seguimento:", error);
        }
    }, [setIsFollowing, user, userId]); // Removido user.id da lista de dependências

    useEffect(() => {
        if (user) {
            verifyRelationship(); 
        }
    }, [user, verifyRelationship]);
    
    const followUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:3000/relationship`;

            const data = {
                follower_id: user.id, // Use o ID do usuário logado como o seguidor
                following_id: userId // Use o ID do usuário cujo perfil está sendo visualizado como o usuário a ser seguido
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setIsFollowing(true);
                console.log("Começou a seguir o usuário.");
            } else {
                console.error("Erro ao seguir o usuário:", response.status);
            }
        } catch (error) {
            console.error("Erro ao seguir o usuário:", error);
        }
    };

    const unfollowUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:3000/relationship/${user.id}/${userId}`;

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setIsFollowing(false); // Defina isFollowing como false após parar de seguir com sucesso
                console.log("Parou de seguir o usuário.");
            } else {
                console.error(
                    "Erro ao deixar de seguir o usuário:",
                    response.status
                );
            }
        } catch (error) {
            console.error("Erro ao deixar de seguir o usuário:", error);
        }
    };

    useEffect(() => {
        // Limpar a imagem do perfil armazenada localmente ao carregar o perfil de um novo usuário
        localStorage.removeItem("profileImage");
    }, [userId]); // Adiciona userId como dependência para este useEffect

    useEffect(() => {
        const storedFullName = localStorage.getItem("fullName");
        const storedUsername = localStorage.getItem("username");
        const storedProfileImage = localStorage.getItem("profileImage");

        if (storedFullName && storedUsername) {
            setFullName(storedFullName);
            setUsername(storedUsername);
            setProfileImage(storedProfileImage);
        }
        if (storedProfileImage) {
            setProfileImage(storedProfileImage);
        }
    }, [setFullName, setProfileImage, setUsername]);

    return { getDataUser, handleLogoClick, handleProfileClick,
    followUser, unfollowUser, verifyRelationship, getGalleryImages};
};

export default useGetdata;
