import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const supportService = {
  // Tickets
  getTickets: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.SUPPORT.TICKETS, { params });
  },

  createTicket: async (payload) => {
    return apiClient.post(ENDPOINTS.SUPPORT.TICKETS, payload);
  },

  getTicketById: async (id) => {
    return apiClient.get(ENDPOINTS.SUPPORT.TICKET_BY_ID(id));
  },

  addMessage: async (id, payload) => {
    return apiClient.post(ENDPOINTS.SUPPORT.ADD_MESSAGE(id), payload);
  },

  updateTicketStatus: async (id, payload) => {
    return apiClient.patch(ENDPOINTS.SUPPORT.UPDATE_STATUS(id), payload);
  },

  // Kola Chatbot
  startKolaSession: async (organizationId = null) => {
    return apiClient.post(ENDPOINTS.SUPPORT.KOLA.START_SESSION, {
      organizationId: organizationId || null,
    });
  },

  interactWithKola: async (payload) => {
    return apiClient.post(ENDPOINTS.SUPPORT.KOLA.INTERACT, payload);
  },
};
