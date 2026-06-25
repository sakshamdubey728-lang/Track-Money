import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  Coins, 
  Gem, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Settings, 
  Sparkles, 
  BadgeHelp,
  PieChart as PieIcon,
  Crown,
  Monitor,
  Smartphone,
  Apple,
  Command,
  Keyboard,
  X,
  Banknote
} from "lucide-react";
import { 
  FinancialData, 
  Expense, 
  Income, 
  RecurringPayment, 
  SavingsGoal, 
  AvatarState, 
  Achievement, 
  EmailSettings, 
  VirtualEmail, 
  CurrencyCode, 
  CURRENCIES, 
  ExpenseCategory, 
  IncomeSource,
  CategoryBudget
} from "./types";
import SavingsJar from "./components/SavingsJar";
import FinancialAvatar from "./components/FinancialAvatar";
import AICoach from "./components/AI_Coach";
import AnalyticsPanel from "./components/AnalyticsPanel";
import SubscriptionManager from "./components/SubscriptionManager";
import EmailSimulator from "./components/EmailSimulator";
import SheetsExport from "./components/SheetsExport";
import DesktopShortcutCreator from "./components/DesktopShortcutCreator";
import { motion, AnimatePresence } from "motion/react";

const LOCAL_STORAGE_KEY = "spendos_finance_data";

// standard expense categories
const CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Education",
  "Healthcare",
  "Utilities",
  "Rent",
  "Miscellaneous"
];

// standard income sources
const INCOME_SOURCES: IncomeSource[] = [
  "Salary",
  "Freelancing",
  "Business Income",
  "Scholarships",
  "Investments"
];

// Pre-seeded initial data to make first launch beautiful
const INITIAL_DATA: FinancialData = {
  expenses: [
    { id: "e1", amount: 4.50, category: "Food", date: "2026-06-18", notes: "Iced Latte at college cafe", currency: "USD" },
    { id: "e2", amount: 15.00, category: "Transportation", date: "2026-06-19", notes: "Metro weekly transit pass", currency: "USD" },
    { id: "e3", amount: 65.00, category: "Shopping", date: "2026-06-16", notes: "Sneakers discount purchase", currency: "USD" },
    { id: "e4", amount: 12.50, category: "Entertainment", date: "2026-06-17", notes: "Cinema movie tickets", currency: "USD" },
    { id: "e5", amount: 42.00, category: "Utilities", date: "2026-06-15", notes: "Flatmate share power bill", currency: "USD" }
  ],
  incomes: [
    { id: "i1", source: "Salary", amount: 1800.00, date: "2026-06-01", notes: "Junior Dev part-time wage", currency: "USD" },
    { id: "i2", source: "Freelancing", amount: 350.00, date: "2026-06-12", notes: "Designed interactive landing page", currency: "USD" }
  ],
  monthlyBudget: 1200,
  categoryBudgets: [
    { category: "Food", limit: 300 },
    { category: "Transportation", limit: 120 },
    { category: "Shopping", limit: 200 },
    { category: "Entertainment", limit: 150 },
    { category: "Education", limit: 100 },
    { category: "Healthcare", limit: 80 },
    { category: "Utilities", limit: 150 },
    { category: "Rent", limit: 600 },
    { category: "Miscellaneous", limit: 100 }
  ],
  recurringPayments: [
    { id: "r1", name: "Netflix Premium", cost: 15.49, category: "Entertainment", dueDate: 15, currency: "USD", isPaidThisMonth: false },
    { id: "r2", name: "Spotify Premium", cost: 10.99, category: "Entertainment", dueDate: 22, currency: "USD", isPaidThisMonth: true },
    { id: "r3", name: "Flat Lease", cost: 500.00, category: "Rent", dueDate: 1, currency: "USD", isPaidThisMonth: true },
    { id: "r4", name: "Gym Membership", cost: 35.00, category: "Utilities", dueDate: 10, currency: "USD", isPaidThisMonth: false }
  ],
  savingsGoals: [
    { id: "g1", name: "New MacBook Pro", targetAmount: 2000, currentAmount: 1250, targetDate: "2026-11-30", monthlyContribution: 200, currency: "USD" },
    { id: "g2", name: "Summer Surf Trip", targetAmount: 800, currentAmount: 400, targetDate: "2026-08-15", monthlyContribution: 150, currency: "USD" }
  ],
  currency: "USD",
  avatar: {
    level: 6,
    xp: 280,
    name: "Saksham",
    customization: {
      skinColor: "#FFD1B3",
      hairStyle: "curly",
      hairColor: "#1E272E",
      outfitColor: "#00C853",
      accessory: "glasses",
      backgroundTheme: "default"
    },
    streakDays: 5,
    lastCheckInDate: "2026-06-18"
  },
  achievements: [
    { id: "a1", name: "First Saver", description: "Log your first expense or goal saving contribution", iconName: "CheckCircle", unlocked: true, unlockedAt: "2026-06-12T11:00:00Z", xpReward: 50 },
    { id: "a2", name: "Budget Hero", description: "Stay under your monthly spending budget limits", iconName: "Shield", unlocked: true, unlockedAt: "2026-06-15T09:00:00Z", xpReward: 100 },
    { id: "a3", name: "Goal Crusher", description: "Successfully achieve 100% on any savings goal", iconName: "Crown", unlocked: false, xpReward: 150 },
    { id: "a4", name: "30-Day Streak", description: "Maintain a consecutive 30-day logging streak", iconName: "Zap", unlocked: false, xpReward: 200 },
    { id: "a5", name: "Cashflow Master", description: "Net monthly cashflow exceeds 30% savings rate", iconName: "TrendingUp", unlocked: true, unlockedAt: "2026-06-18T14:30:00Z", xpReward: 120 },
    { id: "a6", name: "Financial Ninja", description: "Audit your spending with AI Savings Coach", iconName: "Cpu", unlocked: false, xpReward: 250 }
  ],
  emailSettings: {
    name: "Saksham",
    email: "dubeysaksham005@gmail.com",
    dailyGoalAlert: true,
    weeklyGoalAlert: true,
    monthlyGoalAlert: false,
    subscriptionReminder: true
  },
  emailsInbox: [
    { 
      id: "em1", 
      timestamp: "2026-06-18T10:00:00.000Z", 
      to: "dubeysaksham005@gmail.com", 
      subject: "🔥 Save $5 Daily Streak Reminder", 
      body: "Hi Saksham,\n\nKeep your savings journey glowing today! Transfering $5 into your Savings Jar today secures your streak and unlocks accessories.\n\nBest,\nTrack Money Agent", 
      category: "reminder", 
      read: true 
    }
  ],
  isPremium: false
};

