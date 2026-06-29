import React, { useState, useMemo } from "react";
import PageShell from "./PageShell";
import { entities, listSchemas } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, ChefHat, Receipt, Database, Search, Wallet, CircleDot,
  ChevronRight, RefreshCw, Trophy, Gamepad2, Monitor, Package,
  Plus, Trash2, Edit3, CheckCircle, X, Star, Shield, Zap,
  TrendingUp, Clock, UserCheck
} from "lucide-react";

const TABS = [
  { id: "customers",    label: "Хэрэглэгчид",   icon: Users        },
  { id: "kitchen",      label: "Захиалгын Дараалал", icon: ChefHat  },
  { id: "tournaments",  label: "Тэмцээнүүд",    icon: Trophy       },
  { id: "games",        label: "Тоглоомнууд",   icon: Gamepad2     },
  { id: "pcs",          label: "PC Удирдлага",   icon: Monitor      },
  { id: "products",     label: "Бараа/Меню",     icon: Package      },
  { id: "ledger",       label: "Гүйлгээ",        icon: Receipt      },
  { id: "system",       label: "Систем",          icon: Database     },
];

const ORDER_ACTIONS = {
  pending:   { next: "preparing", nextLabel: "Бэлтгэж эхлэх",  nextColor: "text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"     },
  preparing: { next: "ready",     nextLabel: "Бэлэн болсон",    nextColor: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10" },
  ready:     { next: "delivered", nextLabel: "Хүргэсэн",        nextColor: "text-purple-400 border-purple-500/30 hover:bg-purple-500/10"   },
  delivered: { next: null,        nextLabel: null,               nextColor: ""             },
  cancelled: { next: null,        nextLabel: null,               nextColor: ""             },
};

const STATUS_COLORS = {
  pending:   "text-amber-400 bg-amber-500/10 border-amber-500/20",
  preparing: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  ready:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  delivered: "text-muted-foreground bg-muted/30 border-border",
  cancelled: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const TXN_TYPE_COLOR = {
  top_up:     "text-emerald-400",
  session:    "text-rose-400",
  food_order: "text-amber-400",
  tournament: "text-purple-400",
  reward:     "text-cyan-400",
};

const PC_STATUS_COLORS = {
  available:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  occupied:    "text-rose-400 bg-rose-500/10 border-rose-500/20",
  maintenance: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  reserved:    "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const PC_STATUS_LABELS = {
  available:   "НЭЭЛТТЭЙ",
  occupied:    "ИДЭВХТЭЙ",
  maintenance: "ЗАСВАРТАЙ",
  reserved:    "ЗАХИАЛСАН",
};

const TOUR_STATUS_COLORS = {
  upcoming:  "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  active:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  completed: "text-muted-foreground bg-muted/20 border-border/40",
};
const TOUR_STATUS_LABELS = { upcoming: "Удахгүй", active: "Явагдаж байна", completed: "Дууссан" };

export default function Admin() {
  const [activeTab, setActiveTab] = useState("customers");

  // Data
  const profiles     = useEntityList(() => entities.userProfile.list());
  const orders       = useEntityList(() => entities.foodOrder.list());
  const transactions = useEntityList(() => entities.transaction.list());
  const schemas      = useEntityList(listSchemas);
  const tournaments  = useEntityList(() => entities.tournament.list());
  const games        = useEntityList(() => entities.game.list());
  const pcs          = useEntityList(() => entities.pc.list());
  const products     = useEntityList(() => entities.product.list());

  // Customer state
  const [search,       setSearch]       = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [topUpAmt,     setTopUpAmt]     = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);

  // Edit modal state
  const [editItem, setEditItem]   = useState(null);
  const [editData, setEditData]   = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const filteredProfiles = useMemo(() => {
    if (!profiles.data) return [];
    const q = search.toLowerCase();
    return profiles.data.filter(p =>
      p.username?.toLowerCase().includes(q) || p.user_id?.toLowerCase().includes(q)
    );
  }, [profiles.data, search]);

  // Customer top-up
  const handleTopUp = async () => {
    const amt = parseFloat(topUpAmt);
    if (!amt || amt <= 0 || !selectedUser) return;
    setTopUpLoading(true);
    try {
      const newBalance = (selectedUser.balance || 0) + amt;
      await entities.userProfile.update(selectedUser.id, { balance: newBalance });
      await entities.transaction.create({
        user_id: selectedUser.user_id || selectedUser.id,
        type: "top_up",
        amount: amt,
        description: `Ажилтан нөхлөө хийсэн`,
        balance_after: newBalance
      });
      setTopUpAmt("");
      setSelectedUser({ ...selectedUser, balance: newBalance });
      profiles.refresh();
      transactions.refresh();
    } catch (err) {
      alert("Нөхлөө хийхэд алдаа гарлаа: " + err.message);
    } finally {
      setTopUpLoading(false);
    }
  };

  // Kitchen order status advance
  const advanceOrder = async (order) => {
    const action = ORDER_ACTIONS[order.status];
    if (!action?.next) return;
    try {
      await entities.foodOrder.update(order.id, { status: action.next });
      orders.refresh();
    } catch (err) {
      alert("Захиалга шинэчлэхэд алдаа: " + err.message);
    }
  };

  const cancelOrder = async (order) => {
    if (!confirm("Захиалгыг цуцлах уу?")) return;
    try {
      await entities.foodOrder.update(order.id, { status: "cancelled" });
      orders.refresh();
    } catch (err) {
      alert("Цуцлахад алдаа: " + err.message);
    }
  };

  const sortedOrders = useMemo(() => {
    if (!orders.data) return [];
    const priority = { pending: 0, preparing: 1, ready: 2, delivered: 3, cancelled: 4 };
    return [...orders.data].sort((a, b) => (priority[a.status] ?? 5) - (priority[b.status] ?? 5));
  }, [orders.data]);

  // Generic edit handler
  const openEdit = (entity, item) => {
    setEditItem({ entity, item });
    setEditData({ ...item });
  };

  const saveEdit = async () => {
    if (!editItem) return;
    setEditLoading(true);
    try {
      const { entity: ent, item } = editItem;
      await ent.update(item.id, editData);
      setEditItem(null);
      // refresh relevant list
      [profiles, orders, tournaments, games, pcs, products].forEach(l => l.refresh?.());
    } catch (err) {
      alert("Хадгалахад алдаа: " + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const deleteItem = async (ent, id, refreshFn) => {
    if (!confirm("Устгах уу?")) return;
    try {
      await ent.delete(id);
      refreshFn();
    } catch (err) {
      alert("Устгахад алдаа: " + err.message);
    }
  };

  return (
    <PageShell title="АДМИН КОНСОЛ" subtitle="Бүх хэсгийг удирдах хяналтын самбар">

      {/* Tab Navigation */}
      <div className="flex border-b border-border/60 mb-6 gap-0.5 overflow-x-auto pb-0">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-3 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.id ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* ===== CUSTOMERS ===== */}
      {activeTab === "customers" && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Хэрэглэгч хайх..."
                className="w-full bg-card border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-foreground focus:outline-none transition-colors"
              />
            </div>
            {profiles.isLoading ? (
              <div className="py-16 flex justify-center"><div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredProfiles.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-border/60 rounded-2xl">
                <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-bold text-muted-foreground uppercase">Хэрэглэгч олдсонгүй</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProfiles.map(p => {
                  const isSelected = selectedUser?.id === p.id;
                  return (
                    <div key={p.id} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all cyber-hud-card ${isSelected ? "border-cyan-500/50 bg-cyan-500/5" : ""}`}>
                      <button className="flex items-center gap-4 flex-1 text-left" onClick={() => setSelectedUser(isSelected ? null : p)}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-black text-purple-300">{p.username?.[0]?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground">{p.username}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">{p.rank || "Bronze"}</span>
                            {p.session_active && <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5"><CircleDot className="w-2.5 h-2.5 animate-pulse" /> ОНЛАЙН</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black font-mono text-cyan-400">₮{(p.balance || 0).toLocaleString()}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{(p.points || 0).toLocaleString()} pts</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`} />
                      </button>
                      <button onClick={() => openEdit(entities.userProfile, p)} className="p-2 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            {selectedUser ? (
              <div className="cyber-hud-card rounded-2xl p-5 space-y-5 sticky top-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
                    <span className="text-base font-black text-purple-300">{selectedUser.username?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{selectedUser.username}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{selectedUser.rank} • {(selectedUser.total_hours || 0).toFixed(1)}ц нийт</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background/40 border border-border/60 rounded-xl p-3">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Үлдэгдэл</p>
                    <p className="font-black text-base font-mono text-cyan-400">₮{(selectedUser.balance || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-background/40 border border-border/60 rounded-xl p-3">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Оноо</p>
                    <p className="font-black text-base font-mono text-yellow-400">{(selectedUser.points || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground font-mono mb-2 flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> Данс нөхөх
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {[5000, 10000, 20000, 50000].map(preset => (
                      <button key={preset} onClick={() => setTopUpAmt(String(preset))} className={`py-1.5 text-[10px] font-black font-mono border rounded-xl transition-all ${topUpAmt === String(preset) ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-border/80 text-muted-foreground hover:text-foreground"}`}>
                        ₮{preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleTopUp(); }} className="flex gap-2">
                    <input type="number" value={topUpAmt} onChange={e => setTopUpAmt(e.target.value)} placeholder="Дүн (₮)" className="flex-1 bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors" />
                    <button type="submit" disabled={topUpLoading || !topUpAmt} className="px-4 border border-cyan-500 bg-cyan-500/10 text-cyan-400 text-xs font-black rounded-xl hover:bg-cyan-500/20 transition-all disabled:opacity-40">
                      {topUpLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Нэмэх"}
                    </button>
                  </form>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Цуцлах</button>
              </div>
            ) : (
              <div className="py-16 border border-dashed border-border/60 rounded-2xl text-center">
                <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground font-mono uppercase">Хэрэглэгч сонгоно уу</p>
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
              Идэвхтэй захиалга: {orders.data?.filter(o => o.status === "pending" || o.status === "preparing").length || 0}
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
                const isActive = order.status !== "delivered" && order.status !== "cancelled";
                return (
                  <div key={order.id} className={`cyber-hud-card rounded-2xl p-4 flex flex-col gap-3 transition-all ${isActive ? "" : "opacity-60"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground font-mono uppercase">#{order.id?.slice(0, 8)}</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">{order.user_name || "Зочин"}</p>
                        {order.pc_number && <p className="text-[9px] text-muted-foreground font-mono">PC #{order.pc_number}</p>}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${STATUS_COLORS[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      {Array.isArray(order.items) ? order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-[11px] text-foreground font-mono">{item.quantity}× {item.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">₮{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      )) : <p className="text-[10px] text-muted-foreground font-mono italic">—</p>}
                      {order.notes && <p className="text-[9px] text-amber-400 font-mono mt-1 border-t border-border/40 pt-1">Тэмдэглэл: {order.notes}</p>}
                    </div>
                    <div className="border-t border-border/40 pt-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-black font-mono text-cyan-400">₮{order.total?.toLocaleString()}</span>
                      {isActive && (
                        <div className="flex gap-1.5">
                          {action?.next && (
                            <button onClick={() => advanceOrder(order)} className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 border rounded-lg transition-all ${action.nextColor}`}>
                              {action.nextLabel}
                            </button>
                          )}
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <button onClick={() => cancelOrder(order)} className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all">
                              Цуцлах
                            </button>
                          )}
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

      {/* ===== TOURNAMENTS ===== */}
      {activeTab === "tournaments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
              Нийт: {tournaments.data?.length || 0} тэмцээн
            </p>
            <button onClick={tournaments.refresh} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Шинэчлэх
            </button>
          </div>
          {tournaments.isLoading ? (
            <div className="py-16 flex justify-center"><div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(tournaments.data || []).map(t => (
                <div key={t.id} className="cyber-hud-card rounded-2xl overflow-hidden transition-all">
                  {t.image_url && <img src={t.image_url} alt={t.title} className="w-full h-28 object-cover opacity-70" />}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-foreground truncate">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{t.game}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border flex-shrink-0 ${TOUR_STATUS_COLORS[t.status] || ""}`}>
                        {TOUR_STATUS_LABELS[t.status] || t.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">{t.current_participants}/{t.max_participants} тоглогч</span>
                      <span className="text-amber-400 font-black">{t.prize_pool}</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (t.current_participants / t.max_participants) * 100)}%` }} />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => openEdit(entities.tournament, t)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-border/60 rounded-xl text-[10px] font-black uppercase text-muted-foreground hover:text-foreground hover:border-border transition-all">
                        <Edit3 className="w-3 h-3" /> Засах
                      </button>
                      <button onClick={() => deleteItem(entities.tournament, t.id, tournaments.refresh)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase text-rose-400 hover:bg-rose-500/10 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== GAMES ===== */}
      {activeTab === "games" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">{games.data?.length || 0} тоглоом</p>
            <button onClick={games.refresh} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Шинэчлэх
            </button>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {(games.data || []).map(g => (
              <div key={g.id} className="cyber-hud-card rounded-2xl overflow-hidden transition-all flex">
                {g.image_url && <img src={g.image_url} alt={g.title} className="w-20 h-full object-cover opacity-80 flex-shrink-0" />}
                <div className="p-3 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-xs font-black text-foreground truncate">{g.title}</p>
                    {g.is_featured && <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase mb-2">{g.category}</p>
                  <div className="h-1 rounded-full bg-muted/30 mb-2 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${g.popularity || 0}%` }} />
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(entities.game, g)} className="flex-1 flex items-center justify-center gap-1 py-1 border border-border/60 rounded-lg text-[9px] font-black uppercase text-muted-foreground hover:text-foreground transition-all">
                      <Edit3 className="w-2.5 h-2.5" /> Засах
                    </button>
                    <button onClick={() => deleteItem(entities.game, g.id, games.refresh)} className="flex items-center justify-center px-2 py-1 border border-rose-500/20 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PCS ===== */}
      {activeTab === "pcs" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3 mb-2">
            {["available","occupied","maintenance","reserved"].map(s => (
              <div key={s} className={`border rounded-xl p-3 text-center ${PC_STATUS_COLORS[s]}`}>
                <p className="text-lg font-black font-mono">{pcs.data?.filter(p => p.status === s).length || 0}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider">{PC_STATUS_LABELS[s]}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {(pcs.data || []).map(pc => (
              <div key={pc.id} className="cyber-hud-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-black text-foreground">{pc.device_type === "notebook" ? "LAPTOP" : "PC"}-{String(pc.pc_number).padStart(2,"0")}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${PC_STATUS_COLORS[pc.status] || ""}`}>
                    {PC_STATUS_LABELS[pc.status] || pc.status}
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground font-mono mb-1">{pc.zone} зоны</p>
                <p className="text-[9px] text-muted-foreground font-mono mb-3 truncate">{pc.specs}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(entities.pc, pc)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-border/60 rounded-xl text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-all">
                    <Edit3 className="w-3 h-3" /> Засах
                  </button>
                  {pc.status === "maintenance" ? (
                    <button onClick={async () => { await entities.pc.update(pc.id, { status: "available" }); pcs.refresh(); }} className="px-3 py-1.5 border border-emerald-500/30 rounded-xl text-[10px] font-black text-emerald-400 hover:bg-emerald-500/10 transition-all">
                      <CheckCircle className="w-3 h-3" />
                    </button>
                  ) : (
                    <button onClick={async () => { await entities.pc.update(pc.id, { status: "maintenance" }); pcs.refresh(); }} className="px-3 py-1.5 border border-amber-500/20 rounded-xl text-[10px] font-black text-amber-400 hover:bg-amber-500/10 transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PRODUCTS ===== */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">{products.data?.length || 0} бараа</p>
            <button onClick={products.refresh} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Шинэчлэх
            </button>
          </div>
          <div className="cyber-hud-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60">
                  {["Зураг", "Нэр", "Ангилал", "Үнэ", "Төлөв", "Үйлдэл"].map(h => (
                    <th key={h} className="text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(products.data || []).map((p, i) => (
                  <tr key={p.id} className={`border-b border-border/30 hover:bg-background/40 transition-colors ${i % 2 === 0 ? "" : "bg-background/20"}`}>
                    <td className="px-4 py-2">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-muted/40" />}
                    </td>
                    <td className="px-4 py-2 text-xs font-bold text-foreground">{p.name}</td>
                    <td className="px-4 py-2 text-[10px] text-muted-foreground font-mono uppercase">{p.category}</td>
                    <td className="px-4 py-2 text-xs font-black font-mono text-cyan-400">₮{p.price?.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${p.available !== false ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"}`}>
                        {p.available !== false ? "Байна" : "Байхгүй"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(entities.product, p)} className="p-1.5 border border-border/60 rounded-lg text-muted-foreground hover:text-foreground transition-all">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button onClick={() => deleteItem(entities.product, p.id, products.refresh)} className="p-1.5 border border-rose-500/20 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== LEDGER ===== */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">{transactions.data?.length || 0} бичлэг</p>
            <button onClick={transactions.refresh} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Шинэчлэх
            </button>
          </div>
          {!transactions.data?.length ? (
            <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl">
              <Receipt className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-bold text-muted-foreground uppercase">Гүйлгээ байхгүй</p>
            </div>
          ) : (
            <div className="bg-card border border-border/80 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60">
                    {["Хэрэглэгч", "Төрөл", "Дүн", "Үлдэгдэл", "Тайлбар"].map(h => (
                      <th key={h} className="text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.data.slice(0, 50).map((txn, i) => {
                    const isCredit = txn.type === "top_up" || txn.type === "reward";
                    return (
                      <tr key={txn.id} className={`border-b border-border/30 hover:bg-background/40 transition-colors ${i % 2 === 0 ? "" : "bg-background/20"}`}>
                        <td className="px-4 py-2.5 text-[10px] font-mono text-muted-foreground max-w-[100px] truncate">{txn.user_id?.slice(0, 10)}…</td>
                        <td className="px-4 py-2.5"><span className={`text-[9px] font-black uppercase tracking-wider ${TXN_TYPE_COLOR[txn.type] || "text-foreground"}`}>{txn.type?.replace("_", " ")}</span></td>
                        <td className={`px-4 py-2.5 text-xs font-black font-mono ${isCredit ? "text-emerald-400" : "text-rose-400"}`}>{isCredit ? "+" : "−"}₮{Math.abs(txn.amount).toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{txn.balance_after != null ? `₮${txn.balance_after.toLocaleString()}` : "—"}</td>
                        <td className="px-4 py-2.5 text-[10px] text-muted-foreground font-mono max-w-[160px] truncate">{txn.description || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== SYSTEM ===== */}
      {activeTab === "system" && (
        <div>
          {schemas.isLoading ? (
            <div className="py-16 flex justify-center"><div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {schemas.data.map(schema => (
                <div key={schema.collection} className="bg-card rounded-xl border border-border/80 p-4 hover:border-border transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-sm font-bold text-foreground">{schema.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">/{schema.collection}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg font-mono font-bold uppercase">REST</span>
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground font-mono">Шаардлагатай: {(schema.required || []).join(", ") || "байхгүй"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setEditItem(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-cyan-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-black text-sm text-foreground uppercase tracking-wider">Засах</h3>
                <button onClick={() => setEditItem(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {Object.entries(editData).filter(([k]) => !["id","company_id","created_at","updated_at"].includes(k)).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground font-mono">{key.replace(/_/g," ")}</label>
                    {typeof val === "boolean" ? (
                      <button onClick={() => setEditData(d => ({ ...d, [key]: !d[key] }))}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${editData[key] ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-border/60 text-muted-foreground"}`}>
                        {editData[key] ? <CheckCircle className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {editData[key] ? "Тийм" : "Үгүй"}
                      </button>
                    ) : (
                      <input
                        value={editData[key] ?? ""}
                        onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                        className="w-full h-9 bg-background border border-border/60 rounded-xl px-3 text-xs font-mono text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setEditItem(null)} className="flex-1 py-2 border border-border/60 rounded-xl text-xs font-black uppercase text-muted-foreground hover:text-foreground transition-all">Цуцлах</button>
                <button onClick={saveEdit} disabled={editLoading} className="flex-1 py-2 bg-cyan-500/15 border border-cyan-500/40 rounded-xl text-xs font-black uppercase text-cyan-400 hover:bg-cyan-500/25 transition-all disabled:opacity-40">
                  {editLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Хадгалах"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
