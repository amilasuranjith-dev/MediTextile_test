"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, FileText, Settings } from 'lucide-react';
import { useQuoteCart } from '@/context/QuoteCartContext';

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useQuoteCart();

  // Load theme and scroll state on mount
  useEffect(() => {
    // Initial theme set
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setTheme('light');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Quality Assurance', href: '/quality' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800/50 shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="font-heading font-bold text-2xl text-primary dark:text-blue-400 tracking-tight transition-colors">
              MediTex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-blue-400 ${
                    isActive
                      ? 'text-primary dark:text-blue-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Console shortcut link */}
            <Link
              href="/admin"
              className="text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400 flex items-center gap-1 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-md transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 p-2.5 rounded-full transition-colors focus:outline-none"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            {/* B2B Quote cart Button */}
            <Link
              href="/quote-request"
              className="relative inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all transform hover:scale-105 shadow-md shadow-primary/10"
            >
              <FileText className="w-4 h-4" />
              Request Quote
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Navigation controls */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 p-2.5 rounded-full transition-colors focus:outline-none"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            <Link
              href="/quote-request"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors"
            >
              <FileText className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 p-2.5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shadow-xl absolute w-full left-0 z-40 transition-all duration-300 animate-fade-in-up">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                    isActive
                      ? 'text-primary dark:text-blue-400 bg-blue-50/50 dark:bg-slate-700/50 font-bold'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors border-t border-gray-100 dark:border-slate-700 mt-2"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
