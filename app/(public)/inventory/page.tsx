import React from 'react';
import { getInventory, getPageContent } from '@/lib/actions';
import InventoryGallery from '@/components/sections/InventoryGallery';

export default async function ProductPage() {
  const [inventoryItems, content] = await Promise.all([
    getInventory(),
    getPageContent('inventory')
  ]);

  // Transform Prisma data to match UI expectations
  const products = inventoryItems.map((item: any) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: `$${item.price.toLocaleString()}`,
    stock: item.status !== "OUT OF STOCK",
    image: item.imageUrl || ""
  }));

  // Extract unique categories from both the database and add "All Products"
  const dbCategories = Array.from(new Set(inventoryItems.map((item: any) => item.category))) as string[];
  const categories = ["All Products", ...dbCategories];

  return (
    <InventoryGallery 
      initialProducts={products} 
      initialCategories={categories} 
      heroContent={content}
    />
  );
}