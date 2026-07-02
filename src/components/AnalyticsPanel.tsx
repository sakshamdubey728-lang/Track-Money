import React, { useState } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon, 
  Activity, 
  Calendar, 
  ChevronRight, 
  FolderMinus 
} from "lucide-react";
import { FinancialData, CURRENCIES, ExpenseCategory } from "../types";

interface AnalyticsPanelProps {
  financialData: FinancialData;
}

const COLORS = [
  "#26DE81", // Food
  "#29B6F6", // Transportation
  "#EF5350", // Shopping
  "#AB47BC", // Entertainment
  "#FFA726", // Education
  "#EC407A", // Healthcare
  "#78909C", // Utilities
  "#5C6BC0", // Rent
  "#BDC581"  // Miscellaneous
];

export default function AnalyticsPanel({ financialData }: AnalyticsPanelProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "trends" | "cashflow">("categories");

  const curSymbol = CURRENCIES[financialData.currency]?.symbol || "$";

  // 1. Process category statistics
  const categoryData = Object.keys(COLORS).map((_, i) => {
    // Array of standard category strings
    const categories: ExpenseCategory[] = [
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
    const cat = categories[i];
    const total = financialData.expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return { name: cat, value: total, fill: COLORS[i % COLORS.length] };
  }).filter((c) => c.value > 0);

  // Fallback if no categories logged
  const totalExpenses = financialData.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncomes = financialData.incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const netCashflow = totalIncomes - totalExpenses;

  // 2. Process Spending trend lines (last 7 days vs daily budget avg)
  const dailyBudgetAvg = Number(((financialData.monthlyBudget || 1500) / 30).toFixed(2));

  const dateMap: Record<string, number> = {};
  financialData.expenses.forEach((e) => {
    const d = e.date.substring(5); // MM-DD
    dateMap[d] = (dateMap[d] || 0) + Number(e.amount);
  });

  const rawTrends = Object.entries(dateMap).map(([date, amount]) => ({
    date,
    amount,
  })).sort((a, b) => a.date.localeCompare(b.date));

  // Default mock dates if tree is empty
  const baseTrends = rawTrends.length > 0 ? rawTrends.slice(-7) : [
    { date: "06-21", amount: 15.5 },
    { date: "06-22", amount: 24.0 },
    { date: "06-23", amount: 12.8 },
    { date: "06-24", amount: 45.0 },
    { date: "06-25", amount: 32.2 },
    { date: "06-26", amount: 28.4 },
    { date: "06-27", amount: totalExpenses ? Math.min(totalExpenses, 65) : 38.0 },
  ];

  const trendData = baseTrends.map((t) => ({
    date: t.date,
    Spent: t.amount,
    "Daily Budget": dailyBudgetAvg,
  }));

  // 3. Process Income vs Expenses bar chart
  const cashflowBarData = [
    {
      name: "Cashflow",
      Income: totalIncomes || 2500,
      Expenses: totalExpenses || 1200,
    }
  ];

  return (
    <div id="analytics-reports-panel" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col h-full justify-between">
      
      {/* Selector Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-100 mb-5 shrink-0">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Activity className="text-emerald-500 w-5 h-5 animate-pulse" />
            Financial Analytics
          </h3>
          <p className="text-xs text-slate-400">Track categories, trends, and budget alerts</p>
        </div>
        
        {/* Toggle navigation bar */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 md:flex-none text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "categories" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`flex-1 md:flex-none text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "trends" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab("cashflow")}
            className={`flex-1 md:flex-none text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "cashflow" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Cashflow Graph
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="grow flex flex-col justify-center h-64 relative min-h-[250px]">
        {activeTab === "categories" ? (
          /* Pie Chart breakdown */
          categoryData.length === 0 ? (
            <div className="text-center py-8 text-slate-400 flex flex-col items-center justify-center">
              <FolderMinus className="w-12 h-12 text-slate-300 mb-2 animate-bounce" style={{ animationDuration: '4s' }} />
              <p className="text-xs font-medium">No expenses logged yet this month!</p>
              <p className="text-[10px] text-slate-400/80 mt-1">Log meals or transport to generate breakdowns.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Pie Canvas */}
              <div className="md:col-span-7 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [`${curSymbol}${val.toFixed(2)}`, "Spent"]}
                      contentStyle={{ background: "#0F172A", border: "none", borderRadius: "10px", color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* List Legend items */}
              <div className="md:col-span-5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categoryData.map((item, index) => {
                  const percentage = totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0;
                  return (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-slate-600 font-medium">{item.name}</span>
                      </div>
                      <div className="font-mono text-slate-400 text-[11px] font-semibold">
                        {curSymbol}{item.value.toFixed(0)} <span className="opacity-60">({percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : null}

        {activeTab === "trends" ? (
          /* Line trend chart comparing spending to daily budget average */
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: "bold" }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }}
                />
                <Tooltip 
                  formatter={(val: number) => [`${curSymbol}${val.toFixed(2)}`]}
                  contentStyle={{ background: "#0F172A", border: "none", borderRadius: "10px", color: "#fff" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                <Line 
                  type="monotone" 
                  dataKey="Spent" 
                  name="Daily Spent"
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10B981" }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Daily Budget" 
                  name="Daily Budget Avg"
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {activeTab === "cashflow" ? (
          /* Bar charts dynamic comparisons with clean fallback */
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fontWeight: "bold" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }} />
                <Tooltip 
                  formatter={(val: number) => [`${curSymbol}${val.toFixed(2)}`]}
                  contentStyle={{ background: "#0F172A", border: "none", borderRadius: "10px", color: "#fff" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                <Bar dataKey="Income" fill="#00C853" radius={[8, 8, 0, 0]} maxBarSize={60} />
                <Bar dataKey="Expenses" fill="#EF5350" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>

      {/* Widget Footer insights summary */}
      <div className="bg-slate-50 rounded-xl p-3.5 flex justify-between items-center border border-slate-100 shrink-0 mt-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="text-emerald-600 w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Monthly Cashflow</p>
            <p className="text-sm font-mono font-bold text-slate-800">
              {netCashflow >= 0 ? "+" : ""}
              {curSymbol}{netCashflow.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Savings Rate</p>
          <span className="text-xs font-mono font-semibold text-emerald-600">
            {totalIncomes > 0 ? ((netCashflow / totalIncomes) * 100).toFixed(0) : "0"}%
          </span>
        </div>
      </div>
    </div>
  );
}
