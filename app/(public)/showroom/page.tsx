import React from 'react';
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
    </div>
  );
}