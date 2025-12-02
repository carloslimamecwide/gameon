import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

// Endpoints específicos de perfil
const PROFILE_ENDPOINTS = {
  GET: `${API_BASE_URL}/api/profile`,
  UPDATE: `${API_BASE_URL}/api/profile`,
  UPLOAD_AVATAR: `${API_BASE_URL}/api/profile/avatar`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/profile/password`,
};

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(PROFILE_ENDPOINTS.GET);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar perfil");
  }
};

export const updateUserProfile = async (profileData: {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}) => {
  try {
    const response = await axios.put(PROFILE_ENDPOINTS.UPDATE, profileData);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao atualizar perfil");
  }
};

export const uploadAvatar = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append("avatar", {
      uri: imageUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);

    const response = await axios.post(PROFILE_ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao fazer upload da foto");
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await axios.post(PROFILE_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao alterar senha");
  }
};
