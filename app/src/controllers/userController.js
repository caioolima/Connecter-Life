const User = require("../models/userModel");

const express = require("express");

exports.findUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, errors, message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ available: false }); // Em caso de erro, considerar como não disponível
  }
};

exports.addUserBiography = async (req, res) => {
  try {
    const { id } = req.params;
    const { biography } = req.body;

    // Verifica se o usuário existe
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verifica se o usuário já possui uma biografia
    if (user.biography) {
      return res.status(400).json({
        success: false,
        message: "User biography already exists.",
      });
    }

    // Adiciona a biografia ao usuário
    user.biography = biography;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User biography added successfully.",
    });
  } catch (error) {
    console.error("Error adding user biography:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while adding user biography.",
    });
  }
};

exports.updateUserBiography = async (req, res) => {
  try {
    const { id } = req.params;
    const { biography } = req.body;

    // Verifica se o usuário existe
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Atualiza a biografia do usuário
    user.biography = biography;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User biography updated successfully.",
    });
  } catch (error) {
    console.error("Error updating user biography:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating user biography.",
    });
  }
};

exports.addUserProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileImageUrl } = req.body;

    // Encontre o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verifique se o usuário já possui uma imagem de perfil
    if (user.profileImageUrl) {
      return res.status(400).json({
        success: false,
        message: "User profile image already exists.",
      });
    }

    // Atualize a URL da imagem de perfil do usuário
    user.profileImageUrl = profileImageUrl;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User profile image added successfully.",
    });
  } catch (error) {
    console.error("Error adding user profile image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding user profile image.",
    });
  }
};

exports.deleteUserBiography = async (req, res) => {
  try {
    const { id } = req.params;

    // Encontre o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verifique se o usuário possui uma biografia
    if (!user.biography) {
      return res.status(400).json({
        success: false,
        message: "User biography does not exist.",
      });
    }

    // Exclua a biografia do usuário
    user.biography = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User biography deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user biography:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting user biography.",
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUsername, newBiography, profileImageUrl, newPhone } = req.body;

    // Encontre o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verifique se o novo nome de usuário está sendo fornecido
    if (newUsername) {
      // Verifique se o novo nome de usuário é diferente do nome de usuário atual
      if (newUsername !== user.username) {
        // Verifique a disponibilidade do novo nome de usuário
        const existingUser = await User.findOne({
          username: newUsername,
        });
        if (existingUser) {
          // Se o novo nome de usuário já estiver em uso, retorne um erro
          return res.status(400).json({
            success: false,
            message: "Nome de usuário já em uso.",
          });
        }
        // Se o novo nome de usuário estiver disponível, atualize-o
        user.username = newUsername;
      }
    }

    // Atualize a biografia se fornecida
    if (newBiography) {
      user.biography = newBiography;
    }

    // Atualize a URL da imagem de perfil do usuário se fornecida
    if (profileImageUrl) {
      user.profileImageUrl = profileImageUrl;
    }

    // Atualize o número do usuário se fornecido
    if (newPhone) {
      const existingPhone = await User.findOne({ phone: newPhone });

      if (existingPhone) {
        return res
          .status(402)
          .json({ error: "O número de telefone já está em uso." });
      }
      user.phone = newPhone;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating user profile.",
    });
  }
};

exports.deleteUserProfileImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Encontre o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verifique se o usuário possui uma imagem de perfil
    if (!user.profileImageUrl) {
      return res.status(400).json({
        success: false,
        message: "User profile image does not exist.",
      });
    }

    // Exclua a URL da imagem de perfil do usuário
    user.profileImageUrl = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile image deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user profile image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting user profile image.",
    });
  }
};

exports.addGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { galleryImageUrl } = req.body;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Add the gallery image with an empty likes array
    user.galleryImageUrl.push({ url: galleryImageUrl, likes: [] });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Gallery image added successfully.",
    });
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding gallery image.",
    });
  }
};

