import React from 'react'
import { getLegalPage } from '@/lib/actions'
import { HiShieldCheck, HiOutlineDocumentText } from 'react-icons/hi'
import Image from 'next/image'

export default async function PrivacyPage() {
  const page = await getLegalPage('privacy')

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="/images/20260225_092039.webp"
          alt="Privacy Policy Background"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.4]"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 space-y-4">
          <h1 className="text-4xl md:text-6xl uppercase font-bold text-white">
            Privacy Policy
          </h1>

          <p className="mt-4 text-gray-200 text-sm md:text-base max-w-xl mx-auto font-light">
            Protecting your data with secure and reliable warehouse management standards.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {("Security.Privacy.Compliance.Support").split(/[•·,.]/).map((s: string) => s.trim()).filter(Boolean).map((item: string) => (
              <span
                key={item}
                className="bg-white/5 border border-white/10 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Status Badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Secure & Compliant
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* MAIN CARD */}
          <div className="bg-white border border-gray-200 shadow-sm">

            <div className="p-8 md:p-12">

              {/* HEADER */}
              <div className="flex items-center gap-4 border-b pb-6 mb-8">
                <div className="w-14 h-14 flex items-center justify-center bg-red-600 text-white">
                  <HiShieldCheck size={28} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {page?.title || 'Privacy & Data Protection'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Warehouse System Security & Compliance
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div
                className="prose prose-slate max-w-none text-gray-700 leading-relaxed text-sm md:text-base ql-editor !p-0"
                dangerouslySetInnerHTML={{
                  __html:
                    page?.content ||
                    '<p>Content is being updated. Please check back later.</p>',
                }}
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

          {/* CONTACT SECTION */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a
                href="/contact"
                className="text-green-700 font-semibold hover:underline"
              >
                Contact our support team
              </a>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}