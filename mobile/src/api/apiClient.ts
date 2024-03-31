import axios from "axios";

const baseURL = 'http://localhost:3000/';

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: true,
});

export default apiClient;
