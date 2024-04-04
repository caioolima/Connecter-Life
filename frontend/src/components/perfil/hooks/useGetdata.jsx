import { useCallback, useEffect } from "react"
import { useMyContext } from "../../../contexts/profile-provider";
import { useParams } from "react-router-dom"

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
        setUserDataLoaded
    } = useMyContext();
    
    const { userId } = useParams();

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

    return { getDataUser };
};

export default useGetdata;
