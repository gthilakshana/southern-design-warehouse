'use client';
import React, { useState, useEffect } from 'react';
import { createQuoteRequest } from '@/lib/actions';
import { HiCheckCircle, HiExclamationCircle, HiRefresh } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

// REFINED STYLES
const labelClasses =
  "block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-3";

const inputClasses =
  "w-full text-[15px] text-gray-700 placeholder-gray-400 bg-white border-b border-stone-200 px-0 py-3 focus:border-[#B33E2F] transition-all outline-none duration-300";

const selectClasses =
  "w-full text-[15px] text-gray-700 bg-white border-b border-stone-200 px-0 py-3 focus:border-[#B33E2F] transition-all outline-none appearance-none cursor-pointer";

const textAreaClasses =
  "w-full h-32 text-[15px] text-gray-700 placeholder-gray-400 bg-stone-50 border border-stone-100 p-4 focus:border-[#B33E2F] focus:bg-white transition-all outline-none resize-none duration-300";

export default function QuotationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Warehouse Materials',
    materials: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const data = new FormData(e.currentTarget);
    const result = await createQuoteRequest(data);

    if (result.success) {
      setStatus({ type: 'success', message: result.success });
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectType: 'Warehouse Materials',
        materials: '',
        message: ''
      });
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus({ type: 'error', message: result.error || 'Something went wrong.' });
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (status.type) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <section id="quotation-form" className="bg-[#FAF9F6] py-24 lg:py-32 px-6 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
          
          {/* LEFT SIDE: INFO & ACCENT (35%) */}
          <div className="lg:w-[35%] bg-[#1a1a1a] text-white p-10 md:p-16 flex flex-col justify-between relative">
            <div className="relative z-10">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Get Started</span>
              <h2 className="text-4xl md:text-5xl font-light mt-6 leading-tight">
                Request a Quote
              </h2>
              <p className="text-stone-400 mt-8 leading-relaxed font-light">
                Provide your project details and our specialists will prepare a comprehensive material estimate tailored to your professional needs.
              </p>
              
              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4 text-sm text-stone-300">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Quick Response (Within 24hrs)</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-stone-300">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Accurate Wholesale Pricing</span>
                </div>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none transform translate-y-1/4">
                <h3 className="text-[12rem] font-black select-none">QUOTE</h3>
            </div>
          </div>

          {/* RIGHT SIDE: THE FORM (65%) */}
          <div className="lg:w-[65%] p-10 md:p-16 lg:p-20 relative">
            
            {/* Success/Error Toast - Floating inside the card */}
            <AnimatePresence>
              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`absolute top-0 left-0 right-0 z-50 p-6 flex items-center gap-3 border-b text-sm font-bold tracking-wide
                    ${status.type === 'success' 
                      ? 'bg-green-50 border-green-100 text-green-700' 
                      : 'bg-red-50 border-red-100 text-red-700'}`}
                >
                  {status.type === 'success' ? <HiCheckCircle size={24} /> : <HiExclamationCircle size={24} />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* PRIMARY CONTACT DATA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="group">
                  <label className={labelClasses}>Full Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className={inputClasses}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={inputClasses}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className={labelClasses}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="professional@email.com"
                    className={inputClasses}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <label className={labelClasses}>Project Category</label>
                  <select
                    name="projectType"
                    className={selectClasses}
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option>Warehouse Materials</option>
                    <option>Logistics Support</option>
                    <option>Bulk Supply</option>
                    <option>Contract Services</option>
                  </select>
                  <div className="pointer-events-none absolute right-0 bottom-3">
                    <svg className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* MATERIAL DETAILS */}
              <div className="space-y-10">
                <div>
                  <label className={labelClasses}>Specific Materials Needed</label>
                  <input
                    name="materials"
                    type="text"
                    placeholder="e.g. Premium White Granite, Oak Hardwood Flooring"
                    className={inputClasses}
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Project Description</label>
                  <textarea
                    name="message"
                    placeholder="Describe your requirement in detail..."
                    className={textAreaClasses}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-red-600 hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] px-16 py-6 transition-all duration-500 shadow-xl disabled:opacity-50 flex items-center justify-center gap-4 group"
                >
                  {isSubmitting ? (
                    <>
                      <HiRefresh className="animate-spin" size={18} />
                      Processing
                    </>
                  ) : (
                    <>
                      Submit Proposal Request
                      <motion.span 
                        animate={{ x: [0, 5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}