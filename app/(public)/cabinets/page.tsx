import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbMessageDots, TbArmchair } from 'react-icons/tb';
import { getPageContent } from '@/lib/actions';
import ResponsiveHero from '@/components/ui/ResponsiveHero';

export default async function CabinetsPage() {
  const content = await getPageContent('cabinets');

  const dynamicMaterials = content?.heroText
    ? content.heroText.split(/[•·,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : [
      "Kitchen Cabinets",
      "Storage Solutions",
      "Custom Vanities",
      "Hardware & Handles",
      "Cabinet Finishes"
    ];

  const contentImage = content?.contentUrl || "/cabinets/img1.webp";

  return (
    <div className="min-h-screen bg-[#F4F1EE] font-[arial]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white px-6">
        <ResponsiveHero
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl="https://images.unsplash.com/photo-1556911220-e152081230f8?w=1920&q=80"
          alt="Modern Cabinet Design"
          brightness="brightness-[0.25]"
          priority={true}
        />

        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter text-white">
            {content?.title || "Custom Cabinetry Solutions"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {content?.description || "High-quality cabinetry defines the character and functionality of your home. We provide versatile solutions for kitchens, bathrooms, and living spaces."}
          </p>
        </div>
      </section>

   {/* --- CABINETRY DESIGN CONSULTATION: 4-IMAGE GRID UPDATE --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
  {/* Architectural Offset Background */}
  <div className="absolute top-0 right-0 w-1/4 h-full bg-[#fcfcfc] -z-0 hidden lg:block" />

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

      {/* LEFT SIDE: Technical Text & CTA */}
      <div className="lg:col-span-5 space-y-12">
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[2px] bg-red-600" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-red-600">Design Excellence</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl  font-bold text-gray-900 uppercase leading-none tracking-tighter">
            System <br />
            <span className="font-serif italic lowercase font-light text-red-600 tracking-normal">Architecture</span>
          </h2>

          <div className="w-20 h-1 bg-black" />

          <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-light max-w-md">
            Our specialists navigate door geometries and tactile finishes to engineer the perfect storage environment. We focus on <span className="text-red-600 font-medium">maximum efficiency</span> without compromising structural elegance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full gap-4">
          <Link href="/contact" className="flex-1">
            <button className="w-full h-[80px] bg-black text-white px-8 font-bold uppercase tracking-[0.3em] text-[10px] transition-all relative overflow-hidden group shadow-xl active:scale-95">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Connect With Designer</span>
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>

          <Link href="/showroom" className="flex-1">
            <button className="w-full h-[80px] border-2 border-red-600 text-red-600 px-8 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-red-600 hover:text-white transition-all active:scale-95">
              Explore Showroom
            </button>
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: 4-IMAGE BOX GRID */}
      <div className="lg:col-span-7 relative">
        <div className="grid grid-cols-2 gap-4">
          {/* Large Main Image */}
          <div className="relative h-[300px] md:h-[400px] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=800"
              alt="Cabinet detail 1"
              fill
              className="object-cover  transition-all duration-700"
            />
          </div>
          {/* Vertical Detail Image */}
          <div className="relative h-[300px] md:h-[400px] mt-8 overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1556909211-36987daf7b4d?q=80&w=800"
              alt="Cabinet detail 2"
              fill
              className="object-cover  transition-all duration-700"
            />
          </div>
          {/* Lower Image 1 */}
          <div className="relative h-[250px] md:h-[350px] -mt-8 overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800"
              alt="Cabinet detail 3"
              fill
              className="object-cover  transition-all duration-700"
            />
          </div>
          {/* Lower Image 2 */}
          <div className="relative h-[250px] md:h-[350px] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800"
              alt="Cabinet detail 4"
              fill
              className="object-cover transition-all duration-700"
            />
          </div>
        </div>

        {/* Floating Material Index Card (Re-positioned for Grid) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 md:p-12 shadow-[30px_30px_80px_rgba(0,0,0,0.15)] border-l-8 border-red-600 w-[85%] lg:w-[480px] z-20">
          <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
            Material <span className="font-serif italic lowercase font-light text-red-600">Specifications</span>
          </h3>

          <div className="space-y-4">
            {['Hardwood Oak', 'Matte Finish', 'Soft-Close', 'Precision Hinges'].map((item, index) => (
              <div key={index} className="flex items-center justify-between group border-b border-gray-50 pb-2">
                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] group-hover:text-red-600 transition-colors">{item}</span>
                <span className="text-[10px] font-mono text-gray-300">0{index + 1}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[8px] font-mono text-gray-400 uppercase tracking-[0.4em]">
            * Engineered Systems
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

    {/* --- FEATURED CABINET STYLES: MINIMAL GALLERY UPDATE --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    
    {/* Section Header with Brand Typography */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[2px] w-8 bg-red-600" />
          <span className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase font-bold">Catalogue 2026</span>
        </div>
        <h2 className="text-4xl md:text-6xl  font-bold text-gray-900 uppercase leading-none tracking-tighter">
          Cabinet <br /> 
          <span className="font-serif italic lowercase font-light text-red-600 tracking-normal">Styles</span>
        </h2>
      </div>
      <p className="text-gray-400 max-w-sm text-sm font-medium leading-relaxed border-l border-gray-100 pl-6">
        Curated design languages from timeless geometries to ultra-modern seamless systems.
      </p>
    </div>

    {/* Elegant Full-Height Gallery Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[700px]">
      {[
        {
          title: 'Shaker',
          num: '01',
          description: 'Timeless cabinetry with clean lines that complement both traditional and modern homes.',
          features: ['Flat panels', 'Minimalist', 'Clean edges'],
          image: '/cabinets/img7.webp'
        },
        {
          title: 'Flat',
          num: '02',
          description: 'Sleek, handle-less designs for a seamless, high-performance architectural look.',
          features: ['High-gloss', 'Push-to-open', 'Modern'],
          image: '/cabinets/img8.webp'
        },
        {
          title: 'Raised',
          num: '03',
          description: 'Sophisticated cabinetry with intricate detailing for a classic heritage aesthetic.',
          features: ['Detailed profiles', 'Antique', 'Traditional'],
          image: '/cabinets/img9.webp'
        },
      ].map((style, index) => (
        <div key={index} className="group relative w-full h-[500px] md:h-full overflow-hidden bg-gray-900">
          
          {/* Main Style Image */}
          <Image
            src={style.image}
            alt={style.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-all duration-[1.5s] ease-out  group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />

          {/* Static Title (Always Visible) */}
          <div className="absolute inset-x-0 bottom-0 p-10 z-10 group-hover:translate-y-full transition-transform duration-500">
            <span className="text-red-600 font-mono text-[12px] font-bold block mb-2">/ {style.num}</span>
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{style.title}</h3>
          </div>

          {/* Hover Overlay Content */}
          <div className="absolute inset-0 bg-red-600/95 p-12 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
            <span className="text-white/40 font-mono text-5xl font-black mb-6 italic">{style.num}</span>
            
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
              {style.title} <br/> <span className="text-2xl font-serif italic lowercase font-light">Design</span>
            </h3>
            
            <p className="text-white/90 text-sm font-medium leading-relaxed mb-8">
              {style.description}
            </p>

            <div className="space-y-3 pt-6 border-t border-white/20">
              {style.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-[10px] text-white font-mono uppercase tracking-widest">{feat}</span>
                </div>
              ))}
            </div>
            
            <button className="mt-12 w-fit border-b-2 border-white text-white text-[10px] font-black uppercase tracking-[0.3em] pb-1 hover:text-black hover:border-black transition-colors">
              View Collection
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* --- CABINET SELECTION TIPS: TECHNICAL ARCHITECTURE UPDATE --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-white border-t border-gray-100">
  <div className="max-w-7xl mx-auto">
    
    {/* Section Header with requested Font Hierarchy */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
      <div>
        <h2 className="text-4xl md:text-6xl  font-bold text-gray-900 uppercase leading-none tracking-tighter">
          Selection <br />
          <span className="font-serif italic lowercase font-light text-red-600 tracking-normal">Architecture</span>
        </h2>
      </div>
      <p className="text-gray-400 max-w-sm text-sm font-medium leading-relaxed border-l border-red-600/30 pl-6">
        Critical technical considerations for engineering high-performance cabinetry systems.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
      {[
        {
          number: '01',
          title: 'Inventory Analysis',
          description: 'Take inventory of storage requirements. Specialized pull-outs and deep drawers significantly optimize organizational density.'
        },
        {
          number: '02',
          title: 'Structural Systems',
          description: 'Analyze framed vs. frameless construction. Frameless offers maximum interior volume, while framed provides a classic structural look.'
        },
        {
          number: '03',
          title: 'Surface Resilience',
          description: 'Evaluate paint, stain, or laminate. Consider high-traffic durability and maintenance requirements alongside the color palette.'
        },
        {
          number: '04',
          title: 'Hardware Hardware',
          description: 'Knobs and pulls are functional accents. Select high-performance hardware that complements both door geometry and room design.'
        },
        {
          number: '05',
          title: 'Luminance Planning',
          description: 'Integrated under-cabinet or interior glass lighting enhances both operational visibility and ambient depth.'
        },
        {
          number: '06',
          title: 'Dimensional Accuracy',
          description: 'Precision measurement is critical. Factor in appliance tolerances, plumbing locations, and ergonomic workspace clearance.'
        }
      ].map((tip, index) => (
        <div key={index} className="group relative flex flex-col pt-10 border-t border-gray-100 transition-all duration-500">
          {/* Top Industrial Accent Line */}
          <div className="absolute top-0 left-0 h-[3px] bg-red-600 w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
          
          <div className="flex items-center justify-between mb-8">
            <span className="text-5xl font-black text-gray-50 group-hover:text-red-600/10 transition-colors font-mono tracking-tighter">
              {tip.number}
            </span>
            {/* Technical Status Indicator */}
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
               <span className="text-[10px] font-mono text-gray-200 group-hover:text-gray-900 transition-colors font-bold uppercase tracking-widest">Active Spec</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 group-hover:text-red-600 transition-colors">
            {tip.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed font-light">
            {tip.description}
          </p>

          {/* Footer Detail */}
          <div className="mt-8 h-[1px] bg-gray-50 w-full group-hover:bg-red-600/10 transition-colors" />
        </div>
      ))}
    </div>
  </div>
</section>

      {/* --- CRAFTSMANSHIP & DETAIL SECTION - NEW CONTENT --- */}
      <section className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left: Detail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {  img: '/cabinets/img5.webp' },
                { img: '/cabinets/img2.webp' },
                {  img: '/cabinets/img3.webp' },
                {  img: '/cabinets/img4.webp' }
              ].map((item, index) => (
                <div key={index} className="relative h-48 md:h-64 group overflow-hidden first:rounded-tl-[60px] last:rounded-br-[60px]">
                  <Image
                    src={item.img}
                    alt="Craftsmanship Detail"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                 
                </div>
              ))}
            </div>

            {/* Right: Craftsmanship Text */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl  font-bold text-gray-900 uppercase mb-6">
                  Engineered for <br />
                  <span className="text-red-600">Lifelong Performance</span>
                </h2>
                <div className="w-20 h-1.5 bg-[#cf1e1e]" />
                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  Our cabinetry isn&apos;t just about appearance; it&apos;s about structural integrity. Every unit is engineered with precision, using materials that resist warping, moisture, and daily wear. From the depth of the finish to the smoothness of the glides, we define quality in every detail.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  { title: 'Furniture-Grade Materials', desc: 'No particle board. We use high-density plywood and solid wood frames.' },
                  { title: 'Integrated Soft-Close', desc: 'Standard on all drawers and doors for a silent, luxury experience.' },
                  { title: 'Custom Sizing', desc: 'We build to your exact dimensions, maximizing every inch of your space.' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6 p-6 border border-gray-100 hover:border-[#a68966] transition-all bg-[#F9F8F6]/50">
                    <div className="text-red-600 text-xl font-bold">0{i + 1}</div>
                    <div>
                      <h4 className="font-black uppercase text-[11px] tracking-widest text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    

     {/* --- CABINETRY ENGINEERING: SYSTEM & ARCHITECTURE SECTION --- */}
<section className="py-32 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    
    {/* Section Header */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[2px] w-8 bg-red-600" />
          <span className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase font-bold">Engineering Matrix</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 uppercase leading-none tracking-tighter">
          Modular <br /> 
          <span className="font-serif italic lowercase font-light text-red-600 tracking-normal">Systems</span>
        </h2>
      </div>
      <p className="text-gray-400 max-w-sm text-sm font-medium leading-relaxed border-l border-gray-100 pl-6">
        Beyond aesthetics. We engineer internal hardware and storage density to create high-performance architectural environments.
      </p>
    </div>

    {/* The Technical Box Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
    {
      id: 'SYS-01',
      label: 'Core Structure',
      title: 'Frameless Engineering',
      desc: 'Maximum volume utilization with 19mm high-density core panels for structural rigidity.',
      img: '/cabinets/img6.webp'
    },
    {
      id: 'SYS-02',
      label: 'Kinetic Hardware',
      title: 'Soft-Close Systems',
      desc: 'Precision-calibrated hinges tested for 200,000 cycles of seamless operational movement.',
      img: '/cabinets/img10.webp'
    },
    {
      id: 'SYS-03',
      label: 'Surface Tech',
      title: 'Nanotech Finishes',
      desc: 'Anti-fingerprint thermal healing surfaces that maintain architectural purity over time.',
      img: '/cabinets/img11.webp'
    },
    {
      id: 'SYS-04',
      label: 'Organization',
      title: 'Internal Architecture',
      desc: 'Customizable divider systems engineered to optimize every cubic centimeter of storage.',
      img: '/cabinets/img5.webp'
    }
      ].map((box, index) => (
        <div key={index} className="group relative flex flex-col h-[600px] bg-gray-50 overflow-hidden border border-gray-100">
          
          {/* Top Metadata */}
          <div className="p-8 flex justify-between items-start z-10 bg-white">
            <div className="space-y-1">
              <span className="block text-red-600 font-mono text-[9px] font-black uppercase tracking-widest">{box.id}</span>
              <span className="block text-gray-900 font-bold uppercase text-[11px] tracking-tighter">{box.label}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover:animate-ping" />
          </div>

          {/* Image Area */}
          <div className="relative flex-1 overflow-hidden transition-all duration-1000">
            <Image
              src={box.img}
              alt={box.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-red-600/10 transition-colors" />
          </div>

          {/* Bottom Content */}
          <div className="p-8 bg-white relative">
            <div className="absolute top-0 left-0 h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-700" />
            
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 group-hover:text-red-600 transition-colors">
              {box.title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed font-light">
              {box.desc}
            </p>
            
            <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">Verified_Spec</span>
               <div className="h-[1px] w-12 bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* --- BOTTOM CTA: GALLERY & CONTACT REDESIGN --- */}
<div className="mt-4 grid grid-cols-1 lg:grid-cols-12 bg-[#0a0a0a] text-white overflow-hidden shadow-2xl">
    {/* Left Content Area */}
    <div className="lg:col-span-8 p-12 md:p-20 space-y-8">
        <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-red-600" />
            <span className="text-red-600 font-mono text-[9px] tracking-[0.4em] uppercase font-bold">Project Finalization</span>
        </div>
        <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none">
            Ready to engineer your <br />
            <span className="font-serif italic lowercase font-light text-red-600 tracking-normal">storage environment?</span>
        </h3>
        <p className="text-gray-400 max-w-xl text-sm font-light leading-relaxed">
            From initial door geometry to final finish installation, our team ensures every millimeter is optimized for performance and elegance.
        </p>
    </div>

    {/* Right Navigation Area: Gallery and Contact Buttons */}
    <div className="lg:col-span-4 flex flex-col">
        {/* Explore Our Gallery Button */}
        <Link href="/gallery" className="flex-1 flex">
            <button className="flex-1 bg-red-600 hover:bg-white hover:text-red-600 transition-all duration-500 text-white font-black uppercase tracking-[0.3em] text-[10px] py-14 lg:py-0 border-b border-white/10 lg:border-b-0 group">
                <span className="group-hover:tracking-[0.4em] transition-all">Explore Our Gallery</span>
            </button>
        </Link>

        {/* Contact Architecture Button */}
        <Link href="/contact" className="flex-1 flex">
            <button className="flex-1 bg-white text-black hover:bg-red-600 hover:text-white transition-all duration-500 font-black uppercase tracking-[0.3em] text-[10px] py-14 lg:py-0 group">
                <span className="group-hover:tracking-[0.4em] transition-all">Contact Architecture</span>
            </button>
        </Link>
    </div>
</div>
  </div>
</section>
    </div>
  );
}
