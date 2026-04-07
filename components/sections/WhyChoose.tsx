'use client';

import React from 'react';
import { Star } from 'lucide-react'; // Using Lucide for the star icon

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
    <section className="bg-[#1a1a1a] text-white py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 max-w-3xl leading-tight">
            Why Choose Southern Design Warehouse
          </h2>
          <div className="w-20 h-[1.5px] bg-[#a68966]" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mb-24">
          {features.map((item) => (
            <div key={item.id} className="flex group">
              <div className="w-[1px] bg-[#a68966] shrink-0 mr-6 h-full opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col">
                <span className="text-[#a68966] text-sm font-medium mb-3 tracking-widest">{item.id}</span>
                <h3 className="text-xl md:text-2xl font-medium mb-4 text-gray-100">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-base">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- NEW: Customer Trust Section --- */}
        <div className="bg-[#2A2621] py-16 px-8 md:px-12 text-center flex flex-col items-center">
          {/* Star Icon */}
          <Star className="text-[#a68966] w-10 h-10 mb-6" strokeWidth={1} />
          
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Customer Trust</h2>
          
          <p className="text-gray-300 max-w-2xl mb-10 leading-relaxed">
            Contractors, designers, and homeowners trust Southern Design Warehouse for their remodeling projects.
          </p>

          <div className="mb-12">
            <span className="text-[#a68966] text-xs uppercase tracking-[0.2em] font-bold">We focus on:</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {trustPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="bg-[#1C1C1C] py-4 px-6 border border-white/5 text-sm font-medium text-gray-200"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#a68966] text-xl md:text-2xl font-serif italic italic font-light tracking-wide mt-4">
            &quot;Our goal is to make your renovation process easier and more efficient.&quot;
          </p>
        </div>
        {/* --- End Customer Trust --- */}

      </div>
    </section>
  );
}