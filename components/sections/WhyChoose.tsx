'use client';

import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

// The specific features for the "Why Choose" section
const features = [
  {
    id: "01",
    title: "Wide Selection",
    description: "A diverse range of remodeling materials in one convenient location.",
  },
  {
    id: "02",
    title: "Contractor Friendly",
    description: "We understand contractor timelines and supply needs.",
  },
  {
    id: "03",
    title: "Design Support",
    description: "Our team helps homeowners choose materials that work together.",
  },
  {
    id: "04",
    title: "Quality Materials",
    description: "We source products designed for durability and long-term performance.",
  },
  {
    id: "05",
    title: "Local Supply Warehouse",
    description: "Serving homeowners and contractors looking for remodeling materials near them.",
  },
];

const trustPoints = [
  "Reliable supply",
  "Quality materials",
  "Helpful guidance",
  "Professional service"
];

export default function WhyChoose() {
  return (
    <section className="bg-[#121212] text-white py-24 px-6 md:px-16 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="relative mb-24">
          <span className="text-white text-xs font-bold uppercase tracking-[0.5em] block mb-4">The Warehouse Edge</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 max-w-4xl leading-[1.1] tracking-tight">
            Why Choose Southern Design Warehouse
          </h2>
          <div className="w-24 h-[1px] bg-white/30" />
        </div>

        {/* --- Features Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          
          {/* Left Side: Interactive List */}
          <div className="lg:col-span-7 space-y-12">
            {features.map((item) => (
              <div key={item.id} className="group flex items-start gap-8 cursor-default">
                <span className="text-white font-serif italic text-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  {item.id}
                </span>
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-medium text-gray-100 group-hover:text-red-600 transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg max-w-md">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Sticky Feature Image */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[700px] hidden md:block">
             <div className="sticky top-10 w-full h-full">
                {/* Decorative border frame */}
                <div className="absolute inset-0 border border-white/10 translate-x-4 translate-y-4" />
                <div className="relative w-full h-full overflow-hidden">
                   <Image 
                    src="/images/warehouse.jpg" 
                    alt="Professional Warehouse Contractor"
                    fill
                    className="object-cover  hover:grayscale-0 transition-all duration-700"
                   />
                   {/* Gradient overlay to help text transition */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />
                </div>
             </div>
          </div>
        </div>

        {/* --- Refined Customer Trust Section --- */}
        <div className="relative border border-white/5 bg-[#1a1a1a] p-8 md:p-20 overflow-hidden">
          {/* Background Decoration blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a68966]/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-[#a68966]/10 p-4 rounded-full mb-8">
               <Star className="text-white w-8 h-8" fill="currentColor" strokeWidth={0} />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-medium mb-6 tracking-tight">Customer Trust</h2>
            
            <p className="text-gray-400 max-w-2xl mb-12 text-lg leading-relaxed">
              Contractors, designers, and homeowners trust Southern Design Warehouse for their remodeling projects.
            </p>

            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mb-16">
              {trustPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="bg-[#1a1a1a] py-8 px-4 flex flex-col items-center group hover:bg-[#222] transition-colors"
                >
                  <span className="text-white/40 mb-2 text-[10px] uppercase tracking-widest font-bold">Priority</span>
                  <span className="text-gray-200 font-medium">{point}</span>
                </div>
              ))}
            </div>

            <blockquote className="relative">
               <span className="text-6xl font-serif text-red-600/20 absolute -top-10 -left-8">"</span>
               <p className="text-white text-2xl md:text-3xl font-serif italic font-light tracking-wide">
                 Our goal is to make your renovation process easier and more efficient.
               </p>
               <span className="text-6xl font-serif text-[#a68966]/20 absolute -bottom-16 -right-8">"</span>
            </blockquote>
          </div>
        </div>

      </div>
    </section>
  );
}