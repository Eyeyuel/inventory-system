import { apiClient } from '@/lib/api-client';

export const getProducts = async () => {
  const res = await apiClient.get('/todos');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return res.data;
};

export const getProduct = async (id: string) => {
  const res = await apiClient.get(`/todos/${id}`);
  return res.data;
};
