import { useMyContext } from "../../../contexts/profile-provider.jsx";
import { useParams } from "react-router-dom";
import { storage } from "../../Firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const useUploadModal = () => {
    const {
        setUploadInProgress,
        selectedImage,
        setSelectedImage,
        setShowPhotoModal,
        setUserPhotos,
    } = useMyContext();
    const { userId } = useParams();

    const changeImage2 = async () => {
        try {
            // Enviar a imagem da galeria apenas se houver uma imagem selecionada
            if (selectedImage) {
                const token = localStorage.getItem("token");
    
                // Enviar o objeto com a URL da imagem selecionada para o backend
                const response = await fetch(
                    `http://localhost:3000/users/${userId}/gallery-image`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            galleryImageUrl: {
                                url: selectedImage,
                                postedAt: new Date() // Você pode ajustar isso conforme necessário
                            }
                        }) // Envie o objeto com a URL e timestamp
                    }
                );
    
                if (response.ok) {
                    // Se a resposta do servidor for bem-sucedida, você pode atualizar o estado da aplicação conforme necessário
                    console.log("Imagem da galeria enviada com sucesso!");
                    window.location.reload(); // Recarrega a página após o envio bem-sucedido (opcional)
                } else {
                    console.error(
                        "Falha ao enviar a imagem da galeria:",
                        response.status
                    );
                }
            }
    
            // Limpar o estado da imagem selecionada e fechar o modal após o envio bem-sucedido
            setSelectedImage(null);
            setShowPhotoModal(false);
        } catch (error) {
            console.error("Erro ao enviar a imagem da galeria:", error);
        }
    };
    

    const handleImageUpload = async event => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploadInProgress(true); // Indica que o upload está em andamento

            // Upload da imagem para o Firebase Storage
            const storageRef = ref(
                storage,
                `users/${userId}/photos/${uuidv4()}`
            );
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    // Atualize o progresso do upload aqui
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Progresso do upload:", progress);
                },
                error => {
                    console.error("Erro ao fazer upload da imagem:", error);
                    setUploadInProgress(false); // Reinicia o estado do upload em caso de erro
                },
                async () => {
                    // Upload concluído com sucesso
                    try {
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );
                        // Defina a imagem selecionada apenas quando o usuário confirmar a mudança

                        setUploadInProgress(false); // Reinicia o estado do upload após o upload bem-sucedido
                        setSelectedImage(downloadURL); // Define a imagem selecionada
                    } catch (error) {
                        console.error("Erro ao obter a URL da imagem:", error);
                        setUploadInProgress(false); // Reinicia o estado do upload em caso de erro
                    }
                }
            );
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
            setUploadInProgress(false); // Reinicia o estado do upload em caso de erro
        }
    };

    // Função para obter as URLs das imagens da galeria do usuário
    // Efeito para obter as URLs das imagens da galeria do usuário ao montar o componente

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

    return { handleImageUpload, changeImage2, getGalleryImages };
};

export default useUploadModal;
