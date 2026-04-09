import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  const dynamicMaterials = content?.heroText
    ? content.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : ["Reliability", "Pricing", "Bulk Supply", "Pickup"];

  const contentImage = content?.contentUrl || "/images/contractors2.jpg";

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

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center gap-4 bg-[#212121]/80 backdrop-blur-md inline-flex self-center py-2 px-6 border border-white/10 rounded-full">
            <TbHammer className="text-[#a68966] w-5 h-5" />
            <span className="text-gray-200 text-[10px] font-black uppercase tracking-[0.2em]">{content?.title || "Contractor Logistics Center"}</span>
          </div>

          <div className="space-y-6 text-center">
            <h1 className="text-3xl md:text-6xl font-bold  uppercase  text-white ">
              {content?.title || "Contractor Supply Warehouse"}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {content?.description || "Southern Design Warehouse is built to support contractors, builders, and remodelers. We provide a reliable supply of remodeling materials used in kitchens, bathrooms, and interior renovation projects."}
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
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24">
        {/* benefits content... */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-20 xl:items-start">

          <div className="flex flex-col gap-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight uppercase">
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
              <Image
                src={contentImage}
                alt="Contractor professional"
                fill
                sizes="(max-width: 1280px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div className="space-y-5">
              <h3 className="text-3xl font-bold text-gray-900 leading-tight uppercase ">
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

              <Link href="/#quotation-form" className="w-full inline-flex items-center justify-center bg-[#2d4a3e] hover:bg-black text-white py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl active:scale-95 transition-all">
                Request Enterprise Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Simple process designed for contractor convenience and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Quote', description: 'Submit your material requirements through our online quote request form' },
              { step: '02', title: 'Review & Quote', description: 'Our team reviews your project details and provides pricing within 24 hours' },
              { step: '03', title: 'Confirm Order', description: 'Approve the quote and confirm your order with preferred delivery method' },
              { step: '04', title: 'Quick Delivery', description: 'Receive materials on schedule with reliable warehouse pickup option' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[#F4F1EE] p-8 text-center border border-gray-200 hover:border-[#a68966] transition-all">
                  <div className="text-5xl font-black text-[#a68966] mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 uppercase mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED SERVICES SECTION --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-[#F4F1EE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Comprehensive solutions tailored for contractor needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏗️', title: 'Kitchen Materials', description: 'Cabinets, countertops, fixtures, and all kitchen renovation supplies' },
              { icon: '🚿', title: 'Bathroom Fixtures', description: 'Vanities, tiles, fixtures, and complete bathroom remodeling solutions' },
              { icon: '📦', title: 'Bulk Supply', description: 'Large quantity orders with special contractor pricing and delivery options' },
              { icon: '🚚', title: 'Fast Delivery', description: 'Quick turnaround with flexible warehouse pickup and delivery scheduling' },
              { icon: '💰', title: 'Contractor Pricing', description: 'Competitive rates and volume discounts for ongoing partnership' },
              { icon: '📞', title: '24/7 Support', description: 'Dedicated account support for your project needs and inquiries' }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 uppercase mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#2d4a3e]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of contractors who trust Southern Design Warehouse for their material supply needs. Submit a quote request today and experience our reliable service.
          </p>
          <Link href="/#quotation-form" className="inline-flex items-center gap-3 bg-[#a68966] hover:bg-[#956a4d] text-white py-5 px-12 font-bold uppercase tracking-[0.1em] text-sm transition-all shadow-lg">
            Request Your Quote Now
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}