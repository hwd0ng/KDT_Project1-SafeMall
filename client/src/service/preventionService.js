import axios from 'axios';

const API_URL = 'http://localhost:8080/prevent';

export const getPreventions = () => {
  return axios.get(API_URL);
};

export const getPreventionById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createPrevention = (data) => {
  return axios.post(API_URL, data);
};

export const updatePrevention = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deletePrevention = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
