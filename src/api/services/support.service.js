import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const supportService = {
  // Support Tickets
  getTickets: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.SUPPORT.TICKETS.LIST, { params });
  },

  createTicket: async (payload) => {
    return apiClient.post(ENDPOINTS.SUPPORT.TICKETS.CREATE, payload);
  },

  getTicketById: async (id) => {
    return apiClient.get(ENDPOINTS.SUPPORT.TICKETS.GET_BY_ID(id));
  },

  addMessageToTicket: async (id, payload) => {
    return apiClient.post(ENDPOINTS.SUPPORT.TICKETS.ADD_MESSAGE(id), payload);
  },

  updateTicketStatus: async (id, payload) => {
    return apiClient.patch(ENDPOINTS.SUPPORT.TICKETS.UPDATE_STATUS(id), payload);
  },

  // Kola Automated Triage Chatbot
  startKolaSession: async (organizationId = null) => {
    return apiClient.post(ENDPOINTS.SUPPORT.KOLA.START_SESSION, {
      organizationId: organizationId || null,
    });
  },

  interactWithKola: async (payload) => {
    return apiClient.post(ENDPOINTS.SUPPORT.KOLA.INTERACT, payload);
  },
};
