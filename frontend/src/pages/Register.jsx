import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { entities } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Zap, User, Building2, Hash, CheckCircle,
  ChevronRight, ArrowLeft, Eye, EyeOff
} from "lucide-react";

const RANKS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

function InputField({ label, name, value, onChange, type = "text", placeholder, icon: Icon = null }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />}
        <input
          type={isPassword && show ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`h-10 w-full rounded-xl border border-border/60 bg-background/60 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-cyan-500/50 transition-colors ${Icon ? "pl-9 pr-4" : "px-3"} ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate  = useNavigate();
  const { loginAs } = useAuth();

  const [step, setStep]     = useState(1); // 1 = account info, 2 = cafe info, 3 = success
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    username:    "",
    userId:      "",
    password:    "",
    confirmPass: "",
    companyId:   "",
    companyName: "",
    role:        "user",
  });

  const update = e => {
    setError("");
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validateStep1 = () => {
    if (!form.username.trim())        return "Нэвтрэх нэр оруулна уу";
    if (form.username.length < 3)    return "Нэвтрэх нэр 3-аас дээш тэмдэгт байх ёстой";
    if (!form.password)              return "Нууц үг оруулна уу";
    if (form.password.length < 6)    return "Нууц үг 6-аас дээш тэмдэгт байх ёстой";
    if (form.password !== form.confirmPass) return "Нууц үг таарахгүй байна";
    return null;
  };

  const validateStep2 = () => {
    if (!form.companyId.trim())   return "Компани ID оруулна уу";
    if (!form.companyName.trim()) return "Компани нэр оруулна уу";
    return null;
  };

  const nextStep = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      // Generate a userId from username
      const userId = `${form.username.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;

      // Create a UserProfile entity
      await entities.userProfile.create({
        user_id:        userId,
        username:       form.username,
        role:           form.role,
        balance:        0,
        points:         0,
        rank:           "Bronze",
        total_hours:    0,
        session_active: false,
        avatar_url:     null,
      });

      // Log in as this new user
      await loginAs({
        userId,
        userName:    form.username,
        role:        form.role,
        companyId:   form.companyId,
        companyName: form.companyName,
      });

      setStep(3);
      setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
    } catch (err) {
      setError("Бүртгэл үүсгэхэд алдаа гарлаа: " + (err.message || "Буцаж ороод дахин оролдоно уу"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-4">
            <UserPlus className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-foreground">
            NEXUS <span className="text-purple-400">БҮРТГЭЛ</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">Шинэ бүртгэл үүсгэх</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border transition-all ${
                step > s
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : step === s
                  ? "bg-purple-500/15 border-purple-500/40 text-purple-400"
                  : "bg-muted/20 border-border/40 text-muted-foreground"
              }`}>
                {step > s ? <CheckCircle className="w-3.5 h-3.5" /> : s}
              </div>
              {s < 2 && <div className={`h-0.5 w-12 rounded-full transition-all ${step > s ? "bg-emerald-500/40" : "bg-border/40"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl">

          <AnimatePresence mode="wait">

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="font-display font-black text-lg text-foreground">Бүртгэл амжилттай!</p>
                  <p className="text-sm text-muted-foreground mt-1">Хяналтын самбар руу шилжиж байна...</p>
                </div>
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}

            {/* Step 1: Account */}
            {step === 1 && (
              <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={e => { e.preventDefault(); nextStep(); }} className="space-y-4"
              >
                <div className="mb-2">
                  <p className="text-xs font-black uppercase tracking-wider text-foreground">Хэрэглэгчийн мэдээлэл</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Нэвтрэх нэр болон нууц үгээ тохируулна уу</p>
                </div>

                <InputField label="Нэвтрэх нэр" name="username" value={form.username} onChange={update} placeholder="Жишээ: NexusGamer99" icon={User} />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Эрхийн төрөл</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "user", label: "Хэрэглэгч", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
                      { value: "admin", label: "Админ", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
                    ].map(r => (
                      <button key={r.value} type="button" onClick={() => { setError(""); setForm(f => ({ ...f, role: r.value })); }}
                        className={`py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${form.role === r.value ? r.color : "border-border/60 text-muted-foreground hover:border-border"}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <InputField label="Нууц үг" name="password" value={form.password} onChange={update} type="password" placeholder="6+ тэмдэгт" />
                <InputField label="Нууц үг давтах" name="confirmPass" value={form.confirmPass} onChange={update} type="password" placeholder="Дахин оруулна уу" />

                {error && <p className="text-xs text-rose-400 font-mono bg-rose-500/5 border border-rose-500/20 rounded-xl px-3 py-2">{error}</p>}

                <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-400 font-black text-sm uppercase tracking-widest hover:bg-purple-500/25 transition-all mt-2">
                  Үргэлжлүүлэх <ChevronRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {/* Step 2: Cafe info */}
            {step === 2 && (
              <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} className="space-y-4"
              >
                <div className="mb-2">
                  <p className="text-xs font-black uppercase tracking-wider text-foreground">Кафены мэдээлэл</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Өөрийн PC кафены мэдээллийг оруулна уу</p>
                </div>

                <InputField label="Компани ID" name="companyId" value={form.companyId} onChange={update} placeholder="Жишээ: my-cafe-2024" icon={Hash} />
                <InputField label="Кафены нэр" name="companyName" value={form.companyName} onChange={update} placeholder="Жишээ: Dragon PC Café" icon={Building2} />

                {/* Preview */}
                <div className="bg-background/40 border border-border/40 rounded-xl p-3 space-y-1 text-[10px] font-mono">
                  <p className="text-muted-foreground mb-1 font-black uppercase">Бүртгэлийн хураангуй</p>
                  <div className="flex justify-between"><span className="text-muted-foreground">Нэвтрэх нэр</span><span className="text-foreground">{form.username || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Эрх</span><span className="text-cyan-400">{form.role.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Кафе</span><span className="text-foreground">{form.companyName || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Компани ID</span><span className="text-purple-400">{form.companyId || "—"}</span></div>
                </div>

                {error && <p className="text-xs text-rose-400 font-mono bg-rose-500/5 border border-rose-500/20 rounded-xl px-3 py-2">{error}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setError(""); setStep(1); }}
                    className="flex h-11 items-center justify-center gap-1.5 px-4 rounded-xl border border-border/60 text-muted-foreground text-sm font-black uppercase hover:text-foreground transition-all">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-400 font-black text-sm uppercase tracking-widest hover:bg-purple-500/25 transition-all disabled:opacity-40">
                    {loading
                      ? <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      : <><Zap className="w-4 h-4" /> Бүртгэл үүсгэх</>
                    }
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-mono">
          Аль хэдийн бүртгэлтэй юу?{" "}
          <Link to="/login" className="text-cyan-400/70 hover:text-cyan-400 transition-colors">
            Нэвтрэх →
          </Link>
        </p>
      </div>
    </div>
  );
}
