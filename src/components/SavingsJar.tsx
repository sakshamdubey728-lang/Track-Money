import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, DollarSign, Coins } from "lucide-react";

interface SavingsJarProps {
  savingsRate: number; // 0 to 100
  totalSaved: number;
  totalGoalTarget: number;
  currencySymbol: string;
}

interface DropItem {
  id: number;
  type: "coin" | "note";
  left: number; // percentage left offset
  rotation: number;
  scale: number;
  driftX?: number;
}

export default function SavingsJar({
  savingsRate,
  totalSaved,
  totalGoalTarget,
  currencySymbol,
}: SavingsJarProps) {
  const [items, setItems] = useState<DropItem[]>([]);
  const [triggerCoinCount, setTriggerCoinCount] = useState(0);

  // Determine display fill percentage
  // If user has goals, let’s represent the actual goal progression, otherwise fallback to standard savingsRate
  const fillPercentage = totalGoalTarget > 0 
    ? Math.min(100, Math.max(0, (totalSaved / totalGoalTarget) * 100))
    : Math.min(100, Math.max(0, savingsRate));

  // Pre-calculated piled coins and cash notes that fill the jar contextually based on fillPercentage
  const staticPiledItems = React.useMemo(() => {
    // 22 golden and silver coins establishing a sturdy bottom bedding
    const coinsDef = [
      // Bottom-most layer (threshold 1% - 12%)
      { x: 48, y: 244, rotation: -12, scale: 0.95, threshold: 1, variant: 0 },
      { x: 67, y: 245, rotation: 8, scale: 1.0, threshold: 3, variant: 1 },
      { x: 88, y: 246, rotation: -5, scale: 0.9, threshold: 5, variant: 0 },
      { x: 108, y: 245, rotation: 15, scale: 1.05, threshold: 7, variant: 1 },
      { x: 130, y: 244, rotation: -20, scale: 0.98, threshold: 9, variant: 0 },
      { x: 148, y: 243, rotation: 25, scale: 1.0, threshold: 11, variant: 1 },

      // Inside layer slightly on top (threshold 13% - 24%)
      { x: 58, y: 238, rotation: 35, scale: 0.95, threshold: 13, variant: 1 },
      { x: 78, y: 239, rotation: -40, scale: 1.02, threshold: 15, variant: 0 },
      { x: 98, y: 240, rotation: 12, scale: 0.88, threshold: 18, variant: 1 },
      { x: 118, y: 239, rotation: -18, scale: 1.0, threshold: 21, variant: 0 },
      { x: 138, y: 237, rotation: 50, scale: 0.97, threshold: 24, variant: 1 },

      // Third layer forming a beautiful stable coin bedrock (threshold 25% - 35%)
      { x: 50, y: 231, rotation: -65, scale: 1.0, threshold: 26, variant: 0 },
      { x: 69, y: 233, rotation: 28, scale: 0.93, threshold: 28, variant: 1 },
      { x: 89, y: 232, rotation: -15, scale: 1.05, threshold: 30, variant: 0 },
      { x: 109, y: 234, rotation: 42, scale: 0.9, threshold: 32, variant: 1 },
      { x: 129, y: 232, rotation: -35, scale: 1.0, threshold: 34, variant: 1 },
      { x: 146, y: 229, rotation: 55, scale: 0.95, threshold: 36, variant: 0 },
      
      // Top-most coins layer capping the coin base (threshold 37% - 43%)
      { x: 62, y: 224, rotation: -10, scale: 1.03, threshold: 38, variant: 1 },
      { x: 81, y: 225, rotation: 18, scale: 0.92, threshold: 40, variant: 0 },
      { x: 100, y: 224, rotation: -48, scale: 1.02, threshold: 41, variant: 1 },
      { x: 120, y: 223, rotation: 30, scale: 0.88, threshold: 42, variant: 0 },
      { x: 138, y: 222, rotation: -25, scale: 1.0, threshold: 43, variant: 1 }
    ];

    // 17 hand-curated cash banknotes layered and standing semi-upright on top of the coins base
    const notesDef = [
      // Bottom of the paper bill stack, resting on coins (threshold 44% - 58%)
      { x: 55, y: 211, rotation: -32, scale: 1.25, threshold: 44, variant: 0 },
      { x: 92, y: 214, rotation: 12, scale: 1.35, threshold: 47, variant: 1 },
      { x: 135, y: 210, rotation: 45, scale: 1.3, threshold: 50, variant: 2 },
      { x: 74, y: 201, rotation: -18, scale: 1.4, threshold: 54, variant: 1 },
      { x: 114, y: 197, rotation: 25, scale: 1.28, threshold: 58, variant: 0 },

      // Middle layers (threshold 59% - 79%)
      { x: 52, y: 182, rotation: 55, scale: 1.32, threshold: 62, variant: 2 },
      { x: 95, y: 184, rotation: -15, scale: 1.42, threshold: 66, variant: 0 },
      { x: 138, y: 178, rotation: -50, scale: 1.35, threshold: 70, variant: 1 },
      { x: 72, y: 164, rotation: 38, scale: 1.45, threshold: 74, variant: 0 },
      { x: 112, y: 159, rotation: -42, scale: 1.38, threshold: 78, variant: 2 },

      // Upper/neck layers (threshold 80% - 100%)
      { x: 58, y: 141, rotation: -25, scale: 1.45, threshold: 82, variant: 1 },
      { x: 98, y: 138, rotation: 14, scale: 1.48, threshold: 86, variant: 0 },
      { x: 132, y: 134, rotation: 62, scale: 1.4, threshold: 90, variant: 2 },
      { x: 75, y: 114, rotation: -55, scale: 1.42, threshold: 93, variant: 1 },
      { x: 118, y: 111, rotation: 35, scale: 1.48, threshold: 96, variant: 0 },
      { x: 96, y: 91, rotation: -10, scale: 1.45, threshold: 98, variant: 2 },
      { x: 100, y: 77, rotation: 5, scale: 1.35, threshold: 100, variant: 1 }
    ];

    const list: any[] = [];
    
    // 1. Add coins
    coinsDef.forEach((c, idx) => {
      list.push({
        id: `coin-${idx}-${c.x}-${c.y}`,
        x: c.x,
        y: c.y,
        type: "coin" as const,
        rotation: c.rotation,
        scale: c.scale,
        threshold: c.threshold,
        variant: c.variant
      });
    });

    // 2. Add bills
    notesDef.forEach((n, idx) => {
      list.push({
        id: `note-${idx}-${n.x}-${n.y}`,
        x: n.x,
        y: n.y,
        type: "note" as const,
        rotation: n.rotation,
        scale: n.scale,
        threshold: n.threshold,
        variant: n.variant
      });
    });

    return list;
  }, [currencySymbol]);

  // Trigger continuous random sparkles at high savings rates
  const [showSparkles, setShowSparkles] = useState(false);
  useEffect(() => {
    if (fillPercentage > 50) {
      setShowSparkles(true);
    } else {
      setShowSparkles(false);
    }
  }, [fillPercentage]);

  // Handle manual deposit trigger
  const triggerManualDrop = (type: "coin" | "note") => {
    const newItem: DropItem = {
      id: Date.now() + Math.random(),
      type,
      left: 50, // Force perfectly centered coordinate for the drop animation down the neck
      rotation: Math.random() * 60 - 30, // slight initial orientation deviation
      scale: 0.95 + Math.random() * 0.15,
      driftX: Math.round(100 + (Math.random() - 0.5) * 45),
    };
    setItems((prev) => [...prev, newItem]);
    setTriggerCoinCount((c) => c + 1);

    // Clean up items after they settle/animate out
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== newItem.id));
    }, 1200);
  };

  // Automatically drop a coin when totalSaved increases
  const [lastSaved, setLastSaved] = useState(totalSaved);
  useEffect(() => {
    if (totalSaved > lastSaved) {
      // Trigger a combination of coins and notes
      triggerManualDrop("coin");
      setTimeout(() => triggerManualDrop("note"), 300);
      setLastSaved(totalSaved);
    } else if (totalSaved < lastSaved) {
      setLastSaved(totalSaved);
    }
  }, [totalSaved, lastSaved]);

  return (
    <div id="savings-jar-widget" className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col items-center justify-between h-full overflow-hidden">
      {/* Background radial soft leak */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="w-full mb-3 flex items-center justify-between z-10">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Coins className="text-emerald-500 w-5 h-5" />
            Track Money Jar
          </h3>
          <p className="text-xs text-slate-400">Reflects your goals achievement level</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 font-mono text-xs font-bold px-2.5 py-1 rounded-full">
          {fillPercentage.toFixed(0)}% Filled
        </div>
      </div>      {/* The Glass Jar Visual */}
      <div className="relative w-48 h-64 mx-auto flex items-end justify-center my-2 shrink-0 select-none">
        {/* Sparkles */}
        <AnimatePresence>
          {showSparkles && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: [-10, -50], x: [-10, 20] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                className="absolute top-14 left-4 z-25 text-amber-400 font-sans"
              >
                <Sparkles className="w-5 h-5 fill-amber-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.0, 0.4], y: [0, -40], x: [10, -15] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute top-8 right-6 z-25 text-yellow-400"
              >
                <Sparkles className="w-4 h-4 fill-yellow-400" />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic calculations for Liquid Meniscus & Height in SVG Space (200 x 270) */}
        {(() => {
          // Liquid range from cavity bottom (249) to neck shoulder/cap (77)
          const maxLiquidHeight = 172; // 249 - 77
          const liquidHeight = (fillPercentage / 100) * maxLiquidHeight;
          const liquidY = 249 - liquidHeight;
          const finalY = (liquidY / 270) * 256; // maps 270px viewBox to 256px (h-64) div height

          // Meniscus 3D Radius calculation
          const liquidRx = liquidY <= 77 
            ? 26 
            : liquidY >= 113 
              ? 68 
              : 26 + ((113 - liquidY) / 36) * 42;

          return (
            <>
              {/* Elegant Classic Glass Jar Vector Drawing */}
              <svg 
                viewBox="0 0 200 270" 
                className="w-full h-full drop-shadow-[0_12px_32px_rgba(148,163,184,0.18)] z-10 overflow-visible"
              >
                <defs>
                  {/* Clip-path for the inner area of the jar so fluid stays contained */}
                  <clipPath id="jar-clip">
                    <path d="M 74 52 L 126 52 L 126 77 Q 126 93 169 113 L 169 231 Q 169 249 141 249 L 59 249 Q 31 249 31 231 L 31 113 Q 74 93 74 77 Z" />
                  </clipPath>
                  
                  {/* Outer glass reflection gradient */}
                  <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                    <stop offset="15%" stopColor="rgba(255, 255, 255, 0.18)" />
                    <stop offset="85%" stopColor="rgba(255, 255, 255, 0.08)" />
                    <stop offset="100%" stopColor="rgba(202, 225, 255, 0.35)" />
                  </linearGradient>

                  {/* Emerald liquid fluid saving gradient */}
                  <linearGradient id="liquid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(52, 211, 153, 0.75)" />
                    <stop offset="100%" stopColor="rgba(16, 185, 129, 0.95)" />
                  </linearGradient>
                </defs>

                {/* Wooden Cork Stopper sitting tightly inside the rim */}
                <path 
                  d="M 74 22 L 126 24 L 122 46 L 78 46 Z" 
                  fill="#b45309" 
                  stroke="#78350f" 
                  strokeWidth="2.5" 
                  strokeLinejoin="round" 
                />

                {/* Glass Rim lip at opening */}
                <rect 
                  x="66" 
                  y="44" 
                  width="68" 
                  height="8" 
                  rx="4" 
                  fill="url(#glass-grad)" 
                  stroke="#cbd5e1" 
                  strokeWidth="2" 
                />

                {/* Main Glass Symmetrical Jar Body Outline and glass gleam */}
                <path 
                  d="M 70 50 L 130 50 L 130 75 Q 130 95 175 110 L 175 235 Q 175 255 145 255 L 55 255 Q 25 255 25 235 L 25 110 Q 70 95 70 75 Z"
                  fill="url(#glass-grad)"
                  stroke="#cbd5e1"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />

                {/* Inner dynamic fluid level & animation items clipping boundary */}
                <g clipPath="url(#jar-clip)">
                  {/* Ambient glowing gold/green backdrop that reflects the saved progress height */}
                  {fillPercentage > 0 && (
                    <rect 
                      x="0" 
                      y={liquidY} 
                      width="200" 
                      height="270" 
                      fill="url(#liquid-grad)"
                      opacity="0.16"
                      className="transition-all duration-1000 ease-out"
                    />
                  )}

                  {/* Static visual piles of coins and notes growing and filling the jar dynamically */}
                  <g>
                    <AnimatePresence>
                      {staticPiledItems.map((item) => {
                        const isVisible = fillPercentage >= item.threshold;
                        if (!isVisible) return null;
                        return (
                          <motion.g
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.15, x: item.x, y: item.y - 12, rotate: item.rotation }}
                            animate={{ opacity: 1, scale: item.scale, x: item.x, y: item.y, rotate: item.rotation }}
                            exit={{ opacity: 0, scale: 0.3 }}
                            transition={{ type: "spring", stiffness: 120, damping: 14 }}
                            style={{ transformOrigin: "center" }}
                          >
                            {item.type === "coin" ? (
                              item.variant === 0 ? (
                                <g>
                                  <circle cx="0" cy="0" r="7.8" fill="#b45309" />
                                  <circle cx="0" cy="0" r="7" fill="#d97706" stroke="#fbbf24" strokeWidth="0.5" />
                                  <circle cx="0" cy="-0.5" r="5.6" fill="#fbbf24" />
                                  <text x="0" y="1.8" textAnchor="middle" fill="#78350f" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                                    {currencySymbol}
                                  </text>
                                </g>
                              ) : (
                                <g>
                                  <circle cx="0" cy="0" r="7.8" fill="#475569" />
                                  <circle cx="0" cy="0" r="7" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />
                                  <circle cx="0" cy="-0.5" r="5.6" fill="#e2e8f0" />
                                  <text x="0" y="1.8" textAnchor="middle" fill="#334155" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                                    {currencySymbol}
                                  </text>
                                </g>
                              )
                            ) : (
                              item.variant === 0 ? (
                                <g>
                                  <path d="M -11 -5.5 L 0 -4 L 0 5 L -11 3.5 Z" fill="#047857" />
                                  <path d="M -10 -4.5 L 0 -3.2 L 0 4.2 L -10 2.5 Z" fill="#10b981" />
                                  <path d="M 0 -4 L 11 -5.5 L 11 3.5 L 0 5 Z" fill="#065f46" />
                                  <path d="M 0 -3.2 L 10 -4.5 L 10 2.5 L 0 4.2 Z" fill="#059669" />
                                  <text x="0" y="2.2" textAnchor="middle" fill="#024c32" fontSize="5" fontWeight="950" fontFamily="sans-serif">
                                    {currencySymbol}
                                  </text>
                                </g>
                              ) : item.variant === 1 ? (
                                <g>
                                  <rect x="-8" y="-6" width="16" height="12" rx="4" fill="#065f46" />
                                  <rect x="-10" y="-4" width="20" height="8" rx="2" fill="#10b981" stroke="#34d399" strokeWidth="0.5" />
                                  <circle cx="0" cy="0" r="2.2" fill="#047857" opacity="0.4" />
                                  <text x="0" y="2" textAnchor="middle" fill="#022c22" fontSize="5.2" fontWeight="950" fontFamily="sans-serif">
                                    {currencySymbol}
                                  </text>
                                </g>
                              ) : (
                                <g>
                                  <path d="M -11 -3 L -3 -5.5 L -3 3.5 L -11 6 Z" fill="#065f46" />
                                  <path d="M -3 -5.5 L 4 -3 L 4 6 L -3 3.5 Z" fill="#047857" />
                                  <path d="M 4 -3 L 11 -5.5 L 11 3.5 L 4 6 Z" fill="#10b981" stroke="#6ee7b7" strokeWidth="0.4" />
                                  <text x="3.5" y="2" textAnchor="middle" fill="#022c22" fontSize="5" fontWeight="950" fontFamily="sans-serif">
                                    {currencySymbol}
                                  </text>
                                </g>
                              )
                            )}
                          </motion.g>
                        );
                      })}
                    </AnimatePresence>
                  </g>

                  {/* Dynamic falling items inside the active stack section, 100% vector SVG and clipped by glass walls */}
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.g
                        key={item.id}
                        initial={{ 
                          x: 100, // Starts centered under neck
                          opacity: 0, 
                          scale: 0.35,
                          y: 45, // starts under the cork opening
                          rotate: item.rotation
                        }}
                        animate={{ 
                          x: item.driftX || 100, // drift sideways as it drops
                          opacity: [0, 1, 1, 0], // fades in on start, fades out on landing
                          scale: [0.35, item.scale, item.scale, 0.25],
                          y: Math.min(240, Math.max(76, liquidY - 2)), // drops directly to the active pile surface level
                          rotate: item.rotation + 360
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          x: { type: "tween", ease: "linear", duration: 0.72 },
                          y: { type: "tween", ease: "easeIn", duration: 0.72 },
                          rotate: { type: "tween", ease: "easeOut", duration: 0.72 },
                          scale: { duration: 0.72, times: [0, 0.15, 0.8, 1] },
                          opacity: { duration: 0.72, times: [0, 0.12, 0.78, 1] }
                        }}
                        style={{ transformOrigin: "center" }}
                      >
                        {item.type === "coin" ? (
                          <g>
                            <circle cx="0" cy="0" r="7.8" fill="#b45309" />
                            <circle cx="0" cy="0" r="7" fill="#d97706" stroke="#fbbf24" strokeWidth="0.5" />
                            <circle cx="0" cy="-0.5" r="5.6" fill="#fbbf24" />
                            <text x="0" y="1.8" textAnchor="middle" fill="#78350f" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                              {currencySymbol}
                            </text>
                          </g>
                        ) : (
                          <g>
                            <path d="M -11 -5.5 L 0 -4 L 0 5 L -11 3.5 Z" fill="#047857" />
                            <path d="M -10 -4.5 L 0 -3.2 L 0 4.2 L -10 2.5 Z" fill="#10b981" />
                            <path d="M 0 -4 L 11 -5.5 L 11 3.5 L 0 5 Z" fill="#065f46" />
                            <path d="M 0 -3.2 L 10 -4.5 L 10 2.5 L 0 4.2 Z" fill="#059669" />
                            <text x="0" y="2.2" textAnchor="middle" fill="#024c32" fontSize="5" fontWeight="950" fontFamily="sans-serif">
                              {currencySymbol}
                            </text>
                          </g>
                        )}
                      </motion.g>
                    ))}
                  </AnimatePresence>
                </g>

                {/* Highly realistic glass glare & glossy line highlights */}
                <path 
                  d="M 32 125 Q 26 180 32 230" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.45)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 40 115 Q 38 128 40 140" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.4)" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 140 92 Q 162 102 165 120" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.25)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />

                {/* Realistic paper visual label perfectly layered inside the glass bounds */}
                <g transform="rotate(-2 100 160)">
                  <rect 
                    x="45" 
                    y="135" 
                    width="110" 
                    height="50" 
                    rx="8" 
                    fill="rgba(255, 255, 255, 0.98)" 
                    stroke="#e2e8f0" 
                    strokeWidth="1.5" 
                  />
                  <text 
                    x="100" 
                    y="148" 
                    textAnchor="middle" 
                    fill="#94a3b8" 
                    fontSize="7.5" 
                    fontWeight="800" 
                    letterSpacing="1"
                    fontFamily="sans-serif"
                  >
                    TRACK MONEY
                  </text>
                  <text 
                    x="100" 
                    y="162" 
                    textAnchor="middle" 
                    fill="#10b981" 
                    fontSize="11.5" 
                    fontWeight="900" 
                    letterSpacing="0.5"
                    fontFamily="sans-serif"
                  >
                    100% PURE
                  </text>
                  <text 
                    x="100" 
                    y="174" 
                    textAnchor="middle" 
                    fill="#475569" 
                    fontSize="8.5" 
                    fontWeight="800" 
                    letterSpacing="1.5"
                    fontFamily="sans-serif"
                  >
                    SAVINGS
                  </text>
                </g>
              </svg>

            </>
          );
        })()}

        {/* Jar Base Reflection */}
        <div className="absolute -bottom-1.5 inset-x-4 h-3 bg-slate-300/40 rounded-full blur-xs z-5" />
      </div>

      {/* Manual Dropper Buttons */}
      <div className="w-full flex gap-2 justify-center z-20">
        <button
          onClick={() => triggerManualDrop("coin")}
          className="flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium px-3 py-1.5 rounded-full transition-all border border-slate-200 shadow-2xs cursor-pointer active:scale-95"
        >
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          Drop Coin
        </button>
        <button
          onClick={() => triggerManualDrop("note")}
          className="flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium px-3 py-1.5 rounded-full transition-all border border-slate-200 shadow-2xs cursor-pointer active:scale-95"
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          Float Note
        </button>
      </div>
    </div>
  );
}
