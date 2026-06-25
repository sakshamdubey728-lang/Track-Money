export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "AED" | "SGD" | "AUD" | "CAD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // Conversion rate relative to USD (1 USD = X Currency)
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rateToUSD: 1.0 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rateToUSD: 83.5 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rateToUSD: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rateToUSD: 0.78 },
  AED: { code: "AED", symbol: "AED ", name: "UAE Dirham", rateToUSD: 3.67 },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", rateToUSD: 1.35 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rateToUSD: 1.50 },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rateToUSD: 1.37 },
};

export type ExpenseCategory =
  | "Food"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Education"
  | "Healthcare"
  | "Utilities"
  | "Rent"
  | "Miscellaneous";

export type IncomeSource = "Salary" | "Freelancing" | "Business Income" | "Scholarships" | "Investments";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  notes: string;
  currency: CurrencyCode;
}

export interface Income {
  id: string;
  source: IncomeSource;
  amount: number;
  date: string; // YYYY-MM-DD
  notes: string;
  currency: CurrencyCode;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  limit: number;
}

export interface RecurringPayment {
  id: string;
  name: string;
  cost: number;
  category: string;
  dueDate: number; // Day of the month (1-31)
  currency: CurrencyCode;
  isPaidThisMonth: boolean;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  monthlyContribution: number;
  currency: CurrencyCode;
}

export interface AvatarCustomization {
  skinColor: string; // hex
  hairStyle: "short" | "long" | "curly" | "spiky" | "bald";
  hairColor: string; // hex
  outfitColor: string; // hex
  accessory: "none" | "glasses" | "crown" | "headphones" | "cape";
  backgroundTheme: "default" | "neon" | "space" | "gold" | "forest";
}

export interface AvatarState {
  level: number;
  xp: number;
  name: string;
  customization: AvatarCustomization;
  streakDays: number;
  lastCheckInDate?: string; // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
  unlocked: boolean;
  unlockedAt?: string; // ISO string
  xpReward: number;
}

export interface EmailSettings {
  name: string;
  email: string;
  dailyGoalAlert: boolean;
  weeklyGoalAlert: boolean;
  monthlyGoalAlert: boolean;
  subscriptionReminder: boolean;
}

export interface VirtualEmail {
  id: string;
  timestamp: string; // ISO String
  to: string;
  subject: string;
  body: string;
  category: "reminder" | "achievement" | "alert";
  read: boolean;
}

export interface FinancialData {
  expenses: Expense[];
  incomes: Income[];
  monthlyBudget: number; // Overall monthly limit
  categoryBudgets: CategoryBudget[];
  recurringPayments: RecurringPayment[];
  savingsGoals: SavingsGoal[];
  currency: CurrencyCode;
  avatar: AvatarState;
  achievements: Achievement[];
  emailSettings: EmailSettings;
  emailsInbox: VirtualEmail[];
  isPremium: boolean;
}
