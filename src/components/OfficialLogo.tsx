import React, { useState } from 'react';

interface OfficialLogoProps {
  className?: string;
  alt?: string;
  showText?: boolean;
}

/**
 * Official persistent logo for Baby Swim Vision.
 * Loads the administrator-defined persistent logo file from `/media/logo 2.jpg`
 * (with persistent fallbacks to `/media/logo.png` and `/media/logo-official.svg`).
 * Fully persistent across refreshes, dev server restarts, builds, and updates.
 */
export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  className = 'h-10 sm:h-12 w-auto object-contain',
  alt = 'Baby Swim Vision — Logo Officiel',
}) => {
  const [srcIndex, setSrcIndex] = useState(0);

  // Ordered list of official persistent logo files in /public/media/
  const sources = [
    '/media/logo 2-1.jpg',
    '/media/logo 2.jpg',
    '/media/logo.jpg',
    '/media/logo.png',
    '/media/logo-official.svg',
  ];

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={sources[srcIndex]}
      alt={alt}
      className={className}
      onError={handleImageError}
      referrerPolicy="no-referrer"
      loading="eager"
    />
  );
};
