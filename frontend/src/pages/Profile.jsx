import React, { useState, useEffect } from "react";
import PageShell from "./PageShell";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Wallet, Star, Clock, Monitor, Trophy, TrendingUp,
  Plus, CheckCircle, ChevronRight, Zap, Crown, Shield, Gem,
  CreditCard, QrCode, Sparkles, HelpCircle, ArrowRight
} from "lucide-react";

const RANK_CONFIG = {
  Bronze:   { color: "text-amber-700",   bg: "bg-amber-700/10",   border: "border-amber-700/30",   icon: Shield,  next: "Silver",   pts: 500  },
  Silver:   { color: "text-slate-300",   bg: "bg-slate-300/10",   border: "border-slate-300/30",   icon: Star,    next: "Gold",     pts: 1500 },
  Gold:     { color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/30",  icon: Crown,   next: "Platinum", pts: 5000 },
  Platinum: { color: "text-cyan-300",    bg: "bg-cyan-300/10",    border: "border-cyan-300/30",    icon: Gem,     next: "Diamond",  pts: 15000 },
  Diamond:  { color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/30",  icon: Trophy,  next: null,       pts: null },
};

const TOP_UP_PRESETS = [3000, 6000, 12000, 30000];
const HOURLY_RATE = 3000; // 3,000₮ per hour

export default function Profile() {
  const { user } = useAuth();
  const transactions = useEntityList(() => entities.transaction.list());
  const profiles     = useEntityList(() => entities.userProfile.list());

  // Find this user's profile
  const profile = profiles.data?.find(p => p.user_id === user?.id || p.username === user?.name) || null;

  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("qpay"); // qpay or card
  const [showQr, setShowQr] = useState(false);

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
    
    if (paymentMethod === "qpay" && !showQr && !amount) {
      setShowQr(true);
      return;
    }

    setTopUpLoading(true);
    try {
      const newBalance = (profile.balance || 0) + val;
      await entities.userProfile.update(profile.id, { balance: newBalance });
      await entities.transaction.create({
        user_id: profile.user_id || user?.id || "guest",
        type: "top_up",
        amount: val,
        description: `Данс цэнэглэлт: ₮${val.toLocaleString()} (${paymentMethod === "qpay" ? "QPay" : "Карт"})`,
        balance_after: newBalance
      });
      setTopUpSuccess(true);
      setShowQr(false);
      setTimeout(() => setTopUpSuccess(false), 2500);
      profiles.refresh();
      transactions.refresh();
      setTopUpAmount("");
    } catch (err) {
      alert("Цэнэглэлт амжилтгүй: " + err.message);
    } finally {
      setTopUpLoading(false);
    }
  };

  const isMember = profile?.role === "member" || user?.role === "admin";
  const rank = profile?.rank || "Bronze";
  const rankCfg = RANK_CONFIG[rank] || RANK_CONFIG.Bronze;
  const RankIcon = rankCfg.icon;
  const points = profile?.points || 0;
  const nextRankPts = rankCfg.pts;
  const rankProgress = nextRankPts ? Math.min((points / nextRankPts) * 100, 100) : 100;

  const myTxns = transactions.data?.filter(t => t.user_id === user?.id || t.user_id === profile?.user_id).slice(0, 10) || [];

  return (
    <PageShell title="NEXUS PROFILE" subtitle="Хэрэглэгчийн бүртгэл, үлдэгдэл ба цаг хяналт">
      {profiles.isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !profile ? (
        <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl cyber-hud-card">
          <User className="w-10 h-10 mx-auto text-muted-foreground mb-3 animate-pulse" />
          <p className="text-sm font-bold text-foreground uppercase">Хэрэглэгчийн мэдээлэл олдсонгүй</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Админд хандан бүртгэлээ үүсгүүлнэ үү.</p>
        </div>
      ) : (
        <div className="space-y-6 fade-up">
          
          {/* === HERO ROW / BASIC PROFILE === */}
          <div className="relative cyber-hud-card rounded-2xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/30 border border-purple-500/30 flex items-center justify-center overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-purple-300" />
                    )}
                  </div>
                  {isMember && (
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${rankCfg.bg} ${rankCfg.border} border flex items-center justify-center`}>
                      <RankIcon className={`w-3 h-3 ${rankCfg.color}`} />
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div>
                  <h2 className="font-display font-black text-lg text-foreground flex items-center gap-2">
                    {profile.username}
                    {!isMember && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-border text-muted-foreground bg-muted/20">GUEST</span>}
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">ID: #{profile.id?.slice(0, 8)}</p>
                  {isMember && (
                    <span className={`inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${rankCfg.color} ${rankCfg.bg} ${rankCfg.border}`}>
                      {rank} MEMBER
                    </span>
                  )}
                </div>
              </div>

              {/* Balance */}
              <div className="sm:text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Үлдэгдэл баланс</p>
                <p className="font-mono font-black text-2xl text-cyan-400">₮{(profile.balance || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Rank Progress - ONLY FOR MEMBERS */}
            {isMember && rankCfg.next && (
              <div className="relative mt-5 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">{rankCfg.next} цол хүртэл</span>
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

          {/* === ACTIVE SESSION TIMER === */}
          {profile.session_active && (
            <div className="cyber-hud-card rounded-2xl p-5 relative overflow-hidden border-emerald-500/20">
              <div className="absolute inset-0 bg-emerald-500/3 pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    Идэвхтэй Тоглож буй станц — PC #{profile.current_pc}
                  </p>
                  <p className="font-mono font-black text-3xl text-foreground mt-2 tracking-widest">{formatElapsed(sessionElapsed)}</p>
                  <p className="text-[9px] text-muted-foreground font-mono mt-1">
                    Эхэлсэн цаг: {new Date(profile.session_start).toLocaleTimeString()}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Бодогдсон төлбөр</p>
                  <p className="font-mono font-black text-xl text-rose-400 mt-1">
                    ₮{((sessionElapsed / 3600) * HOURLY_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-mono">@ ₮{HOURLY_RATE.toLocaleString()}/ц</p>
                </div>
              </div>
            </div>
          )}

          {/* Layout Split based on membership */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left/Middle Column - Billing & Payments */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Payment/Top-up card */}
              <div className="cyber-hud-card rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-xs uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-cyan-400" /> ДАНС ЦЭНЭГЛЭХ
                  </h3>
                  
                  {/* Payment Method Selector */}
                  <div className="flex gap-1 p-0.5 bg-muted/40 rounded-xl border border-border/60">
                    <button 
                      onClick={() => { setPaymentMethod("qpay"); setShowQr(false); }}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${paymentMethod === "qpay" ? "bg-cyan-500/10 text-cyan-400" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      QPay
                    </button>
                    <button 
                      onClick={() => { setPaymentMethod("card"); setShowQr(false); }}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${paymentMethod === "card" ? "bg-purple-500/10 text-purple-400" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Картаар
                    </button>
                  </div>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-4 gap-2">
                  {TOP_UP_PRESETS.map(preset => (
                    <button
                      key={preset}
                      onClick={() => handleTopUp(preset)}
                      disabled={topUpLoading}
                      className="py-2.5 border border-border/80 hover:border-cyan-400/60 bg-background/40 hover:bg-cyan-500/5 text-xs font-black font-mono text-foreground hover:text-cyan-400 transition-all rounded-xl"
                    >
                      + ₮{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleTopUp(); }} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={e => setTopUpAmount(e.target.value)}
                      placeholder="Өөр дүн оруулах (₮)"
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
                      {topUpSuccess ? "Амжилттай" : "Цэнэглэх"}
                    </button>
                  </div>

                  {/* Mock QPay QR Code */}
                  {showQr && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center p-5 bg-background/50 border border-border/60 rounded-2xl space-y-3">
                      <QrCode className="w-32 h-32 text-foreground" />
                      <p className="text-[10px] text-muted-foreground font-mono text-center uppercase">Утсаараа банкны апп-аар уншуулж төлнө үү</p>
                      <button 
                        type="button" 
                        onClick={() => handleTopUp(topUpAmount)}
                        className="py-1.5 px-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase rounded-lg hover:bg-emerald-500/20 transition-colors"
                      >
                        Төлбөрийг баталгаажуулах
                      </button>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Transactions list */}
              <div className="cyber-hud-card rounded-2xl p-6">
                <h3 className="font-display font-black text-xs uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-purple-400" /> СҮҮЛИЙН ГҮЙЛГЭЭНҮҮД
                </h3>
                {transactions.isLoading ? (
                  <div className="py-8 text-center">
                    <div className="w-5 h-5 border border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : myTxns.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-8 font-mono uppercase">Гүйлгээний түүх байхгүй</p>
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Membership Info or Rank Panel */}
            <div>
              {isMember ? (
                /* Member Rank Info Panel */
                <div className="cyber-hud-card rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-black text-xs uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" /> ГИШҮҮНЧЛЭЛИЙН ДАВУУ ТАЛУУД
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                      <p className="text-xs font-bold text-yellow-400">XP & Онооны систем</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Тоглосон цаг тутамдаа оноо цуглуулж, цол ахина.</p>
                    </div>
                    <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                      <p className="text-xs font-bold text-cyan-400">Хөнгөлөлттэй тариф</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Тоглоом болон хоол ундааны захиалгад 10%-ийн хөнгөлөлт эдлэнэ.</p>
                    </div>
                    <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                      <p className="text-xs font-bold text-purple-400">VIP Тэмцээнүүд</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Зөвхөн гишүүдэд зориулсан тусгай тэмцээнүүдэд оролцох эрх.</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Promotion to become a member */
                <div className="cyber-hud-card rounded-2xl p-5 space-y-4 border-yellow-500/20">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-foreground uppercase">ГИШҮҮН БОЛОХ</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Та одоогоор зочны эрхтэй байна. Гишүүн болсноор дараах боломжуудыг нээнэ:</p>
                  </div>
                  <ul className="space-y-2 text-[10px] font-mono text-muted-foreground">
                    <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-cyan-400" /> Үнэгүй XP / Оноо цуглуулах</li>
                    <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-cyan-400" /> Хөнгөлөлттэй тариф</li>
                    <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-cyan-400" /> VIP тэмцээнд оролцох эрх</li>
                  </ul>
                  <div className="pt-2">
                    <button className="w-full py-2 bg-yellow-400/10 border border-yellow-400/30 hover:bg-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                      Гишүүн болох
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </PageShell>
  );
}
