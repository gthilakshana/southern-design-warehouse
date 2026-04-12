import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BiBuildingHouse, BiDollarCircle, BiPackage } from 'react-icons/bi';
import { TbTruck } from 'react-icons/tb';
import { getPageContent } from '@/lib/actions';
import contentImage1 from "@/public/images/warehouse1.webp";
import ResponsiveHero from '@/components/ui/ResponsiveHero';
import { 
  Cylinder, 
  Bath, 
  Package, 
  Truck, 
  Tag, 
  Headphones 
} from 'lucide-react';
import { Layers, Hammer, ShieldCheck } from 'lucide-react';

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
          priority={true}
        />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          

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
<section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-20 xl:items-start">

    <div className="flex flex-col gap-10">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight uppercase">
        Professional <br /> Partnerships
      </h2>
      {/* Accent Bar changed to Red-600 */}
      <div className="w-20 h-1.5 bg-red-600" />

      <ul className="space-y-6">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <li key={index} className="flex items-center group">
              {/* Border and hover focus updated to Red-600 */}
              <div className="flex flex-1 items-center gap-5 p-8 bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-red-600 cursor-default">
                {/* Icon box uses Gray-100 and Red-600 highlights */}
                <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
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

    {/* Partnership Box - Background changed to Gray-100 for warehouse feel */}
    <div className="bg-gray-100 p-12 flex flex-col gap-10 text-left relative overflow-hidden shadow-sm border border-gray-200">
      {/* Side accent changed to Green-700 */}
      <div className="absolute top-0 right-0 w-4 h-full bg-green-700" />

      <div className="w-full relative h-[350px] shadow-xl overflow-hidden group border border-white bg-white">
        <Image
  src={contentImage1}
  alt="Professional warehouse contractor reviewing logistics" // Use descriptive ALT text for SEO
  fill // Uses the parent container size
  priority // Add this if the image is "above the fold" (visible on page load)
  quality={85} // Balance between file size and clarity (default is 75)
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw" // Tells the browser which size to download
  className="object-cover transition-transform duration-1000 group-hover:scale-105"
  placeholder="blur" 
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
        {/* Quote text changed to Red-600 for attention */}
        <span className="text-red-600 text-[10px] uppercase tracking-[0.2em] font-black italic">Contractor Quote Request:</span>
        <p className="text-gray-700 text-sm max-w-sm font-medium">
          Need materials for your next project? Submit a contractor quote request and our team will respond quickly.
        </p>

        {/* Button updated to Green-700 with a dark hover */}
        <Link 
          href="/#quotation-form" 
          className="w-full inline-flex items-center justify-center bg-green-700 hover:bg-gray-900 text-white py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl active:scale-95 transition-all"
        >
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
      <div className="w-20 h-1.5 bg-red-600 mx-auto mb-8" /> {/* Consistent Red accent bar */}
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
        <div key={index} className="relative group">
          {/* Background changed to gray-100, hover border to green-700 */}
          <div className="bg-gray-100 p-8 text-center border border-gray-200 hover:border-green-700 hover:bg-white transition-all duration-300 h-full shadow-sm hover:shadow-xl">
            
            {/* Step Number updated to Red-600 */}
            <div className="text-5xl font-black text-red-600 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {item.step}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 uppercase mb-3">
              {item.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>

            {/* Bottom highlight bar that appears on hover */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-700 transition-all duration-300 group-hover:w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* --- MATERIAL SHOWCASE SECTION --- */}
<section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
      <div className="max-w-2xl">
        <span className="text-red-600 font-black uppercase tracking-[0.3em] text-xs">Premium Inventory</span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mt-4">Warehouse Categories</h2>
      </div>
      <p className="text-gray-600 font-medium max-w-md">
        Explore our bulk-ready inventory specifically curated for large-scale residential and commercial builds.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Category 1: Flooring */}
      <div className="group relative h-[500px] overflow-hidden bg-gray-900 shadow-2xl">
        <Image 
          src="https://images.unsplash.com/photo-1581850518616-bcb8186c3f30?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Flooring Materials"
          fill
          className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-10 text-white">
          <div className="flex items-center gap-3 mb-4">
             <Layers className="text-red-600" size={24} />
             <span className="uppercase tracking-widest text-sm font-bold">In-Stock Now</span>
          </div>
          <h3 className="text-3xl font-bold uppercase mb-4">Hardwood & Tile Bulk</h3>
          <p className="text-gray-300 mb-6 max-w-sm">Durable, high-traffic rated materials for multi-unit developments and commercial spaces.</p>
          <div className="w-12 h-1 bg-red-600" />
        </div>
      </div>

      {/* Category 2: Cabinetry */}
      <div className="group relative h-[500px] overflow-hidden bg-gray-900 shadow-2xl">
        <Image 
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop" 
          alt="Custom Cabinetry"
          fill
          className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-10 text-white">
          <div className="flex items-center gap-3 mb-4">
             <Hammer className="text-green-500" size={24} />
             <span className="uppercase tracking-widest text-sm font-bold">Custom Orders</span>
          </div>
          <h3 className="text-3xl font-bold uppercase mb-4">Modern Kitchen Systems</h3>
          <p className="text-gray-300 mb-6 max-w-sm">Semi-custom and stock cabinetry options with quick-ship delivery for tight timelines.</p>
          <div className="w-12 h-1 bg-green-700" />
        </div>
      </div>
    </div>
    
  {/* Trust Bar - Updated to 2 columns */}
