import React from 'react';
import Link from 'next/link';
import { 
  Grid3X3, 
  Layout, 
  Layers, 
  DoorOpen, 
  Square, 
  MousePointer2, 
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { Ruler, Lightbulb, MessageSquare, Microscope, NotebookPen } from 'lucide-react';
import { Maximize2, Map, Navigation, Info } from 'lucide-react';
import { 
  Maximize, 
  Droplets, 
  Palette, 
  Settings2,
  PhoneCall,
  CalendarCheck
} from 'lucide-react';
import { getPageContent } from '@/lib/actions';
import { ArrowRight } from 'lucide-react';
import ResponsiveHero from '@/components/ui/ResponsiveHero';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default async function ShowroomPage() {
  const content = await getPageContent('showroom');

  const dynamicCategories = content?.heroText
    ? content.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : [
      "Kitchen Displays",
      "Bathroom Settings",
      "Flooring Gallery",
      "Material Samples",
      "Design Center"
    ];

  const defaultHero = "https://images.unsplash.com/photo-1600585154526-990dcea4db0d?q=80&w=2000&auto=format&fit=crop";


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
          priority={true}
        />

        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white ">
            {content?.title || "Our Design Showroom"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {content?.description || "Experience the quality and craftsmanship of Southern Design Warehouse in person. Our showroom features curated displays designed to inspire your next home transformation."}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {dynamicCategories.map((item: string) => (
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

      
      {/* --- EXPERIENCE SECTION --- */}
<section className="bg-gray-100 py-28 px-6 md:px-12 lg:px-24">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-stretch">

    {/* LEFT SIDE: EXPLORATION */}
    <div className="flex flex-col justify-between">
      <div className="mb-12">
        <span className="text-red-600 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
          In-Store Experience
        </span>
        {/* YOUR SPECIFIC TITLE CLASSES APPLIED HERE */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-gray-900">
          What You <br /> 
          <span className="text-gray-400">Can Explore</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { name: "Flooring", icon: <Grid3X3 /> },
          { name: "Cabinets", icon: <Layout /> },
          { name: "Tiles", icon: <Layers /> },
          { name: "Vanities", icon: <DoorOpen /> },
          { name: "Granite", icon: <Square /> },
          { name: "Wall panels", icon: <MousePointer2 /> }
        ].map((item, index) => (
          <div
            key={index}
            className="group bg-white p-8 flex items-center justify-between border border-gray-200 hover:border-red-600 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-gray-400 group-hover:text-red-600 transition-colors">
                {React.cloneElement(item.icon, { size: 20, strokeWidth: 2 })}
              </div>
              <span className="text-gray-900 text-[13px] font-black uppercase tracking-widest">
                {item.name}
              </span>
            </div>
            <ArrowUpRight className="text-gray-200 group-hover:text-red-600 transition-colors" size={18} />
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT SIDE: BENEFITS CARD */}
    <div className="bg-white p-10 md:p-16 border border-gray-200 relative flex flex-col justify-between shadow-2xl">
      
      {/* BRAND ACCENTS */}
      <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
      <div className="absolute top-0 right-0 w-2 h-full bg-green-700" />

      <div>
        <h3 className="text-2xl font-black text-gray-900 uppercase mb-12 tracking-tight flex items-center gap-4">
          <span className="w-8 h-[2px] bg-red-600" />
          Showroom Benefits
        </h3>

        <div className="space-y-12">
          {[
            "Compare materials side by side",
            "Get guidance from specialists",
            "Find design inspiration"
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-8 group">
              <span className="text-4xl font-black text-gray-100 group-hover:text-red-600/10 transition-colors duration-500 italic">
                0{index + 1}
              </span>
              <div className="pt-2">
                <p className="text-gray-800 text-lg font-bold uppercase leading-tight tracking-tight">
                  {item}
                </p>
                <div className="w-0 h-[3px] bg-green-700 mt-3 group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link 
        href="/contact#quote-form"
        className="mt-16 w-full bg-green-700 hover:bg-gray-900 text-white py-6 px-10 flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-[10px] transition-all group"
      >
        <Calendar size={16} className="group-hover:rotate-12 transition-transform" />
        Schedule a Visit
      </Link>

    </div>
  </div>
</section>


     {/* --- FEATURED DISPLAYS SECTION --- */}
<section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
  <div className="max-w-7xl mx-auto">
    
    {/* HEADER WITH YOUR SPECIFIC TYPOGRAPHY */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
      <div className="max-w-3xl">
        <div className="w-20 h-2 bg-red-600 mb-6" />
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-gray-900">
          Featured <br /> 
          <span className="text-gray-400">Showroom Displays</span>
        </h2>
      </div>
      <p className="text-gray-600 max-w-sm text-lg font-medium leading-tight">
        Explore our curated displays showcasing complete professional design solutions for contractors.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          title: 'Kitchen Gallery',
          description: 'Complete kitchen setups with cabinetry, countertops, and appliances.',
          features: 'Contemporary • Traditional • Modern Farmhouse',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop'
        },
        {
          title: 'Bathroom Showroom',
          description: 'Full bathroom displays with vanities, fixtures, and tile combinations.',
          features: 'Spa style • Classic • Minimalist designs',
          image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2070&auto=format&fit=crop'
        },
        {
          title: 'Flooring Center',
          description: 'Extensive selection of flooring materials for every room and style.',
          features: 'Tile • Wood • Laminate • Natural Stone',
          image: 'https://images.unsplash.com/photo-1581850518616-bcb8186c3f30?q=80&w=2070&auto=format&fit=crop'
        }
      ].map((display, index) => (
        <div key={index} className="bg-gray-100 border-l-4 border-l-transparent hover:border-l-red-600 transition-all duration-500 group shadow-sm">
          {/* IMAGE CONTAINER */}
          <div className="relative h-80 overflow-hidden">
            <OptimizedImage
              src={display.image}
              alt={display.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0 transition-all duration-700"
            />
            {/* INDUSTRIAL OVERLAY */}
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-all duration-500" />
            
            {/* FLOATING TAG */}
            <div className="absolute top-4 right-4 bg-white px-3 py-1">
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-900">Live Display</span>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="p-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{display.title}</h3>
              <ArrowRight className="text-red-600 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" size={24} />
            </div>
            
            <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
              {display.description}
            </p>

            <div className="pt-6 border-t border-gray-300 relative">
              {/* GREEN ACCENT LINE ON HOVER */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-green-700 group-hover:w-full transition-all duration-700" />
              
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-2 block">
                Styles Available:
              </span>
              <p className="text-gray-900 text-xs font-bold uppercase tracking-tight">
                {display.features}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


     {/* --- SHOWROOM EXPERIENCE TIPS SECTION --- */}
<section className="py-28 px-6 md:px-12 lg:px-24 bg-gray-100">
  <div className="max-w-7xl mx-auto">
    
    {/* HEADER WITH YOUR SPECIFIC TYPOGRAPHY */}
    <div className="mb-20">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-[2px] bg-red-600" />
        <span className="text-red-600 font-black uppercase tracking-[0.3em] text-xs">Expert Advice</span>
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-gray-900">
        Get the Most <br /> 
        <span className="text-gray-400">From Your Visit</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
      {[
        {
          number: '01',
          title: 'Take Measurements',
          description: 'Bring measurements of your space and take photos with your phone. This helps our team make accurate recommendations.',
          icon: <Ruler size={20} />
        },
        {
          number: '02',
          title: 'Gather Inspiration',
          description: 'Walk through our displays and take notes on colors, materials, and layouts that appeal to you and your style.',
          icon: <Lightbulb size={20} />
        },
        {
          number: '03',
          title: 'Ask Questions',
          description: 'Our material specialists are available to discuss durability, maintenance, and how to coordinate different products.',
          icon: <MessageSquare size={20} />
        },
        {
          number: '04',
          title: 'Compare Materials',
          description: 'See materials side-by-side in natural light. Touch and feel finishes to understand their texture and quality.',
          icon: <Microscope size={20} />
        },
        {
          number: '05',
          title: 'Get Samples',
          description: 'Take home samples of materials you love to see how they look in your actual space and lighting conditions.',
          icon: <NotebookPen size={20} />
        },
        {
          number: '06',
          title: 'Schedule Design Help',
          description: 'Book a design consultation to work one-on-one with our team and create a detailed plan for your project.',
          icon: <Calendar size={20} />
        }
      ].map((tip, index) => (
        <div key={index} className="flex gap-8 group">
          {/* INDUSTRIAL SQUARE NUMBER BOX */}
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center text-gray-900 font-black text-xl relative z-10 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
              {tip.number}
            </div>
            {/* DECORATIVE OFFSET SQUARE */}
            <div className="absolute top-2 left-2 w-16 h-16 bg-green-700/10 group-hover:bg-green-700 transition-colors duration-300" />
          </div>

          <div className="flex-1 pt-2">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-red-600 group-hover:scale-110 transition-transform">
                 {tip.icon}
               </span>
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                 {tip.title}
               </h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm font-medium max-w-md">
              {tip.description}
            </p>
            {/* HOVER LINE */}
            <div className="w-0 h-[2px] bg-red-600 mt-4 group-hover:w-full transition-all duration-700" />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* --- VIRTUAL SHOWROOM SECTION --- */}
<section className="py-28 px-6 md:px-12 lg:px-24 bg-gray-100">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
    
    {/* LEFT SIDE: INTERACTIVE IMAGE */}
    <div className="relative group overflow-hidden border-8 border-white shadow-2xl">
      <div className="relative h-[600px] w-full">
        <OptimizedImage 
          src="images/20260225_092039.webp" 
          alt="Showroom Layout"
          fill
          className="object-cover  transition-all duration-1000 group-hover:scale-105"
        />
        {/* INTERACTIVE HOTSPOTS (Visual purely for design) */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-600 rounded-full animate-ping" />
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-green-700 rounded-full animate-ping" />
        
        {/* OVERLAY LABEL */}
        <div className="absolute bottom-10 left-10 bg-gray-900 text-white p-6 inline-block">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-red-600">Now Online</p>
          <h3 className="text-xl font-black uppercase tracking-tighter">360° Virtual Walkthrough</h3>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE: CONTENT */}
    <div className="flex flex-col justify-center">
      <div className="mb-12">
        <div className="w-16 h-2 bg-green-700 mb-8" />
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-gray-900">
          Digital <br /> 
          <span className="text-gray-400">Navigation</span>
        </h2>
      </div>

      <div className="space-y-8 mb-12">
        {[
          { 
            title: "Pre-Visit Planning", 
            desc: "Browse our 15,000 sq.ft facility layout digitally to locate specific material zones before your arrival.",
            icon: <Map size={24} />
          },
          { 
            title: "Navigation Guide", 
            desc: "Use your mouse to rotate the 360° view and click on floor icons or hotspots to move through the space seamlessly.",
            icon: <MousePointer2 size={24} />
          },
          { 
            title: "Interactive Zones", 
            desc: "Click through high-resolution 360° views of our Kitchen, Bath, and Flooring galleries.",
            icon: <Maximize2 size={24} />
          }
        ].map((feature, i) => (
          <div key={i} className="flex gap-6 group">
            <div className="text-red-600 mt-1 transition-transform group-hover:rotate-12">
              {feature.icon}
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-sm">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <a 
          href={content?.virtualTourUrl || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 bg-gray-900 hover:bg-red-600 text-white py-6 px-12 font-black uppercase tracking-widest text-xs transition-all shadow-xl w-fit group"
        >
          Launch Virtual Tour
          <Navigation size={18} className="group-hover:translate-x-2 transition-transform" />
        </a>

        <div className="flex items-center gap-2 group/help cursor-help">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover/help:border-red-600 group-hover/help:text-red-600 transition-all">
            <Info size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-none mb-1">How to use?</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Click & Drag to explore</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

     {/* --- MATERIAL LIBRARY SECTION --- */}
<section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
  <div className="max-w-7xl mx-auto">
    
    {/* HEADER WITH 6XL TYPOGRAPHY */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
      <div className="max-w-3xl">
        <div className="w-20 h-2 bg-red-600 mb-6" />
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-gray-900">
          Our Material <br /> 
          <span className="text-gray-400">Library</span>
        </h2>
      </div>
      <p className="text-gray-600 max-w-sm text-lg font-medium leading-tight">
        A comprehensive inventory of over 3,000 SKUs curated for high-end professional builds.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: <Grid3X3 />, label: 'Tiles & Stone', count: '800+ Options', image: 'https://images.unsplash.com/photo-1565183000204-6b143ee7b2a0?q=80&w=2000' },
        { icon: <Layout />, label: 'Cabinetry', count: '500+ Styles', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2000' },
        { icon: <Maximize />, label: 'Countertops', count: '320+ Designs', image: 'https://images.unsplash.com/photo-1568762868663-67ebf45b8272?q=80&w=2000' },
        { icon: <Layers />, label: 'Flooring', count: '450+ Products', image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?q=80&w=2000' },
        { icon: <Droplets />, label: 'Fixtures', count: '280+ Selections', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2000' },
        { icon: <Lightbulb />, label: 'Lighting', count: '220+ Fixtures', image: 'https://images.unsplash.com/photo-1565807666665-72d6d13f3d3b?q=80&w=2000' },
        { icon: <Palette />, label: 'Paint & Stains', count: '300+ Colors', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2000' },
        { icon: <Settings2 />, label: 'Hardware', count: '400+ Items', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000' }
      ].map((material, index) => (
        <button key={index} className="group relative bg-gray-100 h-[320px] overflow-hidden border border-gray-100 transition-all duration-500">
          {/* Background Image with Desaturation */}
          <div className="absolute inset-0  transition-all duration-700 ">
            <OptimizedImage
              src={material.image}
              alt={material.label}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full p-8 flex flex-col items-center justify-center text-center">
            <div className="text-red-600 mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
              {React.cloneElement(material.icon, { size: 48, strokeWidth: 1 })}
            </div>
            <h3 className="font-black text-gray-900 uppercase text-sm tracking-[0.2em] mb-2">{material.label}</h3>
            <p className="text-[10px] font-black text-green-500 tracking-[0.3em] uppercase">{material.count}</p>
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-red-600 group-hover:w-full transition-all duration-500" />
        </button>
      ))}
    </div>
  </div>
</section>

{/* --- FINAL CTA SECTION --- */}
<section className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
  {/* Background with Dark Industrial Overlay */}
  <div className="absolute inset-0">
    <OptimizedImage 
      src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" 
      alt="Showroom interior" 
      fill 
      className="object-cover" 
    />
    <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply" />
    <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent" />
  </div>

  <div className="max-w-5xl mx-auto text-center relative z-10">
    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-white mb-8">
      Plan Your <span className="text-red-600">Showroom</span> Visit
    </h2>
    <p className="text-lg text-gray-300 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
      Experience the textures, weights, and finishes in person. Our material specialists are standing by to coordinate your next logistics run or design consultation.
    </p>
    
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Link 
        href="/contact#quote-form"
        className="bg-red-600 hover:bg-white hover:text-red-600 text-white py-6 px-12 font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-3"
      >
        <CalendarCheck size={18} />
        Schedule Visit
      </Link>
      
      <Link 
        href="/contact"
        className="border border-green-700 text-green-500 hover:bg-green-700 hover:text-white py-6 px-12 font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3"
      >
        <PhoneCall size={18} />
        Contact Us
      </Link>
    </div>
  </div>
</section>
    </div>
  );
}