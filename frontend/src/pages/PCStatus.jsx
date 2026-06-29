import React, { useState, useEffect } from "react";
import PageShell from "./PageShell";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, Laptop, Plus, Trash2, Cpu, Settings,
  CheckCircle, AlertTriangle, Clock, RefreshCw, X, ShieldAlert,
  Play, PowerOff, ShieldCheck, HelpCircle
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

// SeatingCard component handles independent ticking elapsed timers
function SeatingCard({ pc, onManage, onQuickStart }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (pc.status !== "occupied" || !pc.session_start) return;
    const start = new Date(pc.session_start).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [pc.status, pc.session_start]);

  const formatTime = (secs) => {
    if (secs < 0) secs = 0;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isNotebook = (pc.device_type || "pc") === "notebook";

  // Card Borders & Shadows depending on status
  let cardBorder = "border-border/80 hover:border-cyan-500/40 bg-card/65";
  let statusBadge = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  let statusText = "НЭЭЛТТЭЙ";

  if (pc.status === "occupied") {
    cardBorder = "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]";
    statusBadge = "text-rose-400 border-rose-500/20 bg-rose-500/10";
    statusText = "ИДЭВХТЭЙ";
  } else if (pc.status === "maintenance") {
    cardBorder = "border-amber-500/20 bg-amber-500/5 opacity-60";
    statusBadge = "text-amber-500 border-amber-500/10 bg-amber-500/10";
    statusText = "ЗАСВАРТАЙ";
  } else if (pc.status === "reserved") {
    cardBorder = "border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]";
    statusBadge = "text-purple-400 border-purple-500/20 bg-purple-500/10";
    statusText = "ЗАХИАЛСАН";
  }

  return (
    <motion.div
      layout
      className={`flex flex-col border p-5 relative rounded-2xl overflow-hidden group transition-all duration-300 ${cardBorder}`}
    >
      {/* Top row: Name & Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-background/80 border border-border/40 text-muted-foreground`}>
            {isNotebook ? <Laptop className="w-4 h-4 text-pink-400" /> : <Monitor className="w-4 h-4 text-cyan-400" />}
          </div>
          <div>
            <h3 className="font-display font-black text-sm text-foreground tracking-wide">
              {isNotebook ? `LAPTOP-${String(pc.pc_number).padStart(2, "0")}` : `PC-${String(pc.pc_number).padStart(2, "0")}`}
            </h3>
            <span className="text-[9px] uppercase font-bold text-muted-foreground font-mono block">
              {pc.zone || "standard"} Grid
            </span>
          </div>
        </div>

        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg border font-mono ${statusBadge}`}>
          {statusText}
        </span>
      </div>

      {/* Center detail area */}
      <div className="flex-1 flex flex-col items-center justify-center py-3 text-center">
        {pc.status === "occupied" ? (
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Тоглогч</p>
            <p className="font-bold text-sm text-foreground">{pc.current_user_name || "Gamer Client"}</p>
            <p className="font-mono font-black text-2xl text-rose-400 tracking-widest mt-1.5 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]">
              {formatTime(elapsed)}
            </p>
          </div>
        ) : pc.status === "maintenance" ? (
          <div className="space-y-1 py-1">
            <AlertTriangle className="w-5 h-5 mx-auto text-amber-500" />
            <p className="font-mono font-black text-xs text-amber-500 uppercase tracking-widest">Maintenance Mode</p>
          </div>
        ) : pc.status === "reserved" ? (
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Захиалагч</p>
            <p className="font-bold text-sm text-foreground">CS2 Tournament User</p>
            <p className="font-mono font-bold text-xs text-purple-400 uppercase mt-1">Түр Хүлээгдэж буй</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Ашиглах боломжтой</p>
            <p className="font-mono font-black text-2xl text-muted-foreground/30 tracking-widest mt-1.5">
              --:--:--
            </p>
          </div>
        )}
      </div>

      {/* Specs / Rate */}
      <div className="border-t border-border/40 my-3.5 pt-3 flex justify-between items-center text-[10px] font-mono">
        <span className="text-muted-foreground uppercase">Нэг цагийн үнэ:</span>
        <span className="font-black text-cyan-400">₮{pc.hourly_rate ? (pc.hourly_rate * 1000).toLocaleString() : "4,000"}</span>
      </div>

      {/* Card action button */}
      <div className="mt-2.5">
        {pc.status === "occupied" || pc.status === "reserved" ? (
          <button
            onClick={() => onManage(pc)}
            className="w-full py-2 border border-cyan-500 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
          >
            УДИРДАХ
          </button>
        ) : pc.status === "maintenance" ? (
          <button
            disabled
            className="w-full py-2 border border-border bg-muted/40 text-muted-foreground text-[10px] font-black uppercase tracking-wider rounded-xl cursor-not-allowed"
          >
            ТҮГЖИГДСЭН
          </button>
        ) : (
          <button
            onClick={() => onQuickStart(pc)}
            className="w-full py-2 border border-border hover:border-cyan-500 bg-background hover:bg-cyan-500/10 text-muted-foreground hover:text-cyan-400 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
          >
            СЕСС ЭХЛЭХ
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function PCStatus() {
  const { user } = useAuth();
  const pcs = useEntityList(() => entities.pc.list());
  
  const [activeTab, setActiveTab] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null); // Side drawer target
  
  // New Node Form State
  const [formData, setFormData] = useState({
    pc_number: "",
    device_type: "pc",
    zone: "standard",
    specs: "",
    hourly_rate: "4.0",
    status: "available",
  });

  // User list for quick mock session start
  const profiles = useEntityList(() => entities.userProfile.list());

  const getNextNumber = () => {
    if (!pcs.data || pcs.data.length === 0) return 1;
    const nums = pcs.data.map(p => p.pc_number);
    return Math.max(...nums) + 1;
  };

  const handleOpenAddModal = () => {
    setFormData(prev => ({
      ...prev,
      pc_number: String(getNextNumber())
    }));
    setIsAddOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const num = parseInt(formData.pc_number, 10);
      if (isNaN(num)) {
        alert("Please enter a valid station number.");
        return;
      }
      
      if (pcs.data.some(p => p.pc_number === num)) {
        alert(`Station #${num} already exists!`);
        return;
      }

      await entities.pc.create({
        pc_number: num,
        device_type: formData.device_type,
        zone: formData.zone,
        status: formData.status,
        specs: formData.specs || "RTX 4070, 16GB RAM",
        hourly_rate: parseFloat(formData.hourly_rate) || 4.0,
        image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600"
      });

      pcs.refresh();
      setIsAddOpen(false);
    } catch (err) {
      alert("Error adding station: " + err.message);
    }
  };

  // Quick Start Elapsed Session Simulator
  const handleQuickStart = async (pc) => {
    const randomUser = profiles.data?.[Math.floor(Math.random() * (profiles.data?.length || 1))] || { username: "CS2_Gamer" };
    try {
      await entities.pc.update(pc.id, {
        status: "occupied",
        current_user_id: randomUser.user_id || "sim-user",
        session_start: new Date().toISOString()
      });
      // also create transaction log
      await entities.transaction.create({
        user_id: randomUser.user_id || "sim-user",
        type: "session",
        amount: -4000,
        description: `Started session on PC #${pc.pc_number}`,
      });
      pcs.refresh();
    } catch (err) {
      alert("Failed to start session: " + err.message);
    }
  };

  // Terminate Active Session
  const handleStopSession = async (pc) => {
    try {
      await entities.pc.update(pc.id, {
        status: "available",
        current_user_id: null,
        session_start: null
      });
      setSelectedPC(null);
      pcs.refresh();
    } catch (err) {
      alert("Failed to stop: " + err.message);
    }
  };

  // Decommission node
  const deleteStation = async (id, num) => {
    if (confirm(`Station #${num}-г системээс бүрмөсөн устгах уу?`)) {
      try {
        await entities.pc.delete(id);
        setSelectedPC(null);
        pcs.refresh();
      } catch (err) {
        alert("Failed to delete: " + err.message);
      }
    }
  };

  // Update hardware specs
  const handleSaveSpecs = async (pc, newSpecs) => {
    try {
      await entities.pc.update(pc.id, { specs: newSpecs });
      setSelectedPC(prev => ({ ...prev, specs: newSpecs }));
      pcs.refresh();
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  const filteredData = pcs.data?.filter(pc => {
    const type = pc.device_type || "pc";
    if (activeTab === "pcs") return type === "pc";
    if (activeTab === "notebooks") return type === "notebook";
    return true;
  }) || [];

  const totalCount = pcs.data?.length || 0;
  const occupiedCount = pcs.data?.filter(p => p.status === "occupied").length || 0;
  const availableCount = pcs.data?.filter(p => p.status === "available").length || 0;

  return (
    <PageShell title="Суудлын Хяналт" subtitle="Бүх компьютеруудын төлөв болон хэрэглэгчийн мэдээллийг бодит хугацаанд хянах">
      
      {/* Dynamic stats telemetry bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Нийт суудал</p>
            <p className="font-mono font-black text-xl text-foreground">{totalCount} Станц</p>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div>
            <p className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Идэвхтэй PC</p>
            <p className="font-mono font-black text-xl text-rose-400">{occupiedCount} ашиглаж буй</p>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div>
            <p className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Нээлттэй</p>
            <p className="font-mono font-black text-xl text-emerald-400">{availableCount} суллагдсан</p>
          </div>
        </div>

        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 border border-cyan-500 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center gap-1.5 hover:neon-glow-cyan"
        >
          <Plus className="w-4 h-4" /> Шинэ Сесс
        </button>
      </div>

      {/* Main Grid View */}
      <div className="space-y-5">
        {/* Tab Filters */}
        <div className="flex border-b border-border/60 gap-4 pb-0">
          {["all", "pcs", "notebooks"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all" && "Бүх Станцууд"}
              {tab === "pcs" && "Ширээний PC"}
              {tab === "notebooks" && "Нөүтбүүкнүүд"}
              {activeTab === tab && (
                <motion.div 
                  layoutId="stationsTabUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                />
              )}
            </button>
          ))}
        </div>

        {pcs.isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl">
            <ShieldAlert className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground font-mono uppercase">Жагсаалт хоосон байна</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredData.map(pc => (
              <SeatingCard 
                key={pc.id} 
                pc={pc} 
                onManage={setSelectedPC}
                onQuickStart={handleQuickStart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Sliding Panel Drawer / Modal */}
      <AnimatePresence>
        {selectedPC && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPC(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-card border-l border-border p-6 shadow-2xl z-10 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                  <h3 className="font-display font-black text-sm uppercase text-foreground">
                    Node Management Console
                  </h3>
                  <button 
                    onClick={() => setSelectedPC(null)}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* PC Info summary */}
                <div className="space-y-4">
                  <div className="p-4 bg-background/60 border border-border/80 rounded-xl flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="font-bold text-foreground">Station PC #{selectedPC.pc_number}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-mono">{selectedPC.zone} sector</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Hardware specs</label>
                    <textarea
                      value={selectedPC.specs || ""}
                      onChange={(e) => handleSaveSpecs(selectedPC, e.target.value)}
                      placeholder="e.g. RTX 4070, 16GB RAM"
                      className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-3 text-xs font-mono text-foreground focus:outline-none transition-colors h-20 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions panel at bottom */}
              <div className="space-y-2 pt-4 border-t border-border/40">
                {selectedPC.status === "occupied" && (
                  <button
                    onClick={() => handleStopSession(selectedPC)}
                    className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <PowerOff className="w-4 h-4" />
                    Сессийг дуусгах
                  </button>
                )}
                <button
                  onClick={() => deleteStation(selectedPC.id, selectedPC.pc_number)}
                  className="w-full py-3 bg-muted/40 hover:bg-rose-500/5 text-muted-foreground hover:text-rose-400 hover:border-rose-500/20 border border-border text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Системээс устгах
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cyberpunk Dialog Modal for Add Station */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-md bg-card border border-border p-6 shadow-xl z-10 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-black text-sm text-foreground uppercase tracking-wider">
                  Deploy Station Node
                </h3>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Node Number</label>
                    <input 
                      type="number"
                      required
                      value={formData.pc_number}
                      onChange={e => setFormData(p => ({ ...p, pc_number: e.target.value }))}
                      className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Device Type</label>
                    <select
                      value={formData.device_type}
                      onChange={e => setFormData(p => ({ ...p, device_type: e.target.value }))}
                      className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors"
                    >
                      <option value="pc">Desktop PC</option>
                      <option value="notebook">Gaming Laptop</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Zone Classification</label>
                    <select
                      value={formData.zone}
                      onChange={e => setFormData(p => ({ ...p, zone: e.target.value }))}
                      className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors"
                    >
                      <option value="standard">Standard Grid</option>
                      <option value="vip">VIP Sector</option>
                      <option value="tournament">Tournament Arena</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Hourly Rate (₮)</label>
                    <input 
                      type="number"
                      step="1.0"
                      required
                      value={formData.hourly_rate}
                      onChange={e => setFormData(p => ({ ...p, hourly_rate: e.target.value }))}
                      className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Hardware Specifications</label>
                  <textarea 
                    value={formData.specs}
                    onChange={e => setFormData(p => ({ ...p, specs: e.target.value }))}
                    placeholder="RTX 4070, AMD Ryzen 7, 32GB RAM"
                    className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors h-16 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 px-4 py-2 border border-border hover:bg-muted text-xs font-bold uppercase tracking-wider transition-colors rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 border border-cyan-500 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider hover:bg-cyan-500/20 transition-all duration-150 rounded-xl"
                  >
                    Deploy Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageShell>
  );
}
