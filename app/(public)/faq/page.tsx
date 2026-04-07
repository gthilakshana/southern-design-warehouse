'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiMinus, HiQuestionMarkCircle } from 'react-icons/hi'
import { getFAQs, type FAQ } from '@/lib/actions'

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFaqs = async () => {
      const data = await getFAQs()
      setFaqs(data)
      setIsLoading(false)
    }
    fetchFaqs()
  }, [])

  const toggleAccordion = (id: string) => {
    const newOpenIds = new Set(openIds)
    newOpenIds.has(id) ? newOpenIds.delete(id) : newOpenIds.add(id)
    setOpenIds(newOpenIds)
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-20">
          <span className="text-red-600 text-xs font-bold uppercase tracking-[0.2em]">
            Warehouse Support
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
            Frequently Asked Questions
          </h1>

          <p className="text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our warehouse operations,
            materials handling, logistics, and contractor services.
          </p>

          <div className="w-20 h-[3px] bg-red-600 mx-auto mt-6 rounded-full" />
        </div>

        {/* FAQ LIST */}
        <div className="space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-white animate-pulse rounded-xl border border-gray-200" />
              ))}
            </div>
          ) : faqs.length > 0 ? (
            faqs.map((faq) => {
              const isOpen = openIds.has(faq.id)

              return (
                <motion.div
                  key={faq.id}
                  layout
                  className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden
                  ${isOpen
                      ? 'border-green-700 shadow-lg'
                      : 'border-gray-200 hover:border-red-600 hover:shadow-md'}
                `}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                  >
                    <div className="flex items-center gap-5">

                      {/* ICON */}
                      <div
                        className={`w-11 h-11 flex items-center justify-center rounded-lg transition-all
                        ${isOpen
                            ? 'bg-green-700 text-white shadow-md'
                            : 'bg-gray-100 text-gray-500'}
                      `}
                      >
                        <HiQuestionMarkCircle size={22} />
                      </div>

                      {/* QUESTION */}
                      <span className="text-lg md:text-xl font-semibold text-gray-800">
                        {faq.question}
                      </span>
                    </div>

                    {/* PLUS / MINUS */}
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all
                      ${isOpen
                          ? 'bg-green-700 text-white rotate-180'
                          : 'bg-gray-100 text-gray-500'}
                    `}
                    >
                      {isOpen ? <HiMinus /> : <HiPlus />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 md:px-20 pb-6">
                          <div className="h-px bg-gray-200 mb-4" />

                          <p className="text-gray-600 leading-relaxed text-[15px]">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-400 uppercase text-sm tracking-wider">
                No FAQs available right now
              </p>
            </div>
          )}
        </div>

        {/* CTA SECTION */}
        <div className="mt-24 rounded-2xl p-10 text-center bg-gradient-to-r from-[#3b2f2f] to-[#5a3e36] text-white shadow-xl">

          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Need More Help?
          </h3>

          <p className="text-gray-200 mb-8 max-w-xl mx-auto">
            Our warehouse support team is ready to assist you with logistics,
            materials, and contractor services anytime.
          </p>

          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-red-600 hover:bg-red-700 px-8 py-4 font-semibold rounded-lg transition transform hover:-translate-y-0.5 active:scale-95 shadow-md"
          >
            Contact Support
          </button>
        </div>

      </div>
    </div>
  )
}

export default FAQPage