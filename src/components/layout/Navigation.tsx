'use client';

import { useState } from 'react';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Gift,
  Home,
  Info,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  User,
  UserPlus,
  X,
} from 'lucide-react';

import { LiquidButton } from '@/components/ui/LiquidButton';

const navigationItems = [
  { name: 'Kryefaqja', href: '/', icon: Home },
  { name: 'Libra', href: '/books', icon: BookOpen },
  { name: 'Dhuro një Libër', href: '/gift', icon: Gift },
  { name: 'Forumi', href: '/forum', icon: MessageSquare },
  { name: 'Rreth Nesh', href: '/about', icon: Info },
  { name: 'Kontakti', href: '/contact', icon: Mail },
];

export function Navigation() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setIsOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <BookOpen className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 group-hover:from-red-700 group-hover:to-red-900 transition-all duration-200">
              Brënda Librave
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href} className="group">
                <motion.div
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-red-600 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {status === 'loading' ? (
              <div className="animate-pulse">
                <div className="h-8 w-20 bg-gray-300 rounded-lg"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <LiquidButton variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profili
                  </LiquidButton>
                </Link>
                <LiquidButton variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Dil
                </LiquidButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <LiquidButton variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Hyr
                  </LiquidButton>
                </Link>
                <Link href="/auth/register">
                  <LiquidButton variant="albanian" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Regjistrohu
                  </LiquidButton>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-red-600 hover:bg-white/50 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-2 bg-white/95 backdrop-blur-xl">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-white/50 transition-all duration-200"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-gray-200/50 space-y-2">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-white/50 transition-all duration-200"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profili</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-white/50 transition-all duration-200 text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Dil</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-white/50 transition-all duration-200"
                    >
                      <LogIn className="h-5 w-5" />
                      <span className="font-medium">Hyr</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span className="font-medium">Regjistrohu</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
