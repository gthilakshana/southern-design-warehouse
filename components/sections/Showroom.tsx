'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShowroomSection() {
  const handleVisitClick = () => {
    console.log("Navigating to booking...");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <section className="bg-[#FAF9F6] py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* Left Side: Overlapping Image Composition */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
          className="relative"
        >
          {/* Decorative Square Frame (Top Left) */}
          <div className="absolute -top-8 -left-8 w-48 h-48 border border-stone-200 hidden md:block" />

          {/* Main Large Image */}
          <div className="relative z-10 shadow-2xl">
            <div className="border-[12px] border-white">
              <Image
                src="/images/20260225_093348.jpg"
                alt="Modern living room design"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Overlapping Showroom Image (Bottom Right) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-10 -right-4 md:-right-10 z-20 w-3/5 shadow-2xl"
          >
            <div className="border-[8px] border-white">
              <Image
                src="/images/20260225_093351.jpg"
                alt="Inside our showroom"
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Typography & Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-start text-left"
        >
          {/* Map Icon Box */}
          <motion.div variants={itemVariants} className="mb-6 p-4 bg-[#EAE7DE] inline-block">
            <MapPin size={24} className="text-[#8B7355]" strokeWidth={1.5} />
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-8 tracking-tight "
          >
            Visit Our Showroom
          </motion.h2>

          <div className="space-y-6 text-slate-600 mb-10 max-w-lg">
            <motion.p variants={itemVariants} className="text-lg">
              Choosing materials in person helps you visualize the final result of your project.
            </motion.p>
            <motion.p variants={itemVariants} className="font-bold text-slate-800 uppercase tracking-widest text-xs">
              Our showroom allows professionals to:
            </motion.p>

            {/* Horizontal Line List */}
            <ul className="space-y-6 pt-2">
              {[
                "See materials in real lighting",
                "Compare textures and finishes",
                "Match cabinets, flooring, and countertops",
                "Explore design possibilities"
              ].map((text, i) => (
                <motion.li key={i} variants={itemVariants} className="flex items-center gap-4 group">
                  <div className="w-10 h-[1.5px] bg-[#C5A371] group-hover:w-14 transition-all duration-300" />
                  <span className="text-slate-800 font-semibold uppercase tracking-tight text-sm">{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div variants={itemVariants} className="w-full border-t border-stone-200 pt-8">
            <p className="text-slate-900 font-black mb-8 max-w-sm uppercase tracking-tight text-sm">
              Our team guides you through material selection so you can make confident decisions.
            </p>

            <button
              onClick={handleVisitClick}
              className="bg-[#B33E2F] hover:bg-black text-white font-black px-12 py-5 transition-all duration-300 uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95"
            >
              Plan Your Showroom Visit
            </button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
