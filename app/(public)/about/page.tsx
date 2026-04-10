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
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm">{content?.heroText ? "" : (content?.heroText)}</span>
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white mt-2">
            {content?.title}
          </h1>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
            {content?.description}
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

      {/* --- SECTION 1: THE STORY (NARRATIVE LAYOUT) --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-[#dc2626]/10 rounded-sm -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
            <div className="relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-gray-100">
              <Image
                src="images/20260225_093348.jpg"
                alt="Our Logistical Hub"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
            </div>

            {/* Floating Detail */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 shadow-xl border border-gray-100 hidden md:block animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1">Scale of Operations</div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">75,000+ <br />Square Feet</div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600">The Narrative</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight uppercase">
                Bridging Industrial <br />Scale with <span className="text-red-600">Design.</span>
              </h3>
            </div>

            <div
              className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium about-rich-text text-left"
              style={{ wordBreak: 'normal', overflowWrap: 'break-word', whiteSpace: 'normal', hyphens: 'none' }}
              dangerouslySetInnerHTML={{
                __html: sanitizeText(metadata.story) || `
                  <p>Southern Design Warehouse was founded on a simple realization: the gap between large-scale industrial supply and high-end design was too wide. We set out to bridge that gap by providing a facility that offers the <strong>massive inventory capacity</strong> of a commercial warehouse with the <strong>curated precision</strong> of a design studio.</p>
                  <p>Today, we operate as a central hub for the construction and renovation industry. Our facility houses thousands of unique items, ranging from foundational building materials to luxury finishing touches, ensuring our clients never have to compromise on vision or volume.</p>
                `
              }}
            />

            <div className="pt-6 border-t border-gray-100 flex items-center gap-12">
              <div>
                <p className="text-2xl font-bold text-slate-900">5k+</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-red-600">Unique SKUs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">15yrs</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-red-600">Experience</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-red-600">Professional Grade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: PILLARS (MISSION & VISION) --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">

          {/* MISSION PILLAR */}
          <div className="relative group overflow-hidden bg-slate-900 p-12 md:p-16 rounded-sm shadow-2xl animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#dc2626]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#dc2626]/20 transition-colors" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-red-600">Our Mission</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight uppercase">
                Simplifying the Supply Chain.
              </h3>
              <div className="w-16 h-1 bg-red-600" />
              <div
                className="text-gray-400 text-lg leading-relaxed font-medium about-rich-text text-left"
                style={{ wordBreak: 'normal', overflowWrap: 'break-word', whiteSpace: 'normal', hyphens: 'none' }}
                dangerouslySetInnerHTML={{ __html: sanitizeText(metadata.mission) || 'To empower the builders of tomorrow by providing a streamlined, efficient, and technologically advanced material sourcing experience today.' }}
              />
            </div>
          </div>

          {/* VISION PILLAR */}
          <div className="relative group overflow-hidden bg-white p-12 md:p-16 rounded-sm shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#dc2626]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-[#dc2626]/10 transition-colors" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-red-600">Our Vision</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight uppercase">
                Defining the Distribution Standard.
              </h3>
              <div className="w-16 h-1 bg-red-600" />
              <div
                className="text-gray-600 text-lg leading-relaxed font-medium about-rich-text text-left"
                style={{ wordBreak: 'normal', overflowWrap: 'break-word', whiteSpace: 'normal', hyphens: 'none' }}
                dangerouslySetInnerHTML={{ __html: sanitizeText(metadata.vision) || 'To be the most customer-centric and technologically forward material hub in the Southeast, where quality and scale coexist seamlessly.' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: CORE VALUES (REFINED GRID) --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-red-600 mb-4">Our Integrity</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-none uppercase">
                The Core <br />Principles.
              </h3>
            </div>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed border-l-2 border-red-600 pl-6">
              The foundational values that guide every shipment, consultation, and strategic partnership we build.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="group bg-white p-12 border border-gray-100 hover:border-red-600/30 hover:shadow-2xl transition-all duration-500 rounded-sm">
                <div className="w-16 h-16 bg-[#fafafa] flex items-center justify-center rounded-sm mb-8 group-hover:bg-red-600 transition-colors duration-500">
                  <v.icon className="text-slate-900 group-hover:text-white transition-colors duration-500" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter text-slate-900">{v.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-[15px]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: OPERATIONAL SCALE (STATS) --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#111111] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#dc2626]/10 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="flex justify-center text-red-600/40">
                <stat.icon size={40} strokeWidth={1} />
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-[serif]">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase font-black tracking-[0.3em] text-white">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 5: SPECIALIZED SERVICES --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">

            {/* Owner Support */}
            <div className="group border border-gray-100 p-12 md:p-16 hover:border-[#dc2626]/30 transition-all duration-500 bg-[#fafafa]">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Homeowner Design Support</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6 uppercase leading-tight">Expert <br />Consultations.</h3>
              <p className="text-slate-600 mb-10 text-lg leading-relaxed font-medium">
                Take the guesswork out of your renovation. We offer expert material matching,
                high-resolution samples, and a guided showroom experience to help you visualize
                your dream spaces with professional-grade supplies.
              </p>
              <Link href="/showroom" className="inline-flex items-center gap-4 text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] group/link">
                Learn More
                <div className="w-12 h-[1px] bg-slate-400 group-hover/link:w-20 group-hover/link:bg-[#dc2626] transition-all duration-300" />
              </Link>
            </div>

            {/* Contractor Support */}
            <div className="group border border-gray-100 p-12 md:p-16 hover:border-slate-900/30 transition-all duration-500 bg-white">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Contractor Logistical Partner</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6 uppercase leading-tight">Scale Your <br />Operations.</h3>
              <p className="text-slate-600 mb-10 text-lg leading-relaxed font-medium">
                Operate with a partner that acts as an extension of your warehouse.
                Get exclusive volume pricing, prioritized job-site logistics, and
                dedicated account specialist support for large-scale development projects.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-4 text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] group/link">
                Partner With Us
                <div className="w-12 h-[1px] bg-slate-400 group-hover/link:w-20 group-hover/link:bg-[#dc2626] transition-all duration-300" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION 6: THE CAPSTONE CTA --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#111111] text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="images/contractors2.jpg"
            alt="Luxury Material"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none">
            Build Your <br /><span className="text-white">Future Standard.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Whether you are building a boutique residence or a massive commercial complex,
            our warehouse infrastructure and material expertise are ready to support your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link
              href="/contact"
              className="px-12 py-5 bg-red-600 text-white font-black hover:bg-white hover:text-slate-900 transition-all uppercase tracking-[0.2em] text-[11px] active:scale-95 shadow-xl"
            >
              Request a Project Quote
            </Link>
            <Link
              href="/showroom"
              className="px-12 py-5 bg-transparent border border-white/30 text-white font-black hover:bg-white hover:text-slate-900 transition-all uppercase tracking-[0.2em] text-[11px] active:scale-95"
            >
              Schedule Showroom Tour
            </Link>
          </div>
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