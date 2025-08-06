'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ReactReader } from 'react-reader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookmarkIcon, 
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

interface Bookmark {
  id: string;
  cfi: string;
  excerpt: string;
  created: Date;
  chapter?: string;
}

interface Highlight {
  id: string;
  cfi: string;
  text: string;
  created: Date;
  color: string;
}

interface SecureEbookReaderProps {
  bookId: string;
  ebookUrl: string;
  title: string;
  author: string;
  rentalId: string;
  securityToken: string;
  onClose: () => void;
  onSecurityViolation: (violation: string) => void;
}

interface ReaderSettings {
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
  fontFamily: string;
  lineHeight: number;
}

interface SecurityState {
  devToolsOpen: boolean;
  fullscreenExit: boolean;
  textSelection: boolean;
  screenshotAttempt: boolean;
  suspiciousActivity: boolean;
  lastActivity: Date;
}

export function SecureEbookReader({ 
  bookId, 
  ebookUrl, 
  title, 
  author, 
  rentalId, 
  securityToken,
  onClose,
  onSecurityViolation 
}: SecureEbookReaderProps) {
  const { data: session } = useSession();
  const [location, setLocation] = useState<string | number>(0);
  const [rendition, setRendition] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [currentBookmark, setCurrentBookmark] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState('');
  const [toc, setToc] = useState<any[]>([]);
  const [securityState, setSecurityState] = useState<SecurityState>({
    devToolsOpen: false,
    fullscreenExit: false,
    textSelection: false,
    screenshotAttempt: false,
    suspiciousActivity: false,
    lastActivity: new Date()
  });
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    theme: 'light',
    fontFamily: 'Georgia',
    lineHeight: 1.6
  });

  const hideControlsTimer = useRef<NodeJS.Timeout>();
  const readingStartTime = useRef<Date>();
  const securityCheckInterval = useRef<NodeJS.Timeout>();
  const activityTimeout = useRef<NodeJS.Timeout>();

  // 🔒 SECURITY FUNCTIONS

  // Disable right-click context menu
  const disableContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // Disable text selection
  const disableTextSelection = useCallback(() => {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
  }, []);

  // Re-enable text selection (for accessibility)
  const enableTextSelection = useCallback(() => {
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    document.body.style.msUserSelect = '';
  }, []);

  // Detect developer tools
  const detectDevTools = useCallback(() => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      setSecurityState(prev => ({ ...prev, devToolsOpen: true }));
      onSecurityViolation('Developer tools detected');
      return true;
    }
    return false;
  }, [onSecurityViolation]);

  // Detect fullscreen exit
  const detectFullscreenExit = useCallback(() => {
    if (!document.fullscreenElement) {
      setSecurityState(prev => ({ ...prev, fullscreenExit: true }));
      onSecurityViolation('Fullscreen mode exited');
      return true;
    }
    return false;
  }, [onSecurityViolation]);

  // Detect screenshot attempts
  const detectScreenshotAttempt = useCallback((e: KeyboardEvent) => {
    // Detect common screenshot shortcuts
    const isScreenshotShortcut = (
      (e.ctrlKey && e.key === 'p') || // Print
      (e.ctrlKey && e.shiftKey && e.key === 'I') || // Dev tools
      (e.ctrlKey && e.shiftKey && e.key === 'C') || // Dev tools
      (e.ctrlKey && e.shiftKey && e.key === 'J') || // Dev tools
      (e.key === 'F12') || // F12
      (e.ctrlKey && e.key === 'u') || // View source
      (e.ctrlKey && e.shiftKey && e.key === 'u') // View source
    );

    if (isScreenshotShortcut) {
      e.preventDefault();
      setSecurityState(prev => ({ ...prev, screenshotAttempt: true }));
      onSecurityViolation('Screenshot attempt detected');
      return true;
    }
    return false;
  }, [onSecurityViolation]);

  // Monitor user activity
  const updateActivity = useCallback(() => {
    setSecurityState(prev => ({ ...prev, lastActivity: new Date() }));
  }, []);

  // Security monitoring interval
  const startSecurityMonitoring = useCallback(() => {
    securityCheckInterval.current = setInterval(() => {
      detectDevTools();
      detectFullscreenExit();
      
      // Check for inactivity (more than 5 minutes)
      const now = new Date();
      const timeSinceActivity = now.getTime() - securityState.lastActivity.getTime();
      if (timeSinceActivity > 5 * 60 * 1000) { // 5 minutes
        setSecurityState(prev => ({ ...prev, suspiciousActivity: true }));
        onSecurityViolation('Inactivity detected');
      }
    }, 1000); // Check every second
  }, [detectDevTools, detectFullscreenExit, securityState.lastActivity, onSecurityViolation]);

  // Stop security monitoring
  const stopSecurityMonitoring = useCallback(() => {
    if (securityCheckInterval.current) {
      clearInterval(securityCheckInterval.current);
    }
  }, []);

  // Log security event to server
  const logSecurityEvent = useCallback(async (eventType: string, details?: any) => {
    try {
      await fetch(`/api/books/${bookId}/security-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId,
          securityToken,
          eventType,
          details,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [bookId, rentalId, securityToken]);

  // Initialize security measures
  useEffect(() => {
    // Apply security measures
    disableTextSelection();
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', detectScreenshotAttempt);
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('scroll', updateActivity);
    document.addEventListener('click', updateActivity);

    // Start security monitoring
    startSecurityMonitoring();

    // Request fullscreen
    const requestFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.log('Fullscreen not supported or denied');
      }
    };
    requestFullscreen();

    // Cleanup function
    return () => {
      enableTextSelection();
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', detectScreenshotAttempt);
      document.removeEventListener('mousemove', updateActivity);
      document.removeEventListener('keydown', updateActivity);
      document.removeEventListener('scroll', updateActivity);
      document.removeEventListener('click', updateActivity);
      stopSecurityMonitoring();
      
      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [disableTextSelection, enableTextSelection, disableContextMenu, detectScreenshotAttempt, updateActivity, startSecurityMonitoring, stopSecurityMonitoring]);

  // Monitor security state changes
  useEffect(() => {
    if (securityState.devToolsOpen || securityState.fullscreenExit || securityState.screenshotAttempt || securityState.suspiciousActivity) {
      setShowSecurityWarning(true);
      logSecurityEvent('security_violation', securityState);
    }
  }, [securityState, logSecurityEvent]);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    setShowControls(true);
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Mouse movement handler
  const handleMouseMove = useCallback(() => {
    resetHideTimer();
    updateActivity();
  }, [resetHideTimer, updateActivity]);

  // Load reading progress and bookmarks
  useEffect(() => {
    if (session?.user && bookId) {
      loadReadingData();
      readingStartTime.current = new Date();
    }
  }, [session, bookId]);

  // Apply reader settings
  useEffect(() => {
    if (rendition) {
      applyReaderSettings();
    }
  }, [rendition, settings]);

  const loadReadingData = async () => {
    try {
      const response = await fetch(`/api/books/${bookId}/reading-progress?rentalId=${rentalId}&token=${securityToken}`);
      if (response.ok) {
        const data = await response.json();
        if (data.currentCfi) {
          setLocation(data.currentCfi);
        }
        setBookmarks(data.bookmarks || []);
        setHighlights(data.highlights || []);
        setProgress(data.progress || 0);
      }
    } catch (error) {
      console.error('Failed to load reading data:', error);
    }
  };

  const saveReadingProgress = async (cfi: string, progressPercent: number) => {
    if (!session?.user) return;

    try {
      await fetch(`/api/books/${bookId}/reading-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId,
          securityToken,
          currentCfi: cfi,
          progress: progressPercent,
          readingTime: readingStartTime.current 
            ? Math.floor((Date.now() - readingStartTime.current.getTime()) / 60000)
            : 0
        })
      });
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  };

  const applyReaderSettings = () => {
    if (!rendition) return;

    const themes = {
      light: {
        body: {
          'background': '#ffffff',
          'color': '#000000'
        }
      },
      dark: {
        body: {
          'background': '#1a1a1a',
          'color': '#e5e5e5'
        }
      },
      sepia: {
        body: {
          'background': '#f4f1ea',
          'color': '#5c4b37'
        }
      }
    };

    rendition.themes.register('current', themes[settings.theme]);
    rendition.themes.select('current');
    
    rendition.themes.fontSize(`${settings.fontSize}px`);
    rendition.themes.font(settings.fontFamily);
    
    rendition.themes.override('line-height', settings.lineHeight.toString());
  };

  const handleLocationChanged = (cfi: string) => {
    setLocation(cfi);
    
    // Calculate progress
    if (rendition) {
      const progress = rendition.book.locations.percentageFromCfi(cfi);
      setProgress(Math.round(progress * 100));
      saveReadingProgress(cfi, Math.round(progress * 100));
    }

    // Update current chapter
    if (toc.length > 0) {
      const currentChapter = rendition.book.navigation.get(cfi);
      setCurrentChapter(currentChapter?.label || '');
    }
  };

  const handleRenditionReady = (rend: any) => {
    setRendition(rend);
    setIsLoaded(true);

    // Setup keyboard controls
    rend.on('keyup', (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        rend.prev();
      } else if (event.key === 'ArrowRight') {
        rend.next();
      }
    });

    // Load table of contents
    rend.book.loaded.navigation.then((nav: any) => {
      setToc(nav.toc);
    });

    // Generate locations for progress tracking
    rend.book.locations.generate(1024).then(() => {
      console.log('Locations generated');
    });
  };

  const addBookmark = async () => {
    if (!rendition || !session?.user) return;

    const cfi = rendition.currentLocation().start.cfi;
    const range = await rendition.getRange(cfi);
    const excerpt = range.toString().slice(0, 100) + '...';

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      cfi,
      excerpt,
      created: new Date(),
      chapter: currentChapter
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    setCurrentBookmark(newBookmark.id);

    // Save to database
    try {
      await fetch(`/api/books/${bookId}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBookmark,
          rentalId,
          securityToken
        })
      });
    } catch (error) {
      console.error('Failed to save bookmark:', error);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    
    if (currentBookmark === bookmarkId) {
      setCurrentBookmark(null);
    }

    try {
      await fetch(`/api/books/${bookId}/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rentalId, securityToken })
      });
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const goToBookmark = (cfi: string) => {
    if (rendition) {
      rendition.display(cfi);
    }
  };

  const getCurrentBookmark = () => {
    if (!rendition) return null;
    const currentCfi = rendition.currentLocation()?.start?.cfi;
    return bookmarks.find(b => b.cfi === currentCfi);
  };

  const isCurrentlyBookmarked = () => {
    return getCurrentBookmark() !== undefined;
  };

  const handleClose = () => {
    logSecurityEvent('rental_end', { progress, readingTime: readingStartTime.current });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Security Warning */}
      <AnimatePresence>
        {showSecurityWarning && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            <GlassCard className="m-4 p-4 bg-red-500/20 border-red-500/50">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-white font-medium">Security Warning</h3>
                  <p className="text-red-200 text-sm">
                    Suspicious activity detected. Your session is being monitored.
                  </p>
                </div>
                <Button
                  onClick={() => setShowSecurityWarning(false)}
                  variant="ghost"
                  size="sm"
                  className="text-red-200 hover:text-white"
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reader Container */}
      <div className="relative w-full h-full">
        <ReactReader
          url={ebookUrl}
          location={location}
          locationChanged={handleLocationChanged}
          getRendition={handleRenditionReady}
          epubOptions={{
            flow: 'paginated',
            manager: 'default',
            allowScriptedContent: true
          }}
          readerStyles={undefined}
        />

        {/* Top Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-0 right-0 z-10"
            >
              <GlassCard className="m-4 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleClose}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </Button>
                    <div>
                      <h1 className="text-lg font-medium text-white truncate max-w-md">
                        {title}
                      </h1>
                      <p className="text-sm text-gray-300">{author}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-green-400">
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span className="text-xs">Secure</span>
                    </div>
                    <Button
                      onClick={addBookmark}
                      variant="ghost"
                      size="sm"
                      className={`${
                        isCurrentlyBookmarked() 
                          ? 'text-yellow-400' 
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      {isCurrentlyBookmarked() ? (
                        <BookmarkSolidIcon className="w-5 h-5" />
                      ) : (
                        <BookmarkIcon className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowSettings(!showSettings)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>{currentChapter || 'Reading...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Controls */}
        <AnimatePresence>
          {showControls && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              >
                <Button
                  onClick={() => rendition?.prev()}
                  variant="ghost"
                  size="lg"
                  className="text-white/70 hover:text-white bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <Button
                  onClick={() => rendition?.next()}
                  variant="ghost"
                  size="lg"
                  className="text-white/70 hover:text-white bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-4 top-20 bottom-4 w-80"
            >
              <GlassCard className="h-full p-6 overflow-y-auto">
                <h3 className="text-lg font-medium text-white mb-6">Reading Settings</h3>

                {/* Font Size */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Font Size
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => setSettings(prev => ({ 
                        ...prev, 
                        fontSize: Math.max(12, prev.fontSize - 2) 
                      }))}
                      variant="ghost"
                      size="sm"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                    <span className="text-white min-w-[3rem] text-center">
                      {settings.fontSize}px
                    </span>
                    <Button
                      onClick={() => setSettings(prev => ({ 
                        ...prev, 
                        fontSize: Math.min(24, prev.fontSize + 2) 
                      }))}
                      variant="ghost"
                      size="sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Theme */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'light' as const, icon: SunIcon, label: 'Light' },
                      { key: 'dark' as const, icon: MoonIcon, label: 'Dark' },
                      { key: 'sepia' as const, icon: SunIcon, label: 'Sepia' }
                    ].map(({ key, icon: Icon, label }) => (
                      <Button
                        key={key}
                        onClick={() => setSettings(prev => ({ ...prev, theme: key }))}
                        variant={settings.theme === key ? 'primary' : 'ghost'}
                        size="sm"
                        className="flex flex-col items-center space-y-1 h-auto py-3"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      fontFamily: e.target.value 
                    }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="system-ui">System Font</option>
                  </select>
                </div>

                {/* Bookmarks */}
                <div>
                  <h4 className="text-md font-medium text-white mb-3">
                    Bookmarks ({bookmarks.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                        onClick={() => goToBookmark(bookmark.cfi)}
                      >
                        <p className="text-sm text-gray-300 truncate">
                          {bookmark.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {bookmark.chapter}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBookmark(bookmark.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-400"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {bookmarks.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No bookmarks yet
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <GlassCard className="p-8">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent"></div>
                <div>
                  <p className="text-white font-medium">Loading your secure ebook...</p>
                  <p className="text-gray-400 text-sm">{title}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
} 