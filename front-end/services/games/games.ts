import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

// Endpoints específicos de jogos
const GAMES_ENDPOINTS = {
  LIST: `${API_BASE_URL}/api/games`,
  CREATE: `${API_BASE_URL}/api/games`,
  DETAILS: (id: string) => `${API_BASE_URL}/api/games/${id}`,
  JOIN: (id: string) => `${API_BASE_URL}/api/games/${id}/join`,
  LEAVE: (id: string) => `${API_BASE_URL}/api/games/${id}/leave`,
};

export const fetchUserGames = async () => {
  try {
    const response = await axios.get(GAMES_ENDPOINTS.LIST);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar seus jogos");
  }
};

export const createGame = async (gameData: {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
}) => {
  try {
    const response = await axios.post(GAMES_ENDPOINTS.CREATE, gameData);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao criar jogo");
  }
};

export const fetchGameDetails = async (gameId: string) => {
  try {
    const response = await axios.get(GAMES_ENDPOINTS.DETAILS(gameId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar detalhes do jogo");
  }
};

export const joinGame = async (gameId: string) => {
  try {
    const response = await axios.post(GAMES_ENDPOINTS.JOIN(gameId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao entrar no jogo");
  }
};

export const leaveGame = async (gameId: string) => {
  try {
    const response = await axios.delete(GAMES_ENDPOINTS.LEAVE(gameId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao sair do jogo");
  }
};
