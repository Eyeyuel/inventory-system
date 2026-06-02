import ProductsList from '@/components/products-list';
import { Suspense } from 'react';

const ProductsPage = async () => {
  return (
    <div>
      <h1 className="text-3xl">List of products</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsList />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
