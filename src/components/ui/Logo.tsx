'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'default' | 'white' | 'minimal' | 'icon-only' | 'inside-book' | 'inside-book-white' | 'modern' | 'modern-white' | 'modern-minimal' | 'book-b' | 'book-b-white' | 'book-b-minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const Logo = ({ 
  variant = 'default', 
  size = 'md', 
  className = '', 
  animated = true 
}: LogoProps) => {
  const sizes = {
    sm: { width: 32, height: 32, fontSize: 18 },
    md: { width: 48, height: 48, fontSize: 28 },
    lg: { width: 64, height: 64, fontSize: 36 },
    xl: { width: 96, height: 96, fontSize: 54 },
  };

  const currentSize = sizes[size];

  // Version 1: Default with red background
  const DefaultLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      
      {/* Background Square with rounded corners */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="18"
        ry="18"
        fill="url(#redGradient)"
        stroke="#ffffff"
        strokeWidth="3"
      />
      
      {/* Inner highlight for 3D effect */}
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="14"
        ry="14"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.3"
      />
      
      {/* Letter B */}
      <text
        x="32"
        y="62"
        fontSize={currentSize.fontSize}
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        B
      </text>
      
      {/* Open Book L */}
      <g transform="translate(56, 42)">
        {/* Book base/cover */}
        <ellipse cx="10" cy="16" rx="12" ry="3" fill="#ffffff" opacity="0.3"/>
        
        {/* Left page with curve */}
        <path
          d="M 2 4 Q 0 8, 2 12 Q 4 16, 6 18 L 10 16 Q 8 12, 10 8 Q 12 4, 10 2 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="0.5"
        />
        
        {/* Right page with curve */}
        <path
          d="M 10 2 Q 12 4, 10 8 Q 8 12, 10 16 L 14 18 Q 16 16, 18 12 Q 20 8, 18 4 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="0.5"
        />
        
        {/* Book spine/binding */}
        <path
          d="M 10 2 Q 10 6, 10 10 Q 10 14, 10 16"
          stroke="#ffffff"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        
        {/* Text lines on left page */}
        <path d="M 4 6 Q 6 6, 8 7" stroke="#dc2626" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 4 8 Q 6 8, 7 9" stroke="#dc2626" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 4 10 Q 5 10, 6 11" stroke="#dc2626" strokeWidth="0.4" opacity="0.7" fill="none"/>
        
        {/* Text lines on right page */}
        <path d="M 12 7 Q 14 6, 16 6" stroke="#dc2626" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 13 9 Q 14 8, 16 8" stroke="#dc2626" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 14 11 Q 15 10, 16 10" stroke="#dc2626" strokeWidth="0.4" opacity="0.7" fill="none"/>
      </g>
      
      {/* Decorative line between letters - removed for cleaner mobile app look */}
    </svg>
  );

  // Version 2: White background variant
  const WhiteLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
      
      {/* Background Square with rounded corners */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="18"
        ry="18"
        fill="url(#whiteGradient)"
        stroke="#dc2626"
        strokeWidth="4"
      />
      
      {/* Letter B */}
      <text
        x="32"
        y="62"
        fontSize={currentSize.fontSize}
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fill="#dc2626"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        B
      </text>
      
      {/* Open Book L */}
      <g transform="translate(56, 42)">
        {/* Book base/cover */}
        <ellipse cx="10" cy="16" rx="12" ry="3" fill="#dc2626" opacity="0.2"/>
        
        {/* Left page with curve */}
        <path
          d="M 2 4 Q 0 8, 2 12 Q 4 16, 6 18 L 10 16 Q 8 12, 10 8 Q 12 4, 10 2 Z"
          fill="#dc2626"
          stroke="#dc2626"
          strokeWidth="0.5"
        />
        
        {/* Right page with curve */}
        <path
          d="M 10 2 Q 12 4, 10 8 Q 8 12, 10 16 L 14 18 Q 16 16, 18 12 Q 20 8, 18 4 Z"
          fill="#dc2626"
          stroke="#dc2626"
          strokeWidth="0.5"
        />
        
        {/* Book spine/binding */}
        <path
          d="M 10 2 Q 10 6, 10 10 Q 10 14, 10 16"
          stroke="#dc2626"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        
        {/* Text lines on left page */}
        <path d="M 4 6 Q 6 6, 8 7" stroke="#ffffff" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 4 8 Q 6 8, 7 9" stroke="#ffffff" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 4 10 Q 5 10, 6 11" stroke="#ffffff" strokeWidth="0.4" opacity="0.7" fill="none"/>
        
        {/* Text lines on right page */}
        <path d="M 12 7 Q 14 6, 16 6" stroke="#ffffff" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 13 9 Q 14 8, 16 8" stroke="#ffffff" strokeWidth="0.4" opacity="0.7" fill="none"/>
        <path d="M 14 11 Q 15 10, 16 10" stroke="#ffffff" strokeWidth="0.4" opacity="0.7" fill="none"/>
      </g>
      
      {/* Decorative line between letters - removed for cleaner mobile app look */}
    </svg>
  );

  // Version 3: Minimal without background
  const MinimalLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Letter B */}
      <text
        x="32"
        y="62"
        fontSize={currentSize.fontSize}
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fill="#dc2626"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        B
      </text>
      
      {/* Open Book L */}
      <g transform="translate(56, 42)">
        {/* Book base/cover */}
        <ellipse cx="10" cy="16" rx="12" ry="3" fill="#dc2626" opacity="0.2"/>
        
        {/* Left page with curve */}
        <path
          d="M 2 4 Q 0 8, 2 12 Q 4 16, 6 18 L 10 16 Q 8 12, 10 8 Q 12 4, 10 2 Z"
          fill="#dc2626"
          stroke="#dc2626"
          strokeWidth="0.5"
        />
        
        {/* Right page with curve */}
        <path
          d="M 10 2 Q 12 4, 10 8 Q 8 12, 10 16 L 14 18 Q 16 16, 18 12 Q 20 8, 18 4 Z"
          fill="#dc2626"
          stroke="#dc2626"
          strokeWidth="0.5"
        />
        
        {/* Book spine/binding */}
        <path
          d="M 10 2 Q 10 6, 10 10 Q 10 14, 10 16"
          stroke="#dc2626"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        
        {/* Text lines on left page */}
        <path d="M 4 6 Q 6 6, 8 7" stroke="#ffffff" strokeWidth="0.4" opacity="0.9" fill="none"/>
        <path d="M 4 8 Q 6 8, 7 9" stroke="#ffffff" strokeWidth="0.4" opacity="0.9" fill="none"/>
        <path d="M 4 10 Q 5 10, 6 11" stroke="#ffffff" strokeWidth="0.4" opacity="0.9" fill="none"/>
        
        {/* Text lines on right page */}
        <path d="M 12 7 Q 14 6, 16 6" stroke="#ffffff" strokeWidth="0.4" opacity="0.9" fill="none"/>
        <path d="M 13 9 Q 14 8, 16 8" stroke="#ffffff" strokeWidth="0.4" opacity="0.9" fill="none"/>
        <path d="M 14 11 Q 15 10, 16 10" stroke="#ffffff" strokeWidth="0.4" opacity="0.9" fill="none"/>
      </g>
      
      {/* Decorative line between letters - removed for cleaner mobile app look */}
    </svg>
  );

  // Version 4: Icon only with book design
  const IconOnlyLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      
      {/* Book shape */}
      <rect
        x="15"
        y="20"
        width="70"
        height="60"
        rx="4"
        fill="url(#bookGradient)"
      />
      
      {/* Book spine */}
      <rect
        x="15"
        y="20"
        width="8"
        height="60"
        rx="4"
        fill="#991b1b"
      />
      
      {/* Pages effect */}
      <rect
        x="23"
        y="25"
        width="58"
        height="50"
        rx="2"
        fill="#ffffff"
        opacity="0.9"
      />
      
      {/* Letter B */}
      <text
        x="38"
        y="58"
        fontSize="22"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fill="#000000"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        B
      </text>
      
      {/* Open Book L */}
      <g transform="translate(54, 40)">
        {/* Book base/cover */}
        <ellipse cx="10" cy="16" rx="10" ry="2" fill="#000000" opacity="0.2"/>
        
        {/* Left page with curve */}
        <path
          d="M 3 6 Q 2 8, 3 10 Q 4 14, 5 16 L 10 14 Q 8 10, 10 8 Q 11 6, 10 4 Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="0.3"
        />
        
        {/* Right page with curve */}
        <path
          d="M 10 4 Q 11 6, 10 8 Q 8 10, 10 14 L 15 16 Q 16 14, 17 10 Q 18 8, 17 6 Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="0.3"
        />
        
        {/* Book spine/binding */}
        <path
          d="M 10 4 Q 10 6, 10 10 Q 10 12, 10 14"
          stroke="#000000"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        
        {/* Text lines on left page */}
        <path d="M 5 8 Q 6 8, 8 8" stroke="#ffffff" strokeWidth="0.3" opacity="0.8" fill="none"/>
        <path d="M 5 10 Q 6 10, 7 10" stroke="#ffffff" strokeWidth="0.3" opacity="0.8" fill="none"/>
        
        {/* Text lines on right page */}
        <path d="M 12 8 Q 13 8, 15 8" stroke="#ffffff" strokeWidth="0.3" opacity="0.8" fill="none"/>
        <path d="M 13 10 Q 14 10, 15 10" stroke="#ffffff" strokeWidth="0.3" opacity="0.8" fill="none"/>
      </g>
    </svg>
  );

  // Version 5: Inside Book - Main concept showing B inside an opened book
  const InsideBookLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <linearGradient id="bookSpineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <filter id="bookShadow">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      {/* Book base/table surface */}
      <ellipse cx="50" cy="85" rx="45" ry="8" fill="#000000" opacity="0.1"/>
      
      {/* Book spine/binding */}
      <rect
        x="47"
        y="20"
        width="6"
        height="50"
        fill="url(#bookSpineGradient)"
        filter="url(#bookShadow)"
      />
      
      {/* Left page */}
      <path
        d="M 15 25 Q 10 30, 15 35 Q 20 45, 25 55 Q 35 65, 47 68 L 47 22 Q 35 20, 25 22 Q 20 23, 15 25 Z"
        fill="url(#pageGradient)"
        stroke="#e5e7eb"
        strokeWidth="1"
        filter="url(#bookShadow)"
      />
      
      {/* Right page */}
      <path
        d="M 85 25 Q 90 30, 85 35 Q 80 45, 75 55 Q 65 65, 53 68 L 53 22 Q 65 20, 75 22 Q 80 23, 85 25 Z"
        fill="url(#pageGradient)"
        stroke="#e5e7eb"
        strokeWidth="1"
        filter="url(#bookShadow)"
      />
      
      {/* Page curl effects */}
      <path
        d="M 47 22 Q 35 18, 25 20 Q 20 21, 15 23"
        stroke="#d1d5db"
        strokeWidth="1"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M 53 22 Q 65 18, 75 20 Q 80 21, 85 23"
        stroke="#d1d5db"
        strokeWidth="1"
        fill="none"
        opacity="0.8"
      />
      
      {/* Text lines on left page */}
      <g opacity="0.3">
        <path d="M 20 35 Q 30 35, 40 36" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
        <path d="M 22 40 Q 28 40, 38 41" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
        <path d="M 20 45 Q 25 45, 35 46" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
        <path d="M 23 50 Q 30 50, 40 51" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
      </g>
      
      {/* Text lines on right page */}
      <g opacity="0.3">
        <path d="M 60 36 Q 70 35, 80 35" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
        <path d="M 62 41 Q 72 40, 78 40" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
        <path d="M 65 46 Q 75 45, 80 45" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
        <path d="M 60 51 Q 70 50, 77 50" stroke="#6b7280" strokeWidth="0.8" fill="none"/>
      </g>
      
      {/* Large B in the center - "Inside the Book" */}
      <text
        x="50"
        y="50"
        fontSize={Math.floor(currentSize.fontSize * 1.2)}
        fontFamily="Georgia, serif"
        fontWeight="700"
        fill="#dc2626"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
      >
        B
      </text>
      
      {/* Subtle highlight on the B */}
      <text
        x="49"
        y="49"
        fontSize={Math.floor(currentSize.fontSize * 1.2)}
        fontFamily="Georgia, serif"
        fontWeight="700"
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity="0.3"
      >
        B
      </text>
    </svg>
  );

  // Version 6: Inside Book White - for dark backgrounds
  const InsideBookWhiteLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <linearGradient id="bookSpineGradientWhite" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="50%" stopColor="#374151" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        <linearGradient id="pageGradientWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <filter id="bookShadowWhite">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.5"/>
        </filter>
      </defs>
      
      {/* Book base/table surface */}
      <ellipse cx="50" cy="85" rx="45" ry="8" fill="#ffffff" opacity="0.2"/>
      
      {/* Book spine/binding */}
      <rect
        x="47"
        y="20"
        width="6"
        height="50"
        fill="url(#bookSpineGradientWhite)"
        filter="url(#bookShadowWhite)"
      />
      
      {/* Left page */}
      <path
        d="M 15 25 Q 10 30, 15 35 Q 20 45, 25 55 Q 35 65, 47 68 L 47 22 Q 35 20, 25 22 Q 20 23, 15 25 Z"
        fill="url(#pageGradientWhite)"
        stroke="#d1d5db"
        strokeWidth="1"
        filter="url(#bookShadowWhite)"
      />
      
      {/* Right page */}
      <path
        d="M 85 25 Q 90 30, 85 35 Q 80 45, 75 55 Q 65 65, 53 68 L 53 22 Q 65 20, 75 22 Q 80 23, 85 25 Z"
        fill="url(#pageGradientWhite)"
        stroke="#d1d5db"
        strokeWidth="1"
        filter="url(#bookShadowWhite)"
      />
      
      {/* Page curl effects */}
      <path
        d="M 47 22 Q 35 18, 25 20 Q 20 21, 15 23"
        stroke="#9ca3af"
        strokeWidth="1"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M 53 22 Q 65 18, 75 20 Q 80 21, 85 23"
        stroke="#9ca3af"
        strokeWidth="1"
        fill="none"
        opacity="0.8"
      />
      
      {/* Text lines on left page */}
      <g opacity="0.4">
        <path d="M 20 35 Q 30 35, 40 36" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
        <path d="M 22 40 Q 28 40, 38 41" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
        <path d="M 20 45 Q 25 45, 35 46" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
        <path d="M 23 50 Q 30 50, 40 51" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
      </g>
      
      {/* Text lines on right page */}
      <g opacity="0.4">
        <path d="M 60 36 Q 70 35, 80 35" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
        <path d="M 62 41 Q 72 40, 78 40" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
        <path d="M 65 46 Q 75 45, 80 45" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
        <path d="M 60 51 Q 70 50, 77 50" stroke="#4b5563" strokeWidth="0.8" fill="none"/>
      </g>
      
      {/* Large B in the center - "Inside the Book" */}
      <text
        x="50"
        y="50"
        fontSize={Math.floor(currentSize.fontSize * 1.2)}
        fontFamily="Georgia, serif"
        fontWeight="700"
        fill="#dc2626"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
      >
        B
      </text>
      
      {/* Subtle highlight on the B */}
      <text
        x="49"
        y="49"
        fontSize={Math.floor(currentSize.fontSize * 1.2)}
        fontFamily="Georgia, serif"
        fontWeight="700"
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity="0.4"
      >
        B
      </text>
    </svg>
  );

  // Modern Apple-style variants with cutting effect
  const ModernLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <filter id="modernShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.25"/>
        </filter>
      </defs>
      
      {/* Bold B with cutting effect */}
      <text
        x="25"
        y="65"
        fontSize={Math.floor(currentSize.fontSize * 2.2)}
        fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="800"
        fill="url(#modernGradient)"
        textAnchor="middle"
        dominantBaseline="middle"
        filter="url(#modernShadow)"
      >
        B
      </text>
      
      {/* Modern L-shaped open book with cutting effect */}
      <g transform="translate(45, 25)">
        {/* Vertical part of L (book spine/left page) */}
        <rect
          x="0"
          y="-10"
          width="12"
          height="70"
          rx="6"
          fill="url(#modernGradient)"
          filter="url(#modernShadow)"
        />
        
        {/* Horizontal part of L (right page) */}
        <rect
          x="12"
          y="45"
          width="45"
          height="12"
          rx="6"
          fill="url(#modernGradient)"
          filter="url(#modernShadow)"
        />
        
        {/* Book pages detail */}
        <rect
          x="2"
          y="-8"
          width="8"
          height="66"
          rx="4"
          fill="#ffffff"
          opacity="0.3"
        />
        
        <rect
          x="14"
          y="47"
          width="41"
          height="8"
          rx="4"
          fill="#ffffff"
          opacity="0.3"
        />
        
        {/* Modern page lines */}
        <g opacity="0.5">
          <rect x="4" y="5" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="10" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="15" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="20" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="25" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="30" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="35" width="4" height="1" rx="0.5" fill="#ffffff"/>
          
          <rect x="18" y="49" width="8" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="18" y="51.5" width="8" height="1" rx="0.5" fill="#ffffff"/>
        </g>
      </g>
    </svg>
  );

  const ModernWhiteLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="modernWhiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <filter id="modernWhiteShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
        </filter>
      </defs>
      
      {/* Bold B with cutting effect */}
      <text
        x="25"
        y="65"
        fontSize={Math.floor(currentSize.fontSize * 2.2)}
        fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="800"
        fill="url(#modernWhiteGradient)"
        textAnchor="middle"
        dominantBaseline="middle"
        filter="url(#modernWhiteShadow)"
      >
        B
      </text>
      
      {/* Modern L-shaped open book with cutting effect */}
      <g transform="translate(45, 25)">
        {/* Vertical part of L (book spine/left page) */}
        <rect
          x="0"
          y="-10"
          width="12"
          height="70"
          rx="6"
          fill="url(#modernWhiteGradient)"
          filter="url(#modernWhiteShadow)"
        />
        
        {/* Horizontal part of L (right page) */}
        <rect
          x="12"
          y="45"
          width="45"
          height="12"
          rx="6"
          fill="url(#modernWhiteGradient)"
          filter="url(#modernWhiteShadow)"
        />
        
        {/* Book pages detail */}
        <rect
          x="2"
          y="-8"
          width="8"
          height="66"
          rx="4"
          fill="#f9fafb"
          opacity="0.8"
        />
        
        <rect
          x="14"
          y="47"
          width="41"
          height="8"
          rx="4"
          fill="#f9fafb"
          opacity="0.8"
        />
        
        {/* Modern page lines */}
        <g opacity="0.6">
          <rect x="4" y="5" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="10" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="15" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="20" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="25" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="30" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="35" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          
          <rect x="18" y="49" width="8" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="18" y="51.5" width="8" height="1" rx="0.5" fill="#e5e7eb"/>
        </g>
      </g>
    </svg>
  );

  const ModernMinimalLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="modernMinimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
      </defs>
      
      {/* Bold B with cutting effect - minimal version */}
      <text
        x="25"
        y="65"
        fontSize={Math.floor(currentSize.fontSize * 2.2)}
        fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="800"
        fill="url(#modernMinimalGradient)"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        B
      </text>
      
      {/* Minimal L-shaped open book with cutting effect */}
      <g transform="translate(45, 25)">
        {/* Vertical part of L (book spine/left page) */}
        <rect
          x="0"
          y="-10"
          width="8"
          height="70"
          rx="4"
          fill="url(#modernMinimalGradient)"
        />
        
        {/* Horizontal part of L (right page) */}
        <rect
          x="8"
          y="45"
          width="45"
          height="8"
          rx="4"
          fill="url(#modernMinimalGradient)"
        />
        
        {/* Minimal page indicator */}
        <rect
          x="2"
          y="-8"
          width="4"
          height="66"
          rx="2"
          fill="#ffffff"
          opacity="0.4"
        />
        
        <rect
          x="10"
          y="47"
          width="41"
          height="4"
          rx="2"
          fill="#ffffff"
          opacity="0.4"
        />
      </g>
    </svg>
  );

  // Book-B variants - "B" made from book shapes with clear B structure
  const BookBLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="bookBGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id="bookBGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <linearGradient id="bookBGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <filter id="bookBShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.25"/>
        </filter>
      </defs>
      
      {/* Clear B shape made from horizontal book stacks */}
      <g transform="translate(12, 15)">
        {/* Left vertical spine of B */}
        <rect
          x="0"
          y="0"
          width="6"
          height="50"
          rx="2"
          fill="url(#bookBGradient)"
          filter="url(#bookBShadow)"
        />
        
        {/* Top horizontal book stack */}
        <g>
          <rect x="6" y="0" width="16" height="4" rx="2" fill="url(#bookBGradient2)" filter="url(#bookBShadow)"/>
          <rect x="6" y="4" width="18" height="4" rx="2" fill="url(#bookBGradient)" filter="url(#bookBShadow)"/>
          <rect x="6" y="8" width="16" height="4" rx="2" fill="url(#bookBGradient3)" filter="url(#bookBShadow)"/>
          
          {/* Book titles on spines */}
          <text x="14" y="3" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">BRËNDA</text>
          <text x="15" y="7" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">LIBRAVE</text>
          <text x="14" y="11" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">BOOKS</text>
        </g>
        
        {/* Middle horizontal book stack */}
        <g>
          <rect x="6" y="20" width="14" height="4" rx="2" fill="url(#bookBGradient)" filter="url(#bookBShadow)"/>
          <rect x="6" y="24" width="16" height="4" rx="2" fill="url(#bookBGradient2)" filter="url(#bookBShadow)"/>
          
          <text x="13" y="23" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">READING</text>
          <text x="14" y="27" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">STORIES</text>
        </g>
        
        {/* Bottom horizontal book stack */}
        <g>
          <rect x="6" y="36" width="16" height="4" rx="2" fill="url(#bookBGradient3)" filter="url(#bookBShadow)"/>
          <rect x="6" y="40" width="20" height="4" rx="2" fill="url(#bookBGradient)" filter="url(#bookBShadow)"/>
          <rect x="6" y="44" width="18" height="4" rx="2" fill="url(#bookBGradient2)" filter="url(#bookBShadow)"/>
          
          <text x="14" y="39" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">LEARN</text>
          <text x="16" y="43" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">DISCOVER</text>
          <text x="15" y="47" fontSize="2" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">EXPLORE</text>
        </g>
        
        {/* Red B overlay to make the letter clear */}
        <text
          x="15"
          y="32"
          fontSize={Math.floor(currentSize.fontSize * 1.8)}
          fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="900"
          fill="#dc2626"
          textAnchor="middle"
          dominantBaseline="middle"
          opacity="0.8"
          style={{ textShadow: '0 0 4px rgba(255,255,255,0.8)' }}
        >
          B
        </text>
      </g>
      
      {/* L-shaped open book */}
      <g transform="translate(45, 25)">
        <rect
          x="0"
          y="-10"
          width="12"
          height="70"
          rx="6"
          fill="url(#bookBGradient)"
          filter="url(#bookBShadow)"
        />
        <rect
          x="12"
          y="45"
          width="45"
          height="12"
          rx="6"
          fill="url(#bookBGradient)"
          filter="url(#bookBShadow)"
        />
        <rect
          x="2"
          y="-8"
          width="8"
          height="66"
          rx="4"
          fill="#ffffff"
          opacity="0.3"
        />
        <rect
          x="14"
          y="47"
          width="41"
          height="8"
          rx="4"
          fill="#ffffff"
          opacity="0.3"
        />
        <g opacity="0.5">
          <rect x="4" y="5" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="10" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="15" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="20" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="25" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="30" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="4" y="35" width="4" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="18" y="49" width="8" height="1" rx="0.5" fill="#ffffff"/>
          <rect x="18" y="51.5" width="8" height="1" rx="0.5" fill="#ffffff"/>
        </g>
      </g>
    </svg>
  );

  const BookBWhiteLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="bookBWhiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="bookBWhiteGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        <linearGradient id="bookBWhiteGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111827" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <filter id="bookBWhiteShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.4"/>
        </filter>
      </defs>
      
      {/* Clear B shape made from horizontal book stacks */}
      <g transform="translate(12, 15)">
        {/* Left vertical spine of B */}
        <rect
          x="0"
          y="0"
          width="6"
          height="50"
          rx="2"
          fill="url(#bookBWhiteGradient)"
          filter="url(#bookBWhiteShadow)"
        />
        
        {/* Top horizontal book stack */}
        <g>
          <rect x="6" y="0" width="16" height="4" rx="2" fill="url(#bookBWhiteGradient2)" filter="url(#bookBWhiteShadow)"/>
          <rect x="6" y="4" width="18" height="4" rx="2" fill="url(#bookBWhiteGradient)" filter="url(#bookBWhiteShadow)"/>
          <rect x="6" y="8" width="16" height="4" rx="2" fill="url(#bookBWhiteGradient3)" filter="url(#bookBWhiteShadow)"/>
          
          {/* Book titles on spines */}
          <text x="14" y="3" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">BRËNDA</text>
          <text x="15" y="7" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">LIBRAVE</text>
          <text x="14" y="11" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">BOOKS</text>
        </g>
        
        {/* Middle horizontal book stack */}
        <g>
          <rect x="6" y="20" width="14" height="4" rx="2" fill="url(#bookBWhiteGradient)" filter="url(#bookBWhiteShadow)"/>
          <rect x="6" y="24" width="16" height="4" rx="2" fill="url(#bookBWhiteGradient2)" filter="url(#bookBWhiteShadow)"/>
          
          <text x="13" y="23" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">READING</text>
          <text x="14" y="27" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">STORIES</text>
        </g>
        
        {/* Bottom horizontal book stack */}
        <g>
          <rect x="6" y="36" width="16" height="4" rx="2" fill="url(#bookBWhiteGradient3)" filter="url(#bookBWhiteShadow)"/>
          <rect x="6" y="40" width="20" height="4" rx="2" fill="url(#bookBWhiteGradient)" filter="url(#bookBWhiteShadow)"/>
          <rect x="6" y="44" width="18" height="4" rx="2" fill="url(#bookBWhiteGradient2)" filter="url(#bookBWhiteShadow)"/>
          
          <text x="14" y="39" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">LEARN</text>
          <text x="16" y="43" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">DISCOVER</text>
          <text x="15" y="47" fontSize="2" fill="#f9fafb" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">EXPLORE</text>
        </g>
        
        {/* Red B overlay to make the letter clear */}
        <text
          x="15"
          y="32"
          fontSize={Math.floor(currentSize.fontSize * 1.8)}
          fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="900"
          fill="#dc2626"
          textAnchor="middle"
          dominantBaseline="middle"
          opacity="0.9"
          style={{ textShadow: '0 0 6px rgba(255,255,255,0.9)' }}
        >
          B
        </text>
      </g>
      
      {/* L-shaped open book */}
      <g transform="translate(45, 25)">
        <rect
          x="0"
          y="-10"
          width="12"
          height="70"
          rx="6"
          fill="url(#bookBWhiteGradient)"
          filter="url(#bookBWhiteShadow)"
        />
        <rect
          x="12"
          y="45"
          width="45"
          height="12"
          rx="6"
          fill="url(#bookBWhiteGradient)"
          filter="url(#bookBWhiteShadow)"
        />
        <rect
          x="2"
          y="-8"
          width="8"
          height="66"
          rx="4"
          fill="#f9fafb"
          opacity="0.8"
        />
        <rect
          x="14"
          y="47"
          width="41"
          height="8"
          rx="4"
          fill="#f9fafb"
          opacity="0.8"
        />
        <g opacity="0.6">
          <rect x="4" y="5" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="10" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="15" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="20" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="25" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="30" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="4" y="35" width="4" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="18" y="49" width="8" height="1" rx="0.5" fill="#e5e7eb"/>
          <rect x="18" y="51.5" width="8" height="1" rx="0.5" fill="#e5e7eb"/>
        </g>
      </g>
    </svg>
  );

  const BookBMinimalLogo = () => (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 100 100"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="bookBMinimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id="bookBMinimalGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
      </defs>
      
      {/* Clear B shape made from horizontal book stacks - minimal version */}
      <g transform="translate(12, 15)">
        {/* Left vertical spine of B */}
        <rect
          x="0"
          y="0"
          width="5"
          height="50"
          rx="2"
          fill="url(#bookBMinimalGradient)"
        />
        
        {/* Top horizontal book stack */}
        <g>
          <rect x="5" y="0" width="15" height="3" rx="1.5" fill="url(#bookBMinimalGradient2)"/>
          <rect x="5" y="4" width="17" height="3" rx="1.5" fill="url(#bookBMinimalGradient)"/>
          <rect x="5" y="8" width="15" height="3" rx="1.5" fill="url(#bookBMinimalGradient2)"/>
          
          {/* Minimal book titles */}
          <text x="12" y="2.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">BRËNDA</text>
          <text x="13" y="6.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">LIBRAVE</text>
          <text x="12" y="10.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">BOOKS</text>
        </g>
        
        {/* Middle horizontal book stack */}
        <g>
          <rect x="5" y="21" width="13" height="3" rx="1.5" fill="url(#bookBMinimalGradient)"/>
          <rect x="5" y="25" width="15" height="3" rx="1.5" fill="url(#bookBMinimalGradient2)"/>
          
          <text x="11.5" y="23.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">READ</text>
          <text x="12.5" y="27.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">STORY</text>
        </g>
        
        {/* Bottom horizontal book stack */}
        <g>
          <rect x="5" y="38" width="15" height="3" rx="1.5" fill="url(#bookBMinimalGradient2)"/>
          <rect x="5" y="42" width="19" height="3" rx="1.5" fill="url(#bookBMinimalGradient)"/>
          <rect x="5" y="46" width="17" height="3" rx="1.5" fill="url(#bookBMinimalGradient2)"/>
          
          <text x="12" y="40.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">LEARN</text>
          <text x="14" y="44.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">DISCOVER</text>
          <text x="13" y="48.5" fontSize="1.5" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">EXPLORE</text>
        </g>
        
        {/* Red B overlay to make the letter clear */}
        <text
          x="14"
          y="32"
          fontSize={Math.floor(currentSize.fontSize * 1.6)}
          fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="900"
          fill="#dc2626"
          textAnchor="middle"
          dominantBaseline="middle"
          opacity="0.7"
          style={{ textShadow: '0 0 3px rgba(255,255,255,0.7)' }}
        >
          B
        </text>
      </g>
      
      {/* L-shaped open book - minimal */}
      <g transform="translate(45, 25)">
        <rect
          x="0"
          y="-10"
          width="8"
          height="70"
          rx="4"
          fill="url(#bookBMinimalGradient)"
        />
        <rect
          x="8"
          y="45"
          width="45"
          height="8"
          rx="4"
          fill="url(#bookBMinimalGradient)"
        />
        <rect
          x="2"
          y="-8"
          width="4"
          height="66"
          rx="2"
          fill="#ffffff"
          opacity="0.4"
        />
        <rect
          x="10"
          y="47"
          width="41"
          height="4"
          rx="2"
          fill="#ffffff"
          opacity="0.4"
        />
      </g>
    </svg>
  );

  const LogoComponent = () => {
    switch (variant) {
      case 'white':
        return <WhiteLogo />;
      case 'minimal':
        return <MinimalLogo />;
      case 'icon-only':
        return <IconOnlyLogo />;
      case 'inside-book':
        return <InsideBookLogo />;
      case 'inside-book-white':
        return <InsideBookWhiteLogo />;
      case 'modern':
        return <ModernLogo />;
      case 'modern-white':
        return <ModernWhiteLogo />;
      case 'modern-minimal':
        return <ModernMinimalLogo />;
      case 'book-b':
        return <BookBLogo />;
      case 'book-b-white':
        return <BookBWhiteLogo />;
      case 'book-b-minimal':
        return <BookBMinimalLogo />;
      default:
        return <DefaultLogo />;
    }
  };

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="cursor-pointer"
      >
        <LogoComponent />
      </motion.div>
    );
  }

  return <LogoComponent />;
};

// Extended logo with text
interface LogoWithTextProps extends LogoProps {
  showText?: boolean;
  textColor?: string;
}

export const LogoWithText = ({ 
  showText = true, 
  textColor = 'text-gray-900',
  ...logoProps 
}: LogoWithTextProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Logo {...logoProps} />
      {showText && (
        <div className={`${textColor}`}>
          <h1 className="text-xl font-bold">Brënda</h1>
          <p className="text-sm opacity-80">Librave</p>
        </div>
      )}
    </div>
  );
};
