import React, { useState } from 'react';
import { BabyProfile } from '../types';

interface BabyAvatarProps {
  baby?: Partial<BabyProfile> | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  shape?: 'rounded' | 'circle';
  ring?: boolean;
}

export const BabyAvatar: React.FC<BabyAvatarProps> = ({
  baby,
  size = 'md',
  className = '',
  shape = 'rounded',
  ring = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl',
    '2xl': 'w-20 h-20 text-3xl',
    hero: 'w-24 h-24 sm:w-28 sm:h-28 text-4xl sm:text-5xl',
  }[size];

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  const ringClass = ring ? 'ring-2 ring-sky-300 ring-offset-2 ring-offset-white' : '';

  const hasPhoto = !imgError && baby?.avatarType === 'photo' && baby?.photoUrl;

  if (hasPhoto && baby.photoUrl) {
    return (
      <div
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-sky-100 select-none ${shapeClass} ${sizeClasses} ${ringClass} ${className}`}
        data-protected-media="true"
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <img
          src={baby.photoUrl}
          alt={baby.name || 'Bébé'}
          draggable={false}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="w-full h-full object-cover select-none pointer-events-none"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Fallback to avatar emoji or default icon
  const avatarEmoji = baby?.avatarUrl || '👶';

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-sky-100 via-teal-50 to-indigo-100 text-slate-800 shadow-xs select-none ${shapeClass} ${sizeClasses} ${ringClass} ${className}`}
    >
      <span className="leading-none">{avatarEmoji}</span>
    </div>
  );
};
