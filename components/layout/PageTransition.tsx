"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.99, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.01, y: -15 }}
        transition={{
          duration: 0.7,
          // Custom easing for that "luxury" smooth stop
          ease: [0.16, 1, 0.3, 1]
        }}
        className="w-full origin-top"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}