exports.likeGalleryImage = async (req, res) => {
  try {
    const { ownerId, imageUrl, userId } = req.params;

    // Encontrar o usuário proprietário da imagem pelo ID
    const ownerUser = await User.findById(ownerId);

    if (!ownerUser) {
      console.log("Usuário proprietário da imagem não encontrado.");
      return res
        .status(404)
        .json({
          success: false,
          message: "Usuário proprietário da imagem não encontrado.",
        });
    }

    // Encontrar a imagem da galeria pelo URL dentro do usuário proprietário encontrado
    const galleryImage = ownerUser.galleryImageUrl.find(
      (image) => image.url === imageUrl
    );

    if (!galleryImage) {
      console.log("Imagem da galeria não encontrada.");
      return res
        .status(404)
        .json({ success: false, message: "Imagem da galeria não encontrada." });
    }

    // Verificar se o usuário já curtiu a imagem
    if (galleryImage.likes.includes(userId)) {
      console.log("Usuário já curtiu esta imagem.");
      return res
        .status(400)
        .json({ success: false, message: "Usuário já curtiu esta imagem." });
    }

    // Adicionar o ID do usuário ao array de curtidas
    galleryImage.likes.push(userId);
    await ownerUser.save();

    console.log("Imagem curtida com sucesso.");
    return res
      .status(200)
      .json({ success: true, message: "Imagem curtida com sucesso." });
  } catch (error) {
    console.error("Erro ao curtir imagem da galeria:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor ao curtir imagem da galeria.",
      });
  }
};

exports.unlikeGalleryImage = async (req, res) => {
  try {
    const { ownerId, imageUrl, userId } = req.params;

    // Encontrar o usuário proprietário da imagem pelo ID
    const ownerUser = await User.findById(ownerId);

    if (!ownerUser) {
      return res.status(404).json({
        success: false,
        message: "Usuário proprietário da imagem não encontrado.",
      });
    }

    // Encontrar a imagem da galeria pelo URL dentro do usuário proprietário encontrado
    const galleryImage = ownerUser.galleryImageUrl.find(
      (image) => image.url === imageUrl
    );

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Imagem da galeria não encontrada.",
      });
    }

    // Verificar se o usuário já curtiu a imagem
    const likeIndex = galleryImage.likes.indexOf(userId);
    if (likeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "O usuário ainda não curtiu esta imagem.",
      });
    }

    // Remover o ID do usuário do array de curtidas
    galleryImage.likes.splice(likeIndex, 1);
    await ownerUser.save();

    return res.status(200).json({
      success: true,
      message: "Like removido com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao remover like da imagem da galeria:", error);
    return res.status(500).json({
      success: false,
      message:
        "Erro interno do servidor ao remover like da imagem da galeria.",
    });
  }
};

exports.checkUserLikedImage = async (req, res) => {
  try {
    const { userId, imageUrl } = req.params;

    // Encontre o usuário pelo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    // Encontre a imagem da galeria pelo URL dentro do usuário encontrado
    const galleryImage = user.galleryImageUrl.find(
      (image) => image.url === imageUrl
    );

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Imagem da galeria não encontrada.",
      });
    }

    // Verifique se o usuário curtiu a imagem
    const userLiked = galleryImage.likes.includes(userId);

    return res.status(200).json({
      success: true,
      userLiked: userLiked, // Retorna true se o usuário curtiu a imagem, senão false
    });
  } catch (error) {
    console.error("Erro ao verificar se o usuário curtiu a imagem da galeria:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao verificar se o usuário curtiu a imagem da galeria.",
    });
  }
};

exports.getGalleryImageLikes = async (req, res) => {
  try {
    const { userId, imageUrl } = req.params;

    const ownerUser = await User.findById(userId);

    if (!ownerUser) {
      return res.status(404).json({
        success: false,
        message: "Usuário proprietário da imagem não encontrado.",
      });
    }

    const galleryImage = ownerUser.galleryImageUrl.find(
      (image) => image.url === imageUrl
    );

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Imagem da galeria não encontrada.",
      });
    }

    return res.status(200).json({
      success: true,
      likes: galleryImage.likes.length, // Retorna o número total de likes
    });
  } catch (error) {
    console.error("Erro ao obter likes da imagem da galeria:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao obter likes da imagem da galeria.",
    });
  }
};

