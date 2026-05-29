import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-20 pb-10 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <span className="font-heading font-bold text-2xl text-white tracking-tight mb-6 block">
              MediTex
            </span>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Premium surgical dressings, crepe bands, lint, and cotton products tailored for professional healthcare sectors and hospitals across Europe.
            </p>
            <div className="flex gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Sterile Facility
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ISO Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-base mb-6 tracking-wide">Company Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products Catalogue
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors">
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  Management Access <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-bold text-white text-base mb-6 tracking-wide">Featured Lines</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/products?category=Bandages" className="hover:text-white transition-colors">
                  Cotton & Crepe Bandages
                </Link>
              </li>
              <li>
                <Link href="/products?category=Cotton Products" className="hover:text-white transition-colors">
                  Surgical Cotton Wool
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gauze Products" className="hover:text-white transition-colors">
                  Absorbent Swabs & Gauze
                </Link>
              </li>
              <li>
                <Link href="/products?category=Cotton Products" className="hover:text-white transition-colors">
                  Cotton Lint dressing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-base mb-6 tracking-wide">Contact Details</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 leading-relaxed">
                  123 Medical Park, <br />
                  Brussels, Belgium
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href="mailto:export@meditex.eu" className="hover:text-white transition-colors">
                  export@meditex.eu
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-gray-400">+32 2 555 0199</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-800 pt-8 text-center text-gray-500 text-xs flex flex-col sm:flex-row justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} MediTex Medical Ltd. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Regulatory Filings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
