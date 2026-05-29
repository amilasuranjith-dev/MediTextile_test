"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Layers, RotateCw, ZoomIn, Info } from 'lucide-react';

interface LayerInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  techSpec: string;
  thickness: string;
  color: {
    borderLight: string;
    borderDark: string;
    bgLight: string;
    bgDark: string;
    glow: string;
  };
}

const DRESSING_LAYERS: LayerInfo[] = [
  {
    id: 'top',
    name: 'Liquid-Repellent Sterile Barrier',
    type: 'Barrier Layer',
    description: 'High-density sterile film that prevents bacterial ingress and protects wounds from external fluid contamination while remaining highly breathable.',
    techSpec: 'ISO Class 8 certified EO Grade',
    thickness: '0.08 mm thin',
    color: {
      borderLight: 'border-blue-400',
      borderDark: 'dark:border-blue-400/80',
      bgLight: 'bg-blue-50/70',
      bgDark: 'dark:bg-blue-950/40',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.35)]',
    }
  },
  {
    id: 'middle',
    name: 'Absorbent Long-Fiber Cotton Cushion',
    type: 'Absorption Core',
    description: 'Carded 100% natural medical-grade cotton fibers designed for rapid capillary fluid wicking and maximum exudate storage capacity.',
    techSpec: 'EN 14079 absorption scale > 800%',
    thickness: '3.20 mm loft',
    color: {
      borderLight: 'border-teal-400',
      borderDark: 'dark:border-teal-400/80',
      bgLight: 'bg-teal-50/70',
      bgDark: 'dark:bg-teal-950/40',
      glow: 'shadow-[0_0_25px_rgba(20,184,166,0.35)]',
    }
  },
  {
    id: 'bottom',
    name: 'Non-Adherent Sterile Contact Grid',
    type: 'Wound Contact Layer',
    description: 'Ultra-gentle open-weave gauze mesh coated to prevent adherence to healing tissue, facilitating painless dressing changes and venting excess drainage.',
    techSpec: 'CE Compliance Class Is Sterile Device',
    thickness: '0.45 mm mesh',
    color: {
      borderLight: 'border-slate-350',
      borderDark: 'dark:border-slate-650',
      bgLight: 'bg-slate-50/70',
      bgDark: 'dark:bg-slate-900/40',
      glow: 'shadow-[0_0_20px_rgba(148,163,184,0.25)]',
    }
  }
];

