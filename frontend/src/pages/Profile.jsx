import React, { useState, useEffect } from "react";
import PageShell from "./PageShell";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Wallet, Star, Clock, Monitor, Trophy, TrendingUp,
  Plus, CheckCircle, ChevronRight, Zap, Crown, Shield, Gem
} from "lucide-react";

const RANK_CONFIG = {
  Bronze:   { color: "text-amber-700",   bg: "bg-amber-700/10",   border: "border-amber-700/30",   icon: Shield,  next: "Silver",   pts: 500  },
  Silver:   { color: "text-slate-300",   bg: "bg-slate-300/10",   border: "border-slate-300/30",   icon: Star,    next: "Gold",     pts: 1500 },
  Gold:     { color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/30",  icon: Crown,   next: "Platinum", pts: 5000 },
  Platinum: { color: "text-cyan-300",    bg: "bg-cyan-300/10",    border: "border-cyan-300/30",    icon: Gem,     next: "Diamond",  pts: 15000 },
  Diamond:  { color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/30",  icon: Trophy,  next: null,       pts: null },
};

const TOP_UP_PRESETS = [5000, 10000, 20000, 50000];

export default function Profile() {
  const { user } = useAuth();
  const transactions = useEntityList(() => entities.transaction.list());
  const profiles    = useEntityList(() => entities.userProfile.list());

  // find this user's profile or use first result
  const profile = profiles.data?.[0] || null;

  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [sessionElapsed, setSessionElapsed] = useState(0);

  // Tick session timer
  useEffect(() => {
    if (!profile?.session_active || !profile?.session_start) return;
    const start = new Date(profile.session_start).getTime();
    const tick = () => setSessionElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [profile]);

  const formatElapsed = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleTopUp = async (amount) => {
    const val = parseFloat(amount || topUpAmount);
    if (!val || val <= 0 || !profile) return;
    setTopUpLoading(true);
    try {
      const newBalance = (profile.balance || 0) + val;
      await entities.userProfile.update(profile.id, { balance: newBalance });
      await entities.transaction.create({
        user_id: profile.user_id || user?.id || "guest",
        type: "top_up",
        amount: val,
        description: `Balance top-up: ₮${val.toLocaleString()}`,
        balance_after: newBalance
      });
      setTopUpSuccess(true);
      setTimeout(() => setTopUpSuccess(false), 2500);
      profiles.refresh();
      transactions.refresh();
      setTopUpAmount("");
    } catch (err) {
      alert("Top-up failed: " + err.message);
    } finally {
      setTopUpLoading(false);
    }
  };

  const rank = profile?.rank || "Bronze";
  const rankCfg = RANK_CONFIG[rank] || RANK_CONFIG.Bronze;
  const RankIcon = rankCfg.icon;
  const points = profile?.points || 0;
  const nextRankPts = rankCfg.pts;
  const rankProgress = nextRankPts ? Math.min((points / nextRankPts) * 100, 100) : 100;

  const myTxns = transactions.data?.slice(0, 10) || [];

  return (
    <PageShell title="PLAYER PROFILE" subtitle="Account status, balance & session info">

      {profiles.isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !profile ? (
        <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl">
          <User className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-bold text-foreground uppercase">No profile found</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Ask staff to create your player account</p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* === PLAYER HERO CARD === */}
          <div className="relative bg-card border border-border/80 rounded-2xl p-6 overflow-hidden">
            {/* decorative bg blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/30 border border-purple-500/30 flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-9 h-9 text-purple-300" />
                  )}
                </div>
                <div className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl ${rankCfg.bg} ${rankCfg.border} border flex items-center justify-center`}>
                  <RankIcon className={`w-3.5 h-3.5 ${rankCfg.color}`} />
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1">
                <h2 className="font-display font-black text-xl text-foreground">{profile.username}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${rankCfg.color} ${rankCfg.bg} ${rankCfg.border}`}>
                    {rank} MEMBER
                  </span>
                  {profile.session_active && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      SESSION ACTIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Balance pill */}
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Balance</p>
                <p className="font-mono font-black text-2xl text-cyan-400">₮{(profile.balance || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Rank progress bar */}
            {rankCfg.next && (
              <div className="relative mt-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">Progress to {rankCfg.next}</span>
                  <span className="text-[9px] font-bold text-muted-foreground font-mono">{points.toLocaleString()} / {nextRankPts.toLocaleString()} pts</span>
                </div>
                <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rankProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${rankCfg.color.replace("text-", "bg-")}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* === STATS ROW === */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Loyalty Points",  val: (points).toLocaleString(),                       icon: Star,      color: "text-yellow-400" },
              { label: "Total Hours",     val: `${(profile.total_hours || 0).toFixed(1)}h`,     icon: Clock,     color: "text-cyan-400"   },
              { label: "Current PC",      val: profile.current_pc ? `#${profile.current_pc}` : "—", icon: Monitor, color: "text-purple-400" },
              { label: "Status",          val: profile.session_active ? "ONLINE" : "OFFLINE",   icon: Zap,       color: profile.session_active ? "text-emerald-400" : "text-muted-foreground" },
            ].map(({ label, val, icon: Icon, color }) => (
              <div key={label} className="bg-card border border-border/80 rounded-xl p-4">
                <Icon className={`w-4 h-4 ${color} mb-2`} />
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">{label}</p>
                <p className={`text-sm font-black font-mono mt-0.5 ${color}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* === ACTIVE SESSION TIMER === */}
          {profile.session_active && (
            <div className="bg-card border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/3 pointer-events-none" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    Active Gaming Session — PC #{profile.current_pc}
                  </p>
                  <p className="font-mono font-black text-3xl text-foreground mt-2 tracking-widest">{formatElapsed(sessionElapsed)}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">
                    Started: {new Date(profile.session_start).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Est. Cost</p>
                  <p className="font-mono font-black text-lg text-rose-400 mt-1">
                    ₮{((sessionElapsed / 3600) * 4000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-mono">@ ₮4,000/hr</p>
                </div>
              </div>
            </div>
          )}

          {/* === TOP-UP SECTION === */}
          <div className="bg-card border border-border/80 rounded-2xl p-6">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-cyan-400" /> Balance Top-Up
            </h3>

            {/* Preset amounts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {TOP_UP_PRESETS.map(preset => (
                <button
                  key={preset}
                  onClick={() => handleTopUp(preset)}
                  disabled={topUpLoading}
                  className="py-2.5 border border-border/80 hover:border-cyan-400/60 bg-background/40 hover:bg-cyan-500/5 text-xs font-black font-mono text-foreground hover:text-cyan-400 transition-all rounded-xl uppercase"
                >
                  ₮{preset.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <form onSubmit={(e) => { e.preventDefault(); handleTopUp(); }} className="flex gap-2">
              <input
                type="number"
                value={topUpAmount}
                onChange={e => setTopUpAmount(e.target.value)}
                placeholder="Custom amount (₮)"
                className="flex-1 bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2.5 text-xs font-mono text-foreground focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={topUpLoading || !topUpAmount}
                className="px-5 border border-cyan-500 bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider hover:bg-cyan-500/20 transition-all rounded-xl disabled:opacity-40 flex items-center gap-1.5"
              >
                {topUpLoading ? (
                  <div className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                ) : topUpSuccess ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                {topUpSuccess ? "Done!" : "Top-Up"}
              </button>
            </form>
          </div>

          {/* === TRANSACTION HISTORY === */}
          <div className="bg-card border border-border/80 rounded-2xl p-6">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Transaction History
            </h3>
            {transactions.isLoading ? (
              <div className="py-8 text-center">
                <div className="w-5 h-5 border border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : myTxns.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-8 font-mono uppercase">No transactions recorded yet</p>
            ) : (
              <div className="space-y-2">
                {myTxns.map(txn => {
                  const isCredit = txn.type === "top_up" || txn.type === "reward";
                  return (
                    <div key={txn.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-background/40 border border-border/60 hover:border-border transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
                          isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {isCredit ? "+" : "−"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground capitalize">{txn.type?.replace("_", " ")}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{txn.description || "—"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-black font-mono ${isCredit ? "text-emerald-400" : "text-rose-400"}`}>
                          {isCredit ? "+" : "−"}₮{Math.abs(txn.amount).toLocaleString()}
                        </p>
                        {txn.balance_after != null && (
                          <p className="text-[9px] text-muted-foreground font-mono">bal: ₮{txn.balance_after.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </PageShell>
  );
}