exports.getGalleryImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Encontre o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Retorne as URLs das imagens da galeria do usuário
    return res
      .status(200)
      .json({ success: true, galleryImageUrls: user.galleryImageUrl });
  } catch (error) {
    console.error("Error getting gallery images:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while getting gallery images.",
    });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const { userId, imageUrl } = req.params;

    // Encontre o usuário pelo ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    // Verifique se a imagem está na galeria do usuário
    const imageIndex = user.galleryImageUrl.findIndex(
      (image) => image.url === imageUrl
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Imagem não encontrada na galeria do usuário.",
      });
    }

    // Remova a imagem da galeria do usuário
    user.galleryImageUrl.splice(imageIndex, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Imagem excluída da galeria com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir imagem da galeria:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao excluir imagem da galeria.",
    });
  }
};

// Função para buscar um usuário pelo nome de usuário
exports.findAllUsers = async (req, res) => {
  try {
    const { username } = req.params;

    // Remove espaços extras e adiciona a flag 'i' para tornar a busca insensível a maiúsculas/minúsculas
    const cleanedUsername = username.trim().replace(/\s+/g, " ");
    const regexUsername = new RegExp(cleanedUsername, "i");

    const users = await User.find({ username: { $regex: regexUsername } });

    if (users.length > 0) {
      res.status(200).json(users); // Retorna os dados de todos os usuários em formato JSON
    } else {
      res.status(404).json({
        error: `Nenhum usuário encontrado com o nome ${cleanedUsername}`,
      });
    }
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuários." });
  }
};

exports.getAllProfileImagesById = async (req, res) => {
  try {
    const { id } = req.params;

    // Encontre o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verifique se o usuário possui uma imagem de perfil
    if (!user.profileImageUrl) {
      return res.status(404).json({
        success: false,
        message: "User profile image does not exist.",
      });
    }

    // Retorna a URL da imagem de perfil do usuário
    return res.status(200).json({
      success: true,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    console.error("Error getting user profile image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while getting user profile image.",
    });
  }
};

exports.getTopLikedImages = async (req, res) => {
  try {
    // Inicializar um objeto para armazenar o número de curtidas de cada imagem
    const imageLikesCount = {};

    // Encontrar todos os usuários
    const allUsers = await User.find();

    // Iterar sobre todos os usuários e suas galerias de imagens
    allUsers.forEach((user) => {
      let addedToRanking = false; // Variável para controlar se uma publicação do usuário já foi adicionada ao ranking
      user.galleryImageUrl.forEach((image) => {
        // Verificar se a imagem tem pelo menos uma curtida
        if (image.likes.length >= 1 && !addedToRanking) {
          // Incrementar o número de curtidas para a imagem
          imageLikesCount[image.url] = image.likes.length;
          addedToRanking = true; // Marcar que uma publicação do usuário foi adicionada ao ranking
        }
      });
    });

    // Converter o objeto em um array de pares chave-valor
    const imageLikesCountArray = Object.entries(imageLikesCount);

    // Ordenar o array por número de curtidas em ordem decrescente
    imageLikesCountArray.sort((a, b) => b[1] - a[1]);

    // Pegar as top 10 imagens mais curtidas
    const topLikedImages = imageLikesCountArray.slice(0, 10);

    // Retornar as informações das top 10 imagens mais curtidas
    const topLikedImagesDetails = await Promise.all(
      topLikedImages.map(async ([imageUrl, numberOfLikes]) => {
        // Encontrar o usuário que possui a imagem
        const user = await User.findOne({ "galleryImageUrl.url": imageUrl });
        if (user) {
          // Encontrar a imagem na galeria do usuário
          const image = user.galleryImageUrl.find(
            (img) => img.url === imageUrl
          );
          return {
            userId: user._id,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
            imageUrl,
            numberOfLikes,
            postedAt: image.postedAt,
          };
        }
      })
    );

    // Remover entradas vazias (usuários não encontrados)
    const filteredTopLikedImagesDetails = topLikedImagesDetails.filter(
      (image) => image
    );

    // Retornar as top 10 imagens mais curtidas com detalhes
    res.status(200).json({ topLikedImages: filteredTopLikedImagesDetails });
  } catch (error) {
    console.error("Erro ao obter as fotos mais curtidas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