<div className="mt-20 py-10 border-y border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
   
   {/* Item 1 */}
   <div className="flex flex-col items-center gap-2 border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
      <ShieldCheck className="text-green-700" size={32} />
      <span className="font-bold uppercase text-gray-900 tracking-tight">
        Warranty Guaranteed
      </span>
   </div>

   {/* Item 2 */}
   <div className="flex flex-col items-center gap-2">
      <span className="text-2xl font-black text-gray-900">24HR</span>
      <span className="font-bold uppercase text-gray-500 text-sm tracking-tight">
        Pickup Readiness
      </span>
   </div>

</div>
  </div>
</section>

      {/* --- FEATURED SERVICES SECTION --- */}
<section className="py-28 px-6 md:px-12 lg:px-24 bg-gray-100">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase mb-6">What We Offer</h2>
      <div className="w-20 h-1.5 bg-red-600 mx-auto mb-6" />
      <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
        Comprehensive solutions tailored for contractor needs
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: <Cylinder />, title: 'Kitchen Materials', description: 'Cabinets, countertops, fixtures, and all kitchen renovation supplies' },
        { icon: <Bath />, title: 'Bathroom Fixtures', description: 'Vanities, tiles, fixtures, and complete bathroom remodeling solutions' },
        { icon: <Package />, title: 'Bulk Supply', description: 'Large quantity orders with special contractor pricing and delivery options' },
        { icon: <Truck />, title: 'Fast Delivery', description: 'Quick turnaround with flexible warehouse pickup and delivery scheduling' },
        { icon: <Tag />, title: 'Contractor Pricing', description: 'Competitive rates and volume discounts for ongoing partnership' },
        { icon: <Headphones />, title: '24/7 Support', description: 'Dedicated account support for your project needs and inquiries' }
      ].map((service, index) => (
        <div key={index} className="bg-white p-10 border border-gray-200 hover:border-red-600 transition-all group relative overflow-hidden shadow-sm">
          {/* Subtle Icon Background Accent */}
          <div className="text-red-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
            {/* Rendering the React Icon with a standard size */}
            {React.cloneElement(service.icon, { size: 40, strokeWidth: 1.5 })}
          </div>
          <h3 className="text-xl font-bold text-gray-900 uppercase mb-3">{service.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
          
          {/* Hover Decorative Element */}
          <div className="absolute top-0 right-0 w-2 h-0 bg-red-600 group-hover:h-full transition-all duration-300" />
        </div>
      ))}
    </div>
  </div>
</section>
     {/* --- CTA SECTION --- */}
<section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
  {/* Unsplash Background Image with Overlay */}
  <div className="absolute inset-0 z-0">
    <Image 
      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
      alt="Warehouse background"
      fill
      className="object-cover"
    />
    {/* Dark Green-700 Overlay for readability */}
    <div className="absolute inset-0 bg-green-700/90 mix-blend-multiply" />
  </div>

  <div className="max-w-4xl mx-auto text-center text-white relative z-10">
    <h2 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
      Ready to Get <span className="text-red-500">Started?</span>
    </h2>
    <p className="text-lg text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
      Join hundreds of contractors who trust Southern Design Warehouse for their material supply needs. Submit a quote request today.
    </p>
    
    <Link 
      href="/#quotation-form" 
      className="inline-flex items-center gap-4 bg-red-600 hover:bg-white hover:text-red-600 text-white py-6 px-14 font-black uppercase tracking-widest text-sm transition-all shadow-2xl active:scale-95"
    >
      Request Your Quote Now
      <HiOutlineArrowRight className="w-6 h-6" />
    </Link>
  </div>
</section>
    </div>
  );
}