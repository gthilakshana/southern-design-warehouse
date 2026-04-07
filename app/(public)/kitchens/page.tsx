import React from 'react';
import { LuCheck } from "react-icons/lu";
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

  const defaultHero = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop";
  const contentImage = content?.contentUrl || "https://images.unsplash.com/photo-1596701140306-385002030e46?q=80&w=1200&auto=format&fit=crop";

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
                <div key={index} className="flex items-center gap-4 bg-white p-6 shadow-sm rounded-sm border border-gray-100 group hover:border-[#c4a47c] transition-colors">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[#c4a47c]">
                    <LuCheck className="text-[#c4a47c] w-5 h-5" />
                  </div>
                  <span className="text-lg text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <blockquote className="border-l-4 border-[#c4a47c] pl-6 py-2 bg-white/50">
              <p className="text-gray-500 italic text-xl leading-relaxed font-light">
                &quot;Our team helps you match materials so your kitchen looks cohesive and well designed.&quot;
              </p>
            </blockquote>
          </div>

          {/* Right Side: Showroom Experience Card */}
          <div className="space-y-6">
            <div className="relative h-[350px] w-full shadow-2xl rounded-sm overflow-hidden border border-gray-100 bg-white">
              {/* Use the standard content image */}
              <img src={contentImage} alt="Kitchen Showroom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
                <button className="w-full bg-red-600 hover:bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg">
                  Plan Your Visit
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}