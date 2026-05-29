import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Activity, Award, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { mockProducts } from '@/utils/mockData';
import Hero3DVisualizer from '@/components/Hero3DVisualizer';

// Fetch products from database, with fallback to mock data
async function getFeaturedProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(3);

    if (error || !data || data.length === 0) {
      return mockProducts.slice(0, 3);
    }
    return data;
  } catch (err) {
    return mockProducts.slice(0, 3);
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-36 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[450px] h-[450px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column (Hero Content) */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Premium Surgical Supplier
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 dark:text-white leading-tight">
                Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-blue-400 dark:to-teal-400">Surgical Dressings</span> for Europe
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                Setting the European standard in sterility, comfort, and safety. ISO 13485 certified cotton bandages, crepe support bands, and surgical gauze designed for medical specialists.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-opacity-95 dark:hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20"
                >
                  Browse Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/quote-request"
                  className="inline-flex justify-center items-center px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  Request Quote
                </Link>
              </div>

              {/* Badges row */}
              <div className="pt-6 flex flex-wrap items-center gap-8 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-semibold">ISO 13485 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-semibold">CE Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-semibold">Sterile EO Grade</span>
                </div>
              </div>
            </div>

            {/* Right Column (Interactive 3D Visualizer) */}
            <div className="relative w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Hero3DVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIFICATION STATS */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-primary dark:text-blue-400">100%</p>
              <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Natural Cotton base</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary dark:text-blue-400">Class Is</p>
              <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medical Device Standard</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary dark:text-blue-400">EN 14079</p>
              <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">European Gauze Standard</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary dark:text-blue-400">24/7</p>
              <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Global B2B Logistics</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATALOG PRODUCTS */}
      <section className="py-24 bg-surface dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-sm font-bold text-primary dark:text-blue-400 uppercase tracking-widest mb-3">Featured Lines</h2>
              <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 dark:text-white">Medical Grade Catalogue</h3>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-primary dark:text-blue-400 font-bold hover:underline group mt-4 md:mt-0"
            >
              Explore all products
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-150/60 dark:border-slate-700 shadow-sm hover:shadow-xl dark:shadow-slate-900/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-video relative bg-slate-50 dark:bg-slate-900 overflow-hidden">
                  <Image
                    src={product.image_url || '/assets/favicon.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.is_sterile && (
                    <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow">
                      Sterile
                    </span>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">{product.category}</span>
                    <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-white mt-1 mb-2">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-700/60 mt-6 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">
                      {product.certifications.join(' • ')}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center text-sm font-bold text-primary dark:text-blue-400 hover:text-secondary"
                    >
                      Specifications
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US / STANDARDS */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left visual box */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl w-full h-96 lg:h-full min-h-[350px] lg:min-h-[450px] bg-slate-50 dark:bg-slate-800 border border-gray-105 dark:border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-950/5 z-10" />
              {/* Fallback pattern representing sterile laboratory */}
              <div className="text-center p-8 z-20">
                <ShieldCheck className="w-16 h-16 text-secondary mx-auto mb-4 animate-pulse" />
                <p className="font-heading font-bold text-xl text-slate-800 dark:text-white">MediTex Quality Validation Lab</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">Rigorous bio-burden testing, pH inspections, stretch test, and EO sterility checks conducted in-house.</p>
              </div>
            </div>

            {/* Right details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-bold text-primary dark:text-blue-400 uppercase tracking-widest mb-3">European Standards</h2>
                <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 dark:text-white">Excellence in Every Thread</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                  We control the manufacturing process chain from premium cotton carding to sterilization and cleanroom packaging. Every shipment conforms strictly to medical supply guidelines.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-primary dark:text-blue-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Full CE Certification</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Certified class-1 sterile medical devices ready for direct deployment in clinical contexts throughout Europe.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Cleanroom Packing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Packaged inside ISO class 8 cleanrooms protecting all bandage reels and cotton rolls from particulate contaminants.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (CTA) */}
      <section className="py-20 bg-primary relative text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight">
            Streamline Your Medical Supply Chain
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Need customized dimensions, private labeling, or bulk sterile orders? Submit a custom B2B inquiry to receive a detailed quote proposal from our European distribution branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/products"
              className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-primary hover:bg-blue-50 rounded-full font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-black/10"
            >
              Browse Catalogue
            </Link>
            <Link
              href="/quote-request"
              className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-blue-700 hover:bg-blue-650 border border-blue-600 rounded-full font-bold transition-all"
            >
              Create Quote Basket
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
