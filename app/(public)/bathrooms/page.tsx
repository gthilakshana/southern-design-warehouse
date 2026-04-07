import React from 'react';
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

  const defaultHero = "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2000&auto=format&fit=crop";
  const contentImage = content?.contentUrl || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop";

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
      <section className="py-24 px-6 md:px-12 lg:px-24">
        {/* ... Rest of the content section ... */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-6">
            <div className="bg-white p-10 md:p-16 shadow-sm border border-gray-100 relative mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-10 leading-tight uppercase">
                Materials We Help You <br /> Choose
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dynamicMaterials.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-6 border border-[#EAE7DE] bg-[#F9F8F6] hover:border-[#a68966] transition-colors group cursor-default"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#a68966]" />
                    <span className="text-gray-800 font-bold uppercase text-[11px] tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Content Illustration - SIZE FIX */}
            <div className="relative h-[250px] w-full shadow-lg overflow-hidden border border-gray-100 grayscale hover:grayscale-0 transition-all duration-700 bg-white">
              <Image
                src={contentImage}
                alt="Bathroom Materials"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-10 lg:pl-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight ">
                Professional Design <br /> Consultation
              </h2>
              <div className="w-20 h-1 bg-[#a68966] mb-8" />
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                Our materials specialists help guide homeowners through the selection process so the entire bathroom works together seamlessly. We focus on durability, waterproof integrity, and aesthetic harmony.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <button className="flex-1 bg-[#b33e2f] hover:bg-black text-white py-5 px-8 font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group">
                <TbMessageDots className="text-xl group-hover:scale-110 transition-transform" />
                Schedule Consultation
              </button>

              <button className="flex-1 border-2 border-[#a68966] text-[#a68966] py-5 px-8 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#a68966] hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95">
                <TbArmchair className="text-xl" />
                Visit Showroom
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}