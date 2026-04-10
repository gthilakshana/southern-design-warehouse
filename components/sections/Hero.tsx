"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { getSiteSettings } from '@/lib/actions';
import ResponsiveHero from '../ui/ResponsiveHero';

export const Hero = () => {
  const defaultProducts = ['Products', 'Kitchens', 'Bathrooms', 'Cabinets', 'Showroom'];

  const [settings, setSettings] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch hero settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const products = settings?.heroText
    ? settings.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter(Boolean)
    : defaultProducts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    },
  };

  return (
    <section className="relative  h-screen min-h-[750px] flex items-center overflow-hidden text-white">

      {/* HERO IMAGE - Cinematic Scale */}
      {mounted ? (
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <ResponsiveHero
            heroUrl={settings?.heroUrl}
            heroMobileUrl={settings?.heroMobileUrl}
            heroTabletUrl={settings?.heroTabletUrl}
            fallbackUrl=""
            alt="Warehouse Hero"
            brightness="brightness-[0.4]"
            priority={true}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}

      {/* CONTENT */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 font-[arial]">
        <motion.div 
          className="max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* TOP LABEL */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-[2px] bg-red-600" />
            <span className="text-white uppercase tracking-[0.3em] text-[10px] font-black">
              {settings?.siteName || "Warehouse Supply"}
            </span>
          </motion.div>

          {/* TITLE */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-black leading-none uppercase "
          >
            {settings?.heroTitle || (
              <>
                Premium Materials <br />
                for Construction <br />
                & Renovation
              </>
            )}
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-gray-300 max-w-xl text-lg font-medium leading-relaxed"
          >
            {settings?.heroDescription ||
              "Reliable warehouse supply for contractors, builders, and homeowners. Quality materials ready for every project."}
          </motion.p>

          {/* PRODUCT TAGS */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-2 mt-8"
          >
            {products.map((item: string) => (
              <span
                key={item}
                className="bg-white/5 border border-white/10 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </motion.div>

          {/* BUTTONS */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row gap-5 items-center"
          >
            {/* PRIMARY */}
            <Link href="/contact#quote-form" className="w-full sm:w-auto">
              <button className="w-full bg-red-600 hover:bg-black text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all active:scale-95">
                Request Quote
              </button>
            </Link>

            {/* SECONDARY */}
            <Link href="/showroom" className="w-full sm:w-auto">
              <button className="w-full border-2 border-white text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all active:scale-95">
                Visit Showroom
              </button>
            </Link>

           
            
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};