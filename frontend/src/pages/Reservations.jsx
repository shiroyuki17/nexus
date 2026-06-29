import React, { useState, useMemo } from "react";
import PageShell from "./PageShell";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, CalendarCheck, HelpCircle, AlertTriangle, 
  Clock, CheckCircle, Flame
} from "lucide-react";

const TOTAL_SEATS = 50;

const DURATION_OPTIONS = [
  { id: 2, label: "2 Цаг", price: 8000 },
  { id: 4, label: "4 Цаг", price: 16000 },
  { id: 6, label: "6 Цаг", price: 24000 },
  { id: 12, label: "Бүтэн (12ц)", price: 40000 },
];

export default function Reservations() {
  const { user } = useAuth();
  const pcs = useEntityList(() => entities.pc.list());
  const reservations = useEntityList(() => entities.reservation.list());

  // Interactive booking state
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Group PCs by number for quick lookup
  const pcMap = useMemo(() => {
    const map = new Map();
    if (pcs.data) {
      pcs.data.forEach(pc => {
        map.set(pc.pc_number, pc);
      });
    }
    return map;
  }, [pcs.data]);

  // Determine seat status
  const getSeatStatus = (seatNum) => {
    const pc = pcMap.get(seatNum);
    if (!pc) return "available";
    if (pc.status === "occupied") return "occupied";
    if (pc.status === "maintenance") return "maintenance";
    if (pc.status === "reserved") return "reserved";
    return "available";
  };

  const handlePlaceBooking = async () => {
    if (!selectedSeat) return;
    setBookingLoading(true);
    try {
      // 1. Ensure PC node exists in database
      let pcRecord = pcMap.get(selectedSeat);
      if (!pcRecord) {
        // Create the PC record on-the-fly to support all 50 slots
        const zone = selectedSeat > 40 ? "tournament" : selectedSeat > 25 ? "vip" : "standard";
        const rate = selectedSeat > 40 ? 12 : selectedSeat > 25 ? 8 : 4;
        pcRecord = await entities.pc.create({
          pc_number: selectedSeat,
          device_type: "pc",
          zone: zone,
          status: "reserved",
          hourly_rate: rate,
          specs: "RTX 4070, AMD Ryzen 7, 32GB RAM"
        });
      } else if (pcRecord.status === "available") {
        // Mark existing available PC as reserved
        await entities.pc.update(pcRecord.id, { status: "reserved" });
      }

      // 2. Submit Reservation Record
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const nowTime = new Date().toLocaleTimeString("mn-MN", { hour12: false }).slice(0, 5); // HH:MM
      
      await entities.reservation.create({
        user_id: user?.user_id || user?.id || "guest",
        user_name: user?.userName || user?.username || "Gamer Client",
        pc_id: pcRecord.id,
        pc_number: selectedSeat,
        zone: pcRecord.zone || "standard",
        date: today,
        start_time: nowTime,
        duration_hours: selectedDuration.id,
        status: "confirmed",
        total_cost: selectedDuration.price
      });

      // 3. Create top-up transaction/fee simulation if applicable
      await entities.transaction.create({
        user_id: user?.user_id || user?.id || "guest",
        type: "session",
        amount: -selectedDuration.price,
        description: `Reserved PC #${selectedSeat} for ${selectedDuration.id} hours`,
        balance_after: Math.max(0, (user?.balance || 50000) - selectedDuration.price)
      });

      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
      setSelectedSeat(null);
      
      // Refresh telemetry lists
      pcs.refresh();
      reservations.refresh();
    } catch (err) {
      alert("Booking failed: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <PageShell title="Суудал Захиалга" subtitle="MAIN FLOOR / ZONE A / CENTRAL OFFICE">
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left: Seat Grid Layout */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-6 relative">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">PC Grid Layout</span>
              <div className="flex items-center gap-3.5 text-[9px] font-mono font-bold uppercase">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded border border-border bg-background" /> Нээлттэй
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded border border-rose-500/20 bg-rose-500/10" /> Ашиглаж буй
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded border border-cyan-500 bg-cyan-500/20" /> Сонгосон
                </div>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
              {Array.from({ length: TOTAL_SEATS }, (_, idx) => {
                const seatNum = idx + 1;
                const status = getSeatStatus(seatNum);
                const isSelected = selectedSeat === seatNum;
                
                let cardStyle = "border-border/60 hover:border-cyan-500/40 text-muted-foreground";
                if (status === "occupied") cardStyle = "border-rose-500/30 bg-rose-500/10 text-rose-400 cursor-not-allowed";
                if (status === "maintenance") cardStyle = "border-amber-500/20 bg-amber-500/5 text-amber-400 cursor-not-allowed";
                if (status === "reserved") cardStyle = "border-purple-500/30 bg-purple-500/5 text-purple-400 cursor-not-allowed";
                if (isSelected) cardStyle = "border-cyan-500 bg-cyan-500/20 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]";

                return (
                  <button
                    key={seatNum}
                    onClick={() => {
                      if (status === "available") {
                        setSelectedSeat(isSelected ? null : seatNum);
                      }
                    }}
                    disabled={status !== "available"}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center font-mono transition-all text-xs ${cardStyle}`}
                  >
                    <span className="text-[8px] font-bold opacity-60">PC</span>
                    <span className="font-black text-xs leading-none">{String(seatNum).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-5 pt-4 border-t border-border/40 text-center">
              <span className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Screen / Front Desk Direction</span>
            </div>
          </div>

          {/* Active Reservations list */}
          <div className="bg-card border border-border/80 rounded-2xl p-6">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-foreground mb-4">
              Идэвхтэй захиалгуудын жагсаалт
            </h3>
            
            {reservations.isLoading ? (
              <div className="py-8 text-center">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : !reservations.data || reservations.data.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-6 font-mono uppercase">Одоогоор идэвхтэй захиалга байхгүй</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {reservations.data.slice(0, 8).map(res => (
                  <div key={res.id} className="p-3 bg-background/40 border border-border/60 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">PC #{res.pc_number}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">
                        {res.user_name} • {res.start_time} ({res.duration_hours}ц)
                      </p>
                    </div>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded">
                      Баталгаажсан
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Duration Select & Booking Details */}
        <div>
          <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-6 sticky top-4">
            
            <div>
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                Хугацаа Сонгох
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map(opt => {
                  const isSelected = selectedDuration.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedDuration(opt)}
                      className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all ${
                        isSelected 
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-400" 
                          : "border-border/80 bg-background/40 hover:border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{opt.label}</span>
                      <span className="text-[9px] font-bold font-mono mt-0.5">₮{opt.price.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selections details summary */}
            <div className="bg-background/50 border border-border/80 rounded-xl p-4 space-y-3 font-mono">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Захиалгын мэдээлэл</p>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сонгосон PC:</span>
                  <span className="font-bold text-foreground">
                    {selectedSeat ? `#${String(selectedSeat).padStart(2, "0")}` : "Сонгоогүй"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Хугацаа:</span>
                  <span className="font-bold text-foreground">{selectedDuration.label}</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2 text-sm">
                  <span className="text-muted-foreground uppercase">Нийт дүн:</span>
                  <span className="font-black text-cyan-400">
                    ₮{selectedSeat ? selectedDuration.price.toLocaleString() : "0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Actions */}
            <AnimatePresence mode="wait">
              {bookingSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase"
                >
                  <CheckCircle className="w-4 h-4" /> Суудал амжилттай захиалагдлаа!
                </motion.div>
              ) : (
                <button
                  onClick={handlePlaceBooking}
                  disabled={bookingLoading || !selectedSeat}
                  className="w-full py-3.5 border border-cyan-500 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:neon-glow-cyan text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Flame className="w-4 h-4" />
                  {bookingLoading ? "Захиалж байна..." : "Захиалга Хийх"}
                </button>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </PageShell>
  );
}
