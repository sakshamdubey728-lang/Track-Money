import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  Shield, 
  Cpu, 
  Users, 
  PieChart, 
  Zap, 
  Layers, 
  Menu, 
  X,
  Smartphone,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  Globe,
  Bell,
  Activity,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Key
} from "lucide-react";

// Types for the animated particles and falling objects
interface FloatingElement {
  id: number;
  type: "coin" | "note" | "particle";
  x: number; // percentage left
  y: number; // percentage top
  scale: number;
  rotation: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

interface LandingPageProps {
  onLaunchApp: () => void;
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"features" | "insights" | "goals" | "pricing">("features");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorGlow, setCursorGlow] = useState(false);

  // Login Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginStep, setLoginStep] = useState<"form" | "verifying" | "success">("form");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError("Please enter your registered email address.");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Please enter your security passcode.");
      return;
    }
    setLoginError("");
    setLoginStep("verifying");

    // Seamless animated console check progress
    setTimeout(() => {
      setLoginStep("success");
      setTimeout(() => {
        setShowLoginModal(false);
        setLoginStep("form");
        setLoginEmail("");
        setLoginPassword("");
        onLaunchApp();
      }, 800);
    }, 2400);
  };
  
  // Stats counter states (for counting up animation)
  const [savingsCount, setSavingsCount] = useState(0);
  const [budgetCount, setBudgetCount] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);

  // Floating elements state
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [jarFillLevel, setJarFillLevel] = useState(15);

  // Interactive mockup state
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [mockupBudget, setMockupBudget] = useState(1200);
  const [mockupSpent, setMockupSpent] = useState(480);
  const [aiInsightIndex, setAiInsightIndex] = useState(0);

  const mockupRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Handle subtle mockup card tilt based on mouse position
  const handleMouseMoveMockup = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate tilt angles (max 10 degrees)
    const tiltX = (mouseY / (height / 2)) * -8;
    const tiltY = (mouseX / (width / 2)) * 8;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeaveMockup = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Setup cursor glow coordinate tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Set up floating element generators
  useEffect(() => {
    // Initial batch of floating elements
    const elements: FloatingElement[] = Array.from({ length: 64 }).map((_, i) => ({
      id: i,
      type: i % 3 === 0 ? "coin" : i % 3 === 1 ? "note" : "particle",
      x: 2 + Math.random() * 96, // Distributed across the full viewport width
      y: 10 + Math.random() * 85, // Distributed across the full viewport height
      scale: 0.4 + Math.random() * 0.7,
      rotation: Math.random() * 360,
      duration: 5 + Math.random() * 6, // Increased speed of the floating motion
      delay: Math.random() * -10, // Pre-seeded starting points suited to faster speed
      driftX: (Math.random() - 0.5) * 40, // Gentle left/right drift
      driftY: -150 - Math.random() * 200, // Upward floating motion distance
    }));
    setFloatingElements(elements);

    // Increment savings jar fill rate slowly over time (looping simulation)
    const jarTimer = setInterval(() => {
      setJarFillLevel((prev) => (prev >= 85 ? 15 : prev + 5));
    }, 4000);

    return () => clearInterval(jarTimer);
  }, []);

  // Stats counting up simulation on mount
  useEffect(() => {
    const savingsTarget = 14250;
    const budgetTarget = 1500;
    const goalsTarget = 96;

    const duration = 2000; // 2 seconds
    const interval = 25;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setSavingsCount(Math.min(savingsTarget, Math.round((savingsTarget / steps) * step)));
      setBudgetCount(Math.min(budgetTarget, Math.round((budgetTarget / steps) * step)));
      setGoalsCount(Math.min(goalsTarget, Math.round((goalsTarget / steps) * step)));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // AI Insights slider
  const aiInsightsList = [
    "💡 You saved $42.50 in food this week by reducing spontaneous cafe visits. Smart!",
    "📈 Recurring subscriptions stand at $24/mo. You are using 100% of your active plans.",
    "🛡️ Staying under rent threshold has leveled your Financial Avatar to Level 4 (+100 XP).",
    "🎯 Budget Tip: Setting rent to USD 800 leaves room to secure your Christmas goal by November."
  ];

  useEffect(() => {
    const aiInsightTimer = setInterval(() => {
      setAiInsightIndex((prev) => (prev + 1) % aiInsightsList.length);
    }, 5000);
    return () => clearInterval(aiInsightTimer);
  }, []);

  // Generate interactive click ripple effects for buttons
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now() + Math.random(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Premium Cursor Glow */}
      <div 
        className="hidden md:block pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full w-[400px] h-[400px] bg-emerald-500/[0.04] blur-[100px] z-50 transition-opacity duration-300"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* Background Animated Gradient Patches */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/[0.08] rounded-full blur-[140px] pointer-events-none animate-[pulse_10s_infinite_alternate]" />
      <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] bg-teal-900/[0.06] rounded-full blur-[160px] pointer-events-none animate-[pulse_12s_infinite_alternate]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-emerald-950/[0.1] rounded-full blur-[120px] pointer-events-none animate-[pulse_8s_infinite_alternate]" />

      {/* Grid Pattern Layer */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #10B981 1px, transparent 1px),
            linear-gradient(to bottom, #10B981 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px"
        }}
      />

      {/* Sticky Premium Header / Navigation */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-xl bg-slate-950/65 border-b border-slate-900/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand Brand Identity */}
          <div className="flex items-center gap-2 group select-none">
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-300">
              <span className="font-display font-black text-white text-lg tracking-tighter">S</span>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight group-hover:text-emerald-400 transition-colors">
              Spend<span className="text-emerald-500">OS</span>
            </span>
          </div>

          {/* Nav Menu Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#insights" className="text-slate-400 hover:text-white transition-colors">AI Insights</a>
            <a href="#goals" className="text-slate-400 hover:text-white transition-colors">Goals</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-slate-400 hover:text-white transition-colors">About</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="text-slate-400 hover:text-white text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={(e) => { handleButtonClick(e); onLaunchApp(); }}
              className="relative overflow-hidden px-5 py-2.5 bg-[#00C853] hover:bg-emerald-500 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.03] flex items-center gap-1.5 group cursor-pointer"
            >
              {ripples.map((ripple) => (
                <span 
                  key={ripple.id} 
                  className="absolute bg-white/20 rounded-full animate-ping pointer-events-none" 
                  style={{ width: 100, height: 100, left: ripple.x - 50, top: ripple.y - 50 }}
                />
              ))}
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Burger Trigger */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-900 bg-slate-950/95"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900">Features</a>
                <a href="#insights" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900">AI Insights</a>
                <a href="#goals" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900">Goals</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900">Pricing</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900">About</a>
                
                <div className="pt-4 border-t border-slate-900 flex flex-col gap-3">
                  <button onClick={() => { setMobileMenuOpen(false); setShowLoginModal(true); }} className="w-full py-2.5 bg-slate-900 text-slate-300 rounded-xl font-semibold border border-slate-800">Log In</button>
                  <button onClick={() => { setMobileMenuOpen(false); onLaunchApp(); }} className="w-full py-3 bg-[#00C853] text-white rounded-xl font-bold">Get Started</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Hero & Content Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-20 pb-20 relative">

        {/* Ambient floating coins & banknotes backdrop drifting gracefully upwards */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {floatingElements.map((el) => {
            const isCoin = el.type === "coin";
            const isNote = el.type === "note";
            
            return (
              <motion.div
                key={el.id}
                initial={{ left: `${el.x}%`, top: `${el.y}%`, opacity: 0, scale: 0.2 }}
                animate={{ 
                  y: [0, el.driftY],
                  x: [0, el.driftX],
                  opacity: [0, 0.65, 0.65, 0],
                  scale: [0.3, el.scale, el.scale * 1.15, 0.3],
                  rotate: [el.rotation, el.rotation + 180, el.rotation + 360]
                }}
                transition={{
                  duration: el.duration,
                  repeat: Infinity,
                  delay: el.delay,
                  ease: "linear"
                }}
                className="absolute"
              >
                {isCoin && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 border border-yellow-200/50 shadow-lg shadow-yellow-500/25 flex items-center justify-center text-xs font-black text-amber-950 select-none">
                    ₹
                  </div>
                )}
                {isNote && (
                  <div className="w-12 h-6 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded border border-emerald-350 shadow-lg shadow-emerald-500/15 flex items-center justify-center text-[11px] font-black text-emerald-950 rotate-12 select-none">
                    ₹
                  </div>
                )}
                {!isCoin && !isNote && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Hero Landing Grid */}
        <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-10 md:py-16 relative z-10">
          
          {/* Centered Content Column */}
          <div className="flex flex-col items-center text-center space-y-8">
            
            {/* Tag Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/50 rounded-full px-4 py-1.5 w-fit hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Gamified Smart Finance</span>
            </motion.div>

            {/* Main Display Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.12]">
              Take Control of <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">
                Every Dollar
              </span> You Spend.
            </h1>

            {/* Description Paragraph */}
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
              Track your daily expenses, manage budgets, monitor cash flow, set savings goals, and receive AI-powered financial insights—all in one beautifully designed platform. SpendOS helps students and professionals build smarter money habits while making saving fun through gamification.
            </p>

            {/* Hero Interactive CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={(e) => { handleButtonClick(e); onLaunchApp(); }}
                className="relative overflow-hidden px-8 py-4 bg-[#00C853] hover:bg-emerald-500 text-white font-extrabold rounded-full shadow-lg shadow-emerald-500/35 transition-all hover:scale-[1.04] flex items-center justify-center gap-2 group cursor-pointer w-full sm:w-auto"
              >
                {ripples.map((ripple) => (
                  <span 
                    key={ripple.id} 
                    className="absolute bg-white/25 rounded-full animate-ping pointer-events-none" 
                    style={{ width: 140, height: 140, left: ripple.x - 70, top: ripple.y - 70 }}
                  />
                ))}
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <a 
                href="#features"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Learn More
              </a>
            </div>

            {/* Live Metrics Grid Banner */}
            <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6 sm:gap-12 w-full max-w-xl mx-auto">
              <div>
                <span className="text-2xl md:text-3xl font-bold text-white font-mono block">
                  ₹0
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Saved</span>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-bold text-emerald-400 font-mono block">
                  ₹0
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Monthly Limit</span>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-bold text-emerald-500 font-mono block">
                  ₹0
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Goals Achieved</span>
              </div>
            </div>

          </div>

        </section>

        {/* Section divider with subtle glowing line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-20" />

        {/* Features Bento Grid Section */}
        <section id="features" className="text-center space-y-12">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-extrabold text-white">
              Every Tool for Smarter Financial Habits.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              We ditched complex tables and replaced them with interactive, gamified features that help you plan budgets, audit transactions, and level up your financial health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature card 1: Real-time tracking */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-850 p-6 rounded-2xl text-left transition-all hover:border-emerald-500/20 shadow-lg cursor-pointer"
            >
              <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center mb-4 border border-emerald-900/30">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Ledger</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Log and categorize expenses instantly. Includes flexible multi-currency conversions and quick filters by categories and dates.
              </p>
            </motion.div>

            {/* Feature card 2: AI Advisor */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-850 p-6 rounded-2xl text-left transition-all hover:border-emerald-500/20 shadow-lg cursor-pointer"
            >
              <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center mb-4 border border-emerald-900/30">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Savings Coach</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Receives custom real-time audits and strategic recommendations to reduce overspending based on your active spending patterns.
              </p>
            </motion.div>

            {/* Feature card 3: Gamified Rewards */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-850 p-6 rounded-2xl text-left transition-all hover:border-emerald-500/20 shadow-lg cursor-pointer"
            >
              <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center mb-4 border border-emerald-900/30">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gamification Engine</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Earn XP checkpoints, claim achievements, and watch your Financial Avatar grow as you reach and preserve your budget targets.
              </p>
            </motion.div>

          </div>

        </section>

        {/* Goals & Budget Progress Section */}
        <section id="goals" className="pt-24 text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Target Milestones</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white leading-tight">
              Build Wealth Seamlessly with Smart Savings Goals.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Define independent saving goals—from new devices to holiday vacations. Make micro-deposits from extra freelancing revenue or spare change, and see your progress visualizer climb in real-time.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-300 text-xs md:text-sm">Isolated savings buckets per category limit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-300 text-xs md:text-sm">Secure progress tracking and automatic XP claims</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-300 text-xs md:text-sm">Real-time alerts to block overspending behavior</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example Active Goals</h4>
            
            {/* Goal 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">New Workstation PC</span>
                <span className="text-emerald-400 font-mono">₹0 / ₹0</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: "0%" }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% Complete</span>
                <span>Due in 14 days</span>
              </div>
            </div>

            {/* Goal 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">European Summer Trip</span>
                <span className="text-emerald-400 font-mono">₹0 / ₹0</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: "0%" }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% Complete</span>
                <span>Due in 3 months</span>
              </div>
            </div>

            {/* Goal 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">Emergency Backup Reserve</span>
                <span className="text-emerald-400 font-mono">₹0 / ₹0</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: "0%" }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% Complete</span>
                <span>Goal Pending</span>
              </div>
            </div>
          </div>

        </section>

        {/* Pricing Plan Section */}
        <section id="pricing" className="pt-24 text-center space-y-12">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-extrabold text-white">
              Smarter Habits, Simple Options.
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Start building wealth entirely for free, or unlock advanced AI tools and cloud backups with premium plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            
            {/* Free Plan */}
            <div className="bg-slate-905 border border-slate-850 p-8 rounded-2xl flex flex-col justify-between text-left space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Starter Pack</span>
                <h4 className="text-xl font-bold text-white">SpendOS Basic</h4>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-extrabold text-white font-mono">$0</span>
                  <span className="text-xs text-slate-500 font-bold ml-1">/ FOREVER FREE</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs md:text-sm">
                Perfect for students and freelancers aiming to monitor basic transactions, set a master budget, and earn initial XP achievements offline.
              </p>

              <ul className="space-y-3 pt-4 border-t border-slate-900 text-slate-300 text-xs">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Expense & Income Ledger</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Core Savings Goal Bucket</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Basic Gamified Financial Avatar</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Local Storage Sandboxed</li>
              </ul>

              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850/80 text-white text-xs font-bold rounded-xl border border-slate-800 transition-colors"
              >
                Access Free Dashboard
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-slate-900/80 to-slate-950 border-2 border-emerald-500/45 p-8 rounded-2xl flex flex-col justify-between text-left space-y-6 relative">
              <div className="absolute top-4 right-4 bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full animate-pulse">
                Highly Recommended
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Unlimited Wealth</span>
                <h4 className="text-xl font-bold text-white">SpendOS Premium Pro</h4>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-extrabold text-white font-mono">$4.99</span>
                  <span className="text-xs text-slate-500 font-bold ml-1">/ MONTHLY</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs md:text-sm">
                Tailored for active developers, investors, and professionals wanting advanced AI predictions, secure cloud sync, and customizable high-tier avatars.
              </p>

              <ul className="space-y-3 pt-4 border-t border-slate-900 text-slate-300 text-xs">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Everything in Basic Free</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> AI Coach Strategic Audits</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Multi-Currency Live Converter</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Premium Avatars & Crown Items</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Automated Email Simulators</li>
              </ul>

              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-3 bg-[#00C853] hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-colors"
              >
                Upgrade Portal Access
              </button>
            </div>

          </div>

        </section>

      </main>

      {/* Modern Startup Footer */}
      <footer id="about" className="border-t border-slate-900 bg-slate-950 pt-16 pb-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-sm text-slate-400">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00C853] rounded-lg flex items-center justify-center">
                <span className="font-display font-black text-white text-base">S</span>
              </div>
              <span className="font-display font-bold text-md text-white tracking-tight">
                Spend<span className="text-emerald-500">OS</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Durable gamified finance planning and budgeting tool designed to secure smarter spending habits effortlessly.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Product</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Core Features</a></li>
              <li><a href="#insights" className="hover:text-white transition-colors">AI Coaching</a></li>
              <li><a href="#goals" className="hover:text-white transition-colors">Savings Goals</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Options</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Legal</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR compliance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Audit</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tech Stack</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Helpline</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Press</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>&copy; 2026 SpendOS Corporation. All rights reserved. Crafted for smart finance planning.</span>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-white transition-colors cursor-pointer">GitHub</span>
            <span className="hover:text-white transition-colors cursor-pointer">Discord</span>
          </div>
        </div>
      </footer>

      {/* Interactive Secure Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl shadow-emerald-500/5 overflow-hidden"
            >
              {/* Subtle top ambient glowing ray */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close button */}
              {loginStep === "form" && (
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError("");
                  }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {loginStep === "form" && (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg shadow-emerald-500/5">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">Access Secure Portal</h3>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-[280px] mx-auto">
                      Enter your security credentials to authorize and launch your local offline ledger.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Username/Email Input field */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <LogIn className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="dubeysaksham005@gmail.com"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Passcode Input field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Passcode</label>
                        <span 
                          onClick={() => {
                            setLoginEmail("dubeysaksham005@gmail.com");
                            setLoginPassword("password123");
                          }}
                          className="text-[11px] text-emerald-400 hover:underline cursor-pointer font-semibold"
                        >
                          Autofill Demo
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Key className="w-4 h-4" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-medium"
                    >
                      {loginError}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#00C853] hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Authenticate Ledger
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[11px] text-slate-500">
                      Don't have credentials? Click <span onClick={() => { setLoginEmail("dubeysaksham005@gmail.com"); setLoginPassword("password123"); }} className="text-emerald-400 hover:underline cursor-pointer font-semibold">Autofill Demo</span> or use <span onClick={() => { setShowLoginModal(false); onLaunchApp(); }} className="text-emerald-400 hover:underline cursor-pointer font-semibold">Get Started</span>
                    </p>
                  </div>
                </form>
              )}

              {loginStep === "verifying" && (
                <div className="flex flex-col items-center justify-center py-6 text-center select-none">
                  {/* Glowing, spinning radar loader */}
                  <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                    <Shield className="w-6 h-6 text-emerald-400 animate-pulse" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-white">Decrypting Ledger Shards</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Establishing secure tunnel to local offline data vault...</p>

                  {/* Diagnostic details terminal overlay */}
                  <div className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 mt-6 text-left font-mono text-[10px] space-y-1.5 text-slate-400 shadow-inner h-28 overflow-hidden">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>[OK] Security handshake authenticated</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-1.5">
                      <span>&gt; Mapping local storage databases...</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-1.5 animate-[pulse_1.5s_infinite]">
                      <span>&gt; Generating unique level XP session tokens...</span>
                    </div>
                  </div>
                </div>
              )}

              {loginStep === "success" && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle className="w-8 h-8" />
                  </motion.div>

                  <h3 className="font-display font-bold text-xl text-white">Access Granted</h3>
                  <p className="text-xs text-slate-400 mt-1">Session synchronized. Unlocking SpendOS workspace...</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
