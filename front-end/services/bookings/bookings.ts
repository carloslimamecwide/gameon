import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

// Endpoints específicos de reservas
const BOOKINGS_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/api/bookings`,
  LIST: `${API_BASE_URL}/api/bookings`,
  CANCEL: (id: string) => `${API_BASE_URL}/api/bookings/${id}/cancel`,
  DETAILS: (id: string) => `${API_BASE_URL}/api/bookings/${id}`,
};

export const createBooking = async (fieldId: string, timeSlotId: string, date: string) => {
  try {
    const response = await axios.post(BOOKINGS_ENDPOINTS.CREATE, {
      fieldId,
      timeSlotId,
      date,
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao criar reserva");
  }
};

export const fetchUserBookings = async () => {
  try {
    const response = await axios.get(BOOKINGS_ENDPOINTS.LIST);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar suas reservas");
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await axios.delete(BOOKINGS_ENDPOINTS.CANCEL(bookingId));
    return response.data;
  } catch (error) {
    throw new Error("Falha ao cancelar reserva");
  }
};
