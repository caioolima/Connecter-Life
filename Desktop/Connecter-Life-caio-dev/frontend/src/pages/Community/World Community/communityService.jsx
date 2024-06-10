// communityService.js

export const fetchComunidades = async () => {
  try {
    const response = await fetch("http://localhost:3000/communities/comunidade/listar");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar comunidades:", error);
    throw error;
  }
};

export const fetchNumeroMembros = async (communityId) => {
  try {
    const response = await fetch(`http://localhost:3000/communities/comunidade/contarMembros/${communityId}`);
    const data = await response.json();
    return data.numberOfMembers;
  } catch (error) {
    console.error("Erro ao buscar o número de membros da comunidade:", error);
    throw error;
  }
};

export const fetchTopFollowedUsers = async () => {
  try {
    const response = await fetch("http://localhost:3000/user/top-followed");
    const data = await response.json();
    return data.topFollowedUsers;
  } catch (error) {
    console.error("Erro ao buscar os top usuários com mais seguidores:", error);
    throw error;
  }
};

export const fetchTopLikedPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/gallery/top-liked", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.topLikedImages;
  } catch (error) {
    console.error("Erro ao buscar as top publicações mais curtidas:", error);
    throw error;
  }
};
