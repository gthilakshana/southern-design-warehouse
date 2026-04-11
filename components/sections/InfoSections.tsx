"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HiOutlineCheckCircle } from 'react-icons/hi' 
import { Plus, ArrowRight } from 'lucide-react'

export const InfoSections = () => {
  const { scrollYProgress } = useScroll();
  
  // Subtle parallax for the overlapping images
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const contractorBenefits = [
    'Bulk material availability',
    'Contractor pricing',
    'Fast pickup',
    'Reliable inventory',
    'Material specialists'
  ]

  const images = [
    "/images/info1.webp", // Main Hero Image
    "/images/info2.webp", // Industrial Warehouse
    "/images/info3.webp", // Minimalist Wood
    "/images/info4.webp"  // Stone Texture
  ];

  return (
    <div className="bg-[#FAF9F6] text-[#1a1a1a] min-h-screen overflow-hidden"> 
      <section id="contractors" className="relative py-24 lg:py-44">
        
        {/* LIGHT WATERMARK TEXT */}
        <div className="absolute top-20 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] pointer-events-none">
          <span className="text-[18vw] font-black tracking-tighter uppercase">SOUTHERN WAREHOUSE</span>
        </div>

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            
            {/* 1. THE TEXT COMPOSITION */}
            <div className="w-full lg:w-5/12 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[#8B7355] font-bold text-[10px] uppercase tracking-[0.4em]">Section 01 // Pro</span>
                  <div className="flex-1 h-[1px] bg-stone-200" />
                </div>

                <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] mb-10 tracking-tight text-slate-900">
                  Built for <br />
                  Contractors
                </h2>

                <div className="space-y-8 mb-16">
                  <p className="text-lg text-slate-500 font-light leading-relaxed max-w-md">
                    We provide a streamlined procurement experience designed specifically for the pace of professional construction. 
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {contractorBenefits.map((item, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-5 h-5 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                          <Plus size={10} className="text-stone-400 group-hover:text-white" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* LIGHT MINIMAL BUTTON */}
                <Link 
                  href="#quotation-form"
                  className="group relative inline-block w-full sm:w-fit px-12 py-6 bg-white border border-stone-200 hover:border-[#8B7355] transition-all duration-500 shadow-sm overflow-hidden"
                >
                  <span className="relative z-10 font-bold text-[11px] uppercase tracking-[0.3em] flex items-center gap-3">
                    Contractor Quote Request <ArrowRight size={14} />
                  </span>
                  <div className="absolute inset-0 bg-[#8B7355]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </motion.div>
            </div>

            {/* 2. THE FLOATING IMAGE GALLERY */}
            <div className="w-full lg:w-7/12 order-1 lg:order-2">
              <div className="relative h-[550px] md:h-[700px] w-full">
                
                {/* Main Image - Center */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[75%] z-10 shadow-2xl rounded-sm overflow-hidden border-[16px] border-white"
                >
                  <Image src={images[0]} alt="Hero" fill className="object-cover" />
                </motion.div>

                {/* Parallax Image - Top Right */}
                <motion.div 
                  style={{ y: y1 }}
                  className="absolute top-0 right-0 w-[45%] h-[40%] z-20 shadow-xl rounded-sm overflow-hidden border-8 border-white"
                >
                  <Image src={images[1]} alt="Detail" fill className="object-cover" />
                </motion.div>

                {/* Parallax Image - Bottom Left */}
                <motion.div 
                  style={{ y: y2 }}
                  className="absolute bottom-0 left-0 w-[40%] h-[45%] z-20 shadow-xl rounded-sm overflow-hidden border-8 border-white"
                >
                  <Image src={images[2]} alt="Material" fill className="object-cover" />
                </motion.div>

                {/* Small Detail Square */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-10 right-10 w-32 h-32 bg-red-600 z-30 flex items-center justify-center p-6 text-center"
                >
                  <span className="text-white text-[9px] font-bold uppercase tracking-widest leading-tight">
                    Premium Quality Only
                  </span>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}