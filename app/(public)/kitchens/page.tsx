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
    ? content.heroText.split(/[•·,]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : ["Cabinets", "Granite", "Flooring", "Backsplash tiles"];

  
  const contentImage = content?.contentUrl || "/images/20260225_094445.jpg";

  return (
      <div className="min-h-screen bg-[#F9F7F2] font-[arial]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white px-6">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl=""
          alt="Kitchen Background"
          brightness="brightness-[0.25]"
        />

        <div className="relative z-10 max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white ">
            {content?.title || "Kitchen Design Services"}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light">
            {content?.description || "Planning a kitchen renovation requires careful material selection and layout planning. Southern Design Warehouse helps homeowners and contractors design kitchens that balance beauty, functionality, and durability."}
          </p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        {/* ... Rest of the content section remains identical ... */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Side: Design Support */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 uppercase">
              Our Kitchen Design Support
            </h2>

            <div className="space-y-4 mb-12">
              {designSupportList.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-white p-6 shadow-sm rounded-sm border border-gray-100 group hover:border-red-600 transition-colors">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[#c4a47c]">
                    <LuCheck className="text-[#c4a47c] w-5 h-5" />
                  </div>
                  <span className="text-lg text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <blockquote className="border-l-4 border-[#c4a47c] pl-6 py-2 bg-white/50">
              <p className="text-gray-500 italic text-xl leading-relaxed font-light ">
                &quot;Our team helps you match materials so your kitchen looks cohesive and well designed.&quot;
              </p>
            </blockquote>
          </div>

          {/* Right Side: Showroom Experience Card */}
          <div className="space-y-6">
            <div className="relative h-[350px] w-full shadow-2xl rounded-sm overflow-hidden border border-gray-100 bg-white">
              {/* Use the standard content image */}
              <Image
                src={contentImage}
                alt="Kitchen Showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Showroom Card */}
            <div className="bg-white p-10 shadow-xl border-t-8 border-[#c4a47c] rounded-b-sm">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 uppercase tracking-tight">Showroom Experience</h3>
              <p className="text-gray-600 mb-8 font-medium">Visit our showroom to explore combinations of:</p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {showroomOptions.map((option: string, index: number) => (
                  <div key={index} className="bg-[#F9F7F2] py-6 px-4 text-center text-gray-800 font-bold border border-gray-100 uppercase text-[11px] tracking-widest">
                    {option}
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                <p className="text-sm font-black text-[#b23b2b] uppercase tracking-widest text-center border-y border-gray-100 py-4">
                  Seeing materials together makes design decisions easier.
                </p>
                <Link href="/contact">
                <button className="w-full bg-red-600 hover:bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg">
                  Plan Your Visit
                </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURED KITCHEN STYLES SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Featured Kitchen Styles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Explore popular kitchen designs and find inspiration for your renovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Contemporary', 
                description: 'Sleek design with clean lines, minimalist styling, and modern materials',
                features: 'Flat panel cabinets • Quartz countertops • Stainless steel appliances',
                image: '/kitchens/cabinets.jpg'
              },
              { 
                title: 'Traditional', 
                description: 'Classic design elements with warm finishes and timeless appeal',
                features: 'Wood cabinetry • Granite counters • Warm lighting',
                image: '/kitchens/warm-light.jpg'

              },
              { 
                title: 'Modern Farmhouse', 
                description: 'Blend of rustic charm with contemporary functionality and comfort',
                features: 'Open shelving • Mixed materials • Neutral palette',
                image: '/kitchens/mixed.jpg'
              }
            ].map((style, index) => (
              <div key={index} className="bg-[#F9F7F2] border border-gray-200 hover:border-red-600 transition-all overflow-hidden group">
                <div className="relative h-64 bg-gradient-to-br from-[#c4a47c]/10 to-[#2d4a3e]/10 flex items-center justify-center overflow-hidden">
                  <Image
                    src={style.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop'}
                    alt={style.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 uppercase mb-3">{style.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{style.description}</p>
                  <div className="pt-6 border-t border-gray-300">
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#c4a47c] mb-2">Key Features:</p>
                    <p className="text-gray-700 text-sm">{style.features}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DESIGN TIPS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Kitchen Design Tips</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Expert guidance for planning the ideal kitchen space
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                number: '01',
                title: 'Plan the Work Triangle',
                description: 'Arrange sink, stove, and refrigerator in a triangle formation for efficient workflow and movement throughout the kitchen.'
              },
              {
                number: '02',
                title: 'Choose Quality Cabinets',
                description: 'Invest in durable cabinetry with proper finish and hardware that withstands daily use and maintains appearance over time.'
              },
              {
                number: '03',
                title: 'Select Durable Countertops',
                description: 'Pick countertop materials that balance aesthetics with durability, heat resistance, and easy maintenance for your lifestyle.'
              },
              {
                number: '04',
                title: 'Proper Lighting Design',
                description: 'Layer ambient, task, and accent lighting to create functionality and mood. Under-cabinet lighting is essential for food prep.'
              },
              {
                number: '05',
                title: 'Backsplash Protection',
                description: 'Install backsplash tiles to protect walls from splashes and enhance kitchen aesthetics. Choose coordinating colors and patterns.'
              },
              {
                number: '06',
                title: 'Flooring & Flow',
                description: 'Select slip-resistant, durable flooring that also ties in with your overall design theme and color palette.'
              }
            ].map((tip, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xl">
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

      {/* --- PRODUCT CATEGORIES SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Browse Our Kitchen Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Complete selection of materials and fixtures for your kitchen renovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    { label: 'Cabinetry', count: '500+ Products', image: '/kitchens/cabinetry.jpeg' },
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
      className="relative group overflow-hidden min-h-[280px] flex flex-col justify-end p-8 text-left border border-gray-200 transition-all hover:border-black"
    >
      {/* Warehouse Image Layer */}
      <div className="absolute inset-0 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105">
        <Image
          src={category.image}
          alt={category.label}
          fill
          className="object-cover"
        />
        {/* Darker overlay for industrial feel */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-opacity" />
      </div>

      {/* Content Area - Kept your Font Styles exactly */}
      <div className="relative z-10 border-l-2 border-[#c4a47c] pl-4">
        <h3 className="font-bold text-white uppercase text-sm mb-2 drop-shadow-sm">
          {category.label}
        </h3>
        <p className="text-[11px] font-black text-[#c4a47c] tracking-widest drop-shadow-sm">
          {category.count}
        </p>
      </div>
    </button>
  ))}
</div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-red-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6">Come to Our Showroom</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Visit our kitchen showroom to explore material combinations, cabinet styles, and countertop options. See products in person and work with our design team to plan your perfect kitchen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/gallery" passHref>
            <button className="bg-white text-gray-800 hover:bg-gray-900 hover:text-white py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all active:scale-95">
              Gallery View
            </button>
</Link>

            <Link href="/inventory" passHref>
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