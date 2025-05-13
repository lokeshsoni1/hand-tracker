
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface DigitalBulbProps {
  brightness: 'off' | 'half' | 'full';
}

export function DigitalBulb({ brightness }: DigitalBulbProps) {
  const getBulbStyles = () => {
    switch (brightness) {
      case 'full':
        return {
          iconClass: 'text-yellow-300 scale-125',
          glowClass: 'bg-yellow-300/50',
          label: 'Full Brightness',
        };
      case 'half':
        return {
          iconClass: 'text-yellow-200/80 scale-110',
          glowClass: 'bg-yellow-200/30',
          label: 'Half Brightness',
        };
      case 'off':
      default:
        return {
          iconClass: 'text-gray-400',
          glowClass: 'bg-transparent',
          label: 'Off',
        };
    }
  };

  const { iconClass, glowClass, label } = getBulbStyles();

  return (
    <div className="absolute top-4 right-4 flex flex-col items-center z-20">
      <div className={`relative p-6 rounded-full transition-all duration-300 ${glowClass}`}>
        <Lightbulb 
          className={`h-12 w-12 transition-all duration-300 ${iconClass}`} 
          strokeWidth={1.5}
        />
        <div className={`absolute inset-0 rounded-full blur-xl ${glowClass} -z-10 opacity-80`}></div>
      </div>
      <span className="text-sm mt-1 text-white font-semibold bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}
