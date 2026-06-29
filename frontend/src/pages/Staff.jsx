import React, { useState, useMemo } from "react";
import PageShell from "./PageShell";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import {
  ChefHat, Monitor, Clock, CheckCircle, X, RefreshCw,
  Flame, Users, CircleDot, Play, Square, AlertTriangle,
  ShoppingBag, UserCheck, Zap, TrendingUp
} from "lucide-react";

const ORDER_ACTIONS = {
  pending:   { next: "preparing", nextLabel: "Бэлтгэж эхлэх",  color: "text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10" },
  preparing: { next: "ready",     nextLabel: "Бэлэн болсон",    color: "text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10" },
  ready:     { next: "delivered", nextLabel: "Хүргэсэн",        color: "text-purple-400 border-purple-500/40 hover:bg-purple-500/10" },
  delivered: { next: null },
  cancelled: { next: null },
};

const ORDER_STATUS_STYLE = {
  pending:   "text-amber-400 bg-amber-500/10 border-amber-500/20",
  preparing: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  ready:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  delivered: "text-muted-foreground bg-muted/20 border-border/40",
  cancelled: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};
const ORDER_STATUS_MN = {
  pending:   "Хүлээгдэж буй",
  preparing: "Бэлтгэж байна",
  ready:     "Бэлэн",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

const PC_STATUS_STYLE = {
  available:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  occupied:    "text-rose-400 bg-rose-500/10 border-rose-500/20",
  maintenance: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  reserved:    "text-purple-400 bg-purple-500/10 border-purple-500/20",
};
const PC_STATUS_MN = {
  available: "Нээлттэй", occupied: "Идэвхтэй", maintenance: "Засвартай", reserved: "Захиалсан"
};

const TABS = [
  { id: "overview",  label: "Хяналт",       icon: TrendingUp },
  { id: "kitchen",   label: "Гал тогоо",     icon: ChefHat   },
  { id: "stations",  label: "Станцууд",      icon: Monitor   },
];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-background/60 border border-border/40 flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-black font-mono text-foreground">{value}</p>
        <p className="text-[9px] text-muted-foreground font-mono uppercase">{label}</p>
      </div>
    </div>
  );
}

