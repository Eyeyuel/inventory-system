import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:4001/api
  withCredentials: true, // THIS IS THE KEY
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
