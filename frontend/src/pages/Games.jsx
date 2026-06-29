import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { Search, Gamepad2, Star, Cpu, Zap, Filter, X } from "lucide-react";

const CATEGORIES = ["Бүгд", "FPS", "MOBA", "RPG", "Battle Royale", "Racing", "Sports", "Strategy", "MMO"];
const CAT_MAP = { "Бүгд": "All", "FPS": "FPS", "MOBA": "MOBA", "RPG": "RPG", "Battle Royale": "Battle Royale", "Racing": "Racing", "Sports": "Sports", "Strategy": "Strategy", "MMO": "MMO" };
const CAT_COLORS = {
  FPS: "#ff4f7b",
  MOBA: "#a78bfa",
  RPG: "#f59e0b",
  "Battle Royale": "#f472b6",
  Racing: "#00f2fe",
  Sports: "#34d399",
  Strategy: "#60a5fa",
  MMO: "#fb923c",
};

function PopBar({ value = 0 }) {
  const color = value >= 95 ? "#ff4f7b" : value >= 88 ? "#a78bfa" : "#00f2fe";
  return (
    <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 4, background: color, boxShadow: `0 0 8px ${color}80` }}
      />
    </div>
  );
}

function GameCard({ game, index }) {
  const catColor = CAT_COLORS[game.category] || "#00f2fe";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
      whileHover={{
        y: -4,
        borderColor: catColor + "44",
        boxShadow: `0 12px 40px ${catColor}18`,
      }}
    >
      {/* Cover */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", background: "#0d0d18" }}>
        {game.image_url ? (
          <motion.img
            src={game.image_url}
            alt={game.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gamepad2 style={{ width: 40, height: 40, color: "rgba(255,255,255,0.15)" }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,7,14,0.85) 0%, transparent 50%)" }} />

        {/* Category chip */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          padding: "3px 10px", borderRadius: 20,
          fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          background: catColor + "22", border: `1px solid ${catColor}55`, color: catColor,
        }}>
          {game.category}
        </div>

        {/* Featured badge */}
        {game.is_featured && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            padding: "3px 8px", borderRadius: 20,
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
            background: "rgba(255,199,0,0.18)", border: "1px solid rgba(255,199,0,0.4)", color: "#ffd000",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <Star style={{ width: 8, height: 8 }} fill="#ffd000" />
            ОНЦЛОХ
          </div>
        )}

        {/* Popularity bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 6px 0" }}>
          <div style={{ padding: "0 12px" }}>
            <PopBar value={game.popularity} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}>{game.title}</div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: catColor, flexShrink: 0,
            background: catColor + "18", borderRadius: 6, padding: "2px 7px",
          }}>
            {game.popularity || 0}%
          </div>
        </div>

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.8)", lineHeight: 1.55, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {game.description || "Тайлбар байхгүй."}
        </p>

        <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Cpu style={{ width: 9, height: 9, color: "rgba(148,163,184,0.5)", flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {game.min_specs || "Шаардлага тодорхойгүй"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Games() {
  const games = useEntityList(() => entities.game.list());
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Бүгд");

  const filteredGames = useMemo(() => {
    const raw = games.data || [];
    const engCat = CAT_MAP[selectedCat];
    return raw.filter(g => {
      const matchSearch = !search ||
        g.title?.toLowerCase().includes(search.toLowerCase()) ||
        g.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = engCat === "All" || g.category === engCat;
      return matchSearch && matchCat;
    });
  }, [games.data, search, selectedCat]);

  const featured = filteredGames.filter(g => g.is_featured);
  const rest = filteredGames.filter(g => !g.is_featured);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(167,139,250,0.2)",
          }}>
            <Gamepad2 style={{ width: 18, height: 18, color: "#a78bfa" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0, letterSpacing: "-0.02em" }}>
              Тоглоомын Сан
            </h1>
            <p style={{ fontSize: 12, color: "rgba(148,163,184,0.65)", margin: 0 }}>
              {games.data?.length || 0} тоглоом нийт бүртгэлтэй
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 340 }}>
          <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "rgba(148,163,184,0.5)" }} />
          <input
            type="text"
            placeholder="Тоглоом хайх..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: 38, paddingLeft: 34, paddingRight: search ? 34 : 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "#f1f5f9", fontSize: 13, outline: "none",
              boxSizing: "border-box",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "rgba(148,163,184,0.5)", cursor: "pointer", padding: 0,
            }}>
              <X style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>

        {/* Stats chips */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Онцлох", val: (games.data || []).filter(g => g.is_featured).length, color: "#ffd000" },
            { label: "Нийт", val: games.data?.length || 0, color: "#00f2fe" },
          ].map(chip => (
            <div key={chip.label} style={{
              padding: "6px 14px", borderRadius: 8,
              background: chip.color + "12", border: `1px solid ${chip.color}30`,
              fontSize: 12, fontWeight: 700, color: chip.color,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Zap style={{ width: 11, height: 11 }} />
              {chip.label}: {chip.val}
            </div>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {CATEGORIES.map(cat => {
          const isActive = selectedCat === cat;
          const catColor = cat === "Бүгд" ? "#00f2fe" : (CAT_COLORS[CAT_MAP[cat]] || "#00f2fe");
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: "5px 14px", borderRadius: 20, cursor: "pointer",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                background: isActive ? catColor + "20" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? catColor + "55" : "rgba(255,255,255,0.08)"}`,
                color: isActive ? catColor : "rgba(148,163,184,0.65)",
                transition: "all 0.15s",
                boxShadow: isActive ? `0 0 12px ${catColor}25` : "none",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {games.loading && (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div style={{ display: "inline-block", width: 32, height: 32, border: "2px solid rgba(0,242,254,0.15)", borderTop: "2px solid #00f2fe", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ marginTop: 12, fontSize: 13, color: "rgba(148,163,184,0.5)" }}>Тоглоомуудыг ачааллаж байна...</p>
        </div>
      )}

      {/* Error */}
      {games.error && !games.loading && (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#f87171" }}>Тоглоомын мэдээлэл ачаалахад алдаа гарлаа.</p>
        </div>
      )}

      {/* Featured section */}
      {!games.loading && featured.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Star style={{ width: 14, height: 14, color: "#ffd000" }} fill="#ffd000" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#ffd000", letterSpacing: "0.1em" }}>ОНЦЛОХ ТОГЛООМУУД</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {featured.map((game, i) => <GameCard key={game.id} game={game} index={i} />)}
          </div>
        </div>
      )}

      {/* All games */}
      {!games.loading && rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Filter style={{ width: 13, height: 13, color: "rgba(148,163,184,0.5)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(148,163,184,0.5)", letterSpacing: "0.1em" }}>
                БУСАД ТОГЛООМУУД
              </span>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {rest.map((game, i) => <GameCard key={game.id} game={game} index={i + featured.length} />)}
          </div>
        </div>
      )}

      {/* Empty */}
      {!games.loading && filteredGames.length === 0 && !games.error && (
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <Gamepad2 style={{ width: 48, height: 48, color: "rgba(148,163,184,0.2)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 14, color: "rgba(148,163,184,0.5)", margin: 0 }}>
            "{search}" хайлтаар тоглоом олдсонгүй.
          </p>
          <button
            onClick={() => { setSearch(""); setSelectedCat("Бүгд"); }}
            style={{ marginTop: 12, padding: "7px 18px", borderRadius: 8, border: "1px solid rgba(0,242,254,0.3)", background: "rgba(0,242,254,0.08)", color: "#00f2fe", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            Шүүлтүүр арилгах
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
