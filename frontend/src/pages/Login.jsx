import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Zap, Shield, User, Monitor, ChevronRight, Lock } from "lucide-react";

const ROLES = [
  { value: "admin",  label: "Админ",       desc: "Бүрэн эрхтэй",     icon: Shield,  color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30" },
  { value: "user",   label: "Хэрэглэгч",   desc: "Гишүүн эрх",       icon: User,    color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/30" },
  { value: "pc",     label: "PC Терминал", desc: "Тоглоомын станц",   icon: Monitor, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
];

export default function Login() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const [form, setForm] = useState({
    userId: "admin-1",
    userName: "Admin User",
    role: "admin",
    companyId: "demo-company",
    companyName: "Demo Company",
    pcNumber: "1",
  });
  const [loading, setLoading] = useState(false);

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    await loginAs(form);
    navigate("/dashboard", { replace: true });
  };

  const selectedRole = ROLES.find(r => r.value === form.role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-foreground">
            NEXUS <span className="text-cyan-400">ARENA</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">Системд нэвтрэх</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl">
          <form onSubmit={submit} className="space-y-5">

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">
                Эрхийн төрөл
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => {
                  const Icon = role.icon;
                  const active = form.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role: role.value }))}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        active
                          ? `${role.bg} ${role.border} ${role.color}`
                          : "border-border/60 text-muted-foreground hover:border-border"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-wider">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Компани ID
                </label>
                <input
                  name="companyId"
                  value={form.companyId}
                  onChange={update}
                  className="h-10 w-full rounded-xl border border-border/60 bg-background/60 px-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Компани нэр
                </label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={update}
                  className="h-10 w-full rounded-xl border border-border/60 bg-background/60 px-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            {/* User fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Хэрэглэгч ID
                </label>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={update}
                  className="h-10 w-full rounded-xl border border-border/60 bg-background/60 px-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Нэр
                </label>
                <input
                  name="userName"
                  value={form.userName}
                  onChange={update}
                  className="h-10 w-full rounded-xl border border-border/60 bg-background/60 px-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            {/* PC Number (only for pc role) */}
            {form.role === "pc" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  PC Дугаар
                </label>
                <input
                  name="pcNumber"
                  value={form.pcNumber}
                  onChange={update}
                  type="number"
                  min="1"
                  className="h-10 w-full rounded-xl border border-border/60 bg-background/60 px-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            )}

            {/* Selected role summary */}
            {selectedRole && (
              <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-mono ${selectedRole.bg} ${selectedRole.border}`}>
                <Lock className={`w-3.5 h-3.5 ${selectedRole.color}`} />
                <span className={selectedRole.color}>
                  {selectedRole.label} эрхээр нэвтрэх — {selectedRole.desc}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-black text-sm uppercase tracking-widest hover:bg-cyan-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  Нэвтрэх
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-mono">
          <Link to="/register" className="text-cyan-400/70 hover:text-cyan-400 transition-colors">
            Шинэ бүртгэл үүсгэх →
          </Link>
        </p>
      </div>
    </div>
  );
}
