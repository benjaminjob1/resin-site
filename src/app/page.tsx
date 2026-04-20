"use client";
import { useState, useEffect } from "react";
import { Droplets, Clock, Sun, Settings, X, Eye, EyeOff, Info, Zap, Shield } from "lucide-react";

interface Settings {
  accent: string;
  glow: string;
  brightness: number;
}

type WashType = "water" | "alcohol";
type CureSection = "bottom" | "top" | "both";

export default function ResinCalculator() {
  const [washType, setWashType] = useState<WashType>("water");
  const [layerHeight, setLayerHeight] = useState(0.05);
  const [totalLayers, setTotalLayers] = useState(100);
  const [exposurePerLayer, setExposurePerLayer] = useState(2.5);
  const [washTime, setWashTime] = useState(5);
  const [cureSection, setCureSection] = useState<CureSection>("both");
  const [showSettings, setShowSettings] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [activeTab, setActiveTab] = useState<"calculator" | "info">("calculator");
  const [settings, setSettings] = useState<Settings>({ accent: "#06b6d4", glow: "#0891b2", brightness: 1 });

  useEffect(() => { const s = localStorage.getItem("resin-settings"); if (s) try { setSettings(JSON.parse(s)); } catch {} }, []);
  const saveSettings = (k: keyof Settings, v: string | number) => { const n = {...settings, [k]: v}; setSettings(n); localStorage.setItem("resin-settings", JSON.stringify(n)); };

  const totalHeight = (layerHeight * totalLayers * 10);
  const totalPrintTime = ((totalLayers * exposurePerLayer) / 60).toFixed(1);
  
  const recommendedWashTime = washType === "water" 
    ? Math.max(5, Math.min(15, Math.round(totalHeight / 10 * 3)))
    : Math.max(3, Math.min(10, Math.round(totalHeight / 10 * 2)));

  const cureTime = {
    bottom: 15 + (totalLayers > 50 ? 10 : 0),
    top: Math.max(30, Math.round(totalHeight * 2)),
    both: 15 + Math.max(30, Math.round(totalHeight * 2)) + (totalLayers > 50 ? 10 : 0),
  };

  const washTimeOptions = [2, 3, 5, 8, 10, 15];
  const layerHeightOptions = [0.025, 0.05, 0.1];
  const exposureOptions = [1.5, 2, 2.5, 3, 4, 5];

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: "#0a0a0a", filter: `brightness(${settings.brightness})` }}>
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
          <div className="w-72 rounded-2xl p-5 border backdrop-blur-xl" style={{ backgroundColor: "rgba(10,10,10,0.98)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 rounded-lg hover:bg-white/10"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Accent</label>
                <div className="flex gap-2">
                  <input type="color" value={settings.accent} onChange={e => saveSettings("accent", e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-0" />
                  <input type="text" value={settings.accent} onChange={e => saveSettings("accent", e.target.value)} className="flex-1 px-3 rounded-lg text-sm font-mono border" style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Glow</label>
                <div className="flex gap-2">
                  <input type="color" value={settings.glow} onChange={e => saveSettings("glow", e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-0" />
                  <input type="text" value={settings.glow} onChange={e => saveSettings("glow", e.target.value)} className="flex-1 px-3 rounded-lg text-sm font-mono border" style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Brightness</label>
                <input type="range" min="0.5" max="1.5" step="0.05" value={settings.brightness} onChange={e => saveSettings("brightness", parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 p-4 flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: settings.accent }}>Resin Print</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowNav(!showNav)} className="p-2 rounded-xl hover:bg-white/10">{showNav ? <EyeOff size={22} /> : <Eye size={22} />}</button>
          <button onClick={() => setShowSettings(true)} className="p-2 rounded-xl hover:bg-white/10"><Settings size={22} /></button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          {activeTab === "calculator" ? (
            <>
              {/* Print Stats */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${settings.accent}11` }}>
                    <div className="text-2xl font-bold" style={{ color: settings.accent }}>{totalHeight.toFixed(1)}mm</div>
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Total Height</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${settings.accent}11` }}>
                    <div className="text-2xl font-bold" style={{ color: settings.accent }}>{totalPrintTime}h</div>
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Print Time</div>
                  </div>
                </div>
              </div>

              {/* Layer Height */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: settings.accent }}>Layer Height (mm)</h3>
                <div className="grid grid-cols-3 gap-2">
                  {layerHeightOptions.map(lh => (
                    <button key={lh} onClick={() => setLayerHeight(lh)} className="py-2 rounded-lg text-sm font-mono border transition-all" style={layerHeight === lh ? { backgroundColor: settings.accent, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                      {lh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Layers */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: settings.accent }}>Total Layers: {totalLayers}</h3>
                <input type="range" min="20" max="500" step="10" value={totalLayers} onChange={e => setTotalLayers(parseInt(e.target.value))} className="w-full" style={{ accentColor: settings.accent }} />
                <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <span>20</span>
                  <span>500</span>
                </div>
              </div>

              {/* Exposure Per Layer */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: settings.accent }}>Exposure Per Layer (s)</h3>
                <div className="grid grid-cols-6 gap-1">
                  {exposureOptions.map(exp => (
                    <button key={exp} onClick={() => setExposurePerLayer(exp)} className="py-2 rounded-lg text-xs font-mono border transition-all" style={exposurePerLayer === exp ? { backgroundColor: settings.accent, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wash Type */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: settings.accent }}>Wash Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setWashType("water")} className="flex items-center justify-center gap-2 py-3 rounded-xl border transition-all" style={washType === "water" ? { backgroundColor: `${settings.accent}22`, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                    <Droplets size={20} />
                    <span>Water</span>
                  </button>
                  <button onClick={() => setWashType("alcohol")} className="flex items-center gap-2 py-3 px-4 rounded-xl border transition-all" style={washType === "alcohol" ? { backgroundColor: `${settings.accent}22`, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                    <Shield size={20} />
                    <span>Alcohol</span>
                  </button>
                </div>
              </div>

              {/* Wash Time */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: settings.accent }}>Wash Time: {washTime} min</h3>
                <div className="grid grid-cols-6 gap-1">
                  {washTimeOptions.map(wt => (
                    <button key={wt} onClick={() => setWashTime(wt)} className="py-2 rounded-lg text-sm font-mono border transition-all" style={washTime === wt ? { backgroundColor: settings.accent, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                      {wt}
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Recommended: ~{recommendedWashTime} min for this print
                </div>
              </div>

              {/* Cure Section */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: settings.accent }}>Cure Section</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setCureSection("bottom")} className="py-2 rounded-lg text-sm border transition-all" style={cureSection === "bottom" ? { backgroundColor: settings.accent, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                    Bottom
                  </button>
                  <button onClick={() => setCureSection("top")} className="py-2 rounded-lg text-sm border transition-all" style={cureSection === "top" ? { backgroundColor: settings.accent, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                    Top
                  </button>
                  <button onClick={() => setCureSection("both")} className="py-2 rounded-lg text-sm border transition-all" style={cureSection === "both" ? { backgroundColor: settings.accent, borderColor: settings.accent } : { borderColor: "rgba(255,255,255,0.1)" }}>
                    Both
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="rounded-2xl p-6 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: settings.accent, boxShadow: `0 0 40px ${settings.glow}22` }}>
                <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: settings.accent }}>Post-Print Summary</h2>
                
                <div className="space-y-3">
                  {/* Wash */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${settings.accent}11` }}>
                    <div className="flex items-center gap-3">
                      <Droplets size={20} style={{ color: settings.accent }} />
                      <span className="text-sm">Wash ({washType})</span>
                    </div>
                    <span className="font-bold" style={{ color: settings.accent }}>{washTime} min</span>
                  </div>
                  
                  {/* Cure */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${settings.accent}11` }}>
                    <div className="flex items-center gap-3">
                      <Sun size={20} style={{ color: settings.accent }} />
                      <span className="text-sm">Cure ({cureSection})</span>
                    </div>
                    <span className="font-bold" style={{ color: settings.accent }}>{cureTime[cureSection]} min</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Total Post-Processing</span>
                    <span className="font-bold" style={{ color: settings.accent }}>{washTime + cureTime[cureSection]} min</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Info Tab */
            <div className="space-y-4">
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <Droplets size={24} style={{ color: settings.accent }} />
                  <h3 className="text-lg font-semibold" style={{ color: settings.accent }}>Water Wash Resin</h3>
                </div>
                <div className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <p>• Easier cleanup with just water</p>
                  <p>• Generally safer for indoor use</p>
                  <p>• May require longer wash times</p>
                  <p>• Recommended: 5-15 minutes depending on model size</p>
                  <p>• Change water between prints for best results</p>
                </div>
              </div>

              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={24} style={{ color: settings.accent }} />
                  <h3 className="text-lg font-semibold" style={{ color: settings.accent }}>IPA / Alcohol Wash</h3>
                </div>
                <div className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <p>• Requires 91%+ Isopropyl Alcohol (IPA)</p>
                  <p>• More effective at removing uncured resin</p>
                  <p>• Flammable - keep away from UV cure station</p>
                  <p>• Recommended: 3-10 minutes</p>
                  <p>• Replace when saturated (turns milky)</p>
                </div>
              </div>

              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <Sun size={24} style={{ color: settings.accent }} />
                  <h3 className="text-lg font-semibold" style={{ color: settings.accent }}>UV Cure</h3>
                </div>
                <div className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <p>• Bottom-only: 15-25 min (for pull-off)</p>
                  <p>• Top/both sides: 30-60 min depending on height</p>
                  <p>• Rotate model halfway through for even cure</p>
                  <p>• Over-curing can cause brittleness</p>
                  <p>• Some resins need post-curing for full strength</p>
                </div>
              </div>

              <div className="rounded-2xl p-5 border" style={{ backgroundColor: "rgba(20,20,20,0.9)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <Zap size={24} style={{ color: settings.accent }} />
                  <h3 className="text-lg font-semibold" style={{ color: settings.accent }}>Tips</h3>
                </div>
                <div className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <p>• Thinner layers = smoother finish but longer print</p>
                  <p>• Higher exposure = faster print but risk of over-exposure</p>
                  <p>• Always wear gloves when handling uncured resin</p>
                  <p>• Work in ventilated areas</p>
                  <p>• Use 405nm UV for best results</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showNav && (
        <nav className="portrait:bottom-24 landscape:bottom-6 fixed left-2 right-2 z-20 flex items-center rounded-xl border" style={{ backgroundColor: "rgba(8,8,8,0.98)", borderColor: "rgba(255,255,255,0.05)" }}>
          <button onClick={() => setActiveTab("calculator")} className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl" style={{ color: activeTab === "calculator" ? settings.accent : "rgba(255,255,255,0.5)" }}>
            <Droplets size={20} />
            <span className="text-[10px] font-medium">Calculator</span>
          </button>
          <button onClick={() => setActiveTab("info")} className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl" style={{ color: activeTab === "info" ? settings.accent : "rgba(255,255,255,0.5)" }}>
            <Info size={20} />
            <span className="text-[10px] font-medium">Info</span>
          </button>
        </nav>
      )}
    </div>
  );
}
