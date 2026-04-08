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
    ? content.heroText.split(/[•·,]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
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
        />

        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white ">
            {content?.title || "Bathroom Design Planning"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {content?.description || "Bathrooms combine functionality with relaxation and style. Southern Design Warehouse helps homeowners design bathrooms that feel modern, comfortable, and visually appealing."}
          </p>
        </div>
      </section>

      {/* --- DESIGN CONSULTATION SECTION --- */}
<section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    
    {/* LEFT SIDE: Text and Actions */}
    <div className="space-y-10 order-2 lg:order-1">
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight uppercase">
          Professional Design <br /> Consultation
        </h2>
        <div className="w-20 h-1 bg-[#a68966] mb-8" />
        <p className="text-gray-600 text-lg leading-relaxed font-light">
          Our materials specialists help guide homeowners through the selection process so the entire bathroom works together seamlessly. We focus on durability, waterproof integrity, and aesthetic harmony.
        </p>
      </div>

     <div className="flex flex-col sm:flex-row gap-4 pt-10">
  {/* SCHEDULE CONSULTATION LINK */}
  <Link href="/contact">
    <button className="flex-1 bg-[#b33e2f] hover:bg-black text-white py-5 px-8 font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group">
      <TbMessageDots className="text-xl group-hover:scale-110 transition-transform" />
      Schedule Consultation
    </button>
  </Link>

  {/* VISIT SHOWROOM LINK */}
  <Link href="/showroom">
    <button className="flex-1 border-2 border-[#a68966] text-[#a68966] py-5 px-8 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#a68966] hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95">
      <TbArmchair className="text-xl" />
      Visit Showroom
    </button>
  </Link>
</div>
    </div>

    {/* RIGHT SIDE: Materials & Image */}
    <div className="space-y-6 order-1 lg:order-2">
      <div className="bg-[#F9F8F6] p-10 md:p-12 shadow-sm border border-gray-100 relative">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 leading-tight uppercase">
          Materials We Help You <br /> Choose
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dynamicMaterials.map((item: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 p-5 border border-[#EAE7DE] bg-white hover:border-[#a68966] transition-colors group cursor-default"
            >
              <div className="w-2 h-2 rounded-full bg-[#a68966]" />
              <span className="text-gray-800 font-bold uppercase text-[11px] tracking-widest">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Content Illustration */}
      <div className="relative h-[300px] w-full shadow-lg overflow-hidden  hover:grayscale-0 transition-all duration-700">
        <Image
          src={contentImage}
          alt="Bathroom Materials"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>

  </div>
</section>

      {/* --- FEATURED BATHROOM STYLES SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Featured Bathroom Styles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Explore popular bathroom designs and find inspiration for your renovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Modern Minimalist', 
                description: 'Clean lines, neutral colors, and sleek fixtures for a contemporary bathroom aesthetic',
                features: 'Floating vanities • Frameless glass showers • Polished concrete floors',
                image: '/bathrooms/vanities.jpg'
              },
              { 
                title: 'Classic Elegance', 
                description: 'Timeless design elements with quality materials that never go out of style',
                features: 'Double vanities • Marble finishes • Traditional fixtures',
                image: '/bathrooms/marble.jpg'
              },
              { 
                title: 'Spa Retreat', 
                description: 'Luxurious materials and soothing elements to create a relaxing sanctuary',
                features: 'Soaking tubs • Natural stone • Ambient lighting',
                image: '/bathrooms/natural.jpg'
              }
            ].map((style, index) => (
              <div key={index} className="bg-[#F4F1EE] border border-gray-200 hover:border-[#a68966] transition-all overflow-hidden group">
                <div className="relative h-64 bg-gradient-to-br from-[#a68966]/10 to-[#2d4a3e]/10 flex items-center justify-center overflow-hidden">
                  <Image
                    src={style.image}
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
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#a68966] mb-2">Key Features:</p>
                    <p className="text-gray-700 text-sm">{style.features}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DESIGN TIPS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-[#F4F1EE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Bathroom Design Tips</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Expert guidance for creating the perfect bathroom space
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                number: '01',
                title: 'Plan Your Layout First',
                description: 'Consider traffic flow, fixture placement, and ventilation needs before selecting materials. Proper planning prevents costly renovations.'
              },
              {
                number: '02',
                title: 'Choose the Right Flooring',
                description: 'Select waterproof, slip-resistant flooring materials like porcelain tiles or natural stone that withstand moisture and heavy use.'
              },
              {
                number: '03',
                title: 'Incorporate Adequate Lighting',
                description: 'Layer your lighting with ambient, task, and accent options. Good lighting enhances both functionality and ambiance.'
              },
              {
                number: '04',
                title: 'Select Quality Fixtures',
                description: 'Invest in durable, water-efficient fixtures that provide reliable performance and reduce long-term maintenance needs.'
              },
              {
                number: '05',
                title: 'Apply Water-Resistant Materials',
                description: 'Use moisture-resistant drywall, paint, and sealants to protect structures from mold, mildew, and water damage.'
              },
              {
                number: '06',
                title: 'Coordinate Your Finishes',
                description: 'Maintain a cohesive design by coordinating colors, metals, and styles across vanities, fixtures, and accessories.'
              }
            ].map((tip, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-800 text-white flex items-center justify-center font-black text-xl">
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">Browse Our Bathroom Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Complete selection of materials for every bathroom element
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    { label: 'Shower Solutions', count: '250+ Products', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&fit=crop' },
    { label: 'Bathtubs', count: '180+ Products', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&fit=crop' },
    { label: 'Vanities & Sinks', count: '320+ Products', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&fit=crop' },
    { label: 'Wall & Floor Tiles', count: '450+ Products', image: 'https://images.unsplash.com/photo-1565183000204-6b143ee7b2a0?w=600&fit=crop' },
    { label: 'Mirrors & Lighting', count: '200+ Products', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&fit=crop' },
    { label: 'Plumbing Fixtures', count: '290+ Products', image: 'https://images.unsplash.com/photo-1565183000204-6b143ee7b2a0?w=600&fit=crop' },
    { label: 'Paint & Finishes', count: '150+ Products', image: 'https://images.unsplash.com/photo-1568762868663-67ebf45b8272?w=600&fit=crop' },
    { label: 'Cabinetry', count: '180+ Products', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&fit=crop' }
  ].map((category, index) => (
    <button 
      key={index} 
      className="relative group overflow-hidden min-h-[280px] flex flex-col justify-end p-8 text-left border border-gray-200 transition-all hover:border-black"
    >
      {/* Warehouse Visuals */}
      <div className="absolute inset-0 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105">
        <Image
          src={category.image}
          alt={category.label}
          fill
          className="object-cover"
        />
        {/* Dark Industrial Overlay */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-opacity" />
      </div>

      {/* Font styles kept exactly as requested */}
      <div className="relative z-10 border-l-2 border-[#a68966] pl-4">
        <h3 className="font-bold text-white uppercase text-sm mb-2 drop-shadow-sm">
          {category.label}
        </h3>
        <p className="text-[11px] font-black text-[#a68966] tracking-widest drop-shadow-sm">
          {category.count}
        </p>
      </div>
    </button>
  ))}
</div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#2d4a3e]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6">Come to Our Showroom</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Visit our showroom to see our full collection of bathroom materials, fixtures, and design inspirations in person. Our team is ready to help you find the perfect products for your project.
          </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
 
 

  {/* GALLERY VIEW - LINKED */}
  <Link href="/gallery">
    <button className="bg-[#a68966] text-gray-900 hover:bg-[#a68966] hover:text-white py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all active:scale-95">
      Gallery View
    </button>
  </Link>

  {/* INVENTORY SEARCH - LINKED */}
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