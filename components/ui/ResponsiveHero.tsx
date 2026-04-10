'use client';

import React from 'react';
import Image from 'next/image';

interface ResponsiveHeroProps {
  heroUrl?: string | null;
  heroTabletUrl?: string | null;
  heroMobileUrl?: string | null;
  fallbackUrl: string;
  alt: string;
  opacity?: string;
  brightness?: string;
  priority?: boolean;
}

export default function ResponsiveHero({
  heroUrl,
  heroTabletUrl,
  heroMobileUrl,
  fallbackUrl,
  alt,
  opacity = "opacity-100",
  brightness = "brightness-[0.3]",
  priority = true
}: ResponsiveHeroProps) {
  
  const isValidSrc = (src: any) => typeof src === 'string' && src.trim().length > 0;

  const desktopSrc = isValidSrc(heroUrl) ? heroUrl : (isValidSrc(fallbackUrl) ? fallbackUrl : null);
  const tabletSrc = isValidSrc(heroTabletUrl) ? heroTabletUrl : (desktopSrc || null);
  const mobileSrc = isValidSrc(heroMobileUrl) ? heroMobileUrl : (tabletSrc || null);

  // Render a simple dark box if NO valid images are provided at all
  if (!desktopSrc && !tabletSrc && !mobileSrc) {
    return <div className={`absolute inset-0 z-0 bg-[#121212] ${opacity}`} />;
  }

  return (
    <div className={`absolute inset-0 z-0 ${opacity}`}>
      {/* Desktop View (Large Screens) */}
      <div className="hidden lg:block absolute inset-0">
        {desktopSrc && (
          <Image
            src={desktopSrc}
            alt={alt}
            fill
            sizes="100vw"
            className={`object-cover ${brightness}`}
            priority
          />
        )}
      </div>

      {/* Tablet View (Medium Screens) */}
      <div className="hidden md:block lg:hidden absolute inset-0">
        {tabletSrc && (
          <Image
            src={tabletSrc}
            alt={alt}
            fill
            sizes="100vw"
            className={`object-cover ${brightness}`}
            priority
          />
        )}
      </div>

      {/* Mobile View (Small Screens) */}
      <div className="block md:hidden absolute inset-0">
        {mobileSrc && (
          <Image
            src={mobileSrc}
            alt={alt}
            fill
            sizes="100vw"
            className={`object-cover ${brightness}`}
            priority
          />
        )}
      </div>
    </div>
  );
}
