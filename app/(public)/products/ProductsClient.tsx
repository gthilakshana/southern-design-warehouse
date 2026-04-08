'use client';
import ScrollToTop from '@/components/ui/ScrollToTop';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ResponsiveHero from '@/components/ui/ResponsiveHero';
import { PageContent, ProductCategory } from '@/lib/actions';
import 'react-quill-new/dist/quill.snow.css'; // Corrected for the installed package

// --- Internal Animated Component ---
const AnimatedSection = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Internal Button Component ---
const CustomButton = ({ 
  children, 
  variant, 
  onClick 
}: { 
  children: React.ReactNode; 
  variant: 'primary' | 'outline'; 
  onClick: () => void 
}) => {
  const styles = variant === 'primary' 
    ? "bg-[#b33e2f] hover:bg-black text-white" 
    : "border-2 border-gray-200 hover:border-[#a68966] text-gray-900";
  
  return (
    <button 
      onClick={onClick}
      className={`${styles} py-5 px-10 font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300 active:scale-95`}
    >
      {children}
    </button>
  );
};

export default function ProductsClient({ content, categories }: { content: PageContent | null, categories: ProductCategory[] }) {
  const router = useRouter();

  const normalizeCategoryId = (value: string) =>
    `category-${value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category') ?? '';
    if (!categoryParam) return;

    const normalizedParam = normalizeCategoryId(categoryParam);
    const element = document.getElementById(normalizedParam);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const defaultHero = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80";

  return (
    <div className="w-full bg-[#F4F1EE] min-h-screen font-[arial]">
      
      {/* Header - STANDARD SIZE FIX */}
      <section className="bg-[#111111] h-[60vh] relative overflow-hidden flex items-center justify-center">
        <ResponsiveHero 
          heroUrl={content?.heroUrl}
          heroTabletUrl={content?.heroTabletUrl}
          heroMobileUrl={content?.heroMobileUrl}
          fallbackUrl=""
          alt="Product Categories"
          opacity="opacity-80"
          brightness="brightness-[0.4]"
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#a68966]/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-3xl md:text-6xl font-bold  uppercase tracking-tighter text-white mb-5">
              {content?.title || "Product Categories"}
            </h1>
           
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light">
              {content?.description || "Explore our comprehensive selection of premium remodeling materials for residential and commercial projects."}
            </p>

            {/* Dynamic Featured Categories List */}
            {content?.heroText && (
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-8">
                {content.heroText.split(/[•·,]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0).map((item: string, index: number, arr: any[]) => (
                  <React.Fragment key={item}>
                    <span className="text-[#a68966] font-black text-[10px] uppercase tracking-[0.2em]">
                      {item}
                    </span>
                    {index < arr.length - 1 && (
                      <span className="text-[#a68966] text-lg px-2">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* category list... */}
        <div className="space-y-24">
          {categories.map((cat, idx) => (
            <AnimatedSection
              id={normalizeCategoryId(cat.title)}
              key={cat.id}
              className={`bg-white p-10 md:p-16 relative overflow-hidden group shadow-sm border border-transparent hover:border-[#a68966]/30 transition-all duration-500 ${
                idx % 2 !== 0 ? 'bg-gray-50/50' : ''
              }`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />
              <div 
                className="absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{ backgroundColor: cat.color || '#a68966' }}
              />

              <div className="max-w-4xl relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 uppercase ">
                  {cat.title}
                </h2>
                
                {cat.subtitle && (
                  <h3 className="text-xl mt-7 font-bold mb-6 tracking-widest uppercase text-[11px]" style={{ color: cat.color || '#a68966' }}>
                    {cat.subtitle}
                  </h3>
                )}
                
                <div className="w-20 h-[2px] mb-10" style={{ backgroundColor: cat.color || '#b33e2f' }} />

                <div 
                    className="prose prose-lg md:prose-xl  max-w-none prose-slate mb-12 ql-editor !p-0 !min-h-0"
                    style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: cat.desc }} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                  {cat.benefits && (
                    <div>
                      <h4 className="text-[11px] font-black text-gray-400 mb-6 uppercase tracking-widest italic border-b border-gray-100 pb-2">Benefits</h4>
                      <ul className="space-y-4">
                        {cat.benefits.map((item, i) => (
                          <li key={i} className="flex items-start text-gray-600 text-lg font-medium">
                            <span className="text-[#b33e2f] mr-4 mt-1 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cat.uses && cat.uses.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-black text-gray-400 mb-6 uppercase tracking-widest italic border-b border-gray-100 pb-2">
                        Common Uses / Options
                      </h4>
                      <ul className="space-y-4">
                        {cat.uses.map((item, i) => (
                          <li key={i} className="flex items-start text-gray-600 text-lg font-medium">
                            <span className="text-[#b33e2f] mr-4 mt-1 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100">
                  <p className="text-gray-900 font-bold mb-6 text-[10px] tracking-widest uppercase">
                    Looking for quality {cat.title.toLowerCase()} for your project?
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <CustomButton 
                      variant="primary" 
                      onClick={() => router.push('/contact')}
                    >
                      Request Quote
                    </CustomButton>
                    <CustomButton 
                      variant="outline" 
                      onClick={() => router.push('/showroom')}
                    >
                      Visit Showroom
                    </CustomButton>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

       <ScrollToTop /> 
    </div>
  );
}