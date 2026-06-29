import React, { useState } from "react";
import PageShell from "./PageShell";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Palette, Bell, Shield, Monitor, Globe, ChevronRight,
  Check, Moon, Sun, Zap, Volume2, VolumeX, Eye, EyeOff, Save,
  RefreshCw, Wifi, Database, Server, Clock, Info
} from "lucide-react";

const TABS = [
  { id: "appearance", label: "Дизайн",      icon: Palette  },
  { id: "system",     label: "Систем",       icon: Server   },
  { id: "cafe",       label: "Кафе тохиргоо", icon: Monitor },
  { id: "account",    label: "Бүртгэл",      icon: Shield   },
];

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-cyan-500" : "bg-muted/60"}`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/40 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-bold text-foreground">{label}</p>
        {desc && <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();

  // Appearance settings
  const [neonEffects,   setNeonEffects]   = useState(true);
  const [animations,    setAnimations]    = useState(true);
  const [compactMode,   setCompactMode]   = useState(false);
  const [showFPS,       setShowFPS]       = useState(false);

  // System settings
  const [soundEnabled,  setSoundEnabled]  = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh,   setAutoRefresh]   = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  // Cafe settings
  const [cafeName,      setCafeName]      = useState("Demo Company");
  const [hourlyRate,    setHourlyRate]    = useState("4000");
  const [maxSession,    setMaxSession]    = useState("8");
  const [currency,      setCurrency]      = useState("MNT");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const [activeTab, setActiveTab] = useState("appearance");

  const VERSION = "v1.0.0";
  const BUILD   = "2026.06.29";

  return (
    <PageShell title="ТОХИРГОО" subtitle="Системийн бүх тохиргоог энд хийнэ">

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-border/40 last:border-0 ${
                    active ? "bg-cyan-500/10 text-cyan-400" : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">{tab.label}</span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Info card */}
          <div className="mt-4 bg-card border border-border/60 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Системийн мэдээлэл</span>
            </div>
            {[
              ["Хувилбар", VERSION],
              ["Build", BUILD],
              ["Нэвтэрсэн", user?.name || "—"],
              ["Эрх", user?.role?.toUpperCase() || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[10px] font-mono">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-foreground font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border/60 rounded-2xl p-6">

            {/* ===== APPEARANCE ===== */}
            {activeTab === "appearance" && (
              <div>
                <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" /> Дизайн тохиргоо
                </h2>

                <div className="space-y-1">
                  <SettingRow label="Neon гэрэлтэлт" desc="Карт болон хүрээний цэнхэр гэрэлтэлт">
                    <Toggle value={neonEffects} onChange={setNeonEffects} />
                  </SettingRow>
                  <SettingRow label="Хөдөлгөөнт эффект" desc="Хуудас солих болон hover анимэйшн">
                    <Toggle value={animations} onChange={setAnimations} />
                  </SettingRow>
                  <SettingRow label="Нягт горим" desc="Элементүүдийн зай багасгах">
                    <Toggle value={compactMode} onChange={setCompactMode} />
                  </SettingRow>
                  <SettingRow label="FPS тоолуур" desc="Хуудасны уншилтын хурдыг харах">
                    <Toggle value={showFPS} onChange={setShowFPS} />
                  </SettingRow>
                </div>

                {/* Color theme preview */}
                <div className="mt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Өнгөний горим</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: "Cyberpunk", colors: ["#00f2fe","#a78bfa","#ff4f7b"] },
                      { name: "Matrix",    colors: ["#22c55e","#16a34a","#14532d"] },
                      { name: "Blade",     colors: ["#f59e0b","#ef4444","#7c3aed"] },
                    ].map(theme => (
                      <button key={theme.name} className="border border-border/60 hover:border-cyan-500/40 rounded-xl p-3 text-left transition-all group">
                        <div className="flex gap-1 mb-2">
                          {theme.colors.map(c => <div key={c} className="w-5 h-5 rounded-full" style={{ background: c }} />)}
                        </div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-foreground">{theme.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== SYSTEM ===== */}
            {activeTab === "system" && (
              <div>
                <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" /> Системийн тохиргоо
                </h2>
                <div className="space-y-1">
                  <SettingRow label="Дуут мэдэгдэл" desc="Шинэ захиалга ирэхэд дуу гаргах">
                    <Toggle value={soundEnabled} onChange={setSoundEnabled} />
                  </SettingRow>
                  <SettingRow label="Мэдэгдэл" desc="Системийн мэдэгдлүүд идэвхтэй байх">
                    <Toggle value={notifications} onChange={setNotifications} />
                  </SettingRow>
                  <SettingRow label="Автомат шинэчлэл" desc="Өгөгдлийг тогтмол шинэчлэх">
                    <Toggle value={autoRefresh} onChange={setAutoRefresh} />
                  </SettingRow>
                  <SettingRow label="Шинэчлэлийн хугацаа" desc="Хэдэн секунд тутамд шинэчлэх">
                    <select
                      value={refreshInterval}
                      onChange={e => setRefreshInterval(e.target.value)}
                      className="bg-background border border-border/60 rounded-xl px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-cyan-500/50"
                    >
                      {["10","30","60","120"].map(v => <option key={v} value={v}>{v} секунд</option>)}
                    </select>
                  </SettingRow>
                </div>

                {/* Connection status */}
                <div className="mt-6 bg-background/40 border border-border/40 rounded-xl p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Холболтын төлөв</p>
                  {[
                    { icon: Database, label: "Мэдээллийн сан (SQLite)",   status: "Холбогдсон",  color: "text-emerald-400" },
                    { icon: Server,   label: "Backend API (4000)",         status: "Идэвхтэй",    color: "text-emerald-400" },
                    { icon: Wifi,     label: "Frontend (5173)",            status: "Ажиллаж байна", color: "text-cyan-400"  },
                  ].map(({ icon: Icon, label, status, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                      </div>
                      <span className={`text-[10px] font-bold font-mono ${color}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== CAFE ===== */}
            {activeTab === "cafe" && (
              <div>
                <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-amber-400" /> Кафены тохиргоо
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Кафены нэр",       key: "cafeName",   val: cafeName,   set: setCafeName   },
                    { label: "Цагийн үнэ (₮)",   key: "hourlyRate", val: hourlyRate, set: setHourlyRate },
                    { label: "Хамгийн урт сесс (цаг)", key: "maxSession", val: maxSession, set: setMaxSession },
                  ].map(({ label, key, val, set }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground font-mono">{label}</label>
                      <input
                        value={val}
                        onChange={e => set(e.target.value)}
                        className="w-full h-10 bg-background border border-border/60 rounded-xl px-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground font-mono">Валют</label>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full h-10 bg-background border border-border/60 rounded-xl px-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan-500/50"
                    >
                      {["MNT","USD","CNY"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ===== ACCOUNT ===== */}
            {activeTab === "account" && (
              <div>
                <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-400" /> Бүртгэлийн тохиргоо
                </h2>
                <div className="space-y-4">
                  {/* Current user info */}
                  <div className="bg-background/40 border border-border/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
                        <span className="text-base font-black text-cyan-300">{user?.name?.[0]?.toUpperCase() || "?"}</span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user?.name || "—"}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{user?.role?.toUpperCase()} • {user?.companyName || "—"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                      <div><span className="text-muted-foreground">ID: </span><span className="text-foreground">{user?.id || "—"}</span></div>
                      <div><span className="text-muted-foreground">Company: </span><span className="text-foreground">{user?.companyId || "—"}</span></div>
                    </div>
                  </div>

                  {/* Role permissions */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Эрхийн хамрах хүрээ</p>
                    <div className="space-y-2">
                      {[
                        { label: "Хяналтын самбар харах",   allowed: true  },
                        { label: "PC удирдах",               allowed: ["admin","pc"].includes(user?.role) },
                        { label: "Захиалга авах",            allowed: true  },
                        { label: "Тэмцээн бүртгэх",         allowed: true  },
                        { label: "Админ консол нэвтрэх",     allowed: user?.role === "admin" },
                        { label: "Хэрэглэгч устгах",        allowed: user?.role === "admin" },
                      ].map(({ label, allowed }) => (
                        <div key={label} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${allowed ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-muted/30 border border-border/40"}`}>
                            <Check className={`w-2.5 h-2.5 ${allowed ? "text-emerald-400" : "text-muted-foreground/30"}`} />
                          </div>
                          <span className={`text-xs font-mono ${allowed ? "text-foreground" : "text-muted-foreground/50"}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-8 pt-6 border-t border-border/40 flex justify-end">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                  saved
                    ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400"
                    : "bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/25"
                }`}
              >
                {saved ? <><Check className="w-4 h-4" /> Хадгалагдлаа</> : <><Save className="w-4 h-4" /> Хадгалах</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
