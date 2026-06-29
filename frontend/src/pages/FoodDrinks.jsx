import React, { useState, useMemo } from "react";
import PageShell from "./PageShell";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Plus, Minus, X, Coffee, Pizza, Sandwich,
  Layers, Send, CheckCircle, Clock, ChefHat, PackageCheck, Ban
} from "lucide-react";

const CATEGORY_CONFIG = {
  drinks: { label: "Drinks",     icon: Coffee,   color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/30"   },
  snacks: { label: "Snacks",     icon: Sandwich, color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30"  },
  meals:  { label: "Hot Meals",  icon: Pizza,    color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/30"   },
  combo:  { label: "Combos",     icon: Layers,   color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
};

const ORDER_STATUS = {
  pending:   { label: "Pending",    icon: Clock,        color: "text-amber-400 bg-amber-500/10 border-amber-500/20"    },
  preparing: { label: "Preparing",  icon: ChefHat,      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"       },
  ready:     { label: "Ready!",     icon: PackageCheck, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  delivered: { label: "Delivered",  icon: CheckCircle,  color: "text-muted-foreground bg-muted/30 border-border"       },
  cancelled: { label: "Cancelled",  icon: Ban,          color: "text-rose-400 bg-rose-500/10 border-rose-500/20"       },
};

export default function FoodDrinks() {
  const { user } = useAuth();
  const products = useEntityList(() => entities.product.list());
  const myOrders = useEntityList(() => entities.foodOrder.list());

  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState({});               // { productId: { ...product, qty } }
  const [pcNumber, setPcNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Filter products by category
  const filtered = useMemo(() => {
    if (!products.data) return [];
    let list = products.data.filter(p => p.available !== false);
    if (activeCategory !== "all") list = list.filter(p => p.category === activeCategory);
    return list;
  }, [products.data, activeCategory]);

  const categories = useMemo(() => {
    if (!products.data) return [];
    return [...new Set(products.data.map(p => p.category))];
  }, [products.data]);

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: prev[product.id]
        ? { ...prev[product.id], qty: prev[product.id].qty + 1 }
        : { ...product, qty: 1 }
    }));
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const item = prev[id];
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...item, qty: newQty } };
    });
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      const items = cartItems.map(i => ({
        product_id: i.id,
        name: i.name,
        quantity: i.qty,
        price: i.price
      }));
      await entities.foodOrder.create({
        user_id: user?.id || "guest",
        user_name: user?.name || "Guest",
        items,
        total: cartTotal,
        status: "pending",
        pc_number: pcNumber ? parseInt(pcNumber) : undefined,
        notes: notes || undefined
      });
      setCart({});
      setPcNumber("");
      setNotes("");
      setCartOpen(false);
      setPlaced(true);
      setTimeout(() => setPlaced(false), 3000);
      myOrders.refresh();
    } catch (err) {
      alert("Order failed: " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <PageShell title="STORE" subtitle="Food & drinks delivered to your station">

      {/* Success banner */}
      <AnimatePresence>
        {placed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Order placed! Kitchen is preparing your items.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* === LEFT: PRODUCT MENU === */}
        <div className="lg:col-span-2 space-y-4">

          {/* Category Tabs + Cart button */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex border border-border/60 rounded-xl p-1 gap-1">
              {["all", ...categories].map(cat => {
                const cfg = CATEGORY_CONFIG[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                      activeCategory === cat
                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat === "all" ? "All" : cfg?.label || cat}
                  </button>
                );
              })}
            </div>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="ml-auto relative flex items-center gap-2 px-4 py-2 border border-border/80 hover:border-cyan-400/60 bg-card rounded-xl text-xs font-bold text-foreground transition-all"
            >
              <ShoppingCart className="w-4 h-4 text-cyan-400" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cyan-500 text-background rounded-full text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Product Grid */}
          {products.isLoading ? (
            <div className="py-16 flex justify-center">
              <div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center border border-dashed border-border/60 rounded-2xl">
              <p className="text-sm font-bold text-muted-foreground uppercase">No products found</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered.map(product => {
                const cfg = CATEGORY_CONFIG[product.category] || CATEGORY_CONFIG.drinks;
                const inCart = cart[product.id]?.qty || 0;
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 bg-card border border-border/80 hover:border-border rounded-xl p-4 transition-all group"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0`}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">{cfg.label}</p>
                      <p className="text-xs font-black text-cyan-400 font-mono mt-1">₮{product.price?.toLocaleString()}</p>
                    </div>

                    {/* Add/Qty control */}
                    <div className="flex-shrink-0">
                      {inCart === 0 ? (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => changeQty(product.id, -1)} className="w-7 h-7 rounded-lg bg-muted/60 text-foreground hover:bg-muted flex items-center justify-center">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-black font-mono text-cyan-400">{inCart}</span>
                          <button onClick={() => changeQty(product.id, 1)} className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* === RIGHT: MY ORDERS === */}
        <div className="space-y-3">
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> My Orders
          </h3>
          {myOrders.isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="w-5 h-5 border border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : myOrders.data?.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-border/60 rounded-xl">
              <p className="text-xs text-muted-foreground font-mono uppercase">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myOrders.data.slice(0, 8).map(order => {
                const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                const StIcon = st.icon;
                return (
                  <div key={order.id} className="bg-card border border-border/80 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-muted-foreground font-mono uppercase">Order #{order.id?.slice(0, 8)}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${st.color} flex items-center gap-1`}>
                        <StIcon className="w-2.5 h-2.5" />
                        {st.label}
                      </span>
                    </div>
                    {Array.isArray(order.items) && order.items.map((item, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground font-mono">
                        {item.quantity}× {item.name}
                      </p>
                    ))}
                    <div className="mt-2 pt-2 border-t border-border/40 flex justify-between">
                      <span className="text-[9px] text-muted-foreground font-mono">PC #{order.pc_number || "—"}</span>
                      <span className="text-[10px] font-black font-mono text-cyan-400">₮{order.total?.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* === CART SIDE DRAWER === */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-sm bg-card border-l border-border flex flex-col h-full z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/60">
                <h3 className="font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  Cart ({cartCount})
                </h3>
                <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-xs text-muted-foreground font-mono uppercase">Cart is empty</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-2.5 px-3 bg-background/40 border border-border/60 rounded-xl">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">₮{item.price?.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-muted/60 text-foreground hover:bg-muted flex items-center justify-center">
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-black font-mono">{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center">
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <p className="text-xs font-black font-mono text-cyan-400 w-14 text-right">₮{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <form onSubmit={(e) => { e.preventDefault(); placeOrder(); }} className="p-4 border-t border-border/60 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">PC / Station #</label>
                      <input
                        type="number"
                        value={pcNumber}
                        onChange={e => setPcNumber(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Notes</label>
                      <input
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="No ice..."
                        className="w-full bg-background border border-border hover:border-cyan-500/40 focus:border-cyan-400 rounded-xl p-2 text-xs font-mono text-foreground focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-mono uppercase">Total</span>
                    <span className="text-lg font-black font-mono text-cyan-400">₮{cartTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={placing}
                    className="w-full py-3 border border-cyan-500 bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider hover:bg-cyan-500/20 transition-all rounded-xl flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {placing ? (
                      <div className="w-4 h-4 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {placing ? "Placing..." : "Place Order"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