export default function Staff() {
  const { user } = useAuth();
  const orders   = useEntityList(() => entities.foodOrder.list());
  const pcs      = useEntityList(() => entities.pc.list());
  const profiles = useEntityList(() => entities.userProfile.list());

  const [activeTab, setActiveTab] = useState("overview");

  // Stats
  const pendingOrders    = orders.data?.filter(o => o.status === "pending").length   || 0;
  const preparingOrders  = orders.data?.filter(o => o.status === "preparing").length || 0;
  const activeStations   = pcs.data?.filter(p => p.status === "occupied").length     || 0;
  const availableStation = pcs.data?.filter(p => p.status === "available").length    || 0;
  const onlineUsers      = profiles.data?.filter(p => p.session_active).length       || 0;

  const sortedOrders = useMemo(() => {
    if (!orders.data) return [];
    const priority = { pending: 0, preparing: 1, ready: 2, delivered: 3, cancelled: 4 };
    return [...orders.data].sort((a, b) => (priority[a.status] ?? 5) - (priority[b.status] ?? 5));
  }, [orders.data]);

  const activeOrders = sortedOrders.filter(o => !["delivered","cancelled"].includes(o.status));

  const advanceOrder = async (order) => {
    const action = ORDER_ACTIONS[order.status];
    if (!action?.next) return;
    try {
      await entities.foodOrder.update(order.id, { status: action.next });
      orders.refresh();
    } catch (err) {
      alert("Алдаа: " + err.message);
    }
  };

  const cancelOrder = async (order) => {
    if (!confirm("Захиалгыг цуцлах уу?")) return;
    try {
      await entities.foodOrder.update(order.id, { status: "cancelled" });
      orders.refresh();
    } catch (err) {
      alert("Алдаа: " + err.message);
    }
  };

  const setPcStatus = async (pc, status) => {
    try {
      await entities.pc.update(pc.id, { status });
      pcs.refresh();
    } catch (err) {
      alert("Алдаа: " + err.message);
    }
  };

  return (
    <PageShell title="АЖИЛТНЫ САМБАР" subtitle="Гал тогоо болон станцын хяналт">

      {/* Tabs */}
      <div className="flex border-b border-border/60 mb-6 gap-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="staffTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* ===== OVERVIEW ===== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={Flame}     label="Шинэ захиалга"    value={pendingOrders}   color="text-amber-400" />
            <StatCard icon={ChefHat}   label="Бэлтгэж байна"    value={preparingOrders} color="text-cyan-400" />
            <StatCard icon={Monitor}   label="Идэвхтэй станц"   value={activeStations}  color="text-rose-400" />
            <StatCard icon={CircleDot} label="Онлайн хэрэглэгч" value={onlineUsers}     color="text-emerald-400" />
          </div>

          {/* Quick active orders */}
          <div>
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Идэвхтэй захиалгууд
            </h3>
            {activeOrders.length === 0 ? (
              <div className="py-10 border border-dashed border-border/60 rounded-2xl text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400/40 mb-2" />
                <p className="text-xs text-muted-foreground font-mono uppercase">Бүх захиалга гүйцэтгэгдсэн</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {activeOrders.slice(0, 6).map(order => {
                  const action = ORDER_ACTIONS[order.status];
                  return (
                    <div key={order.id} className="bg-card border border-border/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground font-mono">#{order.id?.slice(0, 8)}</p>
                          <p className="text-xs font-bold text-foreground">{order.user_name || "Зочин"}</p>
                          {order.pc_number && <p className="text-[9px] text-cyan-400 font-mono">PC #{order.pc_number}</p>}
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${ORDER_STATUS_STYLE[order.status]}`}>
                          {ORDER_STATUS_MN[order.status]}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {Array.isArray(order.items) && order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-[10px] font-mono">
                            <span className="text-foreground">{item.quantity}× {item.name}</span>
                            <span className="text-muted-foreground">₮{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1.5 pt-1 border-t border-border/40">
                        {action?.next && (
                          <button onClick={() => advanceOrder(order)} className={`flex-1 py-1.5 border rounded-xl text-[10px] font-black uppercase transition-all ${action.color}`}>
                            {action.nextLabel}
                          </button>
                        )}
                        <button onClick={() => cancelOrder(order)} className="px-2.5 py-1.5 border border-rose-500/20 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== KITCHEN ===== */}
      {activeTab === "kitchen" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
              Нийт: {orders.data?.length || 0} захиалга
            </p>
            <button onClick={orders.refresh} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Шинэчлэх
            </button>
          </div>
          {orders.isLoading ? (
            <div className="py-16 flex justify-center"><div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : sortedOrders.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl">
              <ChefHat className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-bold text-muted-foreground uppercase">Захиалга байхгүй</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedOrders.map(order => {
                const action = ORDER_ACTIONS[order.status];
                const isActive = !["delivered","cancelled"].includes(order.status);
                return (
                  <div key={order.id} className={`bg-card border rounded-2xl p-4 flex flex-col gap-3 transition-all ${isActive ? "border-border" : "border-border/40 opacity-55"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground font-mono">#{order.id?.slice(0,8)}</p>
                        <p className="text-xs font-bold text-foreground">{order.user_name || "Зочин"}</p>
                        {order.pc_number && <p className="text-[9px] text-cyan-400 font-mono">PC #{order.pc_number}</p>}
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${ORDER_STATUS_STYLE[order.status]}`}>
                        {ORDER_STATUS_MN[order.status]}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      {Array.isArray(order.items) ? order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[10px] font-mono">
                          <span className="text-foreground">{item.quantity}× {item.name}</span>
                          <span className="text-muted-foreground">₮{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      )) : null}
                      {order.notes && <p className="text-[9px] text-amber-400 font-mono mt-1 border-t border-border/40 pt-1">Тэмдэглэл: {order.notes}</p>}
                    </div>
                    <div className="border-t border-border/40 pt-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-black font-mono text-cyan-400">₮{order.total?.toLocaleString()}</span>
                      {isActive && (
                        <div className="flex gap-1.5">
                          {action?.next && (
                            <button onClick={() => advanceOrder(order)} className={`text-[9px] font-black uppercase px-2.5 py-1 border rounded-lg transition-all ${action.color}`}>
                              {action.nextLabel}
                            </button>
                          )}
                          <button onClick={() => cancelOrder(order)} className="text-[9px] font-black uppercase px-2.5 py-1 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all">Цуцлах</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== STATIONS ===== */}
      {activeTab === "stations" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3 mb-2">
            {[["available","Нээлттэй","text-emerald-400"],["occupied","Идэвхтэй","text-rose-400"],["maintenance","Засвартай","text-amber-400"],["reserved","Захиалсан","text-purple-400"]].map(([s,lbl,c]) => (
              <div key={s} className="bg-card border border-border/60 rounded-xl p-3 text-center">
                <p className={`text-xl font-black font-mono ${c}`}>{pcs.data?.filter(p => p.status === s).length || 0}</p>
                <p className="text-[9px] text-muted-foreground font-mono uppercase">{lbl}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={pcs.refresh} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Шинэчлэх
            </button>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {(pcs.data || []).map(pc => (
              <div key={pc.id} className="bg-card border border-border/80 rounded-xl p-4 hover:border-border transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className={`w-4 h-4 ${pc.device_type === "notebook" ? "text-pink-400" : "text-cyan-400"}`} />
                    <p className="text-sm font-black text-foreground">
                      {pc.device_type === "notebook" ? "LAPTOP" : "PC"}-{String(pc.pc_number).padStart(2,"0")}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${PC_STATUS_STYLE[pc.status]}`}>
                    {PC_STATUS_MN[pc.status] || pc.status}
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground font-mono mb-3 truncate">{pc.specs}</p>
                <div className="flex gap-2">
                  {pc.status === "maintenance" ? (
                    <button onClick={() => setPcStatus(pc, "available")} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-emerald-500/30 rounded-xl text-[10px] font-black text-emerald-400 hover:bg-emerald-500/10 transition-all">
                      <CheckCircle className="w-3 h-3" /> Нэвтрүүлэх
                    </button>
                  ) : pc.status !== "occupied" ? (
                    <button onClick={() => setPcStatus(pc, "maintenance")} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-amber-500/20 rounded-xl text-[10px] font-black text-amber-400 hover:bg-amber-500/10 transition-all">
                      <AlertTriangle className="w-3 h-3" /> Засварт
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center gap-1.5 py-1.5 justify-center text-[10px] font-mono text-muted-foreground">
                      <CircleDot className="w-3 h-3 text-rose-400 animate-pulse" /> Хэрэглэгч тоглож байна
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
