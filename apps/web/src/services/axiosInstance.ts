// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:4000/api
//   withCredentials: true, // THIS IS THE KEY
//   headers: { 'Content-Type': 'application/json' },
// });

import axios from 'axios';
import { setTokens } from './client/tokens';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:4001/api
  withCredentials: true, // sends & receives httpOnly cookies
  headers: { 'Content-Type': 'application/json' },
});

// --- Refresh interceptor ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept the refresh call itself & prevent infinite loops
    if (originalRequest.url === '/auth/refresh' || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;
      try {
        // Call the refresh endpoint – the httpOnly refresh_token cookie is sent automatically
        const response = await apiClient.post('users/refresh'); // no body needed
        await setTokens(response.data.access_token, response.data.refresh_token);

        // The browser automatically stored the new tokens from Set-Cookie headers.
        // Retry the original request – the new access_token cookie will be attached.
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('Error from axious instance refresh token:', refreshError);
        // Refresh failed (e.g., refresh token expired) → redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/signup';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
