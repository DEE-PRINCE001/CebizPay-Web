import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const recruitmentService = {
  // Org Job Postings
  getJobs: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.RECRUITMENT.JOBS.LIST, { params });
  },

  createJob: async (payload) => {
    return apiClient.post(ENDPOINTS.RECRUITMENT.JOBS.CREATE, payload);
  },

  getJobById: async (id) => {
    return apiClient.get(ENDPOINTS.RECRUITMENT.JOBS.GET_BY_ID(id));
  },

  updateJob: async (id, payload) => {
    return apiClient.put(ENDPOINTS.RECRUITMENT.JOBS.UPDATE(id), payload);
  },

  // Applications Review Workflow
  getApplicationsForJob: async (jobId, params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.RECRUITMENT.APPLICATIONS.LIST_FOR_JOB(jobId), { params });
  },

  getApplicationById: async (id) => {
    return apiClient.get(ENDPOINTS.RECRUITMENT.APPLICATIONS.GET_BY_ID(id));
  },

  shortlistApplication: async (id, payload) => {
    return apiClient.post(ENDPOINTS.RECRUITMENT.APPLICATIONS.SHORTLIST(id), payload);
  },

  acceptApplication: async (id, payload) => {
    return apiClient.post(ENDPOINTS.RECRUITMENT.APPLICATIONS.ACCEPT(id), payload);
  },

  rejectApplication: async (id, payload) => {
    return apiClient.post(ENDPOINTS.RECRUITMENT.APPLICATIONS.REJECT(id), payload);
  },

  // Public Recruitment
  getPublicJobs: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.RECRUITMENT.PUBLIC.LIST_JOBS, { params });
  },

  getPublicJobById: async (id) => {
    return apiClient.get(ENDPOINTS.RECRUITMENT.PUBLIC.GET_JOB(id));
  },

  submitPublicApplication: async (formData) => {
    return apiClient.post(ENDPOINTS.RECRUITMENT.PUBLIC.SUBMIT_APPLICATION, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
