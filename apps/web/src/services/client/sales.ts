import { SalesFilters } from '@/components/dashboard/sales-table';
import { PaginatedSalesOrderResponseDto, SalesOrderResponseDto } from '@inventory-system/dto';
import apiClient from '../axiosInstance';

// CHANGED: accepts filters
export async function getSalesOrders(
  params?: SalesFilters,
): Promise<PaginatedSalesOrderResponseDto> {
  const response = await apiClient.get('/sales', {
    params,
  });
  // console.log('Fetched sales orders params:', params);
  // console.log('Fetched sales orders data:', response.data); // Debug log
  return response.data;
}

export async function getSalesOrderById(id: string): Promise<SalesOrderResponseDto> {
  const response = await apiClient.get(`/sales/${id}`);
  console.log('Fetched order details:', response.data); // Debug log

  return response.data;
}
