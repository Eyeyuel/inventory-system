import apiClient from '../axiosInstance';

export interface DashboardStats {
  totalProducts: number;
  stockMovements: number;
  salesDrafts: number;
  purchaseDrafts: number;
}

export async function getDashboard(): Promise<DashboardStats> {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate network delay
  const [productsRes, movementsRes, salesDraftsRes, purchaseDraftsRes] = await Promise.all([
    apiClient.get('product/total'),
    apiClient.get('stock/movements/count'),
    apiClient.get('sales/drafts'),
    apiClient.get('purchase/drafts'),
  ]);

  return {
    totalProducts: productsRes.data.count,
    stockMovements: movementsRes.data.count,
    salesDrafts: salesDraftsRes.data.count,
    purchaseDrafts: purchaseDraftsRes.data.count,
  };
}
