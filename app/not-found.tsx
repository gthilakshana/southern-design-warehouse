'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiHome, HiArchive, HiMail, HiArrowRight } from 'react-icons/hi';
import OptimizedImage from '@/components/ui/OptimizedImage';

/**
 * Premium 404 Not Found Page
 * Theme: Modern Industrial Warehouse
 * Matches the Southern Design Warehouse branding with high-end visuals and transitions.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* 1. BACKGROUND LAYER - High-quality warehouse imagery with dark overlay */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src="/images/warehouse1.webp"
          alt="Warehouse Interior"
          fill
          priority
          className="object-cover opacity-40 grayscale"
          containerClassName="h-screen w-full"
        />
        {/* Gradients to blend the edges and focus center */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-90" />
      </div>

      {/* 2. INDUSTRIAL ACCENTS - Structural elements for that "Warehouse" feel */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600/40 z-10" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-red-600/40 z-10" />
      
      {/* 3. MAIN CONTENT LAYER */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo Heading - Standalone Industrial Version */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 inline-block"
          >
            <Link href="/" className="flex items-center justify-center space-x-3 group">
              <div className="h-12 w-2 bg-red-600 group-hover:h-14 transition-all duration-300" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-white text-3xl font-black tracking-tighter uppercase italic">
                  Southern Design
                </span>
                <span className="text-red-600 text-3xl font-black tracking-tighter uppercase italic">
                  Warehouse
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Large Background 404 Watermark */}
          <h1 className="hidden md:block text-[22rem] font-black leading-none tracking-tighter text-white/[0.03] select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] -z-10 font-mono">
            404
          </h1>

          {/* Core Message */}
          <div className="space-y-6 mb-16">
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight italic">
              Section Not Found
            </h2>
            <div className="h-1 w-24 bg-red-600 mx-auto rounded-full" />
            <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
              You've ventured into an undocumented aisle. The materials you're searching for aren't in this bay.
            </p>
          </div>

          {/* Navigational Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Action 1: Home */}
            <Link href="/" className="group">
              <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-8 transition-all duration-500 transform group-hover:-translate-y-2 h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-6 group-hover:bg-red-600/20 group-hover:text-red-600 transition-colors">
                  <HiHome className="text-white/60 w-6 h-6 group-hover:text-red-600 transition-colors" />
                </div>
                <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-3">Return to Showroom</h3>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.1em]">Head back to Homepage</p>
                <HiArrowRight className="mt-6 text-white/20 group-hover:text-red-600 group-hover:translate-x-2 transition-all" />
              </div>
            </Link>

            {/* Action 2: Products (Highlight) */}
            <Link href="/products" className="group">
              <div className="bg-red-600 hover:bg-red-700 p-8 transition-all duration-500 transform group-hover:-translate-y-2 h-full flex flex-col items-center justify-center text-center shadow-2xl shadow-red-600/20">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center mb-6">
                  <HiArchive className="text-white w-6 h-6" />
                </div>
                <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-3">Browse Inventory</h3>
                <p className="text-white/70 text-[10px] uppercase font-bold tracking-[0.1em]">Explore our collections</p>
                <HiArrowRight className="mt-6 text-white/40 group-hover:translate-x-2 transition-all" />
              </div>
            </Link>

            {/* Action 3: Contact */}
            <Link href="/contact" className="group">
              <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-8 transition-all duration-500 transform group-hover:-translate-y-2 h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-6 group-hover:bg-red-600/20 group-hover:text-red-600 transition-colors">
                  <HiMail className="text-white/60 w-6 h-6 group-hover:text-red-600 transition-colors" />
                </div>
                <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-3">Request Assistance</h3>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.1em]">Speak with an expert</p>
                <HiArrowRight className="mt-6 text-white/20 group-hover:text-red-600 group-hover:translate-x-2 transition-all" />
              </div>
            </Link>
          </div>

          {/* Footer Metadata */}
          <div className="mt-20 flex flex-col items-center">
            <div className="flex items-center space-x-6 mb-4">
               <div className="h-[1px] w-12 bg-white/10" />
               <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em] text-center">
                 System Status: <span className="text-red-600/50">Location Mismatch</span>
               </span>
               <div className="h-[1px] w-12 bg-white/10" />
            </div>
            <p className="text-white/[0.05] text-[10px] font-mono tracking-widest uppercase mb-1">
              ERR_CODE: SDW-WRH-404-NOT-FOUND
            </p>
            <p className="text-white/[0.05] text-[10px] font-mono tracking-widest uppercase">
              COORDINATES: UNKNOWN_BAY_AREA_0
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Technical Overlays */}
      <div className="absolute top-1/4 left-10 pointer-events-none opacity-[0.03] select-none hidden xl:block">
        <div className="text-white text-9xl font-black rotate-90 origin-left tracking-tighter">SDW_SYS_01</div>
      </div>
      <div className="absolute bottom-1/4 right-10 pointer-events-none opacity-[0.03] select-none hidden xl:block">
        <div className="text-white text-9xl font-black -rotate-90 origin-right tracking-tighter">BAY_ACCESS_DENIED</div>
      </div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-50 bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}
