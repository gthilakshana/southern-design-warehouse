"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineArrowNarrowRight, HiX, HiPhotograph } from 'react-icons/hi';
import { getPageContent, getGalleryImages, type PageContent, type GalleryImage } from '@/lib/actions';
import ResponsiveHero from '@/components/ui/ResponsiveHero';

// Interface moved to lib/actions.ts

export default function GalleryPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pageData, galleryData] = await Promise.all([
          getPageContent('gallery'),
          getGalleryImages()
        ]);

        setContent(pageData);
        setImages(galleryData || []);
        setFilteredImages(galleryData || []);
      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute categories dynamically based on current images
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category))).filter(Boolean)];

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === category));
    }
  };

  const defaultHero = "https://images.unsplash.com/photo-1620626011761-9963d7b69763?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center text-center text-white px-6 overflow-hidden">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl={defaultHero}
          alt="Gallery"
          brightness="brightness-[0.4]"
        />

        <div className="relative z-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            {content?.title || "Project Gallery"}
          </motion.h1>

          <p className="text-gray-200 mt-4 text-lg">
            {content?.description || "Explore our completed warehouse and material projects."}
          </p>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <div className="py-8 px-6 sticky top-0 z-30 bg-gray-50/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider  border transition-all duration-300
                ${activeCategory === cat
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID */}
      <section className="py-12 px-6 ">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">Loading gallery...</p>
            </div>
          ) : filteredImages.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {filteredImages.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-shadow duration-300 h-fit"
                    onClick={() => setSelectedImage(img)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={img.url}
                        alt={img.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-700"
                      />
                    </div>

                    {/* Overlay - Fixed positioning for relative parent */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter w-fit mb-2">
                        {img.category}
                      </span>
                      <h3 className="text-white font-bold text-xl">
                        {img.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm mt-2 font-medium">
                        <span>View Project</span>
                        <HiOutlineArrowNarrowRight className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-gray-300 rounded-xl bg-white">
              <HiPhotograph size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No projects found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <HiX size={32} />
            </button>

            <motion.div
              className="bg-white max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-lg grid md:grid-cols-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="bg-gray-200 h-[300px] md:h-full relative">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded text-xs uppercase tracking-widest">
                    {selectedImage.category}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {selectedImage.title}
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {selectedImage.description || "Detailed view of our professional warehouse installation and material handling project."}
                </p>

                <Link 
                  href={`/contact?project=${encodeURIComponent(selectedImage.title)}`}
                  className="bg-red-600 text-white font-bold py-4 px-8 rounded-md hover:bg-red-700 transition-colors shadow-lg shadow-red-100 self-start text-center"
                >
                  Inquire About This Project
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}