export default function App() {
  const [data, setData] = useState<FinancialData>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure subcomponents can load safely if schema differences exist
        return parsed;
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  // Level Up, XP indicators, and notifications
  const [notifications, setNotifications] = useState<string[]>([]);
  const [levelUpToast, setLevelUpToast] = useState<{ show: boolean; level: number }>({ show: false, level: 1 });

  // Filter criteria states
  const [expenseSearch, setExpenseSearch] = useState("");
  const [expenseFilterCat, setExpenseFilterCat] = useState<string>("All");

  // Inputs logs states
  const [logType, setLogType] = useState<"expense" | "income">("expense");
  const [logAmount, setLogAmount] = useState("");
  const [logCategory, setLogCategory] = useState<ExpenseCategory>("Food");
  const [logSource, setLogSource] = useState<IncomeSource>("Salary");
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [logNotes, setLogNotes] = useState("");
  const [logCurrency, setLogCurrency] = useState<CurrencyCode>("USD");

  // Goals additions state
  const [goalContributionId, setGoalContributionId] = useState("");
  const [goalContributionVal, setGoalContributionVal] = useState("");

  // Category limits settings form states
  const [editingBudgetCategory, setEditingBudgetCategory] = useState<ExpenseCategory>("Food");
  const [newCategoryLimit, setNewCategoryLimit] = useState("");

  // Overspending alert warning state
  const [overallLimitInput, setOverallLimitInput] = useState(data.monthlyBudget.toString());

  // Goals Creation Form Drawer states
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalContrib, setNewGoalContrib] = useState("");
  const [newGoalDate, setNewGoalDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split("T")[0];
  });

  // Save changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Cross-platform support states
  const [detectedOS, setDetectedOS] = useState<"mac" | "windows" | "mobile" | "other" | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<"dashboard" | "transactions" | "budgets" | "character" | "coach">("dashboard");
  const [showShortcutCheatSheet, setShowShortcutCheatSheet] = useState(false);

  // OS detection on mount
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|android|blackberry|mini|windows\sphone/i.test(ua)) {
      setDetectedOS("mobile");
    } else if (/macintosh|mac\s?.?os|mac\sos\sx/i.test(ua)) {
      setDetectedOS("mac");
    } else if (/windows/i.test(ua)) {
      setDetectedOS("windows");
    } else {
      setDetectedOS("other");
    }
  }, []);

  // Boot Loader Starting Animation Controls
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [currentUptime, setCurrentUptime] = useState(0);

  // Simulated starting system boot routine
  useEffect(() => {
    if (!isBooting) return;

    // Fast uptime ticker
    const uptimeTimer = setInterval(() => {
      setCurrentUptime((prev) => prev + 15);
    }, 15);

    // Progression checkpoints and terminal messages
    const steps = [
      { prg: 8, log: "Initializing Track Money microkernel..." },
      { prg: 22, log: "Validating platform drivers and viewport scale..." },
      { prg: 40, log: "Mapping offline encrypted local store vault..." },
      { prg: 60, log: "Fetching real-time local ledger conversion indexes..." },
      { prg: 78, log: "Establishing neural advice pathway with AI Coach..." },
      { prg: 92, log: "Synthesizing custom interactive dashboard nodes..." },
      { prg: 100, log: "Console shell nominal. Invoking dashboard portal..." }
    ];

    let currentStepIdx = 0;
    let localProgress = 0;

    const progressInterval = setInterval(() => {
      const increment = Math.floor(Math.random() * 9) + 4;
      localProgress = Math.min(100, localProgress + increment);
      
      setBootProgress(localProgress);

      // Feed logs if corresponding progress threshold has been crossed
      if (currentStepIdx < steps.length && localProgress >= steps[currentStepIdx].prg) {
        const nextLog = steps[currentStepIdx].log;
        setBootLogs((prevLogs) => [...prevLogs, nextLog]);
        currentStepIdx++;
      }

      if (localProgress === 100) {
        clearInterval(progressInterval);
        clearInterval(uptimeTimer);
        setTimeout(() => {
          setIsBooting(false);
        }, 450);
      }
    }, 80);

    // Support escaping starting animation using Esc key
    const handleEscapeBypass = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsBooting(false);
      }
    };
    window.addEventListener("keydown", handleEscapeBypass);

    return () => {
      clearInterval(progressInterval);
      clearInterval(uptimeTimer);
      window.removeEventListener("keydown", handleEscapeBypass);
    };
  }, [isBooting]);

  // Global Keyboard Shortcuts Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = detectedOS === "mac";
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Toggle Shortcut guide: Ctrl + / (Windows) or Cmd + / (Mac)
      if (modifier && e.key === "/") {
        e.preventDefault();
        setShowShortcutCheatSheet((prev) => !prev);
      }

      // Alt + N / Opt + N -> Focus Transaction Registration Amount
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (detectedOS === "mobile") {
          setActiveMobileTab("transactions");
        }
        setTimeout(() => {
          document.getElementById("txn-amount-input")?.focus();
          addToast("⚡ Amount log focused!");
        }, 100);
      }

      // Alt + J / Opt + J -> Focus History Search
      if (e.altKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        if (detectedOS === "mobile") {
          setActiveMobileTab("transactions");
        }
        setTimeout(() => {
          document.getElementById("journal-search-input")?.focus();
          addToast("🔎 Journal search focused!");
        }, 100);
      }

      // Alt + C / Opt + C -> Focus AI Coach input
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        if (detectedOS === "mobile") {
          setActiveMobileTab("coach");
        }
        setTimeout(() => {
          document.getElementById("ai-coach-prompt-input")?.focus();
          addToast("🤖 AI Coach input focused!");
        }, 100);
      }

      // Alt + A / Opt + A -> Claim check in daily XP shortcut
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        handleDailyCheckIn();
      }

      // Alt + T / Opt + T -> Switch Form Log Type between Expense & Income
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setLogType((prev) => (prev === "expense" ? "income" : "expense"));
        addToast("🔄 Form category toggle!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [detectedOS, data]);

  // Toast triggers
  const addToast = (msg: string) => {
    setNotifications((prev) => [msg, ...prev].slice(0, 3));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== msg));
    }, 4500);
  };

  // Convert amount utility based on dynamic active conversion rates
  const convertAmount = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    if (from === to) return amount;
    const usdVal = amount / CURRENCIES[from].rateToUSD;
    return usdVal * CURRENCIES[to].rateToUSD;
  };

  const currentCurrencySymbol = CURRENCIES[data.currency]?.symbol || "$";

  // Financial aggregates calculated dynamically relative to active currency
  const totalExpensesConverted = data.expenses.reduce((sum, e) => {
    return sum + convertAmount(Number(e.amount), e.currency, data.currency);
  }, 0);

  const totalIncomeConverted = data.incomes.reduce((sum, i) => {
    return sum + convertAmount(Number(i.amount), i.currency, data.currency);
  }, 0);

  const netCashflow = totalIncomeConverted - totalExpensesConverted;
  const currentSavingsRate = totalIncomeConverted > 0 ? (netCashflow / totalIncomeConverted) * 100 : 0;

  // Multi-currency auto-updated rates checker alerts
  const handleCurrencyChange = (newCode: CurrencyCode) => {
    setData((prev) => ({
      ...prev,
      currency: newCode,
    }));
    addToast(`Default currency changed to ${CURRENCIES[newCode].name}`);
  };

  // XP System mechanics
  const grantXP = (earnedXp: number, toastText: string) => {
    setData((prev) => {
      let nextXp = prev.avatar.xp + earnedXp;
      let nextLvl = prev.avatar.level;
      let triggerLvlUp = false;
      
      const xpNeeded = nextLvl * 100;
      if (nextXp >= xpNeeded) {
        nextXp = nextXp - xpNeeded;
        nextLvl += 1;
        triggerLvlUp = true;
      }

      if (triggerLvlUp) {
        setTimeout(() => {
          setLevelUpToast({ show: true, level: nextLvl });
          addToast(`⭐ LEVEL UP! You unlocked Level ${nextLvl} items.`);
        }, 500);

        // Append congratulatory email notification
        const welcomeEmail: VirtualEmail = {
          id: Date.now().toString() + "-level",
          timestamp: new Date().toISOString(),
          to: prev.emailSettings.email,
          subject: `👑 Achievement Unlocked: Level ${nextLvl} Financial Builder!`,
          body: `Congratulations ${prev.avatar.name},\n\nYou have ascended to level ${nextLvl}!\n\nYour pristine financial tracking consistency is paving the way for durable compound savings. Re-visit your customization studio drawer to customize your unlocked items.\n\nKeep level-ups and savings rate high!\n\nBest,\nTrack Money Gamified Studio`,
          category: "achievement",
          read: false
        };

        return {
          ...prev,
          avatar: {
            ...prev.avatar,
            xp: nextXp,
            level: nextLvl,
          },
          emailsInbox: [welcomeEmail, ...prev.emailsInbox]
        };
      }

      return {
        ...prev,
        avatar: {
          ...prev.avatar,
          xp: nextXp,
        }
      };
    });

    addToast(toastText);
  };

  // Log checklist check-ins
  const handleDailyCheckIn = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (data.avatar.lastCheckInDate === todayStr) {
      addToast("☕ You already checked in today! Come back tomorrow.");
      return;
    }

    const hasYest = data.avatar.lastCheckInDate === new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = hasYest ? data.avatar.streakDays + 1 : 1;

    setData((prev) => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        streakDays: newStreak,
        lastCheckInDate: todayStr,
      }
    }));

    grantXP(30, `🔥 Check-in claim! Streak: ${newStreak} Days (+30 XP)`);

    // Check streak achievements
    if (newStreak >= 7 && !data.achievements[3].unlocked) {
      unlockAchievement("a4", "Epic Accumulator streak!");
    }
  };

  // Unlock achievements
  const unlockAchievement = (id: string, customText: string) => {
    setData((prev) => {
      const updated = prev.achievements.map((ach) => {
        if (ach.id === id && !ach.unlocked) {
          setTimeout(() => {
            grantXP(ach.xpReward, `🏆 Achievement Unlocked: ${ach.name} (+${ach.xpReward} XP)`);
          }, 300);
          return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return ach;
      });
      return { ...prev, achievements: updated };
    });
  };

  // Add manually expense or income
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(logAmount);
    if (isNaN(val) || val <= 0) return;

    if (logType === "expense") {
      const newExp: Expense = {
        id: Date.now().toString(),
        amount: val,
        category: logCategory,
        date: logDate,
        notes: logNotes.trim() || `${logCategory} item purchase`,
        currency: logCurrency,
      };

      setData((prev) => ({
        ...prev,
        expenses: [newExp, ...prev.expenses],
      }));

      // Check category budget triggers
      const totalInCat = [newExp, ...data.expenses]
        .filter((e) => e.category === logCategory)
        .reduce((sum, e) => sum + convertAmount(Number(e.amount), e.currency, data.currency), 0);

      const targetBudget = data.categoryBudgets.find(c => c.category === logCategory);
      const convertedLimit = targetBudget ? convertAmount(targetBudget.limit, data.currency, data.currency) : 0;

      if (convertedLimit > 0 && totalInCat > convertedLimit) {
        addToast(`⚠️ Overspending Alert! ${logCategory} limits crossed!`);
        // Simulate warning email
        const warningMail: VirtualEmail = {
          id: Date.now().toString() + "-warning",
          timestamp: new Date().toISOString(),
          to: data.emailSettings.email,
          subject: `⚠️ Budget Overspending Alert: ${logCategory} limit exceeded!`,
          body: `Hi ${data.emailSettings.name},\n\nYour accumulated spending in ${logCategory} stands at ${currentCurrencySymbol}${totalInCat.toFixed(2)}, which exceeds your setting category limit of ${currentCurrencySymbol}${convertedLimit.toFixed(0)}.\n\nCut spontaneous expenditures to secure budget benchmarks!\n\nBest,\nTrack Money Watcher Core`,
          category: "alert",
          read: false
        };
        setData(prev => ({ ...prev, emailsInbox: [warningMail, ...prev.emailsInbox] }));
      }

      grantXP(10, `📝 Expense Logged: +10 XP earned`);
      unlockAchievement("a1", "Logged active expense!");

    } else {
      const newInc: Income = {
        id: Date.now().toString(),
        source: logSource,
        amount: val,
        date: logDate,
        notes: logNotes.trim() || `${logSource} earnings`,
        currency: logCurrency,
      };

      setData((prev) => ({
        ...prev,
        incomes: [newInc, ...prev.incomes],
      }));

      grantXP(15, `💵 Income Registered: +15 XP earned`);
    }

    setLogAmount("");
    setLogNotes("");
  };

  // Delete logged entries
  const handleDeleteExpense = (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    addToast("Expense removed.");
  };

  const handleDeleteIncome = (id: string) => {
    setData((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((i) => i.id !== id),
    }));
    addToast("Income removed.");
  };

  // Add savings amount directly to goal
  const handleContributeGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(goalContributionVal);
    if (!goalContributionId || isNaN(val) || val <= 0) return;

    setData((prev) => {
      const updatedGoals = prev.savingsGoals.map((g) => {
        if (g.id === goalContributionId) {
          const nextVal = g.currentAmount + val;
          const isComplete = nextVal >= g.targetAmount;
          
          if (isComplete) {
            setTimeout(() => {
              unlockAchievement("a3", "Goal Completed!");
            }, 300);
          }

          return {
            ...g,
            currentAmount: Math.min(g.targetAmount, nextVal),
          };
        }
        return g;
      });
      return { ...prev, savingsGoals: updatedGoals };
    });

    grantXP(25, `💰 Added ${currentCurrencySymbol}${val} to goal! (+25 XP)`);
    setGoalContributionVal("");
  };

  // Register general budget targets changes
  const handleUpdateOverallBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Math.abs(Number(overallLimitInput));
    if (!isNaN(val)) {
      setData((prev) => ({ ...prev, monthlyBudget: val }));
      addToast(`Monthly budget set to ${currentCurrencySymbol}${val}`);
    }
  };

  // Register individual category budget changes
  const handleUpdateCategoryBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Math.abs(Number(newCategoryLimit));
    if (!isNaN(val) && val > 0) {
      setData((prev) => {
        const caps = prev.categoryBudgets.map((b) => {
          if (b.category === editingBudgetCategory) {
            return { ...b, limit: val };
          }
          return b;
        });
        return { ...prev, categoryBudgets: caps };
      });
      addToast(`Budget for ${editingBudgetCategory} set to ${currentCurrencySymbol}${val}`);
      setNewCategoryLimit("");
    }
  };

  // Subscriptions setups
  const handleAddSubscription = (sub: Omit<RecurringPayment, "id" | "isPaidThisMonth">) => {
    const newSub: RecurringPayment = {
      ...sub,
      id: Date.now().toString(),
      isPaidThisMonth: false,
    };
    setData((prev) => ({
      ...prev,
      recurringPayments: [...prev.recurringPayments, newSub],
    }));
    addToast(`Added Recurring: ${newSub.name}`);
  };

  const handleCheckSubscription = (id: string, isPaid: boolean) => {
    setData((prev) => {
      const updated = prev.recurringPayments.map((r) => {
        if (r.id === id) {
          if (isPaid) {
            setTimeout(() => {
              grantXP(15, `🔌 Subscription Payment complete! (+15 XP)`);
            }, 100);
          }
          return { ...r, isPaidThisMonth: isPaid };
        }
        return r;
      });
      return { ...prev, recurringPayments: updated };
    });
  };

  const handleDeleteSubscription = (id: string) => {
    setData((prev) => ({
      ...prev,
      recurringPayments: prev.recurringPayments.filter((r) => r.id !== id),
    }));
    addToast("Subscription untracked.");
  };

  // Goals drawer builder
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const tarVal = Number(newGoalTarget);
    const conVal = Number(newGoalContrib);
    if (!newGoalName.trim() || isNaN(tarVal) || tarVal <= 0) return;

    const newGoal: SavingsGoal = {
      id: "g-" + Date.now().toString(),
      name: newGoalName.trim(),
      targetAmount: tarVal,
      currentAmount: 0,
      targetDate: newGoalDate,
      monthlyContribution: isNaN(conVal) ? 0 : conVal,
      currency: data.currency,
    };

    setData((prev) => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal],
    }));

    grantXP(20, `🎯 New Goal Created: ${newGoal.name}! (+20 XP)`);
    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalContrib("");
    setIsCreatingGoal(false);
  };

  const handleDeleteGoal = (id: string) => {
    setData((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
    addToast("Goal removed.");
  };

  // Virtual mail simulator dispatch hook
  const handleDispatchVirtualEmail = (category: "reminder" | "achievement" | "alert", subject: string, body: string) => {
    const newMail: VirtualEmail = {
      id: Date.now().toString() + "-sim",
      timestamp: new Date().toISOString(),
      to: data.emailSettings.email,
      subject,
      body,
      category,
      read: false,
    };
    setData((prev) => ({
      ...prev,
      emailsInbox: [newMail, ...prev.emailsInbox],
    }));
    addToast("📧 Outgoing Alert sent! Check virtual inbox tab.");
  };

  // Clear simulated mails list
  const handleClearMailsInbox = () => {
    setData((prev) => ({ ...prev, emailsInbox: [] }));
    addToast("Inbox cleared.");
  };

  // Expense filtered arrays list
  const filteredExpenses = data.expenses.filter((e) => {
    const matchesSearch = e.notes.toLowerCase().includes(expenseSearch.toLowerCase()) || e.category.toLowerCase().includes(expenseSearch.toLowerCase());
    const matchesFilter = expenseFilterCat === "All" || e.category === expenseFilterCat;
    return matchesSearch && matchesFilter;
  });

  // Calculate sum of active goal collections
  const totalSavedOnGoals = data.savingsGoals.reduce((sum, g) => sum + Number(g.currentAmount), 0);
  const totalGoalsTargetCombined = data.savingsGoals.reduce((sum, g) => sum + Number(g.targetAmount), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 relative">
      
      {/* Starting Boot/Loader Terminal Entry Animation Overlay */}
      <AnimatePresence mode="wait">
        {isBooting && (
          <motion.div
            key="spendos-starting-loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.05, 
              filter: "blur(15px)" 
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="fixed inset-0 bg-slate-950 z-[999] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
          >
            {/* Ambient phosphor background grids */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, #10B981 1px, transparent 1px),
                  linear-gradient(to bottom, #10B981 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px"
              }}
            />

            {/* Radiant glowing visual gradient centers */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Bypass / Fast option tag */}
            <button
              onClick={() => setIsBooting(false)}
              className="absolute top-6 right-6 font-mono text-[10px] text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/30 bg-slate-900/40 transition-all px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 z-50 text-left hover:scale-105"
            >
              <span>BYPASS SYSTEM LOADER</span>
              <span className="bg-slate-800 text-[8px] px-1 rounded text-slate-300">ESC</span>
            </button>

            <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8 z-10">
              
              {/* Premium Central Logo Frame */}
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                  className="w-16 h-16 bg-slate-900 border border-emerald-500/40 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.18)]"
                >
                  <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                  <Coins className="w-8 h-8 text-emerald-400 glowing-jar" />
                </motion.div>
                
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
              </div>

              {/* Console branding headers */}
              <div className="space-y-2">
                <motion.h1
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="font-mono text-xl font-black text-white tracking-wide uppercase flex flex-col sm:flex-row items-center justify-center gap-1"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold terminal-blink">&gt;_</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">Track Money</span>
                  </div>
                </motion.h1>
                <motion.p
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-mono text-[9px] text-emerald-600 font-bold uppercase tracking-[0.25em]"
                >
                  Durable cross-platform ledger
                </motion.p>
              </div>

              {/* Progress gauge track */}
              <div className="w-full space-y-2 text-left">
                <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold px-1 select-none">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    BOOT_UPTIME: {currentUptime}ms
                  </span>
                  <span className="text-emerald-400 font-extrabold">{bootProgress}%</span>
                </div>

                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bootProgress}%` }}
                    transition={{ ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-450 rounded-full"
                  />
                </div>
              </div>

              {/* Terminal Diagnostic Diagnostic Logs Box */}
              <div className="w-full bg-slate-950/70 border border-slate-900 rounded-2xl p-4.5 min-h-[145px] max-h-[145px] overflow-y-auto flex flex-col justify-end text-left font-mono text-[9px] leading-relaxed shadow-inner pt-2">
                <div className="space-y-1.5">
                  {bootLogs.map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-start gap-1.5 text-slate-300 animate-fade-in"
                    >
                      <span className="text-emerald-500 font-semibold select-none">[OK]</span>
                      <span>{log}</span>
                    </motion.div>
                  ))}
                  
                  {bootProgress < 100 && (
                    <div className="flex items-center gap-1.5 text-slate-500 animate-pulse mt-0.5">
                      <span>&gt; scanning shell structures</span>
                      <span className="w-1 h-2.5 bg-emerald-500 inline-block terminal-blink" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* Decorative Brand Top Banner Grid background */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-[#0F172A] to-[#1E293B] z-0 shadow-lg relative overflow-hidden flex flex-col justify-between">
        
        {/* Glowing floating visual coordinates */}
        <div className="absolute top-10 right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating level up congratulations toast overlay */}
        <AnimatePresence>
          {levelUpToast.show && (
            <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 p-4 bg-emerald-600 border border-emerald-500 rounded-3xl shadow-xl flex items-center gap-3 animate-[pulseGlow_2s_infinite]">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold">
                <Crown className="w-5 h-5" />
              </div>
              <div className="text-white pr-2">
                <h4 className="font-display font-bold text-sm">Level Up Celebrations!</h4>
                <p className="text-[11px] opacity-90">You unlocked Level {levelUpToast.level} exclusive clothing and crown items!</p>
              </div>
              <button
                onClick={() => setLevelUpToast({ ...levelUpToast, show: false })}
                className="text-white hover:text-slate-200 font-black px-2 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Toasts alert visual overlays */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {notifications.map((n, i) => (
            <div 
              key={i} 
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-4.5 py-3 rounded-xl shadow-lg pointer-events-auto flex items-center gap-2.5 animate-[pulseGlow_3s_infinite_ease-out]"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>{n}</span>
            </div>
          ))}
        </div>

        {/* Header toolbar banner */}
        <header className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-5 z-10">
          
          {/* Native Platform Status Row */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2 text-xs select-none">
            <div className="flex items-center flex-wrap gap-2 animate-fade-in">
              {detectedOS === "mac" && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-xl text-[10px] tracking-wide border border-slate-700 shadow-sm">
                  <Apple className="w-3.5 h-3.5 text-zinc-300" />
                  macOS Native Shell
                </span>
              )}
              {detectedOS === "windows" && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-xl text-[10px] tracking-wide border border-slate-700 shadow-sm">
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  Windows Desktop Shell
                </span>
              )}
              {detectedOS === "mobile" && (
                <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 font-bold px-2.5 py-1 rounded-xl text-[10px] tracking-wide border border-emerald-900/60 shadow-sm">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Mobile Touch Optimized
                </span>
              )}
              {detectedOS === "other" && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-xl text-[10px] tracking-wide border border-slate-700 shadow-sm">
                  <Monitor className="w-3.5 h-3.5 text-violet-400" />
                  Webapp Mode Active
                </span>
              )}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <Clock className="w-3 h-3" /> Latency: 4ms
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {detectedOS !== "mobile" && (
                <button 
                  onClick={() => setShowShortcutCheatSheet(true)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all uppercase cursor-pointer"
                >
                  <Keyboard className="w-3.5 h-3.5 text-amber-400" />
                  Shortcuts Guide
                  <span className="bg-slate-705 text-slate-300 text-[9px] px-1 rounded ml-1 font-mono">{detectedOS === "mac" ? "⌘" : "Ctrl"}+/</span>
                </button>
              )}
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                Durable Cloud Syncing
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand Logo Identity */}
            <div className="flex items-center gap-3">
              <div id="brand-logo" className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-slate-800/80 rotate-6 transform hover:rotate-12 transition-transform cursor-pointer overflow-hidden p-1 relative">
                <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Subtle grid lines in background */}
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="1 2" />
                  <line x1="0" y1="20" x2="40" y2="20" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="1 2" />
                  <line x1="0" y1="30" x2="40" y2="30" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="1 2" />
                  <line x1="10" y1="0" x2="10" y2="40" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="1 2" />
                  <line x1="20" y1="0" x2="20" y2="40" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="1 2" />
                  <line x1="30" y1="0" x2="30" y2="40" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="1 2" />

                  {/* Red/Green Dominant Graph Lines */}
                  {/* Green Line - high bullish trading breakouts */}
                  <path 
                    d="M 4 30 L 11 34 L 18 18 L 26 24 L 36 8" 
                    stroke="#10B981" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_6px_rgba(16,185,129,0.95)]"
                  />
                  
                  {/* Red Line - bearish cross trend */}
                  <path 
                    d="M 4 12 L 12 8 L 19 26 L 27 15 L 36 32" 
                    stroke="#EF4444" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_4px_rgba(239,68,68,0.9)]"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-display font-black text-2xl md:text-2.5xl text-white tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span>Track Money</span>
                </h1>
                <p className="text-xs text-slate-400 tracking-wide mt-0.5">"Spend Smart. Save More."</p>
              </div>
            </div>

            {/* Global Switches control tools */}
            <div className="flex items-center flex-wrap gap-3">
              
              {/* Claim check in button */}
              <button
                onClick={handleDailyCheckIn}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer select-none"
              >
                Claim Daily XP
              </button>

              {/* Free vs Premium Membership switcher */}
              <label className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 p-1.5 rounded-xl text-xs text-slate-300 font-medium select-none cursor-pointer">
                <span>Free Plan</span>
                <div 
                  onClick={() => setData(prev => {
                    const nextSt = !prev.isPremium;
                    addToast(nextSt ? "💎 Upgraded to Premium! Advanced AI unlocked." : "Downgraded to Free tier plan.");
                    return { ...prev, isPremium: nextSt };
                  })}
                  className={`w-10 h-5 bg-slate-600 rounded-full relative transition-colors cursor-pointer ${data.isPremium ? "bg-amber-400" : ""}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${data.isPremium ? "left-5.5" : "left-0.5"}`} />
                </div>
                <span className={`font-bold flex items-center gap-1 ${data.isPremium ? "text-amber-400" : "text-slate-400"}`}>
                  Premium
                  <Gem className="w-3.5 h-3.5" />
                </span>
              </label>

              {/* Currency switcher dropdown */}
              <div className="flex bg-slate-800/80 border border-slate-700 p-1.5 rounded-xl">
                <select
                  value={data.currency}
                  onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                  className="bg-transparent border-none text-slate-300 text-xs font-bold font-mono outline-hidden cursor-pointer"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-940 text-slate-300">
                      {c.code} ({c.symbol.trim()})
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </header>

        {/* Hero details showcase */}
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 pb-8 z-10">
          <div className="max-w-2xl text-left">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight leading-tight">
              Track Every Rupee. <span className="text-brand-green">Save Every Day.</span>
            </h2>
            <p className="text-slate-300 text-sm mt-2 font-medium leading-relaxed max-w-xl">
              Smart expense tracking powered by AI insights, monthly category budgeting tools, and rewarding gamified avatars character studios.
            </p>
          </div>
        </section>

      </div>

      {/* Main Container Widgets App Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 z-20 relative space-y-6">
        
        {/* Mobile View Structure: visible only on small viewports (<lg) */}
        <div className="block lg:hidden space-y-6">
          
          {/* Quick Balance Stats Row */}
          <div className="grid grid-cols-2 gap-3 pb-1">
            {/* Total Income */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-left">Income</span>
              <h3 className="font-mono font-bold text-lg text-slate-850 mt-1 block text-left">
                {currentCurrencySymbol}{totalIncomeConverted.toFixed(1)}
              </h3>
            </div>
            {/* Expenditures */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-left">Expenses</span>
              <h3 className="font-mono font-bold text-lg text-slate-850 mt-1 block text-left">
                {currentCurrencySymbol}{totalExpensesConverted.toFixed(1)}
              </h3>
            </div>
            {/* Remaining budget limits */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-left">Remaining</span>
              <h3 className="font-mono font-bold text-lg text-slate-850 mt-1 block text-left">
                {currentCurrencySymbol}{Math.max(0, data.monthlyBudget - totalExpensesConverted).toFixed(1)}
              </h3>
            </div>
            {/* Savings Rate metric */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-left">Savings Rate</span>
              <h3 className="font-mono font-bold text-lg text-emerald-600 mt-1 block text-left">
                {currentSavingsRate.toFixed(1)}%
              </h3>
            </div>
          </div>

          {/* Sticky Tabbed Controller for optimal touch-targets */}
          <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md border border-slate-800 py-3 rounded-2xl flex items-center justify-around text-center z-40 shadow-xl max-w-lg mx-auto">
            <button
              onClick={() => setActiveMobileTab("dashboard")}
              className="flex flex-col items-center gap-1.5 transition-all flex-1 cursor-pointer touch-manipulation min-h-[44px] justify-center"
            >
              <CreditCard className={`w-5 h-5 transition-transform ${activeMobileTab === "dashboard" ? "text-emerald-400 scale-110" : "text-slate-400"}`} />
              <span className={`text-[9px] font-extrabold ${activeMobileTab === "dashboard" ? "text-emerald-400" : "text-slate-400"}`}>JAR</span>
            </button>
            <button
              onClick={() => setActiveMobileTab("transactions")}
              className="flex flex-col items-center gap-1.5 transition-all flex-1 cursor-pointer touch-manipulation min-h-[44px] justify-center"
            >
              <Coins className={`w-5 h-5 transition-transform ${activeMobileTab === "transactions" ? "text-emerald-400 scale-110" : "text-slate-400"}`} />
              <span className={`text-[9px] font-extrabold ${activeMobileTab === "transactions" ? "text-emerald-400" : "text-slate-400"}`}>LOGGER</span>
            </button>
            <button
              onClick={() => setActiveMobileTab("budgets")}
              className="flex flex-col items-center gap-1.5 transition-all flex-1 cursor-pointer touch-manipulation min-h-[44px] justify-center"
            >
              <Clock className={`w-5 h-5 transition-transform ${activeMobileTab === "budgets" ? "text-emerald-400 scale-110" : "text-slate-400"}`} />
              <span className={`text-[9px] font-extrabold ${activeMobileTab === "budgets" ? "text-emerald-400" : "text-slate-400"}`}>BUDGET</span>
            </button>
            <button
              onClick={() => setActiveMobileTab("character")}
              className="flex flex-col items-center gap-1.5 transition-all flex-1 cursor-pointer touch-manipulation min-h-[44px] justify-center"
            >
              <User className={`w-5 h-5 transition-transform ${activeMobileTab === "character" ? "text-emerald-400 scale-110" : "text-slate-400"}`} />
              <span className={`text-[9px] font-extrabold ${activeMobileTab === "character" ? "text-emerald-400" : "text-slate-400"}`}>HERO</span>
            </button>
            <button
              onClick={() => setActiveMobileTab("coach")}
              className="flex flex-col items-center gap-1.5 transition-all flex-1 cursor-pointer touch-manipulation min-h-[44px] justify-center"
            >
              <Sparkles className={`w-5 h-5 transition-transform ${activeMobileTab === "coach" ? "text-emerald-400 scale-110" : "text-slate-400"}`} />
              <span className={`text-[9px] font-extrabold ${activeMobileTab === "coach" ? "text-emerald-400" : "text-slate-400"}`}>COACH</span>
            </button>
          </div>

          {/* Mobile views router container */}
          <div className="space-y-6 pt-1 text-left">
            {activeMobileTab === "dashboard" && (
              <div className="space-y-6 animate-fade-in text-xs">
                {/* Savings Jar component */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                  <div className="h-[320px]">
                    <SavingsJar
                      savingsRate={currentSavingsRate}
                      totalSaved={totalSavedOnGoals}
                      totalGoalTarget={totalGoalsTargetCombined}
                      currencySymbol={currentCurrencySymbol}
                    />
                  </div>
                </div>

                {/* Subscriptions manager */}
                <SubscriptionManager
                  subscriptions={data.recurringPayments}
                  activeCurrency={data.currency}
                  onAddSubscription={handleAddSubscription}
                  onCheckSubscription={handleCheckSubscription}
                  onDeleteSubscription={handleDeleteSubscription}
                />

                {/* Virtual Emails notifications manager */}
                <EmailSimulator
                  settings={data.emailSettings}
                  emails={data.emailsInbox}
                  isPremium={data.isPremium}
                  onUpdateSettings={(updated) => setData((prev) => ({ ...prev, emailSettings: updated }))}
                  onSimulateEmail={handleDispatchVirtualEmail}
                  onClearInbox={handleClearMailsInbox}
                />
              </div>
            )}

            {activeMobileTab === "transactions" && (
              <div className="space-y-6 animate-fade-in text-xs">
                {/* Registration ledger log transaction form */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 select-none">
                    <span className="font-display font-semibold text-base text-slate-800 flex items-center gap-1.5">
                      <Coins className="text-emerald-500 w-4.5 h-4.5" />
                      Log Transaction
                    </span>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                      <button
                        onClick={() => setLogType("expense")}
                        className={`font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                          logType === "expense" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500"
                        }`}
                      >
                        Expense
                      </button>
                      <button
                        onClick={() => setLogType("income")}
                        className={`font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                          logType === "income" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500"
                        }`}
                      >
                        Income
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAddLog} className="space-y-3.5 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Input Amount</label>
                      <div className="relative mt-1">
                        <select
                          value={logCurrency}
                          onChange={(e) => setLogCurrency(e.target.value as CurrencyCode)}
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-slate-100 text-slate-600 font-mono font-bold text-[10px] px-2 py-1 rounded-sm border-none outline-none"
                        >
                          {Object.keys(CURRENCIES).map((code) => (
                            <option key={code} value={code}>{code}</option>
                          ))}
                        </select>
                        <input
                          id="txn-amount-input-mobile"
                          type="number"
                          required
                          step="0.01"
                          placeholder="0.00"
                          value={logAmount}
                          onChange={(e) => setLogAmount(e.target.value)}
                          className="w-full pl-[68px] pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold outline-hidden focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                        />
                      </div>
                    </div>

                    {logType === "expense" ? (
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Category Tag</label>
                        <select
                          value={logCategory}
                          onChange={(e) => setLogCategory(e.target.value as ExpenseCategory)}
                          className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Income Source</label>
                        <select
                          value={logSource}
                          onChange={(e) => setLogSource(e.target.value as IncomeSource)}
                          className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs"
                        >
                          {INCOME_SOURCES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Transaction Date</label>
                      <input
                        type="date"
                        required
                        value={logDate}
                        onChange={(e) => setLogDate(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Details / Memo Note</label>
                      <input
                        type="text"
                        value={logNotes}
                        maxLength={35}
                        onChange={(e) => setLogNotes(e.target.value)}
                        placeholder="e.g. Lunch at union, Uber, wage..."
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 font-bold uppercase tracking-wider text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 transition-colors shadow-2xs cursor-pointer min-h-[44px]"
                    >
                      Confirm Registration
                    </button>
                  </form>
                </div>

                {/* Journal lists search area */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col h-[380px]">
                  <div className="pb-3 border-b border-slate-100 mb-3 shrink-0 flex justify-between items-center">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-slate-800">Historical Journal</h4>
                      <p className="text-[10px] text-slate-400">Showing {filteredExpenses.length} filtered entries</p>
                    </div>
                    
                    <select
                      value={expenseFilterCat}
                      onChange={(e) => setExpenseFilterCat(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-650 text-[10px] font-bold px-2 py-1 rounded-md"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative shrink-0 mb-3 text-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input
                      id="journal-search-input-mobile"
                      type="text"
                      placeholder="Search notes memo..."
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-755 text-xs"
                    />
                  </div>

                  <div className="grow overflow-y-auto space-y-2 pr-1">
                    {expenseTypeSwitcherList().length === 0 ? (
                      <div className="text-center py-12 text-slate-400 italic text-xs">
                        No matching history logs found.
                      </div>
                    ) : (
                      expenseTypeSwitcherList().map((item: any) => {
                        const isExpense = item.category !== undefined;
                        const itemSymbol = CURRENCIES[item.currency]?.symbol || "$";
                        return (
                          <div 
                            key={item.id} 
                            className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex justify-between items-center text-xs"
                          >
                            <div className="space-y-0.5 max-w-[140px] truncate text-left">
                              <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                                isExpense ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                              }`}>
                                {isExpense ? item.category : item.source}
                              </span>
                              <h5 className="font-semibold text-slate-800 truncate">
                                {item.notes}
                              </h5>
                              <p className="text-[9px] text-slate-400 font-semibold">{item.date}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="text-right font-mono font-bold text-slate-750 text-xs">
                                {isExpense ? "-" : "+"}
                                {itemSymbol}{Number(item.amount).toFixed(2)}
                              </div>
                              <button
                                onClick={() => isExpense ? handleDeleteExpense(item.id) : handleDeleteIncome(item.id)}
                                className="text-rose-500 font-bold p-1 bg-rose-50 hover:bg-rose-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeMobileTab === "budgets" && (
              <div className="space-y-6 animate-fade-in text-xs">
                {/* Category spending limits */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="font-display font-semibold text-sm text-slate-805 flex items-center gap-1.5">
                      <CreditCard className="text-emerald-500 w-4.5 h-4.5" />
                      Budgets Setting
                    </h3>
                    <p className="text-[10px] text-slate-440">Adjust category overspending warning limits</p>
                  </div>

                  <form onSubmit={handleUpdateOverallBudget} className="flex gap-2">
                    <div className="grow text-left">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Monthly Global Cap ({currentCurrencySymbol})</label>
                      <input
                        type="number"
                        value={overallLimitInput}
                        onChange={(e) => setOverallLimitInput(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-xs"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-slate-900 text-white rounded-lg px-3 py-1.5 hover:bg-slate-850 font-bold mt-5 text-[11px] max-h-9 align-middle cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  <form onSubmit={handleUpdateCategoryBudget} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block text-left">Set Category Cap</span>
                    <div className="flex gap-2">
                      <select
                        value={editingBudgetCategory}
                        onChange={(e) => setEditingBudgetCategory(e.target.value as ExpenseCategory)}
                        className="text-xs bg-white border border-slate-250 rounded-lg px-2 py-1 max-w-[125px]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        required
                        placeholder="Cap ($)"
                        value={newCategoryLimit}
                        onChange={(e) => setNewCategoryLimit(e.target.value)}
                        className="grow bg-white border border-slate-250 rounded-lg px-2 text-xs font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-brand-green hover:bg-brand-dark text-white px-3 py-1 font-bold rounded-lg cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                    {data.categoryBudgets.map((budg) => {
                      const spent = data.expenses
                        .filter((e) => e.category === budg.category)
                        .reduce((sum, e) => sum + convertAmount(Number(e.amount), e.currency, data.currency), 0);

                      const limit = convertAmount(budg.limit, data.currency, data.currency);
                      const remains = Math.max(0, limit - spent);
                      const usagePercent = Math.min(100, (spent / limit) * 100);

                      return (
                        <div key={budg.category} className="space-y-1 block text-left">
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="font-semibold text-xs block text-left">{budg.category}</span>
                            <span className="font-mono text-[10px] font-bold">
                              {currentCurrencySymbol}{spent.toFixed(0)} / {currentCurrencySymbol}{limit.toFixed(0)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-brand-green h-full rounded-full" style={{ width: `${usagePercent}%` }} />
                          </div>
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>{usagePercent.toFixed(0)}% Used</span>
                            {usagePercent >= 100 ? (
                              <span className="text-rose-500 font-extrabold">OVER LIMIT</span>
                            ) : (
                              <span>{currentCurrencySymbol}{remains.toFixed(0)} Left</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Savings goals settings and logs */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100 shrink-0 flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="font-display font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="text-emerald-500 w-4.5 h-4.5" />
                        Savings Funds
                      </h3>
                      <p className="text-[10px] text-slate-400">Total: {currentCurrencySymbol}{totalSavedOnGoals.toFixed(1)} saved</p>
                    </div>
                    <button
                      onClick={() => setIsCreatingGoal(!isCreatingGoal)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {isCreatingGoal && (
                    <form onSubmit={handleCreateGoal} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                      <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block text-left">Configure Goal</span>
                      <div className="space-y-2 text-xs">
                        <div>
                          <input
                            type="text"
                            required
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            placeholder="e.g. Vacation Bike Fund"
                            className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-left">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400">Target amt</label>
                            <input
                              type="number"
                              required
                              value={newGoalTarget}
                              onChange={(e) => setNewGoalTarget(e.target.value)}
                              placeholder="1000"
                              className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400">Monthly Target</label>
                            <input
                              type="number"
                              value={newGoalContrib}
                              onChange={(e) => setNewGoalContrib(e.target.value)}
                              placeholder="50"
                              className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                            />
                          </div>
                        </div>
                        <div className="text-left font-bold">
                          <label className="text-[9px] font-bold text-slate-400 block pb-1">Unlock Date</label>
                          <input
                            type="date"
                            value={newGoalDate}
                            onChange={(e) => setNewGoalDate(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1 font-bold">
                          <button
                            type="button"
                            onClick={() => setIsCreatingGoal(false)}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded-lg"
                          >
                            Build Fund
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {data.savingsGoals.length > 0 && (
                    <form onSubmit={handleContributeGoal} className="bg-emerald-50 border border-emerald-150 p-3 rounded-lg space-y-2 text-xs">
                      <span className="font-extrabold text-emerald-800 uppercase text-[9px] tracking-wider block text-left">Quick Deposit</span>
                      <div className="flex gap-2">
                        <select
                          value={goalContributionId}
                          onChange={(e) => setGoalContributionId(e.target.value)}
                          className="grow bg-white border border-slate-250 rounded-lg px-2 py-1 text-slate-750"
                          required
                        >
                          <option value="">Select Fund</option>
                          {data.savingsGoals.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          required
                          placeholder="Amt"
                          value={goalContributionVal}
                          onChange={(e) => setGoalContributionVal(e.target.value)}
                          className="w-16 bg-white border border-slate-250 rounded-lg px-2 text-xs font-mono font-bold"
                        />
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1 rounded-lg cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                    {data.savingsGoals.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 italic text-xs">No active funds created yet.</div>
                    ) : (
                      data.savingsGoals.map((g) => {
                        const percentage = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
                        return (
                          <div key={g.id} className="space-y-1 block text-left">
                            <div className="flex justify-between items-center text-slate-700">
                              <span className="font-semibold block truncate max-w-[150px]">{g.name}</span>
                              <span className="font-mono font-bold text-slate-800">
                                {currentCurrencySymbol}{g.currentAmount.toFixed(0)} / {currentCurrencySymbol}{g.targetAmount.toFixed(0)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold items-center">
                              <span>{percentage.toFixed(0)}% Saved</span>
                              <button
                                onClick={() => handleDeleteGoal(g.id)}
                                className="text-rose-550 font-bold p-1 hover:bg-rose-50 rounded"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Sheets converter export */}
                <SheetsExport 
                  financialData={data} 
                  onGrantXPReward={(xp, msg) => {
                    grantXP(xp, msg);
                    unlockAchievement("a1", "Excel master unlocked!");
                  }}
                />

                {/* Desktop Shortcut Creator */}
                <DesktopShortcutCreator 
                  onGrantXPReward={(xp, msg) => {
                    grantXP(xp, msg);
                  }}
                />
              </div>
            )}

            {activeMobileTab === "character" && (
              <div className="space-y-6 animate-fade-in text-xs">
                {/* Visual Avatar customizable component */}
                <FinancialAvatar
                  avatar={data.avatar}
                  isPremium={data.isPremium}
                  onUpdateAvatar={(updated) => setData((prev) => ({ ...prev, avatar: updated }))}
                />

                {/* Achievements List block */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
                  <div className="pb-2.5 border-b border-slate-100 mb-2 select-none text-left">
                    <h3 className="font-display font-semibold text-sm text-slate-850 flex items-center gap-1.5">
                      <Crown className="text-amber-500 fill-amber-300 w-4.5 h-4.5" />
                      Achievements Badges
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Extra level-up rewards checklists</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {data.achievements.map((ach) => (
                      <div 
                        key={ach.id} 
                        className={`p-3 rounded-xl border flex gap-3 ${
                          ach.unlocked 
                            ? "bg-slate-50 border-emerald-100 shadow-3xs" 
                            : "bg-slate-100/50 border-slate-200 opacity-60"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          ach.unlocked ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                        }`}>
                          <CheckCircle className="w-4.5 h-4.5" />
                        </div>
                        <div className="truncate text-left text-xs my-auto">
                          <h4 className="text-xs font-extrabold text-slate-800 truncate">{ach.name}</h4>
                          <p className="text-[9px] text-slate-440 truncate max-w-[200px]">{ach.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeMobileTab === "coach" && (
              <div className="space-y-6 animate-fade-in text-xs">
                {/* AI advice interactions chatbot */}
                <AICoach
                  financialData={data}
                  onGrantXPReward={(xp, msg) => {
                    grantXP(xp, msg);
                    unlockAchievement("a6", "Enriched by savings coach!");
                  }}
                />

                {/* Analytical charts reports panel */}
                <AnalyticsPanel financialData={data} />
              </div>
            )}
          </div>
        </div>

        {/* Desktop View Structure: visible only on lg & xl viewports */}
        <div className="hidden lg:block space-y-6">
        
        {/* Bento Top Header: Quick balance stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card: Total Income */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 flex justify-between items-center shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Monthly Income</span>
              <h3 className="font-mono font-bold text-2xl text-slate-800">
                {currentCurrencySymbol}{totalIncomeConverted.toFixed(2)}
              </h3>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Active earnings
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card: Monthly Expenditures */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 flex justify-between items-center shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Current Expenditures</span>
              <h3 className="font-mono font-bold text-2xl text-slate-800">
                {currentCurrencySymbol}{totalExpensesConverted.toFixed(2)}
              </h3>
              
              {/* Alert status comparison with monthly overall limits */}
              {totalExpensesConverted > data.monthlyBudget ? (
                <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Budget Limit Crossed!
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 font-semibold">
                  Under monthly benchmarks
                </p>
              )}
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalExpensesConverted > data.monthlyBudget ? "bg-rose-500/10 text-rose-500" : "bg-rose-500/10 text-rose-500"}`}>
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          {/* Card: Remaining limit outlays */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 flex justify-between items-center shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Remaining Budget</span>
              <h3 className="font-mono font-bold text-2xl text-slate-800">
                {currentCurrencySymbol}{Math.max(0, data.monthlyBudget - totalExpensesConverted).toFixed(2)}
              </h3>
              <p className="text-[10px] text-slate-400">
                Monthly Cap: {currentCurrencySymbol}{data.monthlyBudget}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          {/* Card: Streak/Checkin aggregates */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 flex justify-between items-center shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Savings Rate</span>
              <h3 className="font-mono font-bold text-2xl text-emerald-600">
                {currentSavingsRate.toFixed(1)}%
              </h3>
              <p className="text-[10px] text-slate-400">
                Net Saved: {currentCurrencySymbol}{netCashflow.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="w-5 h-5 fill-amber-500/10" />
            </div>
          </div>

        </div>

        {/* Bento Primary Block Contents layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column LEFT: Logs transactions center (span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Logging Form Widget */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 select-none">
                <span className="font-display font-semibold text-base text-slate-800 flex items-center gap-1.5">
                  <Coins className="text-emerald-500 w-4.5 h-4.5" />
                  Log Transaction
                </span>
                
                {/* Switcher tabs */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setLogType("expense")}
                    className={`font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                      logType === "expense" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => setLogType("income")}
                    className={`font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                      logType === "income" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Form entries inputs */}
              <form onSubmit={handleAddLog} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Input Amount</label>
                  <div className="relative mt-1">
                    <select
                      value={logCurrency}
                      onChange={(e) => setLogCurrency(e.target.value as CurrencyCode)}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-slate-100 text-slate-600 font-mono font-bold text-[10px] px-2 py-1 rounded-sm border-none outline-none"
                    >
                      {Object.keys(CURRENCIES).map((code) => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                    <input
                      id="txn-amount-input"
                      type="number"
                      required
                      step="0.01"
                      placeholder="0.00"
                      value={logAmount}
                      onChange={(e) => setLogAmount(e.target.value)}
                      className="w-full pl-[68px] pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold outline-hidden focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                {logType === "expense" ? (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Category Tag</label>
                    <select
                      value={logCategory}
                      onChange={(e) => setLogCategory(e.target.value as ExpenseCategory)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-hidden"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Income Source</label>
                    <select
                      value={logSource}
                      onChange={(e) => setLogSource(e.target.value as IncomeSource)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-hidden animate-fade-in"
                    >
                      {INCOME_SOURCES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Transaction Date</label>
                    <input
                      type="date"
                      required
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Details / Memo Note</label>
                  <input
                    type="text"
                    value={logNotes}
                    maxLength={35}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="e.g. Lunch at union, Uber, wage..."
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 font-bold uppercase tracking-wider text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 transition-colors shadow-2xs cursor-pointer"
                >
                  Confirm Registration
                </button>
              </form>
            </div>

            {/* Historical Entries Logger search/view panel */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col h-[380px]">
              <div className="pb-3 border-b border-slate-100 mb-3 shrink-0 flex justify-between items-center">
                <div>
                  <h4 className="font-display font-semibold text-sm text-slate-800">Historical Journal</h4>
                  <p className="text-[10px] text-slate-400">Showing {filteredExpenses.length} filters match</p>
                </div>
                
                {/* Simple categorical filter */}
                <select
                  value={expenseFilterCat}
                  onChange={(e) => setExpenseFilterCat(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-md outline-hidden cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Search bar input filter */}
              <div className="relative shrink-0 mb-3 text-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  id="journal-search-input"
                  type="text"
                  placeholder="Search notes memo..."
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                  className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-700"
                />
              </div>

              {/* Expense + Income List View scroll box */}
              <div className="grow overflow-y-auto space-y-2 pr-1">
                {expenseTypeSwitcherList().length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic text-xs">
                    No matching history logs found.
                  </div>
                ) : (
                  expenseTypeSwitcherList().map((item: any) => {
                    const isExpense = item.category !== undefined;
                    const itemSymbol = CURRENCIES[item.currency]?.symbol || "$";
                    return (
                      <div 
                        key={item.id} 
                        className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex justify-between items-center text-xs group"
                      >
                        <div className="space-y-0.5 max-w-[140px] truncate">
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                            isExpense ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {isExpense ? item.category : item.source}
                          </span>
                          <h5 className="font-semibold text-slate-800 truncate" title={item.notes}>
                            {item.notes}
                          </h5>
                          <p className="text-[9px] text-slate-400 font-semibold">{item.date}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right font-mono font-bold text-slate-700 text-xs">
                            {isExpense ? "-" : "+"}
                            {itemSymbol}{Number(item.amount).toFixed(2)}
                          </div>
                          <button
                            onClick={() => isExpense ? handleDeleteExpense(item.id) : handleDeleteIncome(item.id)}
                            className="text-slate-350 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                            title="Remove log entry"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Column CENTER: Budgets & Savings Goals Planning (span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Section Card: Budgets planner category settings */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100 shrink-0 select-none">
                <h3 className="font-display font-semibold text-base text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="text-emerald-500 w-4.5 h-4.5" />
                  Budgets Planner
                </h3>
                <p className="text-xs text-slate-400">Configure boundaries and overspend sensors</p>
              </div>

              {/* Dynamic Overall Cap Limit input */}
              <form onSubmit={handleUpdateOverallBudget} className="flex gap-2 text-xs">
                <div className="grow">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Monthly Overall Cap ({currentCurrencySymbol})</label>
                  <input
                    type="number"
                    value={overallLimitInput}
                    onChange={(e) => setOverallLimitInput(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-slate-900 text-white rounded-lg px-3 py-1 mt-5 hover:bg-slate-800 font-bold max-h-7 self-center cursor-pointer"
                >
                  Set Cap
                </button>
              </form>

              {/* Edit Category limits form */}
              <form onSubmit={handleUpdateCategoryBudget} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block">Set Category Cap</span>
                <div className="flex gap-2">
                  <select
                    value={editingBudgetCategory}
                    onChange={(e) => setEditingBudgetCategory(e.target.value as ExpenseCategory)}
                    className="text-xs bg-white border border-slate-250 rounded-lg px-2.5 py-1"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Cap ($)"
                    value={newCategoryLimit}
                    onChange={(e) => setNewCategoryLimit(e.target.value)}
                    className="grow bg-white border border-slate-250 rounded-lg px-2 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-brand-green hover:bg-brand-dark text-white px-3 py-1 font-bold rounded-lg cursor-pointer text-xs"
                  >
                    Set
                  </button>
                </div>
              </form>

              {/* Display Category Caps Progress list */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {data.categoryBudgets.map((budg) => {
                  const spent = data.expenses
                    .filter((e) => e.category === budg.category)
                    .reduce((sum, e) => sum + convertAmount(Number(e.amount), e.currency, data.currency), 0);

                  const limit = convertAmount(budg.limit, data.currency, data.currency);
                  const remains = Math.max(0, limit - spent);
                  const usagePercent = Math.min(100, (spent / limit) * 100);

                  return (
                    <div key={budg.category} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="font-medium">{budg.category}</span>
                        <span className="font-mono text-[10px] font-bold">
                          {currentCurrencySymbol}{spent.toFixed(0)} / <span className="text-slate-400">{currentCurrencySymbol}{limit.toFixed(0)}</span>
                        </span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-150 relative">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            usagePercent >= 100 
                              ? "bg-rose-500" 
                              : usagePercent >= 80 
                                ? "bg-amber-400" 
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                        <span>{usagePercent.toFixed(0)}% Used</span>
                        {usagePercent >= 100 ? (
                          <span className="text-rose-500 font-bold animate-pulse">OVER LIMIT!</span>
                        ) : (
                          <span>{currentCurrencySymbol}{remains.toFixed(0)} Left</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Savings Goals Widget System */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100 shrink-0 flex justify-between items-center select-none">
                <div>
                  <h3 className="font-display font-semibold text-base text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="text-emerald-500 w-4.5 h-4.5" />
                    Savings Goals
                  </h3>
                  <p className="text-xs text-slate-400">Target totals: {currentCurrencySymbol}{totalSavedOnGoals.toFixed(2)} saved</p>
                </div>
                <button
                  onClick={() => setIsCreatingGoal(!isCreatingGoal)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-all cursor-pointer"
                  title="Create Goal"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Creates Goal form sliding drawer */}
              {isCreatingGoal && (
                <form onSubmit={handleCreateGoal} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shrink-0 text-xs">
                  <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Configure New Goal</span>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400">Goal Identifier</label>
                      <input
                        type="text"
                        required
                        value={newGoalName}
                        onChange={(e) => setNewGoalName(e.target.value)}
                        placeholder="e.g. Vacation Bike Fund"
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400">Target amount ({currentCurrencySymbol})</label>
                        <input
                          type="number"
                          required
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(e.target.value)}
                          placeholder="1500"
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400">Monthly Target Contrib</label>
                        <input
                          type="number"
                          value={newGoalContrib}
                          onChange={(e) => setNewGoalContrib(e.target.value)}
                          placeholder="100"
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400">Target Date (Unlock Date)</label>
                      <input
                        type="date"
                        value={newGoalDate}
                        onChange={(e) => setNewGoalDate(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingGoal(false)}
                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-green hover:bg-brand-dark text-white font-bold px-4 py-1 rounded-lg text-xs cursor-pointer"
                    >
                      Build Goal
                    </button>
                  </div>
                </form>
              )}

              {/* Deposit Money onto Goals form box */}
              {data.savingsGoals.length > 0 && (
                <form onSubmit={handleContributeGoal} className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl space-y-2.5 text-xs">
                  <span className="font-bold text-emerald-800 uppercase text-[9px] tracking-wider block">Quick Deposit money</span>
                  <div className="flex gap-2">
                    <select
                      value={goalContributionId}
                      onChange={(e) => setGoalContributionId(e.target.value)}
                      className="grow bg-white border border-slate-250 rounded-lg px-2 py-1 text-slate-750"
                      required
                    >
                      <option value="">Select Savings Fund</option>
                      {data.savingsGoals.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      placeholder="Amt"
                      value={goalContributionVal}
                      onChange={(e) => setGoalContributionVal(e.target.value)}
                      className="w-16 bg-white border border-slate-250 rounded-lg px-2.5 text-xs font-mono font-bold"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>
              )}

              {/* Goals display scroll details list */}
              <div className="space-y-4 max-h-52 overflow-y-auto pr-1">
                {data.savingsGoals.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 italic text-xs">
                    No active goals set up. Click '+' to build Fund!
                  </div>
                ) : (
                  data.savingsGoals.map((g) => {
                    const percentage = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
                    return (
                      <div key={g.id} className="space-y-1 text-xs group">
                        <div className="flex justify-between items-center text-slate-700">
                          <span className="font-semibold block truncate max-w-[150px]">{g.name}</span>
                          <span className="font-mono font-bold">
                            {currentCurrencySymbol}{g.currentAmount.toFixed(0)} / <span className="text-slate-400">{currentCurrencySymbol}{g.targetAmount.toFixed(0)}</span>
                          </span>
                        </div>

                        {/* Progress ring/track bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div 
                            className="bg-brand-green h-full rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[9px] text-slate-400 font-semibold items-center">
                          <span>{percentage.toFixed(0)}% Completed</span>
                          <div className="flex items-center gap-1.5">
                            <span>Date: {g.targetDate}</span>
                            <button
                              onClick={() => handleDeleteGoal(g.id)}
                              className="text-slate-350 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                              title="Delete Goal"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sheets converter export widget */}
            <SheetsExport 
              financialData={data} 
              onGrantXPReward={(xp, msg) => {
                grantXP(xp, msg);
                unlockAchievement("a1", "Excel master unlocked!");
              }}
            />

            {/* Desktop Shortcut Creator */}
            <DesktopShortcutCreator 
              onGrantXPReward={(xp, msg) => {
                grantXP(xp, msg);
              }}
            />

          </div>

          {/* Column RIGHT: Dynamic Jar Visuals & recurring payment, notifications (span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Embedded Active Savings Jar */}
            <div className="h-96">
              <SavingsJar
                savingsRate={currentSavingsRate}
                totalSaved={totalSavedOnGoals}
                totalGoalTarget={totalGoalsTargetCombined}
                currencySymbol={currentCurrencySymbol}
              />
            </div>

            {/* Financial Avatar card */}
            <div>
              <FinancialAvatar
                avatar={data.avatar}
                isPremium={data.isPremium}
                onUpdateAvatar={(updated) => setData((prev) => ({ ...prev, avatar: updated }))}
              />
            </div>

            {/* Subscriptions fixed bills manager */}
            <div>
              <SubscriptionManager
                subscriptions={data.recurringPayments}
                activeCurrency={data.currency}
                onAddSubscription={handleAddSubscription}
                onCheckSubscription={handleCheckSubscription}
                onDeleteSubscription={handleDeleteSubscription}
              />
            </div>

          </div>

        </div>

        {/* Bento bottom deck: AI coach & reports graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          
          {/* AI Coach panel frame block */}
          <div>
            <AICoach
              financialData={data}
              onGrantXPReward={(xp, msg) => {
                grantXP(xp, msg);
                unlockAchievement("a6", "Enriched by savings coach!");
              }}
            />
          </div>

          {/* Multi-report analytical graphs chart */}
          <div>
            <AnalyticsPanel
              financialData={data}
            />
          </div>

        </div>

        {/* Bento final dock: Email notification simulator card and achievements grid checklist */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Achievements Grid list layout (span 7) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between h-full">
            <div className="pb-3 border-b border-slate-100 mb-4 shrink-0 select-none">
              <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-1.5">
                <Crown className="text-amber-500 fill-amber-300 w-5 h-5 animate-bounce" />
                Achievements & Badges
              </h3>
              <p className="text-xs text-slate-400 font-medium">Unlocks exclusive level XP multipliers on completions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-2">
              {data.achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`p-3.5 rounded-xl border flex gap-3 h-24 ${
                    ach.unlocked 
                      ? "bg-slate-50 border-emerald-100 shadow-3xs" 
                      : "bg-slate-100/50 border-slate-250 opacity-55"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    ach.unlocked 
                      ? "bg-emerald-500 text-white shadow-xs" 
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {ach.iconName === "CheckCircle" && <CheckCircle className="w-5 h-5" />}
                    {ach.iconName === "Shield" && <CheckCircle className="w-5 h-5 opacity-90" />}
                    {ach.iconName === "Crown" && <Crown className="w-5 h-5" />}
                    {ach.iconName === "Zap" && <Sparkles className="w-5 h-5" />}
                    {ach.iconName === "TrendingUp" && <TrendingUp className="w-5 h-5" />}
                    {ach.iconName === "Cpu" && <CpuWidgetIcon />}
                  </div>

                  <div className="space-y-0.5 text-left truncate">
                    <span className="flex justify-between items-center gap-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{ach.name}</h4>
                      <span className="inline-block text-[8px] font-black font-mono text-emerald-600 bg-emerald-50 px-1 border border-emerald-100 rounded-sm">
                        +{ach.xpReward} XP
                      </span>
                    </span>
                    <p className="text-[10px] text-slate-440 leading-snug line-clamp-2 pr-1">{ach.description}</p>
                    {ach.unlocked && (
                      <span className="text-[8px] text-emerald-600 font-mono font-bold block uppercase tracking-wide">
                        🏆 UNLOCKED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-wide mt-4 shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Keep adding logs and finishing goal items to lock down remaining wealth builder badges!
            </div>
          </div>

          {/* Smart Alerts notification simulated inbox (span 5) */}
          <div className="md:col-span-5">
            <EmailSimulator
              settings={data.emailSettings}
              emails={data.emailsInbox}
              isPremium={data.isPremium}
              onUpdateSettings={(updated) => setData((prev) => ({ ...prev, emailSettings: updated }))}
              onSimulateEmail={handleDispatchVirtualEmail}
              onClearInbox={handleClearMailsInbox}
            />
          </div>

        {/* Close Widgets grid */}
        </div>

        {/* Close Desktop View container */}
        </div>

      </main>

      {/* Global OS Keyboard Shortcuts Cheat Sheet Modal Overlay */}
      {showShortcutCheatSheet && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-5 animate-scale-up text-xs text-left">
            <button 
              onClick={() => setShowShortcutCheatSheet(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg cursor-pointer transition-all border border-slate-700 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                <Keyboard className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-display font-black text-white text-base tracking-tight">System Hotkeys</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Track Money Cross-Platform Console</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-[11px]">Focus Transaction Amount Field</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">{detectedOS === "mac" ? "⌘" : "Ctrl"}</kbd>
                  <span className="text-[10px] text-slate-500">+</span>
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">I</kbd>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-[11px]">Toggle Log Type (Expense / Income)</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">{detectedOS === "mac" ? "⌘" : "Ctrl"}</kbd>
                  <span className="text-[10px] text-slate-500">+</span>
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">L</kbd>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-[11px]">Focus Journal Search input bar</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">{detectedOS === "mac" ? "⌘" : "Ctrl"}</kbd>
                  <span className="text-[10px] text-slate-500">+</span>
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">K</kbd>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-[11px]">Chat with AI Coach (Focus input)</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">{detectedOS === "mac" ? "⌘" : "Ctrl"}</kbd>
                  <span className="text-[10px] text-slate-500">+</span>
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">J</kbd>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-[11px]">Claim Daily Check-in XP bonus</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">{detectedOS === "mac" ? "⌘" : "Ctrl"}</kbd>
                  <span className="text-[10px] text-slate-500">+</span>
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">U</kbd>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300 border-t border-slate-800/80 pt-3.5">
                <span className="font-semibold text-[11px]">Toggle This Guide Overlay</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">{detectedOS === "mac" ? "⌘" : "Ctrl"}</kbd>
                  <span className="text-[10px] text-slate-500">+</span>
                  <kbd className="bg-slate-800 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">/</kbd>
                </span>
              </div>
            </div>

            <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span>
                Using <strong className="text-slate-300">{detectedOS === "mac" ? "macOS Native Shell" : "Windows Desktop Shell"}</strong> mappings as detected by the system environment.
              </span>
            </div>

            <button
              onClick={() => setShowShortcutCheatSheet(false)}
              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold tracking-wide uppercase py-2.5 rounded-xl transition-all cursor-pointer min-h-[44px]"
            >
              Close Console
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Selector supporting list conversions
  function expenseTypeSwitcherList() {
    return [
      ...data.expenses,
      ...data.incomes.map((i) => ({ ...i, category: undefined }))
    ].sort((a, b) => b.date.localeCompare(a.date));
  }
}

// Inline custom mini vector badge components
function CpuWidgetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <line x1="9" y1="9" x2="9" y2="15" />
      <line x1="15" y1="9" x2="15" y2="15" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
    </svg>
  );
}
