import React from 'react';
import ProductsClient from './ProductsClient';
import { getPageContent, getProductCategories } from '@/lib/actions';

export default async function ProductsPage() {
  const content = await getPageContent('products');
  const categories = await getProductCategories();
  return (
      <ProductsClient content={content} categories={categories} />
  );
}
