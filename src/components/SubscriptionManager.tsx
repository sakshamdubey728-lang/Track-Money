import React, { useState } from "react";
import { 
  Calendar, 
  Plus, 
  TrendingUp, 
  Check, 
  Trash2, 
  AlertCircle, 
  Briefcase, 
  Tv, 
  Smartphone, 
  FileText,
  BadgeAlert,
  ArrowRight
} from "lucide-react";
import { RecurringPayment, CurrencyCode, CURRENCIES } from "../types";

interface SubscriptionManagerProps {
  subscriptions: RecurringPayment[];
  activeCurrency: CurrencyCode;
  onAddSubscription: (sub: Omit<RecurringPayment, "id" | "isPaidThisMonth">) => void;
  onCheckSubscription: (id: string, isPaid: boolean) => void;
  onDeleteSubscription: (id: string) => void;
}

export default function SubscriptionManager({
  subscriptions,
  activeCurrency,
  onAddSubscription,
  onCheckSubscription,
  onDeleteSubscription,
}: SubscriptionManagerProps) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [dueDate, setDueDate] = useState("1");
  const [category, setCategory] = useState("Entertainment");
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  const curSymbol = CURRENCIES[activeCurrency]?.symbol || "$";
  
  // Total expenses active sum
  const totalSubCost = subscriptions.reduce((sum, s) => sum + Number(s.cost), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cost || isNaN(Number(cost))) return;

    onAddSubscription({
      name: name.trim(),
      cost: Math.abs(Number(cost)),
      dueDate: Math.min(31, Math.max(1, Number(dueDate))),
      category,
      currency: activeCurrency,
    });

    setName("");
    setCost("");
    setDueDate("1");
    setCategory("Entertainment");
    setIsOpenAdd(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Entertainment":
        return <Tv className="w-4 h-4 text-rose-500" />;
      case "Utilities":
        return <Smartphone className="w-4 h-4 text-blue-500" />;
      case "Rent":
        return <FileText className="w-4 h-4 text-emerald-500" />;
      default:
        return <Briefcase className="w-4 h-4 text-slate-500" />;
    }
  };

  // 31-day billing calendar array
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div id="recurring-payments-manager" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col h-full justify-between">
      
      {/* Upper header controls */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Calendar className="text-emerald-500 w-5 h-5" />
            Recurring Payments
          </h3>
          <p className="text-xs text-slate-400">Total costs: {curSymbol}{totalSubCost.toFixed(2)}/mo</p>
        </div>
        <button
          onClick={() => setIsOpenAdd(!isOpenAdd)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-all cursor-pointer active:scale-95"
          title="Add Subscription"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Forms Drawer slide down if toggled */}
      {isOpenAdd && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-150 p-4 rounded-xl mb-4 space-y-3 shrink-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Add Subscription</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Provider Name</label>
              <input
                type="text"
                required
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                placeholder="Netflix, Spotify, EMIs..."
                className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-250 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Monthly Cost ({curSymbol})</label>
              <input
                type="text"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="14.99"
                className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-250 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Due Day of Month</label>
              <select
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 px-2 py-1.5 text-xs bg-white border border-slate-250 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>Day {day}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Billing Sector</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-2 py-1.5 text-xs bg-white border border-slate-250 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Entertainment">Entertainment (Netflix/Spotify)</option>
                <option value="Utilities">Utilities & Bills (Mobile/Gym/Wifi)</option>
                <option value="Rent">Rent & Fixed Outlays (Rent/EMIs)</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpenAdd(false)}
              className="text-xs text-slate-500 px-3 py-1 bg-slate-200 border border-slate-300 rounded-lg hover:bg-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-brand-green hover:bg-brand-dark text-white font-bold px-4 py-1 rounded-lg cursor-pointer"
            >
              Add Billing
            </button>
          </div>
        </form>
      )}

      {/* Main scrolling display list */}
      <div className="grow overflow-y-auto space-y-2 max-h-56 pr-1 my-2">
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic">
            <BadgeAlert className="w-8 h-8 text-slate-300 mx-auto mb-1 animate-pulse" />
            <span className="text-xs">No active recurring outlays set up.</span>
            <span className="block text-[10px] text-slate-400/80 mt-0.5">Automate and check off bills to earn XP bonuses.</span>
          </div>
        ) : (
          subscriptions.map((sub) => {
            const isUnpaid = !sub.isPaidThisMonth;
            return (
              <div 
                key={sub.id} 
                className={`p-3 rounded-xl border flex justify-between items-center transition-colors ${
                  sub.isPaidThisMonth ? "bg-emerald-50/50 border-emerald-100" : "bg-white border-slate-100 shadow-3xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Paid check off circle */}
                  <button
                    onClick={() => onCheckSubscription(sub.id, !sub.isPaidThisMonth)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                      sub.isPaidThisMonth 
                        ? "bg-emerald-500 border-emerald-600 text-white" 
                        : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50"
                    }`}
                  >
                    {sub.isPaidThisMonth && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(sub.category)}
                      <h4 className={`text-xs font-semibold ${sub.isPaidThisMonth ? "line-through text-slate-400" : "text-slate-800"}`}>
                        {sub.name}
                      </h4>
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Due Day {sub.dueDate} • {sub.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-xs font-mono font-bold ${sub.isPaidThisMonth ? "text-slate-400" : "text-slate-800"}`}>
                      {curSymbol}{sub.cost.toFixed(2)}
                    </p>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${
                      sub.isPaidThisMonth ? "text-emerald-600" : "text-rose-500 animate-pulse"
                    }`}>
                      {sub.isPaidThisMonth ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onDeleteSubscription(sub.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-sm cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Calendar grid block showing due days */}
      <div className="pt-3 border-t border-slate-100 shrink-0">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Billing Calendar Grid</h4>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            // Find if any subscription falls on this day
            const dueSubs = subscriptions.filter((s) => s.dueDate === day);
            const isDue = dueSubs.length > 0;
            const allPaid = isDue && dueSubs.every(s => s.isPaidThisMonth);

            return (
              <div
                key={day}
                className={`h-7 rounded-sm flex flex-col items-center justify-center relative group select-none text-[10px] font-semibold border ${
                  isDue 
                    ? allPaid 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                      : "bg-rose-50 border-rose-200 text-rose-800 animate-pulse shadow-3xs"
                    : "bg-slate-50/50 border-slate-100 text-slate-400"
                }`}
                title={isDue ? dueSubs.map(s => `${s.name}: ${curSymbol}${s.cost}`).join(", ") : `Day ${day}`}
              >
                <span>{day}</span>
                {isDue && (
                  <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${allPaid ? "bg-emerald-500" : "bg-rose-500"}`} />
                )}
                
                {/* Micro tooltip hover menu */}
                {isDue && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-30 shadow-md">
                    {dueSubs.map(s => `${s.name} (${curSymbol}${s.cost})`).join(" & ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
