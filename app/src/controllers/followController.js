const Relationship = require("../models/relationShip");
const express = require("express");

exports.followUser = async (req, res) => {
  const { follower_id, following_id } = req.body;

  try {
    // Verificar se já existe uma relação entre o seguidor e o usuário seguido
    const existingRelationship = await Relationship.findOne({
      follower_id,
      following_id,
    });

    if (existingRelationship) {
      return res
        .status(400)
        .json({ error: "Você já está seguindo este usuário" });
    }

    // Criação de uma nova instância de Relationship
    const newRelationship = new Relationship({
      follower_id,
      following_id,
    });

    // Salvar a nova relação no banco de dados
    await newRelationship.save();

    res.status(200).json(newRelationship);
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

exports.unfollowUser = async (req, res) => {
  const { follower_id, following_id } = req.params;

  try {
    // Encontre e exclua o relacionamento de seguidor com base nos IDs fornecidos
    const deletedRelationship = await Relationship.findOneAndDelete({
      follower_id,
      following_id,
    });

    if (!deletedRelationship) {
      return res
        .status(404)
        .json({ error: "Relacionamento de seguidor não encontrado" });
    }

    res.status(200).json({ message: "Deixou de seguir o usuário com sucesso" });
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

exports.verifyRelationship = async (req, res) => {
  const { follower_id, following_id } = req.params;

  try {
    // Verificar se existe uma relação entre o seguidor e o usuário seguido
    const existingRelationship = await Relationship.findOne({
      follower_id,
      following_id,
    });

    if (existingRelationship) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

exports.updateUserFollowersCount = async (req, res) => {
  try {
    const { following_id } = req.params;

    // Atualizar o contador de seguidores

    const numberOfFollowers = await Relationship.countDocuments({
      following_id: following_id,
    });

    // Enviar o número de seguidores como resposta
    return res.status(200).json({ numberOfFollowers });
  } catch (error) {
    console.error(
      "Erro ao atualizar o contador de seguidores do usuário:",
      error
    );
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

exports.getUserFollowingCount = async (req, res) => {
  try {
    const { follower_id } = req.params;

    // Contar o número de documentos na coleção Relationship onde o follower_id é igual ao ID do usuário
    const numberOfFollowing = await Relationship.countDocuments({
      follower_id,
    });

    // Retornar o número de usuários que o usuário está seguindo
    return res.status(200).json({ numberOfFollowing });
  } catch (error) {
    console.error(
      "Erro ao obter o número de usuários que o usuário está seguindo:",
      error
    );
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};