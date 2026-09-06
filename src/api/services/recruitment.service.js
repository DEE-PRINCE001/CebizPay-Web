import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const recruitmentService = {
  // Org Job Postings
  org: {
    getJobs: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.RECRUITMENT.ORG.JOBS, { params });
    },
    createJob: async (payload) => {
      return apiClient.post(ENDPOINTS.RECRUITMENT.ORG.JOBS, payload);
    },
    getJobById: async (id) => {
      return apiClient.get(ENDPOINTS.RECRUITMENT.ORG.JOB_BY_ID(id));
    },
    updateJob: async (id, payload) => {
      return apiClient.put(ENDPOINTS.RECRUITMENT.ORG.JOB_BY_ID(id), payload);
    },
    getApplicationsForJob: async (jobId, params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.RECRUITMENT.ORG.APPLICATIONS(jobId), { params });
    },
    getApplicationById: async (id) => {
      return apiClient.get(ENDPOINTS.RECRUITMENT.ORG.APPLICATION_BY_ID(id));
    },
    shortlistApplication: async (id, payload) => {
      return apiClient.post(ENDPOINTS.RECRUITMENT.ORG.SHORTLIST(id), payload);
    },
    acceptApplication: async (id, payload) => {
      return apiClient.post(ENDPOINTS.RECRUITMENT.ORG.ACCEPT(id), payload);
    },
    rejectApplication: async (id, payload) => {
      return apiClient.post(ENDPOINTS.RECRUITMENT.ORG.REJECT(id), payload);
    },
  },

  // Public Recruitment (Candidate View)
  public: {
    getJobs: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.RECRUITMENT.PUBLIC.JOBS, { params });
    },
    getJobById: async (id) => {
      return apiClient.get(ENDPOINTS.RECRUITMENT.PUBLIC.JOB_BY_ID(id));
    },
    submitApplication: async (jobId, formData) => {
      return apiClient.post(ENDPOINTS.RECRUITMENT.PUBLIC.APPLY(jobId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    withdrawApplication: async (id, payload) => {
      return apiClient.post(ENDPOINTS.RECRUITMENT.PUBLIC.WITHDRAW(id), payload);
    },
  },
};
