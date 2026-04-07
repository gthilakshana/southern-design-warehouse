"use client";

import { useEffect, useState } from "react";
import { HiOutlineChevronUp } from "react-icons/hi"; // Professional thin stroke icon
import { motion, AnimatePresence } from "framer-motion"; // For smoother animations

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling 400px for a cleaner look
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group relative flex items-center justify-center w-12 h-12 bg-white border border-slate-200 text-slate-900 rounded-lg shadow-xl hover:bg-[#15803d] hover:text-white hover:border-[#15803d] transition-all duration-300 ease-in-out"
          >
            {/* The Arrow Icon */}
            <HiOutlineChevronUp className="text-xl font-bold transition-transform duration-300 group-hover:-translate-y-1" />
            
            {/* Subtle Tooltip that appears on hover */}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded pointer-events-none">
              Top
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}