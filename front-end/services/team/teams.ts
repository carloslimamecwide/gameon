import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

// Endpoints específicos de equipas
const TEAMS_ENDPOINTS = {
  LIST: `${API_BASE_URL}/api/teams`,
  CREATE: `${API_BASE_URL}/api/teams`,
  DETAILS: (id: string) => `${API_BASE_URL}/api/teams/${id}`,
  JOIN: (id: string) => `${API_BASE_URL}/api/teams/${id}/join`,
  LEAVE: (id: string) => `${API_BASE_URL}/api/teams/${id}/leave`,
};

export const fetchUserTeams = async () => {
  try {
    const response = await axios.get(TEAMS_ENDPOINTS.LIST);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar suas equipas");
  }
};

export const createTeam = async (name: string, description?: string) => {
  try {
    const response = await axios.post(TEAMS_ENDPOINTS.CREATE, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao criar equipa");
  }
};

export const fetchTeamDetails = async (teamId: string) => {
  try {
    const response = await axios.get(TEAMS_ENDPOINTS.DETAILS(teamId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar detalhes da equipa");
  }
};

export const joinTeam = async (teamId: string) => {
  try {
    const response = await axios.post(TEAMS_ENDPOINTS.JOIN(teamId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao entrar na equipa");
  }
};

export const leaveTeam = async (teamId: string) => {
  try {
    const response = await axios.delete(TEAMS_ENDPOINTS.LEAVE(teamId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao sair da equipa");
  }
};
