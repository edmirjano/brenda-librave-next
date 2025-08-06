'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

interface TermsAndConditions {
  id: string;
  title: string;
  version: string;
  content: string;
  type: string;
  effectiveDate: Date;
}

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (acceptanceData: {
    termsId: string;
    readTime: number;
    scrollDepth: number;
    confirmedRead: boolean;
    confirmedUnderstand: boolean;
  }) => void;
  terms: TermsAndConditions;
  rentalType?: string;
  hardcopyRentalType?: string;
  audioBookRentalType?: string;
  subscriptionType?: string;
}

export function TermsAndConditionsModal({
  isOpen,
  onClose,
  onAccept,
  terms,
  rentalType,
  hardcopyRentalType,
  audioBookRentalType,
  subscriptionType
}: TermsAndConditionsModalProps) {
  const [readTime, setReadTime] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [confirmedRead, setConfirmedRead] = useState(false);
  const [confirmedUnderstand, setConfirmedUnderstand] = useState(false);
  const [isReading, setIsReading] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const readTimerRef = useRef<NodeJS.Timeout>();

  // Start reading timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsReading(true);
      startTimeRef.current = Date.now();
      readTimerRef.current = setInterval(() => {
        setReadTime(prev => prev + 1);
      }, 1000);
    } else {
      setIsReading(false);
      setReadTime(0);
      setScrollDepth(0);
      setConfirmedRead(false);
      setConfirmedUnderstand(false);
      if (readTimerRef.current) {
        clearInterval(readTimerRef.current);
      }
    }

    return () => {
      if (readTimerRef.current) {
        clearInterval(readTimerRef.current);
      }
    };
  }, [isOpen]);

  // Track scroll depth
  const handleScroll = () => {
    if (contentRef.current) {
      const element = contentRef.current;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      
      const depth = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setScrollDepth(Math.max(scrollDepth, depth));
    }
  };

  // Handle accept button
  const handleAccept = () => {
    if (!confirmedRead || !confirmedUnderstand) {
      return;
    }

    onAccept({
      termsId: terms.id,
      readTime,
      scrollDepth,
      confirmedRead,
      confirmedUnderstand
    });
  };

  // Check if user has read enough (at least 80% scroll depth and 30 seconds)
  const hasReadEnough = scrollDepth >= 80 && readTime >= 30;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <GlassCard className="relative h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {terms.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Version {terms.version} • Effective {new Date(terms.effectiveDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <div 
                  ref={contentRef}
                  onScroll={handleScroll}
                  className="h-full overflow-y-auto p-6 prose prose-sm max-w-none"
                  style={{ maxHeight: 'calc(90vh - 200px)' }}
                >
                  <div 
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: terms.content.replace(/\n/g, '<br/>') }}
                  />
                </div>
              </div>

              {/* Progress and Controls */}
              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                {/* Reading Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="w-4 h-4" />
                      <span>Reading Progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{readTime}s</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(scrollDepth, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{scrollDepth}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Requirements:</p>
                      <ul className="space-y-1">
                        <li>• You must scroll through at least 80% of the terms</li>
                        <li>• You must spend at least 30 seconds reading</li>
                        <li>• You must confirm that you have read and understood the terms</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Confirmation Checkboxes */}
                <div className="space-y-3 mb-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmedRead}
                      onChange={(e) => setConfirmedRead(e.target.checked)}
                      disabled={!hasReadEnough}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${hasReadEnough ? 'text-gray-700' : 'text-gray-400'}`}>
                      I confirm that I have read the complete terms and conditions
                    </span>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmedUnderstand}
                      onChange={(e) => setConfirmedUnderstand(e.target.checked)}
                      disabled={!hasReadEnough}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${hasReadEnough ? 'text-gray-700' : 'text-gray-400'}`}>
                      I understand and agree to comply with all terms and conditions
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {hasReadEnough ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Requirements met</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <ClockIcon className="w-4 h-4" />
                        <span>Please continue reading</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      variant="primary"
                      onClick={handleAccept}
                      disabled={!confirmedRead || !confirmedUnderstand || !hasReadEnough}
                    >
                      Accept Terms
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 