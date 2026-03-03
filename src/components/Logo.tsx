import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MedicalServices } from '@/components/icons';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  variant?: 'horizontal' | 'vertical';
  showSubtitle?: boolean;
}

export function Logo({ 
  className, 
  iconOnly = false, 
  size = 'md', 
  theme = 'dark',
  variant = 'horizontal',
  showSubtitle = false
}: LogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-32 w-32',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-5xl',
  };

  return (
    <div className={cn(
      "flex items-center gap-3 group cursor-pointer", 
      variant === 'vertical' ? 'flex-col text-center' : 'flex-row',
      className
    )}>
      <div className={cn(
        "relative flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 rounded-full shadow-lg shadow-slate-200/50",
        sizes[size],
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      )}>
        {!imgError ? (
          <img 
            src="/logo.png" 
            alt="MedRelief Logo" 
            className="w-full h-full object-contain p-1.5"
            onError={() => setImgError(true)}
          />
        ) : (
          <MedicalServices className={cn(
            "text-primary",
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-16 h-16'
          )} />
        )}
      </div>
      {!iconOnly && (
        <div className={cn("flex flex-col", variant === 'vertical' ? 'items-center' : 'items-start')}>
          <span className={cn(
            "font-black tracking-tight", 
            textSizes[size],
            theme === 'dark' ? 'text-slate-900' : 'text-white'
          )}>
            MedRelief<span className={theme === 'dark' ? "text-primary" : "text-white/60"}>+</span>
          </span>
          {showSubtitle && (
            <p className={cn(
              "font-bold uppercase tracking-[0.3em] text-slate-400 mt-1",
              size === 'lg' ? 'text-sm' : 'text-[8px]'
            )}>
              Digital Healthcare Excellence
            </p>
          )}
        </div>
      )}
    </div>
  );
}
