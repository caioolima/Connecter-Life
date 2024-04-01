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
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User biography already exists."
                });
        }

        // Adiciona a biografia ao usuário
        user.biography = biography;
        await user.save();
        return res
            .status(201)
            .json({
                success: true,
                message: "User biography added successfully."
            });
    } catch (error) {
        console.error("Error adding user biography:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while adding user biography."
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
        return res
            .status(200)
            .json({
                success: true,
                message: "User biography updated successfully."
            });
    } catch (error) {
        console.error("Error updating user biography:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while updating user biography."
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
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User profile image already exists."
                });
        }

        // Atualize a URL da imagem de perfil do usuário
        user.profileImageUrl = profileImageUrl;
        await user.save();

        return res
            .status(201)
            .json({
                success: true,
                message: "User profile image added successfully."
            });
    } catch (error) {
        console.error("Error adding user profile image:", error);
        return res
            .status(500)
            .json({
                success: false,
                message:
                    "Internal server error while adding user profile image."
            });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { newUsername, newBiography, profileImageUrl, newPhone } =
            req.body;

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
                    username: newUsername
                });
                if (existingUser) {
                    // Se o novo nome de usuário já estiver em uso, retorne um erro
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Nome de usuário já em uso."
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

        return res
            .status(200)
            .json({
                success: true,
                message: "User profile updated successfully."
            });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error while updating user profile."
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
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User profile image does not exist."
                });
        }

        // Exclua a URL da imagem de perfil do usuário
        user.profileImageUrl = null;
        await user.save();

        return res
            .status(200)
            .json({
                success: true,
                message: "User profile image deleted successfully."
            });
    } catch (error) {
        console.error("Error deleting user profile image:", error);
        return res
            .status(500)
            .json({
                success: false,
                message:
                    "Internal server error while deleting user profile image."
            });
    }
};

exports.addGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { galleryImageUrl } = req.body;

        // Encontre o usuário pelo ID
        const user = await User.findById(id);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        user.galleryImageUrl.push(galleryImageUrl);
        await user.save();

        return res
            .status(201)
            .json({
                success: true,
                message: "Gallery image added successfully."
            });
    } catch (error) {
        console.error("Error adding gallery image:", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error while adding gallery image."
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
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error while getting gallery images."
            });
    }
};

