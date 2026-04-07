"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
// Using HiOutlineCheckCircle for the thin, professional double-circle look
import { HiOutlineCheckCircle } from 'react-icons/hi' 
import { GiHammerBreak } from 'react-icons/gi'

export const InfoSections = () => {
  const contractorBenefits = [
    'Bulk material availability',
    'Contractor pricing',
    'Fast pickup',
    'Reliable inventory',
    'Knowledgeable material specialists'
  ]

  return (
    <div className="bg-[#e9e4dc]"> 
      {/* Contractors Section */}
      <section id="contractors" className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              {/* Icon Box */}
              <div className="w-16 h-16 bg-white shadow-sm flex items-center justify-center mb-10 border border-gray-100">
                <GiHammerBreak className="w-8 h-8 text-[#3a5a40]" />
              </div>

              <h2 className="text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-8 tracking-tight">
                Built for Contractors
              </h2>

              <div className="space-y-6 text-[#555555] mb-10 max-w-lg leading-relaxed">
                <p className="text-[17px]">
                  Contractors rely on Southern Design Warehouse for reliable materials and consistent supply.
                </p>
                <p className="text-[17px]">
                  We support builders, remodelers, and construction professionals with:
                </p>
              </div>

              {/* Benefits List - Updated with the specific Icon */}
              <ul className="space-y-6 mb-12">
                {contractorBenefits.map((item) => (
                  <li key={item} className="flex items-center space-x-4 text-[#1a1a1a]">
                    {/* This icon matches the double-ring/outline style from your image */}
                    <HiOutlineCheckCircle className="w-7 h-7 text-[#34533d] stroke-[1.5px]" />
                    <span className="text-[18px] font-medium tracking-tight">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Quote Box */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-10 border-l-4 border-[#c5a358] shadow-sm mb-10 max-w-xl"
              >
                <p className="text-[#666666] italic leading-relaxed text-[16px]">
                  "Whether you are managing a full renovation or a new construction project, 
                  our warehouse is designed to support your workflow."
                </p>
              </motion.div>

              {/* Dark Green Button */}
              <button className="w-fit bg-[#34533d] hover:bg-[#2a4231] text-white px-10 py-5 font-bold text-[13px] uppercase tracking-widest transition-colors">
                Contractor Quote Request
              </button>
            </motion.div>

            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[600px] lg:h-[750px] overflow-hidden rounded-xl shadow-lg border border-white/10"
            >
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop" 
                alt="Materials showcase"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}