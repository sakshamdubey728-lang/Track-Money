import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  Cpu, 
  AlertTriangle, 
  Lightbulb, 
  DollarSign, 
  Zap, 
  Lock, 
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { FinancialData, CURRENCIES } from "../types";

interface AICoachProps {
  financialData: FinancialData;
  onGrantXPReward: (xp: number, alertMsg: string) => void;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const LOADING_PHASES = [
  "Auditing category transaction ledgers...",
  "Running subscription leakage scans...",
  "Calculating 12-month wealth trajectories...",
  "Formatting personalized budget constraints...",
  "Feeding metrics to Track Money Optimizer...",
  "Generating action plan with Gemini AI..."
];

export default function AICoach({ financialData, onGrantXPReward }: AICoachProps) {
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState<number>(0);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rotate loading phase text for friendly user experience
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhaseIndex((curr) => (curr + 1) % LOADING_PHASES.length);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Scroll chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const fetchInsights = async (customPrompt?: string) => {
    setIsLoading(true);
    setLoadingPhaseIndex(0);
    try {
      const currencySymbol = CURRENCIES[financialData.currency]?.symbol || "$";
      
      const payload = {
        currency: financialData.currency,
        currencySymbol,
        monthlyBudget: financialData.monthlyBudget,
        expenses: financialData.expenses,
        incomes: financialData.incomes,
        recurringPayments: financialData.recurringPayments,
        savingsGoals: financialData.savingsGoals,
        isPremium: financialData.isPremium,
        avatarLevel: financialData.avatar.level,
        customPrompt: customPrompt || null,
      };

      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setInsights(data.insights);
        
        // Grant XP for interacting with coach!
        onGrantXPReward(40, "Coaching Wisdom! Earned +40 XP");

        // If it was a chat prompt, append model response to history
        if (customPrompt) {
          setChatHistory((prev) => [
            ...prev,
            { role: "model", text: data.insights }
          ]);
        } else {
          // Initialize chat history with first insights
          setChatHistory([
            { role: "model", text: data.insights }
          ]);
        }
      } else {
        setInsights("⚠️ Failed to generate insights: " + (data.error || "Unknown server response"));
      }
    } catch (error: any) {
      console.error(error);
      setInsights("⚠️ Network error trying to connect to Track Money Coach API. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg = chatInput.trim();
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");

    // Append context to prompt and call API
    const contextualPrompt = `Regarding my current financial snapshot, a user asks: "${userMsg}". Please answer directly as the Track Money financial advisor. Refer specifically to my details where applicable!`;
    fetchInsights(contextualPrompt);
  };

  const triggerQuickQuestion = (question: string) => {
    if (isLoading) return;
    setChatHistory((prev) => [...prev, { role: "user", text: question }]);
    const contextualPrompt = `Answer this direct speed question in 1 or 2 elegant, actionable bullet points: "${question}". Refer specifically to my current budget limits if applicable.`;
    fetchInsights(contextualPrompt);
  };

  return (
    <div id="ai-coach-widget" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col h-[580px] justify-between">
      
      {/* Widget Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-1.5">
              AI Savings Coach
              <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full scale-90">
                Gemini Core
              </span>
            </h3>
            <p className="text-xs text-slate-400">Smart cost reductions & subscription leakage diagnostics</p>
          </div>
        </div>

        {/* Audit button */}
        <button
          onClick={() => fetchInsights()}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-brand-green hover:bg-brand-dark disabled:bg-slate-300 text-white px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer select-none"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white/20" />
          {insights ? "Re-Evaluate" : "Audit Finance"}
        </button>
      </div>

      {/* Main Viewport */}
      <div className="grow overflow-y-auto mb-4 pr-1 px-1 space-y-4 relative flex flex-col">
        {isLoading ? (
          /* Loading screen with friendly rotating messages */
          <div className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-lg text-slate-800 mb-1">Inspirations Loading</h4>
            <p className="text-sm text-slate-400 max-w-sm font-medium animate-pulse">
              {LOADING_PHASES[loadingPhaseIndex]}
            </p>
          </div>
        ) : null}

        {chatHistory.length === 0 ? (
          /* Landing viewport if no audits generated yet */
          <div className="my-auto text-center py-6 px-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <TrendingDown className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-medium text-slate-700">Ready to level-up?</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Press the **Audit Finance** button above. Track Money will analyze your active cash flow, goal-percentages, and subscriptions to generate personalized tips.
              </p>
            </div>
            
            {/* Value Highlights */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  Free Recommendations
                </div>
                <p className="text-[10px] text-emerald-700/80">3-4 fast budget tweaks matching expense categories.</p>
              </div>
              <div className="p-3 bg-violet-50/40 rounded-xl border border-violet-50 relative overflow-hidden">
                {!financialData.isPremium && (
                  <Lock className="absolute top-2 right-2 w-3 h-3 text-violet-400" />
                )}
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-800 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  Premium Audit
                </div>
                <p className="text-[10px] text-violet-700/80">Full 12-month projections, subscription audits, and outfits bonuses.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Conversational Chat Viewport */
          <div className="space-y-4 flex flex-col justify-end min-h-full">
            {chatHistory.map((msg, index) => (
              <div 
                key={index}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 px-1">
                  {msg.role === "user" ? "You" : "Coach"}
                </span>
                <div 
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-3xs ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none markdown-body"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input box / Recommendation speed actions */}
      <div className="shrink-0 space-y-3 pt-3 border-t border-slate-100 z-10">
        
        {/* Quick Speed Actions prompts */}
        {chatHistory.length > 0 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => triggerQuickQuestion("How can I save $50 this month?")}
              className="shrink-0 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full cursor-pointer transition-all active:scale-95"
            >
              How do I save $50?
            </button>
            <button
              onClick={() => triggerQuickQuestion("Am I overspending on dining out?")}
              className="shrink-0 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full cursor-pointer transition-all active:scale-95"
            >
              Analyze food costs
            </button>
            <button
              onClick={() => triggerQuickQuestion("List fast tips to gain XP rewards")}
              className="shrink-0 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full cursor-pointer transition-all active:scale-95"
            >
              Fast Avatar XP tips
            </button>
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            id="ai-coach-prompt-input"
            type="text"
            value={chatInput}
            disabled={isLoading || chatHistory.length === 0}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={chatHistory.length === 0 ? "Generate an audit first to enable coach chat..." : "Ask follow-up questions to your coach..."}
            className="grow px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-brand-green rounded-xl text-slate-700 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !chatInput.trim() || chatHistory.length === 0}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
