import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbMessageDots, TbArmchair } from 'react-icons/tb';
import { getPageContent } from '@/lib/actions';
import ResponsiveHero from '@/components/ui/ResponsiveHero';

export default async function CabinetsPage() {
  const content = await getPageContent('cabinets');

  const dynamicMaterials = content?.heroText
    ? content.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : [
      "Kitchen Cabinets",
      "Storage Solutions",
      "Custom Vanities",
      "Hardware & Handles",
      "Cabinet Finishes"
    ];

  const contentImage = content?.contentUrl || "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1200&q=80";

  return (
    <div className="min-h-screen bg-[#F4F1EE] font-[arial]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white px-6">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl="https://images.unsplash.com/photo-1556911220-e152081230f8?w=1920&q=80"
          alt="Modern Cabinet Design"
          brightness="brightness-[0.25]"
        />

        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter text-white">
            {content?.title || "Custom Cabinetry Solutions"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {content?.description || "High-quality cabinetry defines the character and functionality of your home. We provide versatile solutions for kitchens, bathrooms, and living spaces."}
          </p>
        </div>
      </section>

      {/* --- DESIGN CONSULTATION SECTION - REDESIGNED PREMIUM LAYOUT --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F9F8F6] -z-0 hidden lg:block" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* LEFT SIDE: Text and Actions (Col-span 5) */}
            <div className="lg:col-span-5 space-y-12 order-2 lg:order-1">
              <div className="space-y-8">
                <div className="inline-block px-4 py-1 bg-[#a68966]/10 border-l-2 border-[#a68966]">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a68966]">Design Excellence</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">
                  Custom Cabinetry <br />
                  <span className="text-[#a68966]">Design & Selection</span>
                </h2>
                <div className="w-16 h-1.5 bg-[#b33e2f]" />
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light font-sans">
                  Our design experts help you navigate through various door styles, wood types, and finishes to find the perfect fit for your lifestyle. We focus on maximizing storage efficiency without compromising on elegance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="flex-1">
                  <button className="w-full bg-[#1a1a1a] hover:bg-[#b33e2f] text-white py-6 px-8 font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group">
                    <TbMessageDots className="text-xl group-hover:rotate-12 transition-transform" />
                    Connect With Designer
                  </button>
                </Link>

                <Link href="/showroom" className="flex-1">
                  <button className="w-full border-2 border-gray-200 text-gray-900 py-6 px-8 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                    Explore Showroom
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE: Overlapping Materials & Image (Col-span 7) */}
            <div className="lg:col-span-7 relative order-1 lg:order-2 mb-12 lg:mb-0">
              {/* Main Large Image */}
              <div className="relative h-[450px] md:h-[550px] w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden rounded-sm group">
                <Image
                  src={contentImage}
                  alt="Cabinetry Materials"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Overlapping Options Box */}
              <div className="absolute -bottom-10 lg:-bottom-12 -left-4 lg:-left-20 bg-white p-8 lg:p-12 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] border-t-4 border-[#a68966] max-w-[90%] lg:max-w-[480px] animate-in slide-in-from-left-10 duration-1000">
                <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">
                  Premium <span className="text-[#a68966]">Configurations</span>
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {dynamicMaterials.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between group cursor-default"
                    >
                      <span className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.2em] group-hover:text-black transition-colors">{item}</span>
                      <div className="flex-1 border-b border-dotted border-gray-200 mx-4 h-2 opacity-30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a68966] group-hover:scale-150 transition-transform" />
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                  * Custom engineering available for all cabinetry systems.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURED STYLES SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Cabinet Styles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Explore our diverse range of cabinetry styles from traditional to ultra-modern
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: 'Shaker Design',
                description: 'Timeless and versatile cabinetry with clean lines that complement both traditional and modern homes',
                features: 'Flat center panels • Minimalist hardware • Clean edge details',
                image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&q=80'
              },
              {
                title: 'Contemporary Flat',
                description: 'Sleek, handle-less or minimal hardware designs for a seamless, architectural look',
                features: 'High-gloss finishes • Push-to-open technology • Bold color options',
                image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80'
              },
              {
                title: 'Raised Panel',
                description: 'Elegant and sophisticated cabinetry with intricate detailing for a classic aesthetic',
                features: 'Detailed profiles • Antique finishes • Traditional crown molding',
                image: 'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=800&q=80'
              },

            ].map((style, index) => (
              <div key={index} className="bg-[#F4F1EE] border border-gray-200 hover:border-[#a68966] transition-all overflow-hidden group flex flex-col h-full shadow-sm hover:shadow-md">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 uppercase mb-3 tracking-tight">{style.title}</h3>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">{style.description}</p>
                  <div className="mt-auto pt-6 border-t border-gray-300">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a68966] mb-3">Core Features:</p>
                    <p className="text-gray-800 text-[13px] font-bold leading-relaxed">{style.features}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SELECTION TIPS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-[#F4F1EE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Cabinet Selection Tips</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Important considerations before finalizing your cabinetry project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                number: '01',
                title: 'Evaluate Your Storage Needs',
                description: 'Take inventory of what you need to store. Specialized pull-outs, dividers, and deep drawers can significantly improve organization.'
              },
              {
                number: '02',
                title: 'Consider Cabinet Construction',
                description: 'Choose between framed and frameless construction. Frameless offers more interior space, while framed provides a traditional structural look.'
              },
              {
                number: '03',
                title: 'Choose the Right Finish',
                description: 'Paint, stain, or laminate? Consider durability and maintenance requirements along with your desired color palette.'
              },
              {
                number: '04',
                title: 'Don\'t Overlook Hardware',
                description: 'Knobs and pulls are the "jewelry" of your cabinets. Select hardware that complements both the door style and the overall room design.'
              },
              {
                number: '05',
                title: 'Plan for Lighting',
                description: 'Integrated under-cabinet lighting or interior glass cabinet lighting can enhance both function and ambiance.'
              },
              {
                number: '06',
                title: 'Measure Carefully',
                description: 'Accurate measurements are critical. Factor in appliance dimensions, plumbing locations, and workspace clearance.'
              }
            ].map((tip, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#b33e2f] text-white flex items-center justify-center font-black text-xl">
                    {tip.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 uppercase mb-3">{tip.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CRAFTSMANSHIP & DETAIL SECTION - NEW CONTENT --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left: Detail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Dovetail Joinery', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80' },
                { label: 'Soft-Close Systems', img: 'https://images.unsplash.com/photo-1556912173-3bb81390e60e?w=800&q=80' },
                { label: 'Solid Core Build', img: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&q=80' },
                { label: 'Precision Finishes', img: 'https://images.unsplash.com/photo-1600585154340-be6191da95b4?w=800&q=80' }
              ].map((item, index) => (
                <div key={index} className="relative h-48 md:h-64 group overflow-hidden first:rounded-tl-[60px] last:rounded-br-[60px]">
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Craftsmanship Text */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">
                  Engineered for <br />
                  <span className="text-[#a68966]">Lifelong Performance</span>
                </h2>
                <div className="w-20 h-1.5 bg-[#b33e2f]" />
                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  Our cabinetry isn&apos;t just about appearance; it&apos;s about structural integrity. Every unit is engineered with precision, using materials that resist warping, moisture, and daily wear. From the depth of the finish to the smoothness of the glides, we define quality in every detail.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  { title: 'Furniture-Grade Materials', desc: 'No particle board. We use high-density plywood and solid wood frames.' },
                  { title: 'Integrated Soft-Close', desc: 'Standard on all drawers and doors for a silent, luxury experience.' },
                  { title: 'Custom Sizing', desc: 'We build to your exact dimensions, maximizing every inch of your space.' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6 p-6 border border-gray-100 hover:border-[#a68966] transition-all bg-[#F9F8F6]/50">
                    <div className="text-[#a68966] text-xl font-bold">0{i + 1}</div>
                    <div>
                      <h4 className="font-black uppercase text-[11px] tracking-widest text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PORTFOLIO HIGHLIGHT SECTION - NEW CONTENT --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white uppercase mb-6">Project <span className="text-[#a68966]">Spotlight</span></h2>
              <p className="text-gray-400 max-w-xl text-lg font-light">Explore how our custom cabinetry transforms ordinary rooms into architectural statements.</p>
            </div>
            <Link href="/gallery">
              <button className="border border-white/20 hover:border-[#a68966] hover:text-[#a68966] px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] transition-all">
                View Full Gallery
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            {[
              {
                title: 'The Heritage Kitchen',
                location: 'Buckhead, GA',
                desc: 'Full-scale custom cabinetry integration using hand-selected European Oak and antique brass accents.',
                img: 'https://images.unsplash.com/photo-1556911220-e152081230f8?w=1200&q=80'
              },
              {
                title: 'Modern Minimalist Villa',
                location: 'Milton, GA',
                desc: 'Matte black handle-less floor-to-ceiling storage systems for a seamless architectural aesthetic.',
                img: 'https://images.unsplash.com/photo-1600585154340-be6191da95b4?w=1200&q=80'
              }
            ].map((project, index) => (
              <div key={index} className="group relative overflow-hidden bg-black/20">
                <div className="relative h-[400px] md:h-[500px]">
                  <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                <div className="absolute inset-0 p-12 flex flex-col justify-end text-left items-start md:items-start text-center md:text-left">
                  <div className="inline-block px-3 py-1 bg-[#a68966] mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{project.location}</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">{project.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-md hidden md:block">
                    {project.desc}
                  </p>
                  <div className="w-0 h-1 bg-[#a68966] mt-6 group-hover:w-full transition-all duration-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#2d4a3e]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6">Visit Our Design Center</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            See our cabinetry collections in person and feel the quality of our materials. Our designers are ready to help you plan your next major renovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gallery">
              <button className="bg-[#a68966] text-gray-900 hover:bg-[#a68966] hover:text-white py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all active:scale-95">
                Gallery View
              </button>
            </Link>

            <Link href="/inventory">
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#2d4a3e] py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all active:scale-95">
                Inventory Search
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
