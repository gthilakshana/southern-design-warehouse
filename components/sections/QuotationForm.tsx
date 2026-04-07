'use client';

import React, { useState } from 'react';
import { createQuoteRequest } from '@/lib/actions';
import { HiCheckCircle, HiExclamationCircle, HiRefresh } from 'react-icons/hi';

// LABEL
const labelClasses =
  "block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2";

// INPUT
const inputClasses =
  "w-full text-[15px] text-gray-700 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 pb-3 focus:ring-0 focus:border-red-600 transition-all outline-none";

// TEXTAREA
const textAreaClasses =
  "w-full h-40 text-[15px] text-gray-700 placeholder-gray-400 bg-gray-100 border border-gray-300 p-4 focus:ring-0 focus:border-red-600 transition-all outline-none resize-none rounded-lg";

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

  return (
    <section className="bg-gray-100 py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* CONTAINER */}
        <div className="bg-white max-w-5xl mx-auto shadow-xl rounded-2xl overflow-hidden border border-gray-200">

          {/* TOP BAR (BROWN INDUSTRIAL ACCENT) */}
          <div className="h-2 w-full bg-[#4b2e2e]" />

          {/* HEADER */}
          <div className="text-center py-16 px-8 md:px-16">
            <span className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase">
              Warehouse Quotation
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 uppercase">
              Request a Quote
            </h2>

            <p className="text-gray-500 mt-5 max-w-xl mx-auto leading-relaxed">
              Get accurate pricing for warehouse materials, logistics, and contractor services.
              Our team will respond quickly with the best options.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="pb-20 px-8 md:px-16 lg:px-20 space-y-12">

            {/* NAME + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className={labelClasses}>Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Phone</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  className={inputClasses}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* EMAIL + TYPE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className={labelClasses}>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  className={inputClasses}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <label className={labelClasses}>Project Type</label>
                <select
                  name="projectType"
                  className={inputClasses}
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                >
                  <option>Warehouse Materials</option>
                  <option>Logistics Support</option>
                  <option>Bulk Supply</option>
                  <option>Contract Services</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pt-5">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* MATERIALS */}
            <div>
              <label className={labelClasses}>Materials</label>
              <input
                name="materials"
                type="text"
                placeholder="e.g., Steel, Cement, Storage Units"
                className={inputClasses}
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className={labelClasses}>Message</label>
              <textarea
                name="message"
                placeholder="Describe your requirement..."
                className={textAreaClasses}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* STATUS */}
            {status.type && (
              <div
                className={`p-5 rounded-xl flex items-center gap-3 border text-sm font-medium
                ${status.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-600'}
              `}
              >
                {status.type === 'success'
                  ? <HiCheckCircle size={22} />
                  : <HiExclamationCircle size={22} />}
                {status.message}
              </div>
            )}

            {/* BUTTON */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-14 py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3 mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <HiRefresh className="animate-spin" size={20} />
                    Sending Request...
                  </>
                ) : (
                  'Request a Quote'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}