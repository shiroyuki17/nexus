import React, { useState, useMemo } from "react";
import PageShell from "./PageShell";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Gamepad2, Calendar, Clock, Users, Zap, CheckCircle,
  Star, ChevronRight, X, Ticket, Flame, Lock, PlayCircle
} from "lucide-react";

const STATUS_CONFIG = {
  upcoming: {
    label: "УДАХГҮЙ",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    icon: Calendar,
  },
  active: {
    label: "ЯВАГДАЖ БАЙНА",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    icon: Flame,
  },
  completed: {
    label: "ДУУССАН",
    color: "text-muted-foreground",
    bg: "bg-muted/20",
    border: "border-border/50",
    glow: "",
    icon: CheckCircle,
  },
};

function TournamentCard({ t, onRegister }) {
  const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.upcoming;
  const StatusIcon = cfg.icon;
  const pct = t.max_participants > 0
    ? Math.round((t.current_participants / t.max_participants) * 100)
    : 0;
  const isFull = t.current_participants >= t.max_participants;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col border rounded-2xl overflow-hidden transition-all duration-300 ${cfg.border} ${cfg.glow} hover:-translate-y-1`}
    >
      {/* Banner image */}
      <div className="relative h-36 overflow-hidden bg-muted/20">
        {t.image_url ? (
          <img
            src={t.image_url}
            alt={t.title}
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        {/* Status badge */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest font-mono ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
        {/* Prize pool */}
        <div className="absolute top-3 right-3 bg-background/90 border border-border/60 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-black text-amber-400 font-mono">{t.prize_pool || "—"}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 bg-card/60">
        {/* Title */}
        <div>
          <h3 className="font-display font-black text-sm text-foreground leading-tight tracking-wide">{t.title}</h3>
          <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5 flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" /> {t.game}
          </p>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-cyan-400/60" />
            <span>{t.date || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400/60" />
            <span>{t.time || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Ticket className="w-3 h-3 text-amber-400/60" />
            <span>
              Бүртгэлийн хураамж:{" "}
              <span className="text-amber-400 font-black">
                {t.entry_fee > 0 ? `₮${t.entry_fee?.toLocaleString()}` : "ҮНЭГҮЙ"}
              </span>
            </span>
          </div>
        </div>

        {/* Participant bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> Тоглогчид
            </span>
            <span className={isFull ? "text-rose-400 font-black" : "text-foreground font-bold"}>
              {t.current_participants} / {t.max_participants}
              {isFull && " (ДҮҮРСЭН)"}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${isFull ? "bg-rose-500" : pct > 70 ? "bg-amber-500" : "bg-cyan-500"}`}
            />
          </div>
        </div>

        {/* Description */}
        {t.description && (
          <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{t.description}</p>
        )}

        {/* Action button */}
        <button
          onClick={() => onRegister(t)}
          disabled={t.status === "completed" || isFull}
          className={`mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            t.status === "completed"
              ? "bg-muted/30 text-muted-foreground cursor-not-allowed border border-border/40"
              : isFull
              ? "bg-rose-500/10 text-rose-400 cursor-not-allowed border border-rose-500/20"
              : t.status === "active"
              ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
              : "bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/25"
          }`}
        >
          {t.status === "completed" ? (
            <><CheckCircle className="w-3.5 h-3.5" /> Дууссан</>
          ) : isFull ? (
            <><Lock className="w-3.5 h-3.5" /> Дүүрсэн</>
          ) : t.status === "active" ? (
            <><PlayCircle className="w-3.5 h-3.5" /> Оролцох</>
          ) : (
            <><Zap className="w-3.5 h-3.5" /> Бүртгүүлэх</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function Tournaments() {
  const { user } = useAuth();
  const tournaments = useEntityList(() => entities.tournament.list());

  const [filter, setFilter] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [teamName, setTeamName] = useState("");

  const filtered = useMemo(() => {
    if (!tournaments.data) return [];
    if (filter === "all") return tournaments.data;
    return tournaments.data.filter(t => t.status === filter);
  }, [tournaments.data, filter]);

  const stats = useMemo(() => {
    if (!tournaments.data) return { active: 0, upcoming: 0, completed: 0, total: 0 };
    return {
      total: tournaments.data.length,
      active: tournaments.data.filter(t => t.status === "active").length,
      upcoming: tournaments.data.filter(t => t.status === "upcoming").length,
      completed: tournaments.data.filter(t => t.status === "completed").length,
    };
  }, [tournaments.data]);

  const handleRegister = async () => {
    if (!selectedTournament || !teamName.trim()) return;
    setRegistering(true);
    try {
      await entities.tournamentRegistration.create({
        tournament_id: selectedTournament.id,
        user_id: user?.id || "guest",
        user_name: user?.name || "Guest",
        team_name: teamName.trim(),
        status: "registered",
      });
      setRegistered(true);
      setTimeout(() => {
        setRegistered(false);
        setSelectedTournament(null);
        setTeamName("");
        tournaments.refresh();
      }, 2000);
    } catch (err) {
      alert("Бүртгэл амжилтгүй болсон: " + err.message);
    } finally {
      setRegistering(false);
    }
  };

  const FILTERS = [
    { key: "all",       label: "Бүгд",     count: stats.total },
    { key: "active",    label: "Идэвхтэй", count: stats.active },
    { key: "upcoming",  label: "Удахгүй",  count: stats.upcoming },
    { key: "completed", label: "Дууссан",  count: stats.completed },
  ];

  return (
    <PageShell title="ТЭМЦЭЭНҮҮД" subtitle="Бүртгүүлж шагналаа хожоорой">

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Нийт тэмцээн", value: stats.total,     icon: Trophy, color: "text-amber-400" },
          { label: "Явагдаж буй",  value: stats.active,    icon: Flame,  color: "text-emerald-400" },
          { label: "Удахгүй",      value: stats.upcoming,  icon: Zap,    color: "text-cyan-400" },
          { label: "Дууссан",      value: stats.completed, icon: CheckCircle, color: "text-muted-foreground" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border/60 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-background/60 border border-border/40 flex items-center justify-center flex-shrink-0">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-black font-mono text-foreground">{value}</p>
              <p className="text-[9px] text-muted-foreground font-mono uppercase">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 border border-border/60 rounded-xl p-1 w-fit">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              filter === f.key
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            <span className={`text-[9px] px-1 rounded ${filter === f.key ? "bg-cyan-500/20" : "bg-muted/40"}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {tournaments.isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border/60 rounded-2xl">
          <Trophy className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Тэмцээн олдсонгүй</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <TournamentCard key={t.id} t={t} onRegister={setSelectedTournament} />
          ))}
        </div>
      )}

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedTournament && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedTournament(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-cyan-500/5"
            >
              {registered ? (
                <div className="py-8 flex flex-col items-center gap-3 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                  <p className="font-display font-black text-lg text-foreground">Бүртгэл амжилттай!</p>
                  <p className="text-sm text-muted-foreground">{selectedTournament.title} тэмцээнд бүртгэгдлээ.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="font-display font-black text-base text-foreground">{selectedTournament.title}</h2>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedTournament.game}</p>
                    </div>
                    <button onClick={() => setSelectedTournament(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="bg-background/60 border border-border/40 rounded-xl p-3 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Огноо</span>
                        <span className="text-foreground">{selectedTournament.date} {selectedTournament.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Шагналын сан</span>
                        <span className="text-amber-400 font-black">{selectedTournament.prize_pool}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Бүртгэлийн хураамж</span>
                        <span className="text-cyan-400 font-black">
                          {selectedTournament.entry_fee > 0
                            ? `₮${selectedTournament.entry_fee?.toLocaleString()}`
                            : "ҮНЭГҮЙ"}
                        </span>
                      </div>
                    </div>

                    {/* Team name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                        Багийн нэр / Нэрс
                      </label>
                      <input
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        placeholder="Жишээ: NEXUS Wolves"
                        className="w-full h-10 bg-background border border-border/60 rounded-xl px-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <button
                      onClick={handleRegister}
                      disabled={!teamName.trim() || registering}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 text-sm font-black uppercase tracking-wider hover:bg-cyan-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {registering ? (
                        <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-4 h-4" /> Бүртгүүлэх
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
