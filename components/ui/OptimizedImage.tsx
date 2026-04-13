'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  containerClassName?: string;
  transitionDuration?: number;
}

/**
 * A wrapper for Next.js Image component that adds:
 * 1. A smooth fade-in transition when the image is fully decoded.
 * 2. Automatic blur placeholder support (works best with fixed dimensions or static imports).
 * 3. Consistent aspect ratio handling to prevent layout shifts.
 */
export default function OptimizedImage({
  src,
  alt,
  containerClassName = "",
  transitionDuration = 0.8,
  className = "",
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle images that are already cached or loaded before hydration
  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  // Use a generic placeholder if src is missing or invalid
  const finalSrc = !src || (typeof src === 'string' && src.trim() === '') 
    ? '/images/placeholder.jpg' 
    : src;

  // A generic base64 gray blur placeholder for remote images (Unsplash/etc) 
  // to avoid the "white box" effect during loading.
  const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
      <AnimatePresence>
        {(hasError) ? (
          <div className="absolute inset-0 z-20 bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
             <HiExclamationCircle className="text-gray-300 w-10 h-10 mb-2" />
             <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Image Unavailable</span>
          </div>
        ) : !isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 animate-shimmer"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.02 }}
        animate={{ 
          opacity: (isLoaded && !hasError) ? 1 : 0,
          filter: (isLoaded && !hasError) ? 'blur(0px)' : 'blur(20px)',
          scale: (isLoaded && !hasError) ? 1 : 1.02
        }}
        transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        <Image
          ref={imageRef}
          src={finalSrc}
          alt={alt}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true); // Stop loading state
          }}
          placeholder="blur"
          blurDataURL={blurDataURL}
          className={`transition-all duration-300 ${className}`}
          {...props}
        />
      </motion.div>
    </div>
  );
}
