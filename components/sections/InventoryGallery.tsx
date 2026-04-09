'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  HiChevronRight,
  HiCheckCircle,
  HiXCircle,
  HiArrowLeft,
  HiSearch,
} from 'react-icons/hi';
import { BiSortAlt2 } from 'react-icons/bi';
import ResponsiveHero from '@/components/ui/ResponsiveHero';
import { PageContent } from '@/lib/actions';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: boolean;
  image: string | null;
}

interface InventoryGalleryProps {
  initialProducts: Product[];
  initialCategories: string[];
  heroContent?: PageContent | null;
}

export default function InventoryGallery({
  initialProducts,
  initialCategories,
  heroContent
}: InventoryGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter logic
  const filteredProducts =
    activeCategory === 'All Products'
      ? initialProducts
      : initialProducts.filter(
          (p) => p.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()
        );

  // This ensures "All Products" is the first item and removes duplicates from initialCategories
  const categoriesList = Array.from(new Set(['All Products', ...initialCategories]));

  const defaultHero = "https://images.unsplash.com/photo-1581447100595-3a74ad993217?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50 font-[arial]">
      {/* 1. SMALL HEIGHT HERO HERO SECTION */}
      <section className="relative h-[35vh] flex items-center justify-center text-center text-white px-6 overflow-hidden">
        <ResponsiveHero
          heroUrl={heroContent?.heroUrl || defaultHero}
          heroTabletUrl={heroContent?.heroTabletUrl}
          heroMobileUrl={heroContent?.heroMobileUrl}
          fallbackUrl={defaultHero}
          alt="Inventory"
          brightness="brightness-[0.4]"
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mt-20 md:mt-10 leading-tight">
            {heroContent?.title || "Warehouse Inventory"}
          </h1>
          <p className="text-gray-300 mt-1 text-sm md:text-base font-bold uppercase tracking-tighter">
            {heroContent?.description || "Curated selection of premium materials ready for shipment."}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {(heroContent?.heroText || "Inventory.Materials.Selection.Support").split(/[•·,.]/).map((s: string) => s.trim()).filter(Boolean).map((item: string) => (
              <span
                key={item}
                className="bg-white/5 border border-white/10 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. GALLERY CONTENT */}
      <div className="flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-6">

        <div>
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
            Categories
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
            Warehouse Inventory
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedProduct(null);
              }}
              className={`flex items-center justify-between px-4 py-3 text-sm font-medium border transition-all
              ${
                activeCategory === cat
                  ? 'bg-gray-100 border-gray-300 text-gray-900'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
              <HiChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </nav>

        <div className="mt-auto text-xs text-gray-600 p-4 bg-gray-100 border border-gray-200">
          Need help selecting items? Contact support.
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10">

        {/* DETAIL VIEW */}
        {selectedProduct ? (
          <div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 mb-6 transition"
            >
              <HiArrowLeft /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white border border-gray-200 shadow-lg p-6 rounded-xl">

              <div className="relative w-full h-[420px] rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                {selectedProduct.image ? (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <HiSearch size={64} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Visual Asset</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">

                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  {selectedProduct.category}
                </span>

                <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                  {selectedProduct.name}
                </h1>

                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  High-quality warehouse material built for durability and performance.
                </p>

                <div className="flex items-center justify-between border-y border-gray-200 py-4 mb-6">

                  <span className="text-2xl font-bold text-gray-900">
                    {selectedProduct.price}
                  </span>

                  {selectedProduct.stock ? (
                    <span className="flex items-center gap-2 text-green-700 text-xs font-bold uppercase">
                      <HiCheckCircle /> In Stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase">
                      <HiXCircle /> Out of Stock
                    </span>
                  )}

                </div>

                <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-md active:scale-95">
                  Add to Quote
                </button>

              </div>
            </div>
          </div>
        ) : (
          <>
            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-4">

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {filteredProducts.length} Products
                </h3>
                <p className="text-xs text-gray-500">
                  In {activeCategory}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-100 transition">
                <BiSortAlt2 />
                <span>Sort: Latest</span>
              </div>

            </div>

            {/* GRID */}
            {filteredProducts.length > 0 ? (
              <motion.div 
                key={activeCategory} // FORCES RE-ANIMATION ON CATEGORY CHANGE
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible" // CHANGED FROM whileInView TO ENSURE VISIBILITY
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 }
                  }
                }}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.5, ease: "easeOut" }
                      }
                    }}
                    className="group bg-white border border-gray-200 hover:shadow-xl hover:border-red-600 transition-all cursor-pointer rounded-sm overflow-hidden"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition duration-700"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-200">
                           <HiSearch size={48} />
                           <span className="text-[8px] font-black uppercase tracking-widest mt-2">No Image</span>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 z-10">
                        {product.stock ? (
                          <span className="bg-green-700 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                            Available
                          </span>
                        ) : (
                          <span className="bg-red-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {product.category}
                      </p>

                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight leading-tight">
                        {product.name}
                      </h4>

                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <span className="text-xl font-black text-gray-900">
                          {product.price}
                        </span>

                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-red-600 flex items-center gap-1 transition-colors">
                          View Item <HiChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-center px-6"
              >
                <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mb-6">
                  <HiSearch size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest leading-none">
                  No Items Found
                </h3>
                <p className="text-gray-500 mt-4 max-w-xs text-sm font-medium">
                  We couldn't find any products in the <span className="text-gray-900 font-bold">"{activeCategory}"</span> category.
                </p>
                <button 
                  onClick={() => setActiveCategory('All Products')}
                  className="mt-8 bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-colors shadow-lg active:scale-95"
                >
                  View All Products
                </button>
              </motion.div>
            )}

            {/* PAGINATION */}
            <div className="mt-10 flex justify-center gap-3">

              <button className="px-4 py-2 text-xs border border-gray-300 text-gray-500 hover:bg-gray-100 transition">
                Prev
              </button>

              <button className="px-4 py-2 text-xs bg-red-600 text-white">
                1
              </button>

              <button className="px-4 py-2 text-xs border border-gray-300 hover:bg-gray-100 transition">
                Next
              </button>

            </div>
          </>
        )}
      </main>
      </div>
    </div>
  );
}