export default function Hero3DVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(15);
  const [rotateY, setRotateY] = useState(-20);
  const [isHovered, setIsHovered] = useState(false);
  const [explodedMode, setExplodedMode] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Disable auto rotate on user hover or custom interactions
  useEffect(() => {
    if (isHovered || selectedLayer || !explodedMode) {
      if (autoRotate) {
        setAutoRotate(false);
      }
      return;
    }

    if (!autoRotate) return;

    let frameId: number;
    let angle = -20;
    const animate = () => {
      angle = (angle + 0.15) % 360;
      setRotateY(angle);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered, selectedLayer, explodedMode, autoRotate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setAutoRotate(false);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert mouse coordinates into rotation values
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt ranges: X axis (up/down tilt) -15deg to 35deg, Y axis (left/right tilt) -45deg to 10deg
    const calcRotateX = 15 - ((y - centerY) / centerY) * 15;
    const calcRotateY = -20 + ((x - centerX) / centerX) * 25;

    setRotateX(calcRotateX);
    setRotateY(calcRotateY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to gentle defaults
    if (!autoRotate) {
      setRotateX(15);
      setRotateY(-20);
      setAutoRotate(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Visualizer Container Box */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[4/3.8] sm:aspect-[4/3.5] lg:aspect-[4/3.8] rounded-3xl border border-gray-150/60 dark:border-slate-800/80 bg-gradient-to-br from-white/80 to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/60 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: '1200px' }}
      >
        {/* Background Grid Pattern & Glowing Orbs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,76,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,76,129,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 bg-secondary/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Canvas Space */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Main 3D Rotating Stack */}
          <motion.div
            className="relative w-[65%] h-[55%] flex items-center justify-center"
            style={{ 
              transformStyle: 'preserve-3d',
              rotateX: rotateX,
              rotateY: rotateY,
            }}
            animate={{
              rotateX: rotateX,
              rotateY: rotateY,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 120, mass: 0.8 }}
          >
            {/* 3D Connecting Light Pillars (Only visible in Exploded Mode) */}
            {explodedMode && (
              <div 
                className="absolute inset-0 flex justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d', transform: 'translateZ(0px)' }}
              >
                {/* 3D laser connecting pillars at corner coordinates */}
                {[-70, 70].map((offsetX) => (
                  [-50, 50].map((offsetZ) => (
                    <div
                      key={`${offsetX}-${offsetZ}`}
                      className="absolute w-[2px] h-[260px] bg-gradient-to-b from-blue-500/10 via-teal-500/25 to-slate-400/10 dark:from-blue-400/20 dark:via-teal-400/30 dark:to-slate-600/25 blur-[1px]"
                      style={{
                        transform: `translateX(${offsetX}px) translateZ(${offsetZ}px) translateY(-50%) rotateX(-90deg)`,
                        transformOrigin: 'center center',
                      }}
                    />
                  ))
                ))}
              </div>
            )}

            {/* Layer 1 (Top): Barrier Layer */}
            <motion.div
              onClick={(e) => { e.stopPropagation(); setSelectedLayer(selectedLayer === 'top' ? null : 'top'); }}
              className={`absolute w-full h-[32px] rounded-2xl border-2 glass ${DRESSING_LAYERS[0].color.borderLight} ${DRESSING_LAYERS[0].color.borderDark} flex flex-col items-center justify-center p-3 shadow-lg cursor-pointer transition-all duration-300 ${selectedLayer === 'top' ? DRESSING_LAYERS[0].color.glow : ''} hover:scale-[1.03]`}
              style={{
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: explodedMode ? -100 : -10,
                z: explodedMode ? 60 : 10,
                opacity: selectedLayer && selectedLayer !== 'top' ? 0.35 : 1,
              }}
              transition={{ type: 'spring', damping: 22, stiffness: 90 }}
            >
              {/* Outer Shell Texture - Blue Sheen */}
              <div className="absolute inset-0 rounded-2xl bg-blue-500/5 dark:bg-blue-400/5 opacity-80" />
              {/* Hexagonal Pattern SVG Background */}
              <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="hex-pattern" width="16" height="27.71" patternUnits="userSpaceOnUse">
                    <path d="M8 0 L16 4.62 L16 13.86 L8 18.48 L0 13.86 L0 4.62 Z M0 27.71 L8 23.09 L16 27.71 M8 18.48 L8 23.09" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500 dark:text-blue-400" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-pattern)" />
              </svg>
              
              <div 
                className="relative z-10 flex items-center justify-between w-full px-2"
                style={{ transform: 'translateZ(10px)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-blue-500/10 dark:bg-blue-400/20 border border-blue-500/30 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                    {DRESSING_LAYERS[0].type}
                  </span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {DRESSING_LAYERS[0].thickness}
                </span>
              </div>
            </motion.div>

            {/* Layer 2 (Middle): Absorber Layer */}
            <motion.div
              onClick={(e) => { e.stopPropagation(); setSelectedLayer(selectedLayer === 'middle' ? null : 'middle'); }}
              className={`absolute w-full h-[40px] rounded-2xl border-2 glass ${DRESSING_LAYERS[1].color.borderLight} ${DRESSING_LAYERS[1].color.borderDark} flex flex-col items-center justify-center p-3 shadow-lg cursor-pointer transition-all duration-300 ${selectedLayer === 'middle' ? DRESSING_LAYERS[1].color.glow : ''} hover:scale-[1.03]`}
              style={{
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: explodedMode ? 0 : 0,
                z: explodedMode ? 0 : 0,
                opacity: selectedLayer && selectedLayer !== 'middle' ? 0.35 : 1,
              }}
              transition={{ type: 'spring', damping: 22, stiffness: 90 }}
            >
              {/* Fluffy cotton texture - fiber patterns */}
              <div className="absolute inset-0 rounded-2xl bg-teal-500/5 dark:bg-teal-400/5 opacity-80" />
              <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="cotton-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-teal-500 dark:text-teal-400" />
                    <path d="M0 15 Q7.5 5 15 15 T30 15" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-teal-500 dark:text-teal-400" />
                    <path d="M15 0 Q25 7.5 15 15 T15 30" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-teal-500 dark:text-teal-400" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cotton-pattern)" />
              </svg>

              <div 
                className="relative z-10 flex items-center justify-between w-full px-2"
                style={{ transform: 'translateZ(10px)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-teal-500/10 dark:bg-teal-400/20 border border-teal-500/30 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                    {DRESSING_LAYERS[1].type}
                  </span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  {DRESSING_LAYERS[1].thickness}
                </span>
              </div>
            </motion.div>

            {/* Layer 3 (Bottom): Contact Mesh */}
            <motion.div
              onClick={(e) => { e.stopPropagation(); setSelectedLayer(selectedLayer === 'bottom' ? null : 'bottom'); }}
              className={`absolute w-full h-[32px] rounded-2xl border-2 glass ${DRESSING_LAYERS[2].color.borderLight} ${DRESSING_LAYERS[2].color.borderDark} flex flex-col items-center justify-center p-3 shadow-lg cursor-pointer transition-all duration-300 ${selectedLayer === 'bottom' ? DRESSING_LAYERS[2].color.glow : ''} hover:scale-[1.03]`}
              style={{
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: explodedMode ? 100 : 10,
                z: explodedMode ? -60 : -10,
                opacity: selectedLayer && selectedLayer !== 'bottom' ? 0.35 : 1,
              }}
              transition={{ type: 'spring', damping: 22, stiffness: 90 }}
            >
              {/* Open mesh weave SVG */}
              <div className="absolute inset-0 rounded-2xl bg-slate-500/5 dark:bg-slate-400/5 opacity-80" />
              <svg className="absolute inset-0 w-full h-full opacity-15 dark:opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="mesh-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="10" y2="0" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-500" />
                    <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-500" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
              </svg>

              <div 
                className="relative z-10 flex items-center justify-between w-full px-2"
                style={{ transform: 'translateZ(10px)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-slate-500/10 dark:bg-slate-400/25 border border-slate-550 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                    {DRESSING_LAYERS[2].type}
                  </span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-gray-650 dark:text-gray-300 border border-gray-300 dark:border-slate-700">
                  {DRESSING_LAYERS[2].thickness}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Callout Lines & Spec Plates (Only Visible on Hover / Large screens) */}
        {explodedMode && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-25">
            {/* Top Layer Flag Pointer */}
            <motion.div 
              className="absolute top-[18%] left-4 bg-white/95 dark:bg-slate-900/95 border border-blue-500/30 dark:border-blue-400/40 p-2.5 rounded-xl shadow-md max-w-[170px]"
              animate={{ opacity: isHovered ? 1 : 0.8, x: isHovered ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-[10px] font-extrabold text-blue-500 dark:text-blue-400 uppercase tracking-widest">01. Protection</h4>
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-200 leading-tight mt-0.5">Semi-permeable film. Fluid barrier, gas permeable.</p>
            </motion.div>

            {/* Middle Layer Flag Pointer */}
            <motion.div 
              className="absolute top-[43%] right-4 bg-white/95 dark:bg-slate-900/95 border border-teal-500/30 dark:border-teal-400/40 p-2.5 rounded-xl shadow-md max-w-[170px]"
              animate={{ opacity: isHovered ? 1 : 0.8, x: isHovered ? -8 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-[10px] font-extrabold text-teal-500 dark:text-teal-400 uppercase tracking-widest">02. Absorber Core</h4>
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-200 leading-tight mt-0.5">Premium cotton fibers. Capillary wicking sponge.</p>
            </motion.div>

            {/* Bottom Layer Flag Pointer */}
            <motion.div 
              className="absolute bottom-[18%] left-4 bg-white/95 dark:bg-slate-900/95 border border-gray-300 dark:border-slate-700 p-2.5 rounded-xl shadow-md max-w-[170px]"
              animate={{ opacity: isHovered ? 1 : 0.8, x: isHovered ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">03. Contact Mesh</h4>
              <p className="text-[9px] font-bold text-gray-700 dark:text-gray-200 leading-tight mt-0.5">Non-adherent weave. Painless wound detachment.</p>
            </motion.div>
          </div>
        )}

        {/* View Controls Overlay inside the Visualizer (Bottom bar) */}
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
          {/* Exploded / Assembled toggle */}
          <button
            onClick={() => setExplodedMode(!explodedMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-750 text-gray-650 dark:text-gray-200 border border-gray-150/60 dark:border-slate-700 shadow-sm text-[10px] font-bold transition-all hover:scale-[1.02]"
            title="Toggle between Exploded Layer view and Compact Product view"
          >
            <ZoomIn className="w-3.5 h-3.5 text-primary dark:text-blue-400" />
            {explodedMode ? 'Assemble Stack' : 'Explode Layers'}
          </button>
          
          {/* Auto spin toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center justify-center p-1.5 rounded-xl border border-gray-150/60 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02] ${autoRotate ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400' : 'bg-white/90 dark:bg-slate-800/90 text-gray-400'}`}
            title="Toggle Autopilot 3D Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>

        {/* Dynamic Drag/Move Cue */}
        {!isHovered && (
          <div className="absolute top-4 left-4 bg-black/5 dark:bg-white/5 border border-gray-150/30 dark:border-slate-800 px-3 py-1.5 rounded-xl pointer-events-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-450 dark:text-gray-500">
              Interactive 3D Stack
            </span>
          </div>
        )}
      </div>

      {/* Selected Layer Specs Panel (Renders details dynamically below the 3D model) */}
      <div className="w-full mt-6 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm transition-all min-h-[110px] flex flex-col justify-center">
        {selectedLayer ? (
          (() => {
            const layer = DRESSING_LAYERS.find(l => l.id === selectedLayer)!;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedLayer === 'top' ? 'bg-blue-500' : selectedLayer === 'middle' ? 'bg-teal-500' : 'bg-gray-450'}`} />
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">{layer.type}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedLayer(null)}
                    className="text-[10px] font-extrabold text-gray-400 hover:text-primary dark:hover:text-blue-400 hover:underline"
                  >
                    Clear Focus
                  </button>
                </div>
                <h4 className="font-heading font-extrabold text-gray-950 dark:text-white text-base">{layer.name}</h4>
                <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed">{layer.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-primary dark:text-blue-400 pt-1">
                  <span>Standard: {layer.techSpec}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-700" />
                  <span>Thickness: {layer.thickness}</span>
                </div>
              </motion.div>
            );
          })()
        ) : (
          <div className="text-center py-2 space-y-1.5">
            <div className="flex justify-center text-gray-300 dark:text-slate-700">
              <Info className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
              Hover visualizer to tilt. Click any layer layer in the 3D model to inspect sterile technical parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
