import React from 'react';
import Image from 'next/image';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BiBuildingHouse, BiDollarCircle, BiPackage } from 'react-icons/bi';
import { TbTruck, TbHammer } from 'react-icons/tb';
import { getPageContent } from '@/lib/actions';
import ResponsiveHero from '@/components/ui/ResponsiveHero';

export default async function ContractorsPage() {
  const content = await getPageContent('contractors');

  const benefits = [
    { name: 'Reliable material availability', icon: BiBuildingHouse },
    { name: 'Contractor pricing options', icon: BiDollarCircle },
    { name: 'Bulk supply', icon: BiPackage },
    { name: 'Quick warehouse pickup', icon: TbTruck },
  ];

  const defaultHero = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2070&auto=format&fit=crop";
  const contentImage = content?.contentUrl || "https://images.unsplash.com/photo-1596701140306-385002030e46?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#F4F1EE]  font-[arial]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white px-6 overflow-hidden">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl=""
          alt="Contractor Background"
          brightness="brightness-[0.25]"
        />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center gap-4 bg-[#212121]/80 backdrop-blur-md inline-flex self-center py-2 px-6 border border-white/10 rounded-full">
            <TbHammer className="text-[#a68966] w-5 h-5" />
            <span className="text-gray-200 text-[10px] font-black uppercase tracking-[0.2em]">{content?.title || "Contractor Logistics Center"}</span>
          </div>

          {/* Dynamic Hero Text Dot-List */}
          {content?.heroText && (
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {content.heroText.split(/[•·,]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0).map((item: string, index: number, arr: any[]) => (
                <React.Fragment key={item}>
                  <span className="text-[#a68966] font-black text-[10px] uppercase tracking-[0.3em]">
                    {item}
                  </span>
                  {index < arr.length - 1 && (
                    <span className="text-[#a68966] text-lg px-2">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="space-y-6 text-center">
            <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white ">
              {content?.title || "Contractor Supply Warehouse"}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {content?.description || "Southern Design Warehouse is built to support contractors, builders, and remodelers. We provide a reliable supply of remodeling materials used in kitchens, bathrooms, and interior renovation projects."}
            </p>
          </div>

          
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24">
        {/* benefits content... */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-20 xl:items-start">

          <div className="flex flex-col gap-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight uppercase tracking-tighter italic">
              Professional <br /> Partnerships
            </h2>
            <div className="w-20 h-1.5 bg-[#a68966]" />

            <ul className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <li key={index} className="flex items-center group">
                    <div className="flex flex-1 items-center gap-5 p-8 bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#a68966] cursor-default">
                      <div className="w-12 h-12 rounded bg-[#F9F8F6] border border-gray-50 flex items-center justify-center text-[#a68966] group-hover:bg-[#a68966] group-hover:text-white transition-all">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[14px] font-black uppercase tracking-widest text-gray-800">{benefit.name}</span>
                      <HiOutlineArrowRight className="text-gray-300 w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Partnership Box - SIZE FIX */}
          <div className="bg-[#EAE7DE] p-12 flex flex-col gap-10 text-left relative overflow-hidden shadow-sm border border-gray-200/50">
            <div className="absolute top-0 right-0 w-4 h-full bg-[#2d4a3e]" />

            <div className="w-full relative h-[350px] shadow-xl overflow-hidden group border border-white/20 bg-white">
              <img
                src={contentImage}
                alt="Contractor professional"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div className="space-y-5">
              <h3 className="text-3xl font-bold text-gray-900 leading-tight uppercase tracking-tight italic">
                Sustainable Supply <br /> Chain
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-lg font-medium">
                We believe in building long term relationships with contractors who need consistent supply and dependable service. Our warehouse pickup is optimized for speed.
              </p>
            </div>

            <div className="w-full border-t border-gray-300 pt-10 mt-2 space-y-6">
              <span className="text-[#a68966] text-[10px] uppercase tracking-[0.2em] font-black italic">Contractor Quote Request:</span>
              <p className="text-gray-700 text-sm max-w-sm font-medium">
                Need materials for your next project? Submit a contractor quote request and our team will respond quickly.
              </p>

              <button className="w-full bg-[#2d4a3e] hover:bg-black text-white py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl active:scale-95 transition-all">
                Request Enterprise Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}