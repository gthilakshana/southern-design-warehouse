'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Sparkles, Layers, Eye, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShowroomEditorial() {
  const [isZoomed, setIsZoomed] = useState(false);

  const features = [
    { title: "Real Lighting", icon: <Sparkles size={20} />, desc: "See materials in natural light" },
    { title: "Tactile Tech", icon: <Layers size={20} />, desc: "Compare textures side-by-side" },
    { title: "Design Vision", icon: <Eye size={20} />, desc: "Visualize the final result" },
    { title: "Expert Lead", icon: <ShieldCheck size={20} />, desc: "Guided by industry pros" }
  ];

  return (
    <section className="relative bg-white min-h-screen flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT SIDE: THE VISUAL (Fixed on Desktop) */}
      <div className="relative w-full lg:w-1/2 h-[60vh] lg:h-screen bg-stone-100">
        <motion.div 
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src="/kitchens/Cabinetry.webp"
            alt="Showroom"
            fill
            className="object-cover  hover:grayscale-0 transition-all duration-1000 cursor-pointer"
            onClick={() => setIsZoomed(true)}
          />
         
          
          {/* Vertical Label */}
          <div className="absolute left-8 bottom-12 origin-left -rotate-90">
            <p className="text-white/50 text-[10px] uppercase tracking-[0.5em] whitespace-nowrap">
              Established 2026 — Southern Design
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: THE CONTENT */}
      <div className="w-full lg:w-1/2 px-8 md:px-16 lg:px-24 py-20 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[1px] w-8 bg-red-600"></span>
            <span className="text-red-600 text-[11px] font-bold uppercase tracking-[0.3em]">
              The Warehouse Experience
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 leading-[1.1] mb-8">
            Think <span className="font-serif italic">beyond</span> the screen.
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-md">
            Digital samples can only take you so far. Step into a space designed for tactile 
            exploration and professional decision-making.
          </p>

          {/* Feature List (Vertical & Clean) */}
          <div className="space-y-8 mb-16">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-start gap-6 border-l border-slate-100 hover:border-[#B33E2F] pl-6 transition-colors"
              >
                <div className="text-slate-300 group-hover:text-[#B33E2F] transition-colors pt-1">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-1">{f.title}</h4>
                  <p className="text-sm text-slate-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Group */}
          <div className="flex flex-wrap gap-8 items-center">
            <Link 
              href="/contact#quote-form"
              className="relative overflow-hidden group bg-slate-900 text-white px-10 py-6"
            >
              <span className="relative z-10 flex items-center gap-3 uppercase text-[11px] font-bold tracking-widest">
                Schedule Consult <ArrowRight size={16} />
              </span>
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link 
              href="/contact#location"
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#B33E2F] transition-colors"
            >
              <MapPin size={16} />
              Directions
            </Link>
          </div>
        </motion.div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 md:p-12"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative w-full h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-widest font-bold">Showroom Gallery</span>
                <button className="text-[10px] uppercase tracking-widest font-bold border-b border-black">Close [X]</button>
              </div>
              <div className="relative flex-1">
                <Image 
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000" 
                  alt="Showroom Full" 
                  fill 
                  className="object-contain" 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}