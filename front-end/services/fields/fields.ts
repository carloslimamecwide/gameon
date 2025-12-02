import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

// Endpoints específicos de campos
const FIELDS_ENDPOINTS = {
  NEARBY: `${API_BASE_URL}/api/fields/nearby`,
  LIST: `${API_BASE_URL}/api/fields`,
  DETAILS: (id: string) => `${API_BASE_URL}/api/fields/${id}`,
};

export const fetchNearbyFields = async (latitude: number, longitude: number, radius = 10) => {
  try {
    const response = await axios.get(FIELDS_ENDPOINTS.NEARBY, {
      params: { lat: latitude, lng: longitude, radius },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar campos próximos");
  }
};

export const fetchAllFields = async () => {
  try {
    const response = await axios.get(FIELDS_ENDPOINTS.LIST);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar campos");
  }
};

export const fetchFieldDetails = async (fieldId: string) => {
  try {
    const response = await axios.get(FIELDS_ENDPOINTS.DETAILS(fieldId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar detalhes do campo");
  }
};
