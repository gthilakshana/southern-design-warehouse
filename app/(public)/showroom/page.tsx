import React from 'react';
import Image from 'next/image';
import { TbMessageDots, TbBuildingStore } from 'react-icons/tb';
import { getPageContent } from '@/lib/actions';
import ResponsiveHero from '@/components/ui/ResponsiveHero';

export default async function ShowroomPage() {
  const content = await getPageContent('showroom');

  const dynamicCategories = content?.heroText
    ? content.heroText.split(/[•·,]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : [
      "Kitchen Displays",
      "Bathroom Settings",
      "Flooring Gallery",
      "Material Samples",
      "Design Center"
    ];

  const defaultHero = "https://images.unsplash.com/photo-1600585154526-990dcea4db0d?q=80&w=2000&auto=format&fit=crop";
  const contentImage = content?.contentUrl || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop";

  return (
      <div className="min-h-screen bg-[#F4F1EE] font-[arial]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[65vh] flex items-center justify-center text-center text-white px-6 overflow-hidden">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl={defaultHero}
          alt="Southern Design Showroom"
          brightness="brightness-[0.3]"
        />

        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white ">
            {content?.title || "Our Design Showroom"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {content?.description || "Experience the quality and craftsmanship of Southern Design Warehouse in person. Our showroom features curated displays designed to inspire your next home transformation."}
          </p>
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section className="bg-gray-100 py-20 px-6 md:px-12 lg:px-20">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

    {/* LEFT SIDE */}
    <div>
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-10">
        What You Can Explore
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {[
          "Flooring",
          "Cabinets",
          "Tiles",
          "Vanities",
          "Granite",
          "Wall panels"
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white py-10 text-center rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-red-600 transition duration-300 cursor-pointer"
          >
            <span className="text-gray-800 text-lg font-medium">
              {item}
            </span>
          </div>
        ))}

      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="bg-white p-10 md:p-12 rounded-xl shadow-lg border border-gray-200 relative">

      {/* TOP BORDER LINE */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600 rounded-t-xl"></div>

      <h2 className="text-3xl font-semibold text-gray-900 mb-10">
        Showroom Benefits
      </h2>

      <div className="space-y-8">

        {[
          "Compare materials side by side",
          "Get guidance from material specialists",
          "Find design inspiration"
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-6">

            {/* NUMBER BOX */}
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-red-600 font-bold rounded">
              {index + 1}
            </div>

            <p className="text-gray-600 text-lg">
              {item}
            </p>
          </div>
        ))}

      </div>

      {/* BUTTON */}
      <button className="mt-12 w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-md font-semibold text-lg shadow-md transition duration-300">
        Schedule a Visit
      </button>

    </div>

  </div>
</section>
      {/* --- FEATURED DISPLAYS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Featured Showroom Displays</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Explore our curated displays showcasing complete design solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Kitchen Gallery', 
                description: 'Complete kitchen setups with cabinetry, countertops, and appliances',
                features: 'Contemporary • Traditional • Modern Farmhouse styles',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop'
              },
              { 
                title: 'Bathroom Showroom', 
                description: 'Full bathroom displays with vanities, fixtures, and tile combinations',
                features: 'Spa style • Classic • Minimalist designs',
                image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop'
              },
              { 
                title: 'Flooring Center', 
                description: 'Extensive selection of flooring materials for every room and style',
                features: 'Tile • Wood • Laminate • Natural stone options',
                image: 'https://images.unsplash.com/photo-1568762868663-67ebf45b8272?w=600&h=400&fit=crop'
              }
            ].map((display, index) => (
              <div key={index} className="bg-[#F4F1EE] border border-gray-200 hover:border-[#a68966] transition-all overflow-hidden group">
                <div className="relative h-64 bg-gradient-to-br from-[#a68966]/10 to-[#2d4a3e]/10 flex items-center justify-center overflow-hidden">
                  <Image
                    src={display.image}
                    alt={display.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 uppercase mb-3">{display.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{display.description}</p>
                  <div className="pt-6 border-t border-gray-300">
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#a68966] mb-2">Styles Available:</p>
                    <p className="text-gray-700 text-sm">{display.features}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SHOWROOM EXPERIENCE TIPS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-[#F4F1EE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Get the Most From Your Visit</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Tips for making the most of your showroom experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                number: '01',
                title: 'Take Measurements',
                description: 'Bring measurements of your space and take photos with your phone. This helps our team make accurate recommendations.'
              },
              {
                number: '02',
                title: 'Gather Inspiration',
                description: 'Walk through our displays and take notes on colors, materials, and layouts that appeal to you and your style.'
              },
              {
                number: '03',
                title: 'Ask Questions',
                description: 'Our material specialists are available to discuss durability, maintenance, and how to coordinate different products.'
              },
              {
                number: '04',
                title: 'Compare Materials',
                description: 'See materials side-by-side in natural light. Touch and feel finishes to understand their texture and quality.'
              },
              {
                number: '05',
                title: 'Get Samples',
                description: 'Take home samples of materials you love to see how they look in your actual space and lighting conditions.'
              },
              {
                number: '06',
                title: 'Schedule Design Help',
                description: 'Book a design consultation to work one-on-one with our team and create a detailed plan for your project.'
              }
            ].map((tip, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#a68966] text-white flex items-center justify-center font-black text-xl">
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

      {/* --- MATERIAL LIBRARY SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Our Material Library</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Explore our comprehensive selection of quality materials and products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🧱', label: 'Tiles & Stone', count: '800+ Options', image: 'https://images.unsplash.com/photo-1565183000204-6b143ee7b2a0?w=400&h=300&fit=crop' },
              { icon: '🪵', label: 'Cabinetry', count: '500+ Styles', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
              { icon: '⚫', label: 'Countertops', count: '320+ Designs', image: 'https://images.unsplash.com/photo-1568762868663-67ebf45b8272?w=400&h=300&fit=crop' },
              { icon: '🟫', label: 'Flooring', count: '450+ Products', image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400&h=300&fit=crop' },
              { icon: '🚰', label: 'Fixtures & Faucets', count: '280+ Selections', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop' },
              { icon: '💡', label: 'Lighting', count: '220+ Fixtures', image: 'https://images.unsplash.com/photo-1565807666665-72d6d13f3d3b?w=400&h=300&fit=crop' },
              { icon: '🎨', label: 'Paint & Stains', count: '300+ Colors', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop' },
              { icon: '🔨', label: 'Hardware & Accents', count: '400+ Items', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' }
            ].map((material, index) => (
              <button key={index} className="relative bg-[#F4F1EE] border border-gray-200 hover:border-[#a68966] p-8 text-center transition-all hover:shadow-lg group overflow-hidden min-h-[280px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Image
                    src={material.image}
                    alt={material.label}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">{material.icon}</div>
                  <h3 className="font-bold text-gray-900 uppercase text-sm mb-2 drop-shadow-sm">{material.label}</h3>
                  <p className="text-[11px] font-black text-[#a68966] tracking-widest drop-shadow-sm">{material.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#2d4a3e]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6">Plan Your Showroom Visit</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Our showroom is designed to inspire and guide your design decisions. Visit us today to explore materials, discuss your project with our specialists, and bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#a68966] hover:bg-[#956a4d] text-white py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all shadow-lg active:scale-95">
              Schedule Visit
            </button>
            <button className="border-2 border-[#a68966] text-[#a68966] hover:bg-[#a68966] hover:text-white py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all active:scale-95">
              Get Directions
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-[#2d4a3e] py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all active:scale-95">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}