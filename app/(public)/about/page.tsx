"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  HiOutlineCheck,
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineGlobe
} from 'react-icons/hi'
import { getPageContent, getSiteSettings, type PageContent } from '@/lib/actions'

// Helper to clean up any &nbsp; or hidden characters from rich text editors
const sanitizeText = (html: string) => {
  if (!html) return html;
  return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
};

const AboutPage = () => {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPageContent('about')
        setContent(data)
      } catch (err) {
        console.error("Failed to fetch about content:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { label: 'Inventory Items', value: '5k+', icon: HiOutlineViewGrid },
    { label: 'Industry Partners', value: '200+', icon: HiOutlineUsers },
    { label: 'Delivery Coverage', value: '100mi', icon: HiOutlineTruck },
    { label: 'On-Time Delivery', value: '99%', icon: HiOutlineCheck },
  ]

  const values = [
    {
      title: 'Reliability',
      desc: 'We understand that timelines matter. Our systems are built to ensure your materials arrive when promised.',
      icon: HiOutlineShieldCheck
    },
    {
      title: 'Innovation',
      desc: 'Utilizing modern inventory tracking to provide real-time updates and seamless ordering for our clients.',
      icon: HiOutlineLightningBolt
    },
    {
      title: 'Community',
      desc: 'Proudly serving the Southern region, supporting local contractors and building stronger neighborhoods.',
      icon: HiOutlineGlobe
    }
  ]

  const metadata = (content?.metadata as any) || {}

  const designMaterials = content?.heroText
    ? content.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : ["Global Sourcing", "Massive Inventory", "Expert Logistics", "Premium Materials"];

  return (
    <div className="min-h-screen bg-gray-100 font-[arial]" style={{ fontSize: content?.fontSize || 'inherit' }}>

      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center">
        {content?.heroUrl ? (
          <Image
            src={content.heroUrl}
            alt="About Hero"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.4]"
            priority
          />
        ) : (
          <Image
            src="/images/contractors.jpg"
            alt="Warehouse"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.4]"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm">{content?.heroText ? "" : (content?.heroText || 'Established Excellence')}</span>
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white mt-2">
            {content?.title || 'About Our Warehouse'}
          </h1>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
            {content?.description || 'Leading the industry with precision logistics, massive inventory scales, and a commitment to quality that builds the future.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {designMaterials.map((item: string) => (
              <span
                key={item}
                className="bg-white/5 border border-white/10 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT CONTENT - STORY */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-8 md:p-16 shadow-sm overflow-hidden text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 uppercase tracking-tight">
            The Southern Design Warehouse Story
          </h2>

          <div
            className="prose max-w-none prose-gray text-gray-600 leading-relaxed font-medium about-rich-text text-left"
            dangerouslySetInnerHTML={{
              __html: sanitizeText(metadata.story) || `
                <p class="mb-4">Southern Design Warehouse was founded on a simple realization: the gap between large-scale industrial supply and high-end design was too wide. We set out to bridge that gap by providing a facility that offers the <strong>massive inventory capacity</strong> of a commercial warehouse with the <strong>curated precision</strong> of a design studio.</p>
                <p class="mb-4">Today, we operate as a central hub for the construction and renovation industry. Our facility houses over 5,000 unique SKUs, ranging from foundational building materials to high-end finishing touches.</p>
              `
            }}
          />
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-20 px-6 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

          {/* MISSION */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">
              Our Mission
            </h2>
            <div className="w-20 h-1.5 bg-red-600" />
            <div 
              className="text-gray-600 text-lg leading-relaxed font-medium about-rich-text text-left"
              dangerouslySetInnerHTML={{ __html: sanitizeText(metadata.mission) || 'To empower the builders of tomorrow by simplifying the supply chain today.' }}
            />
          </div>

          {/* VISION */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">
              Our Vision
            </h2>
            <div className="w-20 h-1.5 bg-green-700" />
            <div 
              className="text-gray-600 text-lg leading-relaxed font-medium about-rich-text text-left"
              dangerouslySetInnerHTML={{ __html: sanitizeText(metadata.vision) || 'To be the most technologically advanced and customer-centric warehouse in the Southern region.' }}
            />
          </div>

        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">Our Core Values</h2>
            <p className="text-gray-500 mt-2 font-bold uppercase text-[10px] tracking-widest italic">The principles that guide every shipment and every interaction.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-10 border border-gray-200 hover:border-red-600 transition-colors group">
                <v.icon className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 border border-gray-200 shadow-sm"
            >
              <div className="flex justify-center mb-4 text-red-600">
                <stat.icon size={32} />
              </div>
              <div className="text-3xl font-extrabold text-gray-800">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-10 hover:border-red-600 transition-all">
              <HiOutlineUsers className="text-red-600 mb-4" size={36} />
              <h3 className="font-bold text-2xl mb-4 text-gray-800 uppercase tracking-tighter">For Homeowners</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed font-medium">
                Take the guesswork out of your renovation. We offer expert consultations,
                material samples, and a guided showroom to help you visualize your dream home
                with professional-grade supplies.
              </p>
              <Link href="/contact" className="inline-flex items-center text-red-600 font-black text-[11px] uppercase tracking-widest hover:underline">
                Visit Our Design Showroom <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="border border-gray-200 p-10 bg-gray-50 hover:border-red-600 transition-all">
              <HiOutlineTruck className="text-red-600 mb-4" size={36} />
              <h3 className="font-bold text-2xl mb-4 text-gray-800 uppercase tracking-tighter">For Contractors</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed font-medium">
                Scale your business with a warehouse that acts as your partner.
                Get exclusive volume pricing, prioritized job-site delivery,
                and specialized account management for large-scale projects.
              </p>
              <Link href="/contact" className="inline-flex items-center text-red-600 font-black text-[11px] uppercase tracking-widest hover:underline">
                Visit Our Design Showroom <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#182330] text-center ">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tighter ">
          Ready to Start Your Next Project?
        </h2>
        <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg font-medium">
          Whether you are building a single home or a commercial complex, our warehouse has the inventory and the expertise to help you succeed.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="px-10 py-5 bg-red-600 text-white font-black hover:bg-black transition-all uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95"
          >
            Request a Quote
          </Link>
          <Link
            href="/inventory"
            className="px-10 py-5 bg-transparent border-2 border-white text-white font-black hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] text-[11px] active:scale-95"
          >
            Browse Inventory
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .about-rich-text p { 
          margin-bottom: 1.5rem; 
          overflow-wrap: break-word !important; 
          word-break: normal !important; 
          hyphens: none !important;
          text-align: left !important; 
          word-spacing: normal !important;
        }
        .about-rich-text strong { color: #1f2937; font-weight: 800; }
        .about-rich-text img { max-width: 100%; height: auto; border-radius: 2px; }
        .about-rich-text iframe { max-width: 100%; border: 0; }
        .about-rich-text h1, .about-rich-text h2, .about-rich-text h3 {
          font-weight: 800;
          text-transform: uppercase;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  )
}

export default AboutPage