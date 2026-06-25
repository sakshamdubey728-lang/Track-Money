import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { 
  FileSpreadsheet, 
  ExternalLink, 
  LogOut, 
  Lock, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  initAuth, 
  googleSignIn, 
  logoutUser, 
  exportToGoogleSheetsInstance,
  SheetRow
} from "../lib/sheetsAuth";
import { FinancialData, Expense, CURRENCIES } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface SheetsExportProps {
  financialData: FinancialData;
  onGrantXPReward?: (xp: number, message: string) => void;
}

export default function SheetsExport({ financialData, onGrantXPReward }: SheetsExportProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Export settings
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<{ id: string; url: string; title: string } | null>(null);
  
  // Confirmation state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialize auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Format years/months in dropdown list from real expenses
  const availableMonths = React.useMemo(() => {
    const monthsSet = new Set<string>();
    
    // Default current month if no expenses exist yet
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    monthsSet.add(currentMonthStr);

    financialData.expenses.forEach((e) => {
      if (e.date) {
        // e.date matches "YYYY-MM-DD"
        const part = e.date.substring(0, 7); // "YYYY-MM"
        if (/^\d{4}-\d{2}$/.test(part)) {
          monthsSet.add(part);
        }
      }
    });

    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  }, [financialData.expenses]);

  // Set default selection
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  // Generate dynamic default title on month switch
  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
      const nameOfM = dateObj.toLocaleString("default", { month: "long" });
      setCustomTitle(`Spendo Expense Report - ${nameOfM} ${year}`);
    }
  }, [selectedMonth]);

  // Extract expenses for the chosen month
  const expensesForChosenMonth = React.useMemo(() => {
    if (!selectedMonth) return [];
    return financialData.expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [financialData.expenses, selectedMonth]);

  // Sum of Expenses for selected month in default currency conversion
  const totalChosenMonthAmount = React.useMemo(() => {
    return expensesForChosenMonth.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expensesForChosenMonth]);

  const activeCurrencySymbol = CURRENCIES[financialData.currency]?.symbol || "$";

  // Login handler
  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setExportError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      setExportError(err?.message || "Authentication popup dismissed or blocked.");
    } finally {
      setIsSigningIn(false);
    }
  };

  // Sign out handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setExportSuccess(null);
    } catch (err: any) {
      setExportError("Sign out failed.");
    }
  };

  // Trigger export flow
  const handleBtnExportClick = (e: React.FormEvent) => {
    e.preventDefault();
    setExportError(null);
    setExportSuccess(null);
    
    if (expensesForChosenMonth.length === 0) {
      setExportError("There are no registered expenses for this specific month yet.");
      return;
    }
    
    // Present the mandated secure explicit confirmation dialog
    setShowConfirmModal(true);
  };

  // Execute export once confirmed
  const triggerActualExport = async () => {
    setShowConfirmModal(false);
    setIsExporting(true);
    setExportError(null);

    try {
      const token = accessToken || await googleSignIn().then(r => r?.accessToken);
      if (!token) {
        throw new Error("No OAuth access credentials found. Please sign in again.");
      }

      const rowsToExport: SheetRow[] = expensesForChosenMonth.map((e) => ({
        date: e.date,
        notes: e.notes || "No description",
        category: e.category,
        amount: Number(e.amount),
        currency: e.currency
      }));

      const reportTitle = customTitle.trim() || `Expenses Report ${selectedMonth}`;

      const res = await exportToGoogleSheetsInstance(
        token,
        reportTitle,
        rowsToExport,
        activeCurrencySymbol,
        totalChosenMonthAmount
      );

      setExportSuccess({
        id: res.spreadsheetId,
        url: res.spreadsheetUrl,
        title: reportTitle
      });

      // Grant XP completion reward
      if (onGrantXPReward) {
        onGrantXPReward(100, "Sheets Exporter Master! Saved budget report cloud-native.");
      }
    } catch (err: any) {
      setExportError(err?.message || "Google Sheets server error occurrences. Please verify scope consent.");
    } finally {
      setIsExporting(false);
    }
  };

  // Human-readable format of monthly code e.g. "2026-06" -> "June 2026"
  const formatMonthCode = (code: string) => {
    if (!code) return "";
    const [year, month] = code.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs relative text-xs">
      {/* Decorative sheets accent badge */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold uppercase text-[9px] tracking-wider rounded-full border border-emerald-100">
        <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />
        Cloud Native
      </div>

      <div className="pb-3 border-b border-slide-100 mb-5 select-none text-left">
        <h3 className="font-display font-black text-slate-800 text-base flex items-center gap-2">
          <FileSpreadsheet className="text-emerald-600 w-5 h-5 fill-emerald-50" />
          Google Sheets Converter
        </h3>
        <p className="text-slate-400 mt-0.5">Sync and compile your ledger logs safely inside your standard Google environment.</p>
      </div>

      <AnimatePresence mode="wait">
        {needsAuth ? (
          /* NOT AUTHORIZED STATE -> PRESENT SHINY GOOGLE SIGN-IN */
          <motion.div
            key="sign-in-screen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-6 flex flex-col items-center justify-center text-center space-y-4 text-xs"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-3xs">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-1.5 max-w-sm">
              <h4 className="font-extrabold text-slate-800 text-sm">Grant Authorization Required</h4>
              <p className="text-slate-400 leading-relaxed">
                Connect your account securely. Spendo respects Least Privilege guidelines and will only access spreadsheets created by this application.
              </p>
            </div>

            {exportError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl flex items-start gap-2 text-left w-full max-w-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{exportError}</span>
              </div>
            )}

            {/* Material Design Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="gsi-material-button w-full max-w-xs cursor-pointer hover:shadow-md transition-shadow py-2 text-sm justify-center"
              style={{ display: "inline-flex" }}
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents" style={{ fontSize: "13px", fontWeight: "600" }}>
                  {isSigningIn ? "Authorizing Security..." : "Sign in with Google"}
                </span>
              </div>
            </button>
          </motion.div>
        ) : (
          /* COMPILING / CONVERTING EXPORTS WORKSPACE DASHBOARD */
          <motion.div
            key="export-dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Connected User Identity summary */}
            <div className="flex justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-emerald-400" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold font-mono uppercase">
                    {currentUser?.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-slate-800">{currentUser?.displayName || "Workspace Owner"}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{currentUser?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                title="Disconnect Google Auth"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>

            {/* Selection Options Config */}
            <form onSubmit={handleBtnExportClick} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select TARGET Month</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setExportSuccess(null);
                        setExportError(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    >
                      {availableMonths.map((m) => (
                        <option key={m} value={m}>
                          {formatMonthCode(m)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Log Volumes Statistics</label>
                  <div className="relative bg-slate-100/60 border border-slate-200/80 rounded-xl px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-slate-755">{expensesForChosenMonth.length}</span>
                      <span className="text-[10px] text-slate-450 font-bold uppercase ml-1">Items</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm text-emerald-600">
                        {activeCurrencySymbol}{totalChosenMonthAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Spreadsheet Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="title of report..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:bg-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {exportError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 animate-bounce" />
                  <span className="leading-snug">{exportError}</span>
                </div>
              )}

              {/* Status Success */}
              {exportSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-black text-emerald-800">Export Complete! (+100 XP)</h4>
                      <p className="text-emerald-700 text-[11px] font-bold mt-0.5">
                        New Spreadsheet &ldquo;{exportSuccess.title}&rdquo; registered in your Google Drive root.
                      </p>
                    </div>
                  </div>

                  <a
                    href={exportSuccess.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer shadow-3xs"
                  >
                    Open Sheet in New Tab
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isExporting || expensesForChosenMonth.length === 0}
                className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-750 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Executing Cloud Export...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    Export {formatMonthCode(selectedMonth)} to Google Sheets
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explicit mandated secure user confirmation Modal overlay */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-left text-xs space-y-4"
            >
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 font-bold shrink-0">
                  <Info className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Export Confirmation</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Google Drive Actions</p>
                </div>
              </div>

              <div className="space-y-2 text-slate-600">
                <p className="leading-relaxed">
                  Are you absolutely sure you want to write a new Spreadsheet titled:
                </p>
                <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-center select-all font-mono font-bold text-slate-800">
                  &ldquo;{customTitle}&rdquo;
                </div>
                <p className="leading-relaxed text-[11px]">
                  This operation will generate a formatted document containing <strong className="text-slate-800">{expensesForChosenMonth.length} transactions</strong> and store it securely in your personal account space.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerActualExport}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1 min-h-[44px]"
                >
                  Yes, Export Report
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
