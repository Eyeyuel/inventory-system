import apiClient from '../axiosInstance';

export async function getProfile() {
  const response = await apiClient.get('/profile');
  return response.data;
}
