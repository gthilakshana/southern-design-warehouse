"use client";

import { HiOutlineArrowRight } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@/lib/actions";
import { motion } from "framer-motion";
import Image from "next/image";



type CategoriesProps = {
  categories: ProductCategory[];
};

const defaultCategories: ProductCategory[] = [
  { 
    id: '1', 
    title: 'Kitchens', 
    desc: 'Premium cabinetry and stone surfaces for modern kitchens.', 
    color: '#c5a358', 
    order: 1, 
    benefits: ['Premium Quality', 'Custom Fits'], 
    uses: ['Residential', 'Commercial'], 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    title: 'Bathrooms', 
    desc: 'Elegant vanities and tiles for a spa-like bathroom experience.', 
    color: '#8B7355', 
    order: 2, 
    benefits: ['Waterproof', 'Stylish'], 
    uses: ['Homes', 'Hotels'], 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '3', 
    title: 'Flooring', 
    desc: 'Durable and beautiful flooring options for every room.', 
    color: '#2d4a3e', 
    order: 3, 
    benefits: ['Durable', 'Easy Clean'], 
    uses: ['Interior', 'Exterior'], 
    updatedAt: new Date().toISOString() 
  },
];

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const getPlainText = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const summarize = (text: string, length = 135) =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text;

export default function Categories({ categories }: CategoriesProps) {
  const router = useRouter();
  const displayedCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    /* Added 'relative' and 'overflow-hidden' to contain the large text */
    <section className="relative bg-[#f5f2ed] py-24 lg:py-32 border-b border-stone-200 overflow-hidden">
      
      {/* LIGHT WATERMARK TEXT */}
      <div className="absolute top-20 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] pointer-events-none z-0">
        <span className="text-[18vw] font-black tracking-tighter uppercase">
          WAREHOUSE
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header Composition */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#8B7355] text-[10px] font-bold uppercase tracking-[0.4em]">Curated Collections</span>
              <div className="w-12 h-[1px] bg-[#8B7355]/30"></div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 tracking-tight leading-none">
              Material Categories
            </h2>
          </div>
          
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed border-l border-stone-200 pl-6">
            Explore a selection of professional grade materials used by top designers across residential and commercial projects.
          </p>
        </div>

        {/* The Refined Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {displayedCategories.map((cat: any, i) => (
            <motion.div
              key={cat.title || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group flex flex-col h-full bg-white p-10 border border-gray-300 hover:border-red-600 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                <div className="relative h-full w-full">
                  <Image 
                    src={cat.imageUrl || `https://source.unsplash.com/800x800/?${cat.title}`}
                    alt={cat.title}
                    fill
                    className="object-cover"
                    style={{
                        maskImage: 'linear-gradient(to left, black 20%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent 100%)'
                    }}
                  />
                </div>
              </div>

              <span className="absolute top-6 right-8 text-[40px] font-black text-gray-100 group-hover:text-gray-400 transition-colors pointer-events-none z-10">
                0{i + 1}
              </span>

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-medium text-slate-900 mb-4 pr-10">
                  {cat.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-10 flex-grow">
                  {cat.shortDesc 
                    ? summarize(getPlainText(cat.shortDesc), 120) 
                    : summarize(getPlainText(cat.desc), 120)}
                </p>

                <button
                  type="button"
                  onClick={() => router.push(`/products?category=${encodeURIComponent(cat.title)}`)}
                  className="flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B7355] group/btn"
                >
                  <span className="relative">
                    Explore Collection
                    <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#8B7355] group-hover/btn:w-full transition-all duration-300"></div>
                  </span>
                  <HiOutlineArrowRight className="ml-3 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}