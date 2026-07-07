// import { useMutation } from '@tanstack/react-query';
// import APIClient from '@/services/ApiClient';

// interface Category {
//   id: number;
//   category: string;
//   description: string;
// }

// const apiClient = new APIClient<Category>('/category');

// export const useUpdateCategory = () => {
//   return useMutation<Category, Error, { id: number; data: Partial<Category> }>({
//     mutationFn: ({ id, data }) => apiClient.patch(id, data), // Uses your APIClient.patch()
//   });
// };
