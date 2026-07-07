import axios from 'axios';
import { setTokens } from './client/tokens';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Queue management for concurrent refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept the refresh call itself & prevent infinite loops
    if (originalRequest.url === '/users/refresh' || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (isRefreshing) {
        // Another refresh is already happening – queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Update the Authorization header with the new token (though cookies are used, this is safe)
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint – only once for all queued requests
        const response = await apiClient.post('users/refresh'); // adjust if path differs
        const { access_token, refresh_token } = response.data;

        // Store new tokens in httpOnly cookies
        await setTokens(access_token, refresh_token);

        // Retry all queued requests with the new access token
        processQueue(null, access_token);

        // Update current request's Authorization header (browser will also send the cookie)
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed – redirect to login (or signup)
        if (typeof window !== 'undefined') {
          window.location.href = '/signup'; // Consider using '/login' if appropriate
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

// // import axios from 'axios';

// // const apiClient = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:4000/api
// //   withCredentials: true, // THIS IS THE KEY
// //   headers: { 'Content-Type': 'application/json' },
// // });

// import axios from 'axios';
// import { setTokens } from './client/tokens';

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:4001/api
//   withCredentials: true, // sends & receives httpOnly cookies
//   headers: { 'Content-Type': 'application/json' },
// });

// // --- Refresh interceptor ---
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Don't intercept the refresh call itself & prevent infinite loops
//     if (originalRequest.url === '/auth/refresh' || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401) {
//       originalRequest._retry = true;
//       try {
//         // Call the refresh endpoint – the httpOnly refresh_token cookie is sent automatically
//         const response = await apiClient.post('users/refresh'); // no body needed
//         await setTokens(response.data.access_token, response.data.refresh_token);

//         // The browser automatically stored the new tokens from Set-Cookie headers.
//         // Retry the original request – the new access_token cookie will be attached.
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         console.log('Error from axious instance refresh token:', refreshError);
//         // Refresh failed (e.g., refresh token expired) → redirect to login
//         if (typeof window !== 'undefined') {
//           window.location.href = '/signup';
//         }
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default apiClient;
