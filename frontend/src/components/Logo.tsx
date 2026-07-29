// Logo.tsx
import React from 'react';
// Logoyu assets klasöründen içe aktarıyoruz
import logoImg from '../assets/logo.png';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <img 
      src={logoImg} 
      alt="CanVet Logo" 
      // object-cover: Resmi en-boy oranını bozmadan belirlenen alana sığdırır.
      // rounded-full: Resmi kare ise daire, dikdörtgen ise oval yapar.
      className={`object-cover rounded-full ${className}`} 
    />
  );
}