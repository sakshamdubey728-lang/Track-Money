import React, { useState } from "react";
import { 
  Monitor, 
  Apple, 
  Smartphone, 
  Download, 
  Globe, 
  Laptop, 
  Bookmark, 
  ExternalLink,
  HelpCircle,
  Sparkles,
  Command,
  ArrowDownToLine,
  Check,
  ChevronRight,
  MousePointerClick
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DesktopShortcutCreatorProps {
  onGrantXPReward?: (xp: number, message: string) => void;
}

export default function DesktopShortcutCreator({ onGrantXPReward }: DesktopShortcutCreatorProps) {
  const [osType, setOsType] = useState<"windows" | "mac" | "linux" | "mobile">(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|android|blackberry|mini|windows\sphone/i.test(ua)) return "mobile";
    if (/macintosh|mac\s?.?os|mac\sos\sx/i.test(ua)) return "mac";
    if (/linux/i.test(ua)) return "linux";
    return "windows";
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<"pwa" | "file" | "browser">("pwa");

  // Get current app's actual URL
  const appUrl = window.location.href || "https://ai.studio/build";
  const appTitle = "Track Money - Spendo Ledger";

  // Trigger automated .URL file download for Windows/macOS
  const handleDownloadWindowsShortcut = () => {
    // A .url file is an INI configuration that Windows/Mac interpret as a web shortcut
    const fileContent = `[InternetShortcut]\r\nURL=${appUrl}\r\nIconIndex=13\r\n`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Track Money.url";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerSuccessFeedback();
  };

  // Trigger automated .desktop file download for Linux loaders
  const handleDownloadLinuxShortcut = () => {
    const fileContent = `[Desktop Entry]\nVersion=1.0\nName=Track Money\nComment=Launch Spendo Finance Ledger\nExec=xdg-open "${appUrl}"\nIcon=globe\nTerminal=false\nType=Application\nCategories=Office;Finance;\n`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "track-money.desktop";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerSuccessFeedback();
  };

  // Trigger automated .webloc file download for macOS Finder
  const handleDownloadMacShortcut = () => {
    const fileContent = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n\t<key>URL</key>\n\t<string>${appUrl}</string>\n</dict>\n</plist>`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Track Money.webloc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerSuccessFeedback();
  };

  const triggerSuccessFeedback = () => {
    setDownloadSuccess(true);
    if (onGrantXPReward) {
      onGrantXPReward(50, "Shortcut Creator Unlocked! Saved instant access link (+50 XP).");
    }
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 5000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs relative text-xs">
      {/* Visual Badge Accent */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 font-bold uppercase text-[9px] tracking-wider rounded-full border border-amber-100">
        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/20" />
        Instant App
      </div>

      <div className="pb-3 border-b border-slate-100 mb-5 text-left">
        <h3 className="font-display font-black text-slate-800 text-base flex items-center gap-2">
          <Laptop className="text-amber-500 w-5 h-5 fill-amber-50" />
          Add Shortcut to Desktop
        </h3>
        <p className="text-slate-400 mt-0.5">Launches the Ledger Dashboard in 1-click directly from your computer home screen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
        {/* Mock Computer Screen Illustration Left Column */}
        <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-150 flex flex-col justify-between items-center text-center relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />
          
          {/* OS Switcher Badges */}
          <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-full text-[10px] relative z-10 font-bold">
            <button 
              onClick={() => setOsType("windows")} 
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${osType === "windows" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Monitor className="w-3 h-3 text-blue-500" />
              Win
            </button>
            <button 
              onClick={() => setOsType("mac")} 
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${osType === "mac" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Apple className="w-3 h-3 text-slate-800" />
              Mac
            </button>
            <button 
              onClick={() => setOsType("linux")} 
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${osType === "linux" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Globe className="w-3 h-3 text-orange-500" />
              Linux
            </button>
          </div>

          {/* Interactive Mock Desktop Representation */}
          <div className="my-6 relative w-36 h-24 bg-slate-900 rounded-lg border-2 border-slate-700 shadow-md p-2 flex flex-col justify-between items-start">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-slate-900 pointer-events-none" />
            <div className="absolute top-1 right-2 text-[7px] text-slate-500 font-mono">10:10 AM</div>

            {/* Simulated Desktop Icon for Track Money */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="relative z-10 flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-500 border border-emerald-400 flex items-center justify-center shadow-3xs">
                <span className="text-[9px] font-black text-white font-mono">$</span>
              </div>
              <span className="text-[7px] font-bold text-white leading-none tracking-tight">Track Money</span>
            </motion.div>

            {/* Bottom Mock App Taskbar */}
            <div className="relative w-full h-3 bg-slate-800/85 border-t border-slate-700 rounded-b flex items-center px-1.5 gap-1 justify-between">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <div className="w-1 h-1 bg-slate-600 rounded-xs" />
                <div className="w-2 h-1 bg-slate-600 rounded-xs" />
              </div>
              <div className="w-4 h-1 bg-slate-600 rounded-xs" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Drag the downloaded shortcut file to your PC/Mac home desktop space.
          </p>
        </div>

        {/* Action Controls and Guide tabs Right Column */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Menu Guide Tabs */}
          <div className="flex border-b border-slate-100 pb-1 gap-4 font-bold select-none">
            <button
              onClick={() => setActiveGuideTab("pwa")}
              className={`pb-2 text-xs transition-colors cursor-pointer border-b-2 relative ${activeGuideTab === "pwa" ? "text-amber-600 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-600"}`}
            >
              1. Chrome App (PWA)
            </button>
            <button
              onClick={() => setActiveGuideTab("file")}
              className={`pb-2 text-xs transition-colors cursor-pointer border-b-2 relative ${activeGuideTab === "file" ? "text-amber-600 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-600"}`}
            >
              2. Download Link-File
            </button>
            <button
              onClick={() => setActiveGuideTab("browser")}
              className={`pb-2 text-xs transition-colors cursor-pointer border-b-2 relative ${activeGuideTab === "browser" ? "text-amber-600 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-600"}`}
            >
              3. Manual Bookmark
            </button>
          </div>

          <div className="min-h-[140px] flex items-center">
            <AnimatePresence mode="wait">
              {activeGuideTab === "pwa" && (
                <motion.div
                  key="pwa-guide"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="space-y-3 w-full"
                >
                  <h4 className="font-extrabold text-slate-700 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[10px] font-black text-amber-600">1</span>
                    Recommended: Chrome / Edge Desktop App
                  </h4>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Install Spendo as a native windowed browser app that places its own launch icon directly on your Desktop, Start Menu, or Status Doc.
                  </p>
                  <ol className="space-y-2 text-slate-600 text-[11px] font-medium pl-2 list-decimal list-inside">
                    <li>Look at the top-right of your Browser URL address bar.</li>
                    <li>Click the <strong className="text-slate-800">&ldquo;Install App&rdquo; icon</strong> (resembles three cascading nodes or monitor arrow screen).</li>
                    <li>Or click the <strong className="text-slate-800">Browser Options (⋮)</strong> and select <strong className="text-slate-800">&ldquo;Save and share&rdquo; → &ldquo;Install page as app...&rdquo;</strong></li>
                  </ol>
                </motion.div>
              )}

              {activeGuideTab === "file" && (
                <motion.div
                  key="file-guide"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="space-y-3 w-full"
                >
                  <h4 className="font-extrabold text-slate-700 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[10px] font-black text-amber-600">2</span>
                    One-Click Auto-Generated Shortcut
                  </h4>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Download a secure web shortcut config configured instantly for your active {osType === "windows" ? "Windows PC" : osType === "mac" ? "macOS Finder" : "Linux OS"}.
                  </p>
                  <div className="bg-slate-50 p-2.5 border border-slate-150 rounded-xl space-y-1">
                    <p className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider block">Target Destination URL Link:</p>
                    <p className="font-mono bg-white text-[10px] px-2 py-1 border border-slate-200/80 rounded select-all truncate text-slate-500 font-bold">{appUrl}</p>
                  </div>
                  
                  {/* Automatic Shortcut file trigger button */}
                  <div className="pt-2">
                    {osType === "windows" && (
                      <button
                        onClick={handleDownloadWindowsShortcut}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ArrowDownToLine className="w-4 h-4" />
                        Download Windows .URL File
                      </button>
                    )}
                    {osType === "mac" && (
                      <button
                        onClick={handleDownloadMacShortcut}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ArrowDownToLine className="w-4 h-4" />
                        Download macOS .Webloc File
                      </button>
                    )}
                    {osType === "linux" && (
                      <button
                        onClick={handleDownloadLinuxShortcut}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ArrowDownToLine className="w-4 h-4" />
                        Download Linux .Desktop File
                      </button>
                    )}
                    {osType === "mobile" && (
                      <div className="p-3 bg-blue-50 border border-blue-100 text-blue-700 font-semibold rounded-xl flex items-start gap-2 text-xs">
                        <Smartphone className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Download links are designed for laptop/desktop screen configurations. Use &ldquo;Add to Home Screen&rdquo; option inside Safari/Chrome browsers on mobile!</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeGuideTab === "browser" && (
                <motion.div
                  key="browser-guide"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="space-y-3 w-full"
                >
                  <h4 className="font-extrabold text-slate-700 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[10px] font-black text-amber-600">3</span>
                    Instant Drag-and-Drop Bookmark Link
                  </h4>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Drag the secure icon link below directly from the browser viewport right onto your computer's Desktop background workspace to create an instant shortcut.
                  </p>
                  
                  <div className="flex gap-4.5 items-center">
                    {/* Draggable Anchor Element block */}
                    <a
                      href={appUrl}
                      title={appTitle}
                      className="inline-flex items-center gap-2 bg-emerald-50 border-2 border-dashed border-emerald-300 hover:border-emerald-500 text-emerald-700 font-bold px-5 py-3 rounded-2xl cursor-grab active:cursor-grabbing hover:bg-emerald-100/60 transition-all text-xs"
                      onDragEnd={triggerSuccessFeedback}
                    >
                      <MousePointerClick className="w-4 h-4 text-emerald-600 animate-[bounce_1.5s_infinite]" />
                      Drag Me to Your Desktop
                    </a>

                    <div className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-[140px]">
                      ← DRAG & DROP THIS BOUNDING BOX directly to your Desktop wallpaper!
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Success messages notifier */}
          <AnimatePresence>
            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold p-3 rounded-xl flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Downloaded shortcut loader! Drag it to your Desktop wallpaper background now. (+50 XP)</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips Info Panel bottom */}
          <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-extrabold text-slate-700 text-[11px]">Want standard Offline installation?</p>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Installing via <strong className="text-slate-600">Chrome PWA (Tab 1)</strong> runs Spendo fully offline utilizing cached service-workers database nodes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
