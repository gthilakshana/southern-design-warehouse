import React from 'react';
import Image from 'next/image';
import { LuCheck } from "react-icons/lu";
import Link from 'next/link'
import { getPageContent } from '@/lib/actions';
import ResponsiveHero from '@/components/ui/ResponsiveHero';

export default async function KitchensPage() {
  const content = await getPageContent('kitchens');

  const designSupportList = [
    'Material selection guidance',
    'Cabinet coordination',
    'Countertop recommendations',
    'Flooring combinations',
  ];

  const showroomOptions = content?.heroText
    ? content.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : ["Cabinets", "Granite", "Flooring", "Backsplash tiles"];

  
  const contentImage = content?.contentUrl || "/images/warehouse.jpg";

  return (
      <div className="min-h-screen bg-[#F9F7F2] font-[arial]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white px-6">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl="https://images.unsplash.com/photo-1600585154340-be6199f7d209?q=80&w=2000"
          alt="Luxury Kitchen Design"
          brightness="brightness-[0.25]"
        />

        <div className="relative z-10 max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white ">
            {content?.title || "Kitchen Design Services"}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light">
            {content?.description || "Planning a kitchen renovation requires careful material selection and layout planning. Southern Design Warehouse helps homeowners and contractors design kitchens that balance beauty, functionality, and durability."}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {showroomOptions.map((item: string) => (
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

      
      {/* --- CONTENT SECTION: DESIGN SUPPORT --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-[#fcfcfc] overflow-hidden">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

    {/* Left Side: Editorial Design Support (7 Columns) */}
    <div className="lg:col-span-7 flex flex-col justify-center">
      <div className="mb-12">
        <span className="text-[#dc2626] font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Professional Consultancy</span>
        <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight tracking-tighter uppercase">
          Design <br /> <span className="font-serif italic lowercase tracking-normal text-gray-400">Support</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {designSupportList.map((item, index) => (
          <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-100 group transition-all duration-300 hover:pl-2">
            <div className="w-2 h-2 bg-[#dc2626] rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm text-gray-600 font-bold uppercase tracking-widest">{item}</span>
          </div>
        ))}
      </div>

      <div className="relative pl-12 py-4">
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-200" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-[#dc2626]" />
        <p className="text-gray-500 italic text-2xl leading-relaxed font-light font-serif">
          &quot;Our team helps you match materials so your kitchen looks cohesive and well designed.&quot;
        </p>
      </div>
    </div>

    {/* Right Side: The "Showroom Archive" (5 Columns) */}
    <div className="lg:col-span-5 relative">
      <div className="relative z-10 bg-white p-2 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.1)]">
        <div className="relative h-[450px] w-full overflow-hidden mb-8">
          <Image
            src={contentImage}
            alt="Kitchen Showroom Support"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover  transition-all duration-1000"
            priority
          />
          {/* Subtle Floating Badge */}
          <div className="absolute top-6 right-6 bg-black text-white px-4 py-2 text-[10px] font-mono tracking-widest uppercase">
            EST. 2026
          </div>
        </div>

        <div className="px-8 pb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tighter">Showroom Experience</h3>
          
          <div className="grid grid-cols-2 gap-[1px] bg-gray-100 border border-gray-100 mb-10 overflow-hidden">
            {showroomOptions.map((option, index) => (
              <div key={index} className="bg-white py-5 px-4 text-center group hover:bg-[#dc2626] transition-colors duration-300">
                <span className="text-gray-500 group-hover:text-white font-bold uppercase text-[9px] tracking-[0.2em] transition-colors">
                  {option}
                </span>
              </div>
            ))}
          </div>

          <Link href="/contact" className="block group">
            <button className="w-full bg-black text-white py-6 font-bold uppercase tracking-[0.3em] text-[10px] transition-all relative overflow-hidden">
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">Plan Your Visit</span>
              <div className="absolute inset-0 bg-[#dc2626] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-full h-full border-2 border-[#dc2626]/10 -z-0 pointer-events-none hidden lg:block" />
    </div>

  </div>
</section>


      {/* --- FEATURED KITCHEN STYLES SECTION --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-[#1a1a1a] text-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    {/* Header with a "Design Label" look */}
    <div className="flex flex-col mb-24 relative">
      <span className="text-[#dc2626] font-mono text-sm tracking-[0.5em] uppercase mb-4">Style Guide 2026</span>
      <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
        Featured <span className="text-gray-500 italic">Styles</span>
      </h2>
      <div className="w-24 h-[1px] bg-[#dc2626]" />
      <p className="mt-8 text-gray-400 max-w-md text-lg leading-relaxed font-light">
        Curated aesthetics from minimalist modernism to timeless heritage craftsmanship.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {[
        { 
          title: 'Contemporary', 
          num: '01',
          description: 'Sleek design with clean lines, minimalist styling, and modern materials',
          features: ['Flat panel cabinets', 'Quartz countertops', 'Stainless steel'],
          image: '/kitchens/cabinets.jpg'
        },
        { 
          title: 'Traditional', 
          num: '02',
          description: 'Classic design elements with warm finishes and timeless appeal',
          features: ['Wood cabinetry', 'Granite counters', 'Warm lighting'],
          image: '/kitchens/Countertops.jpeg'
        },
        { 
          title: 'Modern Farmhouse', 
          num: '03',
          description: 'Blend of rustic charm with contemporary functionality and comfort',
          features: ['Open shelving', 'Mixed materials', 'Neutral palette'],
          image: '/kitchens/Cabinetry.jpeg'
        }
      ].map((style, index) => (
        <div key={index} className="group relative">
          {/* Image Container with Custom Aspect Ratio */}
          <div className="relative aspect-[4/5] overflow-hidden mb-8 transition-all duration-700 ">
            <Image
              src={style.image}
              alt={style.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
            />
            {/* Number Overlay */}
            <span className="absolute top-6 right-6 text-6xl font-black text-white/10 italic group-hover:text-[#dc2626]/20 transition-colors">
              {style.num}
            </span>
          </div>

          {/* Content Area */}
          <div className="relative">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-4">
              <span className="text-[#dc2626] text-xs font-mono tracking-tighter">/ {style.title}</span>
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 h-12">
              {style.description}
            </p>

            {/* Tags/Features with Pill Design */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
              {style.features.map((feature, i) => (
                <span key={i} className="text-[10px] uppercase tracking-widest text-gray-500 border border-white/20 px-3 py-1 rounded-full group-hover:border-[#dc2626] group-hover:text-white transition-colors">
                  {feature}
                </span>
              ))}
            </div>

            {/* Hover Indicator Line */}
            <div className="absolute -bottom-4 left-0 w-0 h-[2px] bg-[#dc2626] transition-all duration-500 group-hover:w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* --- DESIGN TIPS SECTION --- */}
<section className="relative py-28 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
  {/* Subtly textured background element */}
  <div className="absolute top-0 right-0 w-1/3 h-full bg-[#ffe0e0] -z-0 hidden lg:block" />
  
  <div className="max-w-7xl mx-auto relative z-10">
    <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-8">
      <div className="max-w-xl">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 uppercase leading-[0.9] mb-8">
          Design <br />
         Principles
        </h2>
        <div className="w-20 h-1 bg-black mb-8" />
      </div>
      
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
      {[
        {
          number: '01',
          title: 'Plan the Work Triangle',
          description: 'Arrange sink, stove, and refrigerator in a triangle formation for efficient workflow and movement.'
        },
        {
          number: '02',
          title: 'Quality Cabinetry',
          description: 'Invest in durable cabinetry with high-grade finishes and industrial hardware that maintains integrity over time.'
        },
        {
          number: '03',
          title: 'Durable Surfaces',
          description: 'Pick materials that balance heat resistance and hygiene with the raw aesthetic of your space.'
        },
        {
          number: '04',
          title: 'Layered Lighting',
          description: 'Combine ambient, task, and accent lighting. Under-cabinet LEDs are essential for technical prep work.'
        },
        {
          number: '05',
          title: 'Backsplash Shield',
          description: 'Install high-impact tiles to protect surfaces while adding a focal texture to the kitchen geometry.'
        },
        {
          number: '06',
          title: 'Ergonomic Flow',
          description: 'Select slip-resistant, durable flooring that ties together the overall design theme and traffic patterns.'
        }
      ].map((tip, index) => (
        <div key={index} className="group flex flex-col">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-black text-gray-200 group-hover:text-[#dc2626] transition-colors duration-500 font-mono">
              {tip.number}
            </span>
            <div className="h-[1px] flex-grow bg-gray-100 group-hover:bg-[#dc2626] transition-all duration-500" />
          </div>
          
          <div className="pl-2">
            <h3 className="text-lg font-bold text-gray-900 uppercase mb-4 tracking-tighter group-hover:translate-x-2 transition-transform duration-300">
              {tip.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {tip.description}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom Decorative Section with Unsplash Image */}
    <div className="mt-32 relative h-[300px] w-full overflow-hidden">
      <Image 
        src="/kitchens/paint.jpg" 
        alt="Technical Kitchen Planning"
        fill
        sizes="100vw"
        className="object-cover  transition-all duration-1000"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <p className="text-white font-mono text-xs tracking-[1em] uppercase border-y border-white/30 py-4 px-8 backdrop-blur-sm">
          Technical Excellence • Aesthetic Precision
        </p>
      </div>
    </div>
  </div>
</section>

     {/* --- PRODUCT CATEGORIES SECTION --- */}
<section className="py-28 px-6 md:px-12 lg:px-24 bg-[#fcfcfc]">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
      <div className="max-w-2xl">
        <span className="text-[#dc2626] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">Curated Collections</span>
        <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight">
          Browse Our <span className="font-serif italic">Kitchen</span> Collection
        </h2>
      </div>
      <p className="text-gray-500 max-w-xs text-sm leading-relaxed border-l border-gray-200 pl-6">
        A complete selection of premium materials and fixtures for your next architectural renovation.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Cabinetry', count: '500+ Products', image: '/kitchens/Cabinetry.jpeg' },
        { label: 'Countertops', count: '320+ Products', image: '/kitchens/Countertops.jpeg' },
        { label: 'Backsplash Tiles', count: '280+ Products', image: '/kitchens/Tiles.jpeg' },
        { label: 'Flooring', count: '350+ Products', image: '/kitchens/Flooring.jpeg' },
        { label: 'Lighting Fixtures', count: '220+ Products', image: '/kitchens/Light.jpg' },
        { label: 'Sinks & Faucets', count: '280+ Products', image: '/kitchens/Sinks.jpg' },
        { label: 'Paint & Finishes', count: '180+ Products', image: '/kitchens/paint.jpg' },
        { label: 'Hardware & Accessories', count: '420+ Products', image: '/kitchens/hardware.jpg' }
      ].map((category, index) => (
        <button 
          key={index} 
          className="relative group overflow-hidden h-[400px] flex flex-col justify-end p-8 text-left transition-all duration-500 hover:shadow-2xl"
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
            <Image
              src={category.image}
              alt={category.label}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors duration-500" />
          </div>

          {/* Content Area */}
          <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {/* The Accent Line - Animates height on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#dc2626] origin-bottom transition-transform duration-500 scale-y-50 group-hover:scale-y-100" />
            
            <div className="pl-6">
              <h3 className="font-bold text-white uppercase text-lg tracking-wider mb-1">
                {category.label}
              </h3>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-[#dc2626] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-full group-hover:translate-y-0">
                  {category.count}
                </p>
              </div>
            </div>
          </div>

          {/* Subtle Border Overlay */}
          <div className="absolute inset-0 border border-white/10 group-hover:border-[#dc2626]/30 transition-colors duration-500" />
        </button>
      ))}
    </div>
  </div>
</section>

      {/* --- FINAL CTA SECTION --- */}
<section className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
  {/* Background Unsplash Image with Parallax-like feel */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/kitchens/paint.jpg"
      alt="Modern Kitchen Showroom Archive"
      fill
      sizes="100vw"
      className="object-cover scale-105"
    />
    {/* Industrial Gradient Overlay (Replacing the flat red) */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="max-w-3xl">
      {/* Decorative Accent */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-[2px] bg-[#dc2626]" />
        <span className="text-[#dc2626] font-bold tracking-[0.3em] uppercase text-xs">Visit Us Today</span>
      </div>

      <h2 className="text-4xl md:text-6xl font-light text-white uppercase leading-tight mb-8">
        Experience Quality <br /> 
        <span className="font-serif italic lowercase text-gray-300">in</span> person
      </h2>

      <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed font-light">
        Visit our kitchen showroom to explore material combinations and hardware. Work with our design team to turn your technical vision into a reality.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/gallery" passHref>
          <button className="group relative bg-[#dc2626] text-black py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all hover:bg-white active:scale-95 flex items-center justify-center gap-3">
            Gallery View
            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
          </button>
        </Link>

        <Link href="/inventory" passHref>
          <button className="backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-black py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all active:scale-95">
            Inventory Search
          </button>
        </Link>
      </div>
    </div>
  </div>

  {/* Design Detail: Subtle coordinates or location tag */}
  <div className="absolute bottom-12 right-12 hidden lg:block">
    <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase rotate-90 origin-right">
      Premium Kitchen Fixtures • Since 2026
    </p>
  </div>
</section>
    </div>
  );
}