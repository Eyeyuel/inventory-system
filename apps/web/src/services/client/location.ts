// export async function createLocation () {}

import { PaginatedLocationResponseDto } from '@inventory-system/dto';
import apiClient from '../axiosInstance';

export async function getLocations(): Promise<PaginatedLocationResponseDto> {
  const response = await apiClient.get('/location');
  return response.data;
}

// export async function getSalesOrders(
//   params?: SalesFilters,
// ): Promise<PaginatedSalesOrderResponseDto> {
//   const response = await apiClient.get('/sales', {
//     params,
//   });
//   // console.log('Fetched sales orders params:', params);
//   // console.log('Fetched sales orders data:', response.data); // Debug log
//   return response.data;
// }

// export async function getSalesOrderById(id: string): Promise<SalesOrderResponseDto> {
//   const response = await apiClient.get(`/sales/${id}`);
//   console.log('Fetched order details:', response.data); // Debug log

//   return response.data;
// }
