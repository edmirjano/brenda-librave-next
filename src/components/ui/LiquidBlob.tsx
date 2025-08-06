'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useIsClient } from '@/hooks/useIsClient';

interface LiquidBlobProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'red' | 'green' | 'pink';
  opacity?: number;
  position?: {
    x: number;
    y: number;
  };
  floating?: boolean;
  morphing?: boolean;
  className?: string;
}

export const LiquidBlob = ({
  size = 'md',
  color = 'blue',
  opacity = 0.6,
  position = { x: 50, y: 50 },
  floating = true,
  morphing = true,
  className = '',
}: LiquidBlobProps) => {
  const [morphState, setMorphState] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (morphing && isClient) {
      const interval = setInterval(() => {
        setMorphState(prev => prev + 1);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [morphing, isClient]);

  // Don't render anything until mounted on client
  if (!isClient) {
    return null;
  }

  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  const colors = {
    blue: 'from-blue-400/40 via-cyan-300/30 to-blue-500/40',
    purple: 'from-purple-400/40 via-pink-300/30 to-purple-500/40',
    red: 'from-red-400/40 via-orange-300/30 to-red-500/40',
    green: 'from-green-400/40 via-emerald-300/30 to-green-500/40',
    pink: 'from-pink-400/40 via-rose-300/30 to-pink-500/40',
  };

  // Dynamic blob shape using CSS clip-path and border-radius
  const getBlobPath = (state: number) => {
    const shapes = [
      // Organic blob shapes
      '60% 40% 30% 70% / 60% 30% 70% 40%',
      '30% 60% 70% 40% / 50% 60% 30% 60%', 
      '50% 50% 80% 20% / 40% 70% 60% 30%',
      '70% 30% 40% 60% / 60% 40% 80% 20%',
      '40% 60% 60% 40% / 70% 30% 50% 70%',
    ];
    
    return shapes[state % shapes.length];
  };

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={`
        absolute pointer-events-none select-none
        ${sizes[size]}
        ${className}
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
      variants={floating ? floatingVariants : {}}
      animate={floating ? 'float' : {}}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {/* Main blob */}
      <div
        className={`
          w-full h-full
          bg-gradient-to-br ${colors[color]}
          backdrop-blur-3xl
          blur-xl
        `}
        style={{
          borderRadius: getBlobPath(morphState),
          transition: 'border-radius 4s ease-in-out',
        }}
      />

      {/* Inner glow */}
      <motion.div
        className={`
          absolute inset-4
          bg-gradient-to-br ${colors[color]}
          opacity-60
          blur-lg
        `}
        style={{
          borderRadius: getBlobPath(morphState + 1),
          transition: 'border-radius 4s ease-in-out',
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Core highlight */}
      <motion.div
        className={`
          absolute inset-8
          bg-gradient-to-br from-white/20 to-transparent
          blur-md
        `}
        style={{
          borderRadius: getBlobPath(morphState + 2),
          transition: 'border-radius 4s ease-in-out',
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

// Background component with multiple floating blobs
interface LiquidBackgroundProps {
  blobCount?: number;
  children?: React.ReactNode;
  className?: string;
}

export const LiquidBackground = ({
  blobCount = 5,
  children,
  className = '',
}: LiquidBackgroundProps) => {
  const isClient = useIsClient();

  const generateBlobs = () => {
    const blobs = [];
    const colors: Array<'blue' | 'purple' | 'red' | 'green' | 'pink'> = ['blue', 'purple', 'red', 'green', 'pink'];
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];

    // Use deterministic positions to avoid hydration issues
    const predefinedPositions = [
      { x: 15, y: 20 },
      { x: 75, y: 15 },
      { x: 25, y: 70 },
      { x: 85, y: 60 },
      { x: 50, y: 40 },
      { x: 10, y: 85 },
      { x: 90, y: 30 },
      { x: 60, y: 80 },
    ];

    for (let i = 0; i < blobCount; i++) {
      const posIndex = i % predefinedPositions.length;
      blobs.push({
        id: i,
        position: predefinedPositions[posIndex],
        color: colors[i % colors.length],
        size: sizes[i % sizes.length],
        opacity: 0.2 + (i * 0.1) % 0.4, // Deterministic opacity 0.2-0.6
      });
    }

    return blobs;
  };

  const [blobs] = useState(() => generateBlobs());

  if (!isClient) {
    return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Liquid blobs */}
      <div className="absolute inset-0 -z-10">
        {blobs.map((blob) => (
          <LiquidBlob
            key={blob.id}
            position={blob.position}
            color={blob.color}
            size={blob.size}
            opacity={blob.opacity}
            floating={true}
            morphing={true}
          />
        ))}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};