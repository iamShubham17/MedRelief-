import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-32 w-32',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-5xl',
  };

  return (
    <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
      <div className={cn(
        "relative flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 rounded-full",
        sizes[size]
      )}>
        <img 
          src="/logo.png" 
          alt="MedRelief Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback if logo.png is missing
            e.currentTarget.src = 'https://picsum.photos/seed/medrelief/200/200';
          }}
        />
      </div>
      {!iconOnly && (
        <span className={cn("font-black tracking-tight text-slate-900", textSizes[size])}>
          MedRelief<span className="text-primary">+</span>
        </span>
      )}
    </div>
  );
}
