import axios from 'axios';

/**
 * Axios instance for making API requests.
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
