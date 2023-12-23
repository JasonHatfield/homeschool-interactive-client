import axios from 'axios';

// Create an instance of axios with a base URL and default headers
const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to set the authorization token in the request headers
export const setAuthToken = (token) => {
    if (token) {
        // Set the 'Authorization' header with the provided token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // If no token is provided, remove the 'Authorization' header
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

export default apiClient;
