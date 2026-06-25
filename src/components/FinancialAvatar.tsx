import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, Lock, Check, Edit2, User, HelpCircle, Palette } from "lucide-react";
import { AvatarState, AvatarCustomization, CurrencyConfig } from "../types";

interface FinancialAvatarProps {
  avatar: AvatarState;
  isPremium: boolean;
  onUpdateAvatar: (updated: AvatarState) => void;
}

const SKIN_COLORS = [
  { name: "Peach", hex: "#FFD1B3" },
  { name: "Warm", hex: "#E0A96D" },
  { name: "Bronze", hex: "#B87333" },
  { name: "Espresso", hex: "#5C3D2E" },
  { name: "Alien Blue", hex: "#81ECEC", minLevel: 10 },
  { name: "Gold Dust", hex: "#FFEAA7", minLevel: 25, premiumOnly: true },
];

const HAIR_STYLES = [
  { id: "bald", name: "Clean Bald" },
  { id: "short", name: "Classic Short" },
  { id: "long", name: "Flowing Long" },
  { id: "curly", name: "Tight Curly" },
  { id: "spiky", name: "Cyber Spiky", minLevel: 5 },
];

const HAIR_COLORS = [
  { name: "Black", hex: "#1E272E" },
  { name: "Brown", hex: "#485460" },
  { name: "Blonde", hex: "#FED330" },
  { name: "Red", hex: "#FF5E57" },
  { name: "Cosmic Purple", hex: "#A55EEA", minLevel: 10 },
  { name: "Neon Green", hex: "#26DE81", minLevel: 20, premiumOnly: true },
];

const OUTFIT_COLORS = [
  { name: "Dollar Green", hex: "#00C853" },
  { name: "Royal Blue", hex: "#3B82F6" },
  { name: "Crimson Red", hex: "#EF4444" },
  { name: "Charcoal Black", hex: "#1E293B" },
  { name: "Golden Glow", hex: "#F59E0B", minLevel: 15, premiumOnly: true },
];

const ACCESSORIES = [
  { id: "none", name: "No Accessory" },
  { id: "glasses", name: "Smart Glasses", minLevel: 3 },
  { id: "headphones", name: "DJ Headphones", minLevel: 10 },
  { id: "crown", name: "Gold Crown", minLevel: 20, premiumOnly: true },
  { id: "cape", name: "Hero Cape", minLevel: 30, premiumOnly: true },
];

const BACKGROUNDS = [
  { id: "default", name: "Fresh Mint", class: "bg-gradient-to-br from-emerald-50 to-teal-100" },
  { id: "forest", name: "Deep Canopy", class: "bg-gradient-to-br from-green-900 to-emerald-850 text-white" },
  { id: "neon", name: "Cyberpunk", class: "bg-gradient-to-br from-fuchsia-900 via-indigo-950 to-slate-900 text-white", minLevel: 10 },
  { id: "space", name: "Cosmic Odyssey", class: "bg-gradient-to-br from-slate-950 to-violet-950 text-white", minLevel: 20 },
  { id: "gold", name: "Legendary Treasury", class: "bg-gradient-to-br from-yellow-700 via-amber-600 to-amber-950 text-white", minLevel: 50, premiumOnly: true },
];

export function getLevelRank(level: number): { title: string; badgeColor: string } {
  if (level >= 100) return { title: "Legendary Wealth Builder", badgeColor: "bg-red-500 text-white" };
  if (level >= 50) return { title: "Financial Master", badgeColor: "bg-amber-500 text-white" };
  if (level >= 20) return { title: "Elite Accumulator", badgeColor: "bg-violet-600 text-white" };
  if (level >= 10) return { title: "Smart Saver Pro", badgeColor: "bg-indigo-600 text-white" };
  if (level >= 5) return { title: "Budget Warrior", badgeColor: "bg-emerald-600 text-white" };
  return { title: "Novice Saver", badgeColor: "bg-slate-500 text-white" };
}

