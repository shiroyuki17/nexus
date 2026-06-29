import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Monitor, CalendarClock, Gamepad2, UtensilsCrossed,
  User, Trophy, Shield, ChevronRight, Zap, LogOut, Cpu, UserCog, Settings
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { path: "/dashboard",    icon: LayoutDashboard, label: "Хяналтын Самбар", color: "#00f2fe" },
  { path: "/pc-status",    icon: Monitor,         label: "Суудлын Хяналт",  color: "#a78bfa", roles: ["admin","pc"] },
  { path: "/reservations", icon: CalendarClock,   label: "Суудал Захиалга", color: "#34d399" },
  { path: "/games",        icon: Gamepad2,        label: "Тоглоомын Сан",   color: "#f59e0b" },
  { path: "/food-drinks",  icon: UtensilsCrossed, label: "Хоол, Ундаа",     color: "#f472b6" },
  { path: "/tournaments",  icon: Trophy,          label: "Тэмцээн",         color: "#fb923c" },
  { path: "/profile",      icon: User,            label: "Профайл",         color: "#60a5fa" },
  { path: "/staff",        icon: UserCog,         label: "Ажилчид",         color: "#c084fc", roles: ["admin","pc"] },
  { path: "/settings",     icon: Settings,        label: "Тохиргоо",        color: "#94a3b8" },
  { path: "/admin",        icon: Shield,          label: "Админ",           color: "#ff4f7b", roles: ["admin"] },
];


const COLLAPSED_KEY = "nexus_sidebar_collapsed";

const ROLE_LABEL = { admin: "АДМИН", user: "ГИШҮҮН", pc: "ОПЕРАТОРЧ" };
const ROLE_COLOR = { admin: "#ff4f7b", user: "#00f2fe", pc: "#a78bfa" };

function UserAvatar({ name, size = 32 }) {
  const initials = (name || "?").slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #00f2fe 0%, #a78bfa 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, fontWeight: 700, color: "#07070a",
        flexShrink: 0,
        boxShadow: "0 0 10px rgba(0,242,254,0.35)",
      }}
    >
      {initials}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSED_KEY) === "true"; } catch { return false; }
  });
  const location = useLocation();

  const toggle = () => {
    setCollapsed(v => {
      try { localStorage.setItem(COLLAPSED_KEY, String(!v)); } catch {}
      return !v;
    });
  };

  const visibleNavItems = navItems.filter(item => {
    if (item.roles) return item.roles.includes(user?.role);
    return true;
  });

  const handleLogout = async () => {
    await logout();
    window.location.assign("/login");
  };

  const sidebarBg = {
    background: "linear-gradient(180deg, #0a0a12 0%, #07070e 100%)",
    borderRight: "1px solid rgba(0,242,254,0.10)",
    boxShadow: "4px 0 24px rgba(0,0,0,0.6)",
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 232 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col select-none overflow-hidden"
      style={sidebarBg}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center h-14 px-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,242,254,0.08)" }}
      >
        <div
          style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "rgba(0,242,254,0.08)",
            border: "1px solid rgba(0,242,254,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 10px rgba(0,242,254,0.2)",
          }}
        >
          <Zap style={{ width: 15, height: 15, color: "#00f2fe" }} strokeWidth={2.5} />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="ml-2.5 overflow-hidden whitespace-nowrap"
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#00f2fe", letterSpacing: "0.1em", textShadow: "0 0 12px rgba(0,242,254,0.6)" }}>
                NEXUS SERVER
              </div>
              <div style={{ fontSize: 9, color: "rgba(0,242,254,0.45)", letterSpacing: "0.15em", fontWeight: 600, marginTop: 1 }}>
                GAMING CENTER
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── User Card ── */}
      <AnimatePresence initial={false}>
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              overflow: "hidden",
              margin: "8px 10px 4px",
              padding: "10px 12px",
              background: "rgba(0,242,254,0.04)",
              border: "1px solid rgba(0,242,254,0.1)",
              borderRadius: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <UserAvatar name={user.username || user.name || user.email} size={34} />
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.username || user.name || user.email}
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                  color: ROLE_COLOR[user.role] || "#00f2fe",
                  marginTop: 2,
                }}>
                  {ROLE_LABEL[user.role] || user.role?.toUpperCase()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav ── */}
      <nav className="flex-1 py-1 px-1.5 space-y-0.5 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="block">
              <div
                style={{
                  position: "relative",
                  display: "flex", alignItems: "center",
                  height: 38, borderRadius: 8,
                  padding: "0 10px", gap: 10,
                  transition: "background 0.15s, color 0.15s",
                  background: isActive ? `rgba(${hexToRgb(item.color)}, 0.1)` : "transparent",
                  color: isActive ? item.color : "rgba(148,163,184,0.85)",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Active bar */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                      width: 3, height: 22, borderRadius: "0 3px 3px 0",
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}

                <item.icon
                  style={{ width: 17, height: 17, flexShrink: 0, color: isActive ? item.color : undefined }}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.14 }}
                      style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap", lineHeight: 1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div
        className="pb-2 px-1.5 space-y-0.5 shrink-0"
        style={{ borderTop: "1px solid rgba(0,242,254,0.07)" }}
      >
        <div style={{ height: 6 }} />
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center",
            height: 36, width: "100%", borderRadius: 8,
            padding: "0 10px", gap: 10, border: "none",
            background: "transparent", cursor: "pointer",
            color: "rgba(148,163,184,0.7)",
            fontSize: 13, fontWeight: 500,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(148,163,184,0.7)"; }}
        >
          <LogOut style={{ width: 17, height: 17, flexShrink: 0 }} strokeWidth={1.8} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                style={{ whiteSpace: "nowrap" }}
              >
                Гарах
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={toggle}
          title={collapsed ? "Дэлгэх" : "Хаах"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 30, width: "100%", borderRadius: 8,
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(100,116,139,0.7)",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(100,116,139,0.7)"; }}
        >
          <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.22 }}>
            <ChevronRight style={{ width: 13, height: 13 }} />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}

// Helper: "#00f2fe" -> "0,242,254"
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
