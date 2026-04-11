import React from 'react'
import { getLegalPage } from '@/lib/actions'
import { HiOutlineScale, HiOutlineDocumentText } from 'react-icons/hi'
import Image from 'next/image'

export default async function TermsPage() {
  const page = await getLegalPage('terms')

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="/images/20260225_092039.webp"
          alt="Terms Background"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.4]"
          priority
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 space-y-4">
          <h1 className="text-4xl md:text-6xl uppercase font-bold text-white">
            Terms of Service
          </h1>

          <p className="mt-4 text-gray-200 text-sm md:text-base max-w-xl mx-auto font-light">
            Legal agreements and operational guidelines for using our warehouse system.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {("Agreement.Guidelines.Policy.Support").split(/[•·,.]/).map((s: string) => s.trim()).filter(Boolean).map((item: string) => (
              <span
                key={item}
                className="bg-white/5 border border-white/10 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </div>

          {/* STATUS BADGE */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Legal Agreement
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* MAIN CARD */}
          <div className="bg-white border border-gray-200 shadow-sm">

            <div className="p-8 md:p-12">

              {/* HEADER */}
              <div className="flex items-center gap-4 border-b pb-6 mb-8">
                <div className="w-14 h-14 flex items-center justify-center bg-red-600 text-white">
                  <HiOutlineScale size={28} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {page?.title || 'Terms & Conditions'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Warehouse Service Agreement & Usage Policy
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div 
                className="prose prose-slate max-w-none text-gray-700 leading-relaxed text-sm md:text-base ql-editor !p-0"
                dangerouslySetInnerHTML={{ __html: page?.content || '<p>Terms are currently being updated. Please check again later.</p>' }}
              />

              {/* FOOTER */}
              <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">

                {/* VERSION */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <HiOutlineDocumentText className="text-red-600" size={18} />
                  <span>Version 1.0.0</span>
                </div>

                {/* DATE */}
                <p className="text-xs text-gray-500">
                  Last Updated:{' '}
                  {page?.updatedAt
                    ? new Date(page.updatedAt).toLocaleDateString()
                    : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* DOWNLOAD BUTTON */}
          <div className="mt-10 text-center">
            <button className="px-6 py-3 bg-green-700 text-white text-sm font-semibold hover:opacity-90 transition">
              Download Terms (PDF)
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}