export default function FinancialAvatar({ avatar, isPremium, onUpdateAvatar }: FinancialAvatarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(avatar.name);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const xpToNextLevel = avatar.level * 100;
  const xpPercentage = Math.min(100, (avatar.xp / xpToNextLevel) * 100);
  const statusRank = getLevelRank(avatar.level);

  const saveName = () => {
    setIsEditing(false);
    onUpdateAvatar({ ...avatar, name: tempName || "Smart Saver" });
  };

  const handleCustomizationChange = (key: keyof AvatarCustomization, value: string) => {
    onUpdateAvatar({
      ...avatar,
      customization: {
        ...avatar.customization,
        [key]: value,
      },
    });
  };

  const checkLocked = (item: any) => {
    const minLvl = item.minLevel ?? 0;
    const prem = item.premiumOnly ?? false;
    
    const isLvlLocked = avatar.level < minLvl;
    const isPreLocked = prem && !isPremium;
    
    return {
      locked: isLvlLocked || isPreLocked,
      isLvlLocked,
      isPreLocked,
      minLvl,
      prem,
    };
  };

  const getBackgroundClass = () => {
    const bg = BACKGROUNDS.find((b) => b.id === avatar.customization.backgroundTheme);
    return bg ? bg.class : "bg-gradient-to-br from-emerald-50 to-teal-100";
  };

  // Dedicated Renderers for Avatar Items
  const renderAvatarSVG = () => {
    const skin = avatar.customization.skinColor;
    const hairStyle = avatar.customization.hairStyle;
    const hairColor = avatar.customization.hairColor;
    const outfit = avatar.customization.outfitColor;
    const accessory = avatar.customization.accessory;

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Cape Option */}
        {accessory === "cape" && (
          <path
            d="M 25,60 C 18,70 12,95 24,100 C 42,95 58,95 76,100 C 88,95 82,70 75,60 Z"
            fill="#FF2E93"
            stroke="#C00755"
            strokeWidth="1.5"
          />
        )}

        {/* Head Shadow */}
        <ellipse cx="50" cy="53" rx="15" ry="17" fill={`${skin}dd`} />

        {/* Face Base */}
        <circle cx="50" cy="45" r="18" fill={skin} />

        {/* Neck */}
        <polygon points="45,60 55,60 53,65 47,65" fill={skin} />

        {/* Hair Back */}
        {hairStyle === "long" && (
          <path d="M 31,40 C 24,55 24,75 32,78 M 69,40 C 76,55 76,75 68,78" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
        )}

        {/* Face Features: Eyes */}
        <circle cx="43" cy="43" r="1.5" fill="#1E293B" />
        <circle cx="57" cy="43" r="1.5" fill="#1E293B" />

        {/* Cheeks */}
        <circle cx="40" cy="48" r="1.5" fill="#FF8A8A" opacity="0.6" />
        <circle cx="60" cy="48" r="1.5" fill="#FF8A8A" opacity="0.6" />

        {/* SMILE! Improves based on level */}
        {avatar.level >= 10 ? (
          <path d="M 44,49 Q 50,56 56,49" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M 45,50 Q 50,54 55,50" fill="none" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Nose */}
        <path d="M 49,44 Q 50,47 51,44" fill="none" stroke="#000" strokeWidth="0.8" opacity="0.3" />

        {/* Hair Front Styles */}
        {hairStyle === "short" && (
          <path
            d="M 31,38 C 31,25 69,25 69,38 C 55,27 45,29 31,38 Z"
            fill={hairColor}
          />
        )}
        {hairStyle === "curly" && (
          <g fill={hairColor}>
            <circle cx="34" cy="32" r="5" />
            <circle cx="42" cy="28" r="5.5" />
            <circle cx="50" cy="27" r="5.5" />
            <circle cx="58" cy="28" r="5.5" />
            <circle cx="66" cy="32" r="5" />
            <circle cx="33" cy="39" r="4.5" />
            <circle cx="67" cy="39" r="4.5" />
          </g>
        )}
        {hairStyle === "spiky" && (
          <polygon
            points="31,38 36,25 43,30 50,22 57,30 64,25 69,38"
            fill={hairColor}
          />
        )}
        {hairStyle === "long" && (
          <path
            d="M 31,38 C 31,24 69,24 69,38 C 69,45 66,50 64,52 C 58,35 42,35 36,52 Z"
            fill={hairColor}
          />
        )}

        {/* Ears */}
        <circle cx="31" cy="45" r="3.5" fill={skin} />
        <circle cx="69" cy="45" r="3.5" fill={skin} />

        {/* Body Outfits */}
        <path
          d="M 28,66 C 30,62 38,61 50,61 C 62,61 70,62 72,66 L 78,100 L 22,100 Z"
          fill={outfit}
        />
        {/* Collar Accent */}
        <polygon points="42,61 50,70 58,61" fill="#fff" opacity="0.9" />

        {/* Glasses Accessory */}
        {accessory === "glasses" && (
          <g stroke="#F59E0B" strokeWidth="1.5" fill="none">
            <rect x="36" y="40" width="10" height="7" rx="1.5" />
            <rect x="54" y="40" width="10" height="7" rx="1.5" />
            <line x1="46" y1="43" x2="54" y2="43" />
            <line x1="31" y1="44" x2="36" y2="43" />
            <line x1="64" y1="43" x2="69" y2="44" />
          </g>
        )}

        {/* Headphones Accessory */}
        {accessory === "headphones" && (
          <g>
            <path d="M 28,45 A 22,22 0 0,1 72,45" fill="none" stroke="#2D3748" strokeWidth="3" />
            <rect x="25" y="41" width="6" height="10" rx="2" fill="#E2E8F0" stroke="#1A202C" strokeWidth="1.5" />
            <rect x="69" y="41" width="6" height="10" rx="2" fill="#E2E8F0" stroke="#1A202C" strokeWidth="1.5" />
          </g>
        )}

        {/* Crown Accessory */}
        {accessory === "crown" && (
          <g fill="#FBBF24" stroke="#D97706" strokeWidth="1">
            <polygon points="34,28 38,15 44,22 50,12 56,22 62,15 66,28" />
            <circle cx="38" cy="14" r="1.5" fill="#FFE082" />
            <circle cx="50" cy="11" r="1.5" fill="#FFE082" />
            <circle cx="62" cy="14" r="1.5" fill="#FFE082" />
            <rect x="34" y="25" width="32" height="3" rx="0.5" fill="#D97706" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div id="financial-avatar-widget" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-full flex flex-col justify-between">
      
      {/* Upper header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-brand-green" />
            Financial Avatar
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            {isEditing ? (
              <input
                type="text"
                value={tempName}
                maxLength={18}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                className="font-display font-bold text-xl text-slate-800 outline-hidden border-b-2 border-brand-green bg-slate-50 px-1 rounded-xs"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-1.5 group select-none">
                <h4 className="font-display font-bold text-xl text-slate-800">
                  {avatar.name}
                </h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-40 group-hover:opacity-100 hover:text-emerald-500 transition-opacity cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Streak Indicator */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 bg-amber-50 rounded-full px-2.5 py-1 border border-amber-100">
            <span className="text-amber-500 font-bold text-xs">🔥 {avatar.streakDays}</span>
            <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">Streak</span>
          </div>
        </div>
      </div>

      {/* Avatar Drawing and Status View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-2">
        
        {/* Visual Frame */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className={`relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md select-none ${getBackgroundClass()}`}>
            
            {/* Float Character Canvas */}
            <div className="absolute inset-0 flex items-center justify-center p-3">
              {renderAvatarSVG()}
            </div>
            
            {/* Level badge */}
            <div className="absolute bottom-1 right-1 bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-xs">
              L{avatar.level}
            </div>

            {/* Premium tag override */}
            {isPremium && (
              <span className="absolute top-1 left-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                PRO💎
              </span>
            )}
          </div>
        </div>

        {/* Level stats */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-2">
            <span className={`inline-block font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusRank.badgeColor}`}>
              {statusRank.title}
            </span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-mono font-bold">
              <span>XP: {avatar.xp} / {xpToNextLevel}</span>
              <span>{(xpPercentage).toFixed(0)}%</span>
            </div>
            {/* Custom XP Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-brand-green h-full rounded-full"
              />
            </div>
            <p className="text-[10px] text-slate-400 italic">
              Level up your avatar to unlock premium customization outfits, royal crowns, and backgrounds!
            </p>
          </div>
        </div>
      </div>

      {/* Trigger customize drawer toggle button */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
        <button
          onClick={() => setIsCustomizing(true)}
          className="w-full flex items-center justify-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 text-white font-semibold py-2 rounded-xl transition-all cursor-pointer select-none"
        >
          <Palette className="w-4 h-4" />
          Customize Character
        </button>
      </div>

      {/* Customize Dialog Modal Overlay */}
      <AnimatePresence>
        {isCustomizing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
                    <Sparkles className="text-amber-500 fill-amber-500 w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                    Track Money Character Studio
                  </h3>
                  <p className="text-xs text-slate-400">Unlock luxury items by leveling up or premium memberships</p>
                </div>
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="bg-slate-200/60 hover:bg-slate-200 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Modal Content - Partition split (visual vs controls) */}
              <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-y-auto max-h-[60vh] md:max-h-[65vh]">
                
                {/* Visual Left pane */}
                <div className="md:col-span-2 p-6 flex flex-col items-center justify-center bg-slate-50/50">
                  <div className={`w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg ${getBackgroundClass()} relative flex items-center justify-center p-4`}>
                    {renderAvatarSVG()}
                    <div className="absolute bottom-1 right-1 bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                      L{avatar.level}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 mt-4 italic font-semibold">"Current Level: {avatar.level}"</span>
                </div>

                {/* Selections Right pane */}
                <div className="md:col-span-3 p-6 space-y-5 overflow-y-auto">
                  
                  {/* Option segment: Skin color */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Skin Tones</span>
                    <div className="flex flex-wrap gap-2">
                      {SKIN_COLORS.map((s) => {
                        const lockState = checkLocked(s);
                        const isSelected = avatar.customization.skinColor === s.hex;
                        return (
                          <button
                            key={s.name}
                            onClick={() => !lockState.locked && handleCustomizationChange("skinColor", s.hex)}
                            className={`relative w-8 h-8 rounded-full shadow-inner border transition-all ${
                              isSelected ? "ring-2 ring-emerald-500 scale-105" : "hover:scale-105"
                            } ${lockState.locked ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
                            style={{ backgroundColor: s.hex }}
                            title={`${s.name} ${lockState.minLvl ? `(Level ${lockState.minLvl})` : ""} ${lockState.prem ? "(PRO)" : ""}`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-slate-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5" />}
                            {lockState.locked && <Lock className="w-3 h-3 text-slate-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Option segment: Hair styles */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Haircuts</span>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_STYLES.map((h) => {
                        const lockState = checkLocked(h);
                        const isSelected = avatar.customization.hairStyle === h.id;
                        return (
                          <button
                            key={h.id}
                            onClick={() => !lockState.locked && handleCustomizationChange("hairStyle", h.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 rounded-full font-medium border border-slate-200 transition-all ${
                              isSelected ? "bg-emerald-500 text-white border-emerald-500 scale-105" : "bg-white hover:bg-slate-50"
                            } ${lockState.locked ? "opacity-45 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {h.name}
                            {lockState.locked && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Option segment: Hair colors */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Hair Colors</span>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map((c) => {
                        const lockState = checkLocked(c);
                        const isSelected = avatar.customization.hairColor === c.hex;
                        return (
                          <button
                            key={c.name}
                            onClick={() => !lockState.locked && handleCustomizationChange("hairColor", c.hex)}
                            className={`relative w-8 h-8 rounded-full shadow-inner border transition-all ${
                              isSelected ? "ring-2 ring-emerald-500 scale-105" : "hover:scale-105"
                            } ${lockState.locked ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 rounded-full p-0.5" />}
                            {lockState.locked && <Lock className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Option segment: Outfits */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Suit Outfits</span>
                    <div className="flex flex-wrap gap-2">
                      {OUTFIT_COLORS.map((o) => {
                        const lockState = checkLocked(o);
                        const isSelected = avatar.customization.outfitColor === o.hex;
                        return (
                          <button
                            key={o.name}
                            onClick={() => !lockState.locked && handleCustomizationChange("outfitColor", o.hex)}
                            className={`relative w-8 h-8 rounded-full shadow-inner border transition-all ${
                              isSelected ? "ring-2 ring-emerald-500 scale-105" : "hover:scale-105"
                            } ${lockState.locked ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
                            style={{ backgroundColor: o.hex }}
                            title={o.name}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 rounded-full p-0.5" />}
                            {lockState.locked && <Lock className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Option segment: Accessories */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Luxury Accessories</span>
                    <div className="flex flex-wrap gap-2">
                      {ACCESSORIES.map((a) => {
                        const lockState = checkLocked(a);
                        const isSelected = avatar.customization.accessory === a.id;
                        return (
                          <button
                            key={a.id}
                            onClick={() => !lockState.locked && handleCustomizationChange("accessory", a.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 rounded-full font-medium border border-slate-200 transition-all ${
                              isSelected ? "bg-emerald-500 text-white border-emerald-500 scale-105" : "bg-white hover:bg-slate-50"
                            } ${lockState.locked ? "opacity-45 cursor-not-allowed bg-slate-100" : "cursor-pointer"}`}
                          >
                            {a.name}
                            {lockState.locked && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Option segment: Backgrounds */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Background Environments</span>
                    <div className="flex flex-wrap gap-2">
                      {BACKGROUNDS.map((b) => {
                        const lockState = checkLocked(b);
                        const isSelected = avatar.customization.backgroundTheme === b.id;
                        return (
                          <button
                            key={b.id}
                            onClick={() => !lockState.locked && handleCustomizationChange("backgroundTheme", b.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 rounded-full font-medium border border-slate-200 transition-all ${
                              isSelected ? "bg-emerald-500 text-white border-emerald-500 scale-105" : "bg-white hover:bg-slate-50"
                            } ${lockState.locked ? "opacity-45 cursor-not-allowed bg-slate-100" : "cursor-pointer"}`}
                          >
                            {b.name}
                            {lockState.locked && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Action footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="px-5 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Apply & Close Customizer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
