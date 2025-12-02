import axios from "axios";
import { handleApiError } from "../../utils/apiErrorHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/api";

// Função para criar headers com token
const createAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Endpoints específicos de autenticação
const AUTH_ENDPOINTS = {
  SIGNIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/register`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
};

// Debug: Log da configuração da API
console.log("API Base URL:", API_BASE_URL);
console.log("Auth Endpoints:", AUTH_ENDPOINTS);

export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.SIGNIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Authentication service error:", error);
    throw error;
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    console.log("Registering user with data:", { name, email, password: "***" });

    const response = await axios.post(AUTH_ENDPOINTS.SIGNUP, {
      name,
      email,
      password,
    });

    console.log("Registration response status:", response.status);
    console.log("Registration response data:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error("Registration service error:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Forgot password service error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const headers = await createAuthHeaders();
    const response = await axios.post(AUTH_ENDPOINTS.LOGOUT, {}, { headers });
    return response.data;
  } catch (error) {
    throw new Error("Logout failed");
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });

    const data = response.data as { accessToken?: string; refreshToken?: string };

    // Atualizar tokens no storage
    if (data.accessToken) {
      await AsyncStorage.setItem("access_token", data.accessToken);
    }
    if (data.refreshToken) {
      await AsyncStorage.setItem("refresh_token", data.refreshToken);
    }

    return data;
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};
