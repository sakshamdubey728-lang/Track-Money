import React, { useState } from "react";
import { 
  Mail, 
  Settings2, 
  Bell, 
  Clock, 
  Send, 
  MailOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { EmailSettings, VirtualEmail } from "../types";

interface EmailSimulatorProps {
  settings: EmailSettings;
  emails: VirtualEmail[];
  isPremium: boolean;
  onUpdateSettings: (updated: EmailSettings) => void;
  onSimulateEmail: (category: "reminder" | "achievement" | "alert", subject: string, body: string) => void;
  onClearInbox: () => void;
}

export default function EmailSimulator({
  settings,
  emails,
  isPremium,
  onUpdateSettings,
  onSimulateEmail,
  onClearInbox,
}: EmailSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"inbox" | "settings">("inbox");
  const [dailyTarget, setDailyTarget] = useState("5");
  const [weeklyTarget, setWeeklyTarget] = useState("35");
  const [monthlyTarget, setMonthlyTarget] = useState("150");
  const [viewingEmail, setViewingEmail] = useState<VirtualEmail | null>(null);

  // Filter unread count
  const unreadCount = emails.filter((e) => !e.read).length;

  const handleToggle = (key: keyof EmailSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Trigger test alarms instantly
  const triggerSimulateTest = (type: "daily" | "achievement" | "bill") => {
    if (type === "daily") {
      onSimulateEmail(
        "reminder",
        `🎯 Track Money Goal Alert: Save ${settings.dailyGoalAlert ? `$${dailyTarget}` : "$5"} Today`,
        `Hi ${settings.name || "Smart Saver"},\n\nThis is your friendly automated reminder from Track Money!\n\nTo hit your savings objectives, we recommend transferring **$${dailyTarget}** into your active Savings Jar today. Skipping this daily contribution could extend your Vacation Fund target date by 6 days.\n\nKeep your checks streak alive and level up your outfit item slots!\n\nBest,\nTrack Money Automation Core`
      );
    } else if (type === "achievement") {
      onSimulateEmail(
        "achievement",
        "🎉 Goal Milestone: You've hit 80% of your Laptop savings goal!",
        `Hi ${settings.name || "Smart Saver"},\n\nHuge congratulations! Your active savings goal is booming.\n\nYou have completed **80%** of your target collection! Only small pushes left before you unlock the physical items and secure +150 XP for your Financial Avatar.\n\nLevel up and show off your legendary wealth-builder outfit slots!\n\nBest,\nTrack Money Gamified Center`
      );
    } else if (type === "bill") {
      onSimulateEmail(
        "alert",
        "⚠️ Billing Alert: Active Netflix Payment Due Tomorrow",
        `Hi ${settings.name || "Smart Saver"},\n\nPayment notification from Track Money Subscriptions Monitor.\n\nYour **Netflix** billing cycle starts tomorrow. A total cost of **$14.99** will be charged. Please mark this paid in your dashboard checklist once transacted to keep your cash flow charts in balance.\n\nBest,\nTrack Money Notification Agent`
      );
    }
  };

  return (
    <div id="smart-reminders-system" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col h-full justify-between">
      
      {/* Tab navigation headers */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Mail className="text-emerald-500 w-5 h-5" />
            Email Reminders
          </h3>
          <p className="text-xs text-slate-400">Virtual smart alerts engine simulator</p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "inbox" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500"
            }`}
          >
            Inbox {unreadCount > 0 && <span className="bg-rose-500 text-white rounded-full px-1 text-[9px]">{unreadCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "settings" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500"
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main body viewport panels */}
      <div className="grow overflow-y-auto max-h-56 pr-1 my-2 min-h-[220px]">
        {activeTab === "settings" ? (
          /* CONFIGURATION PANEL */
          <div className="space-y-4 text-xs">
            {/* Target targets configurations */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Set Reminders MicroTargets</span>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400 font-bold block">Daily ($)</label>
                  <input
                    type="number"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1 bg-white border border-slate-200 rounded-sm font-mono text-center font-bold text-slate-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 font-bold block">Weekly ($)</label>
                  <input
                    type="number"
                    value={weeklyTarget}
                    onChange={(e) => setWeeklyTarget(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1 bg-white border border-slate-200 rounded-sm font-mono text-center font-bold text-slate-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 font-bold block">Monthly ($)</label>
                  <input
                    type="number"
                    value={monthlyTarget}
                    onChange={(e) => setMonthlyTarget(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1 bg-white border border-slate-200 rounded-sm font-mono text-center font-bold text-slate-700 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Email contact profile */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Profile name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => onUpdateSettings({ ...settings, name: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden text-slate-600"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Alert Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => onUpdateSettings({ ...settings, email: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden text-slate-600 font-mono"
                />
              </div>
            </div>

            {/* Alert Category switches */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Alert Subscriptions</span>
              
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-600">Daily savings targets reminders</span>
                  <input
                    type="checkbox"
                    checked={settings.dailyGoalAlert}
                    onChange={() => handleToggle("dailyGoalAlert")}
                    className="rounded-xs border-slate-300 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-600">Weekly milestones notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.weeklyGoalAlert}
                    onChange={() => handleToggle("weeklyGoalAlert")}
                    className="rounded-xs border-slate-300 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-600">Monthly goals completion statements</span>
                  <input
                    type="checkbox"
                    checked={settings.monthlyGoalAlert}
                    onChange={() => handleToggle("monthlyGoalAlert")}
                    className="rounded-xs border-slate-300 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-600">Billing cycle day-before alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.subscriptionReminder}
                    onChange={() => handleToggle("subscriptionReminder")}
                    className="rounded-xs border-slate-300 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          /* SIMULATED EMAIL INBOX DISPLAY */
          <div className="space-y-2 text-xs">
            {viewingEmail ? (
              /* SPECIFIC EMAIL VIEW CARD */
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-800">{viewingEmail.subject}</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">To: {viewingEmail.to} • {viewingEmail.timestamp}</p>
                  </div>
                  <button
                    onClick={() => {
                      viewingEmail.read = true;
                      setViewingEmail(null);
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-0.5 rounded-sm font-bold text-[10px] cursor-pointer"
                  >
                    Back
                  </button>
                </div>
                <p className="whitespace-pre-line text-[11px] text-slate-600 font-sans leading-relaxed">
                  {viewingEmail.body}
                </p>
              </div>
            ) : emails.length === 0 ? (
              /* Inbox is empty */
              <div className="text-center py-10 text-slate-400 italic">
                <MailOpen className="w-8 h-8 text-slate-300 mx-auto mb-1 opacity-50" />
                <p className="text-xs">Your virtual inbox is empty.</p>
                <p className="text-[10px] text-slate-400/80 mt-1">Press any "Simulate Test Trigger" below to test outgoing emails!</p>
              </div>
            ) : (
              /* Inbox List items */
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 pb-1">
                  <span>Emails list</span>
                  <button onClick={onClearInbox} className="hover:text-rose-500 transition-colors pointer-events-auto cursor-pointer">
                    Clear Logs
                  </button>
                </div>
                {emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setViewingEmail(email)}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/20 transition-all ${
                      email.read ? "bg-white border-slate-100 opacity-70" : "bg-emerald-50/30 border-emerald-100 font-bold"
                    }`}
                  >
                    <div className="mt-0.5">
                      {email.category === "reminder" && <Clock className="w-4 h-4 text-emerald-500" />}
                      {email.category === "achievement" && <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300/35" />}
                      {email.category === "alert" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                    </div>
                    <div className="grow">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-800 truncate max-w-[140px] font-semibold">{email.subject}</span>
                        <span className="text-[8px] text-slate-400 font-mono">{email.timestamp.substring(11, 16)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{email.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Outgoing simulators quick triggers actions */}
      <div className="pt-3 border-t border-slate-100 shrink-0">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Simulate Real Alerts triggers</h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => triggerSimulateTest("daily")}
            className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            <Clock className="w-3 h-3 text-emerald-500" />
            Remind Save
          </button>
          <button
            onClick={() => triggerSimulateTest("achievement")}
            className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-300/20" />
            80% Target
          </button>
          <button
            onClick={() => triggerSimulateTest("bill")}
            className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            Bill Alerts
          </button>
        </div>
      </div>

    </div>
  );
}
