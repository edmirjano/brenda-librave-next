'use client';

import { useCallback, useRef, useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Button } from './Button';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: number; // width/height ratio
  maxSize?: number; // in MB
  quality?: number; // WebP quality 0-1
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = 3 / 4, // Default book cover ratio
  maxSize = 5, // 5MB default
  quality = 0.8,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebP = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new window.Image();

        img.onload = () => {
          // Calculate dimensions maintaining aspect ratio
          const maxWidth = 800;
          const maxHeight = maxWidth / aspectRatio;

          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and convert to WebP
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              } else {
                reject(new Error('Failed to convert image'));
              }
            },
            'image/webp',
            quality
          );
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    },
    [aspectRatio, quality]
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      const file = files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Ju lutem zgjidhni një imazh të vlefshëm.');
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Imazhi duhet të jetë më i vogël se ${maxSize}MB.`);
        return;
      }

      setUploading(true);
      try {
        // Convert to WebP
        const webpDataUrl = await convertToWebP(file);

        // TODO: Upload to your storage service (S3, Cloudinary, etc.)
        // For now, we'll just use the data URL
        onChange(webpDataUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Gabim në përpunimin e imazhit. Ju lutem provoni përsëri.');
      } finally {
        setUploading(false);
      }
    },
    [convertToWebP, maxSize, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {value ? (
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-lg border border-gray-200"
            style={{ aspectRatio }}
          >
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="flex justify-between mt-2">
            <Button variant="outline" size="sm" onClick={openFileDialog} disabled={uploading}>
              🔄 Ndrysho
            </Button>

            {onRemove && (
              <Button variant="destructive" size="sm" onClick={onRemove} disabled={uploading}>
                🗑️ Hiq
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
            uploading && 'opacity-50 pointer-events-none'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{ aspectRatio }}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                className="w-8 h-8 text-blue-500 animate-spin mb-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-sm text-gray-600">Duke ngarkuar...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <p className="text-sm text-gray-600 mb-2">
                Zvarritni imazhit këtu ose klikoni për të zgjedhur
              </p>

              <p className="text-xs text-gray-500 mb-4">PNG, JPG, WebP deri në {maxSize}MB</p>

              <Button variant="outline" onClick={openFileDialog} disabled={uploading}>
                📁 Zgjidhni Imazh
              </Button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
