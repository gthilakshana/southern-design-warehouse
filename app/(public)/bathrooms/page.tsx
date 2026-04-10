import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbMessageDots, TbArmchair } from 'react-icons/tb';
import { getPageContent } from '@/lib/actions';
import ResponsiveHero from '@/components/ui/ResponsiveHero';

export default async function BathroomsPage() {
  // 7. This is the line that was missing!
  const content = await getPageContent('bathrooms');
  
  const dynamicMaterials = content?.heroText
    ? content.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : [
         "Tiles",
         "Bathroom vanities",
         "Shower doors",
         "Flooring",
         "Wall materials"
       ];

 
  const contentImage = content?.contentUrl || "/images/20260225_094204.jpg";

  return (
      <div className="min-h-screen bg-[#F4F1EE]  font-[arial]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white px-6">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl=""
          alt="Modern Bathroom Design"
          brightness="brightness-[0.25]"
          priority={true}
        />

        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white ">
            {content?.title || "Bathroom Design Planning"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {content?.description || "Bathrooms combine functionality with relaxation and style. Southern Design Warehouse helps homeowners design bathrooms that feel modern, comfortable, and visually appealing."}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {dynamicMaterials.map((item: string) => (
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

     {/* --- DESIGN CONSULTATION SECTION --- */}
<section className="relative py-32 px-6 md:px-12 lg:px-24 bg-[#fcfcfc] overflow-hidden">
  {/* Subtle Background Text for Texture */}
  <div className="absolute -top-10 -left-10 text-[180px] font-black text-gray-50/50 select-none pointer-events-none uppercase tracking-tighter">
    Design
  </div>

  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
    
    {/* LEFT SIDE: Visual Content (Moved to prioritize visual impact) */}
    <div className="lg:col-span-5 order-2 lg:order-1 relative">
      <div className="relative aspect-[3/4] overflow-hidden shadow-2xl">
        <Image 
          src="/bathrooms/water.jpg" 
          alt="Bathroom Design Planning"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover transition-all duration-[1.5s]"
        />
        {/* Floating Technical Label */}
        <div className="absolute bottom-0 right-0 bg-white p-6 max-w-[180px]">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#dc2626] mb-2 font-bold">Focus Area</p>
          <p className="text-xs font-bold text-gray-900 leading-tight uppercase">Waterproof Integrity & Aesthetic Harmony</p>
        </div>
      </div>
      {/* Decorative Frame Element */}
      <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-[#dc2626]/30" />
    </div>

    {/* RIGHT SIDE: Text and Actions (7 Columns) */}
    <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-12">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-[1px] bg-[#dc2626]" />
          <span className="text-[#dc2626] font-bold tracking-[0.4em] text-[10px] uppercase">Consultancy Services</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-light text-gray-900 leading-[0.9] uppercase tracking-tighter mb-8">
          Professional <br /> 
          <span className="font-serif italic lowercase tracking-normal text-gray-400">Consultation</span>
        </h2>
        
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-light max-w-xl">
          Our materials specialists guide you through the selection process, ensuring your sanctuary functions with <span className="text-gray-900 font-medium italic">technical precision</span> and timeless elegance.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 pt-6">
        {/* SCHEDULE CONSULTATION LINK */}
        <Link href="/contact" className="flex-1">
          <button className="w-full group relative bg-black text-white py-6 px-8 font-bold uppercase tracking-[0.2em] text-[11px] transition-all overflow-hidden flex items-center justify-center gap-3 active:scale-95">
            <span className="relative z-10 flex items-center gap-3 group-hover:text-black transition-colors duration-300">
              <TbMessageDots className="text-xl" />
              Schedule Consultation
            </span>
            <div className="absolute inset-0 bg-[#dc2626] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </Link>

        {/* VISIT SHOWROOM LINK */}
        <Link href="/showroom" className="flex-1">
          <button className="w-full border border-gray-200 text-gray-900 py-6 px-8 font-bold uppercase tracking-[0.2em] text-[11px] hover:border-[#dc2626] hover:bg-[#fcfcfc] transition-all flex items-center justify-center gap-3 active:scale-95">
            <TbArmchair className="text-xl text-[#dc2626]" />
            Visit Showroom
          </button>
        </Link>
      </div>

      {/* Trust Quote / Footnote */}
      <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium border-t border-gray-100 pt-8">
        Guiding homeowners since 2026 • Material Excellence Guaranteed
      </p>
    </div>

  </div>
</section>

      {/* --- FEATURED BATHROOM STYLES SECTION --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
  <div className="max-w-7xl mx-auto">
    {/* Header with offset alignment */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
      <div className="border-l-4 border-[#dc2626] pl-8">
        <span className="text-gray-400 font-mono text-xs tracking-[0.4em] uppercase mb-2 block">Curated Aesthetics</span>
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 uppercase leading-none tracking-tighter">
          Bathroom <br /> <span className="font-serif italic lowercase font-light text-[#dc2626]">Styles</span>
        </h2>
      </div>
      <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
        From minimalist technicality to restorative sanctuary environments. Explore our signature design directions.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {[
        { 
          title: 'Modern Minimalist', 
          num: '01',
          description: 'Clean lines and sleek fixtures for a contemporary architectural aesthetic.',
          features: ['Floating vanities', 'Frameless glass', 'Polished concrete'],
          image: '/bathrooms/vanities.jpg'
        },
        { 
          title: 'Classic Elegance', 
          num: '02',
          description: 'Timeless design elements with quality materials that define heritage luxury.',
          features: ['Double vanities', 'Marble finishes', 'Traditional fixtures'],
          image: '/bathrooms/marble.jpg'
        },
        { 
          title: 'Spa Retreat', 
          num: '03',
          description: 'Restorative materials and soothing elements to create a private sanctuary.',
          features: ['Soaking tubs', 'Natural stone', 'Ambient lighting'],
          image: '/bathrooms/natural.jpg'
        }
      ].map((style, index) => (
        <div key={index} className="group relative flex flex-col bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl">
          {/* Top Numbering */}
          <div className="absolute -top-6 -left-4 z-20">
            <span className="text-7xl font-black text-gray-100 group-hover:text-[#dc2626]/20 transition-colors duration-500 italic">
              {style.num}
            </span>
          </div>

          {/* Image Container */}
          <div className="relative h-80 overflow-hidden">
            <Image
              src={style.image}
              alt={style.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content Area */}
          <div className="p-10 relative">
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#dc2626]" />
              {style.title}
            </h3>
            
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-light">
              {style.description}
            </p>

            <div className="space-y-3 pt-8 border-t border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626]">Technical Specs:</p>
              <div className="flex flex-wrap gap-2">
                {style.features.map((feature, i) => (
                  <span key={i} className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter border border-gray-100 px-2 py-1">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Subtle Hover bar at bottom */}
          <div className="h-1 w-0 bg-[#dc2626] transition-all duration-500 group-hover:w-full" />
        </div>
      ))}
    </div>
  </div>
</section>

     {/* --- DESIGN TIPS SECTION --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-white border-t border-gray-100">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col lg:flex-row justify-between items-baseline mb-24 gap-6">
      <div className="relative">
        <span className="text-[#dc2626] font-mono text-[10px] tracking-[0.5em] uppercase mb-4 block">Expert Methodology</span>
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 uppercase leading-none tracking-tighter">
          Bathroom <br /> <span className="text-gray-300 font-light">Design Tips</span>
        </h2>
      </div>
      <p className="text-gray-400 max-w-sm text-sm font-medium uppercase tracking-widest leading-relaxed">
        Guidance for creating high-performance, restorative environments through technical precision.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-16">
      {[
        {
          number: '01',
          title: 'Strategic Layout',
          description: 'Analyze traffic flow and fixture placement. Proper planning ensures the room feels spacious regardless of square footage.'
        },
        {
          number: '02',
          title: 'Resilient Flooring',
          description: 'Select waterproof, slip-resistant porcelain or stone. The foundation must withstand thermal changes and constant moisture.'
        },
        {
          number: '03',
          title: 'Luminance Layers',
          description: 'Integrate task lighting at the vanity and ambient glows for the shower. Lighting defines the mood of the sanctuary.'
        },
        {
          number: '04',
          title: 'Precision Fixtures',
          description: 'Invest in water-efficient components that balance environmental responsibility with industrial durability.'
        },
        {
          number: '05',
          title: 'Moisture Barriers',
          description: 'Utilize professional-grade sealants and water-resistant drywall to maintain structural integrity against mold.'
        },
        {
          number: '06',
          title: 'Cohesive Metals',
          description: 'Standardize finishes across hardware and fixtures to create a unified, curated aesthetic throughout the space.'
        }
      ].map((tip, index) => (
        <div key={index} className="group relative pt-10 border-t border-gray-100 flex flex-col">
          {/* Vertical Accent Line */}
          <div className="absolute top-0 left-0 w-1 h-0 bg-[#dc2626] transition-all duration-500 group-hover:h-full" />
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-5xl font-black text-gray-50 group-hover:text-gray-100 transition-colors font-mono tracking-tighter">
              {tip.number}
            </span>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#dc2626] transition-colors">
              <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-4 transition-transform group-hover:translate-x-2">
            {tip.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed font-light">
            {tip.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* --- PRODUCT CATEGORIES SECTION --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-[#fcfcfc]">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
      <div className="max-w-xl">
        <span className="text-[#dc2626] font-mono text-[10px] tracking-[0.5em] uppercase mb-4 block">Product Inventory</span>
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 uppercase leading-none tracking-tighter">
          Bathroom <br /> <span className="font-serif italic lowercase font-light text-gray-400 tracking-normal">Collection</span>
        </h2>
      </div>
      <p className="text-gray-500 max-w-xs text-sm font-medium leading-relaxed border-l border-gray-200 pl-6">
        A complete selection of high-performance materials for every technical bathroom element.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Shower Solutions', count: '250+ Products', image: '/bathrooms/shower.jpg' },
        { label: 'Bathtubs', count: '180+ Products', image: '/bathrooms/bathtubs.jpg' },
        { label: 'Vanities & Sinks', count: '320+ Products', image: '/bathrooms/natural.jpg' },
        { label: 'Wall & Floor Tiles', count: '450+ Products', image: '/bathrooms/tile.jpg' },
        { label: 'Mirrors & Lighting', count: '200+ Products', image: '/bathrooms/mirror.jpg' },
        { label: 'Plumbing Fixtures', count: '290+ Products', image: '/bathrooms/plumbing.jpg' },
        { label: 'Paint & Finishes', count: '150+ Products', image: '/bathrooms/painting.jpg' },
        { label: 'Cabinetry', count: '180+ Products', image: '/bathrooms/cabinet.jpg' }
      ].map((category, index) => (
        <button 
          key={index} 
          className="relative group overflow-hidden h-[400px] flex flex-col justify-end p-8 text-left transition-all duration-500"
        >
          {/* Background Visual Layer */}
          <div className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110 ">
            <Image
              src={category.image}
              alt={category.label}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
            {/* Gradient Industrial Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/20 transition-all duration-500" />
          </div>

          {/* Label Content Area */}
          <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
            {/* Animated Gold Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#dc2626] origin-bottom transition-transform duration-500 scale-y-50 group-hover:scale-y-100" />
            
            <div className="pl-6">
              <h3 className="font-bold text-white uppercase text-sm mb-2 tracking-widest group-hover:text-[#dc2626] transition-colors">
                {category.label}
              </h3>
              <p className="text-[10px] font-black text-gray-400 group-hover:text-white tracking-[0.3em] uppercase transition-colors">
                {category.count}
              </p>
            </div>
          </div>

          {/* Subtle Outer Border */}
          <div className="absolute inset-0 border border-white/10 group-hover:border-[#dc2626]/30 transition-colors duration-500 pointer-events-none" />
        </button>
      ))}
    </div>
  </div>
</section>

     
{/* --- FINAL CTA SECTION --- */}
<section className="relative py-15 px-6 md:px-12 lg:px-18 overflow-hidden group">
  {/* Background Unsplash Image with Subtle Motion */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/bathrooms/bathroom1.jpg"
      alt="Luxury Bathroom Showroom"
      fill
      sizes="100vw"
      className="object-cover transition-transform duration-[3s] group-hover:scale-110"
    />
    {/* Sophisticated Dark Industrial Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black/90" />
    
    {/* Decorative Technical Grid Overlay */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
         style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
    />
  </div>

  <div className="max-w-4xl mx-auto text-center text-white relative z-10">
    {/* Aesthetic Badge */}
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="w-8 h-[1px] bg-[#dc2626]" />
      <span className="text-[#dc2626] font-mono text-[10px] tracking-[0.5em] uppercase">The Experience</span>
      <div className="w-8 h-[1px] bg-[#dc2626]" />
    </div>

    <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tighter leading-none">
      Visit Our <br /> 
      <span className="font-serif italic lowercase font-light text-gray-400 tracking-normal">Showroom</span>
    </h2>

    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
      Explore our full collection of bathroom materials and fixtures in person. Our team is ready to translate your technical vision into a functional sanctuary.
    </p>

    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      {/* GALLERY VIEW - PRIMARY */}
      <Link href="/gallery" className="flex-1 max-w-[240px]">
        <button className="w-full bg-[#dc2626] text-black py-5 px-8 font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-white active:scale-95 shadow-2xl">
          Gallery View
        </button>
      </Link>

      {/* INVENTORY SEARCH - SECONDARY */}
      <Link href="/inventory" className="flex-1 max-w-[240px]">
        <button className="w-full backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black py-5 px-8 font-bold uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95">
          Inventory Search
        </button>
      </Link>
    </div>

    {/* Footer Detail */}
    <div className="mt-10 flex justify-center opacity-20">
      <div className="h-20 w-[1px] bg-gradient-to-b from-[#dc2626] to-transparent" />
    </div>
  </div>
</section>

    </div>
  );
}