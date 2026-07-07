'use server';
import apiClient from './axiosInstance';

interface User {
  id: number;
  name: string;
}

export const createUser = async (data: User) => {
  const response = await apiClient.post('/users', data);
  // console.log(response.data);
};
