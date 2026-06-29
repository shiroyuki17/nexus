import React, { useMemo } from "react";
import PageShell from "./PageShell";
import { useAuth } from "@/lib/AuthContext";
import { entities } from "@/api/entities";
import { useEntityList } from "@/hooks/useEntityList";
import { motion } from "framer-motion";
import { 
  Server, Cpu, Activity, ShieldCheck, 
  Terminal, HardDrive, RefreshCw, Layers
} from "lucide-react";

// Mock processes for bottom table
const MOCK_PROCESSES = [
  { name: "DHCP Grid Station Linker",  pid: "4091", cpu: "1.2%", ram: "48 MB", status: "Running", color: "text-emerald-400" },
  { name: "Vite Asset Dev Server",      pid: "5173", cpu: "0.8%", ram: "124 MB", status: "Active", color: "text-emerald-400" },
  { name: "Nexus Express API Proxy",    pid: "4000", cpu: "2.4%", ram: "256 MB", status: "Running", color: "text-emerald-400" },
  { name: "Steam LAN Cache Daemon",     pid: "8082", cpu: "0.2%", ram: "18 MB",  status: "Idle",    color: "text-cyan-400" },
  { name: "Prisma Pool Manager",       pid: "3306", cpu: "4.1%", ram: "92 MB",  status: "Running", color: "text-emerald-400" },
  { name: "Tailwind JIT Watcher",       pid: "7711", cpu: "0.0%", ram: "14 MB",  status: "Sleeping", color: "text-muted-foreground" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const pcs = useEntityList(() => entities.pc.list());

  const totalStations = pcs.data?.length || 0;
  const occupiedCount = pcs.data?.filter(p => p.status === "occupied").length || 0;
  const maintenanceCount = pcs.data?.filter(p => p.status === "maintenance").length || 0;
  const availableCount = pcs.data?.filter(p => p.status === "available").length || 0;

  // Calculate usage percentage
  const usagePercentage = useMemo(() => {
    if (!totalStations) return 0;
    return Math.round((occupiedCount / totalStations) * 100);
  }, [totalStations, occupiedCount]);

  // Dynamic SVG circle offsets
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (usagePercentage / 100) * circumference;

  return (
    <PageShell title="Хяналтын Самбар" subtitle="СИСТЕМД ТАВТАЙ МОРИЛНО УУ">
      <div className="space-y-6">
        
        {/* Top Header telemetry grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          
          {/* Circular capacity gauge card */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            
            {/* SVG Circle Indicator */}
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  className="text-muted/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={normalizedRadius}
                  cx="60"
                  cy="60"
                />
                {/* Progress circle with pulse/glow */}
                <motion.circle
                  className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                  strokeWidth="8"
                  strokeDasharray={circumference + " " + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={normalizedRadius}
                  cx="60"
                  cy="60"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display font-black text-3xl text-foreground">{usagePercentage}%</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase font-mono">Ашиглалт</span>
              </div>
            </div>

            {/* Gauge summary details */}
            <div className="flex-1 space-y-2.5 text-center md:text-left">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-400 font-mono">Grid Seating Load</p>
                <h4 className="font-display font-bold text-lg text-foreground mt-0.5">Суудлын ачаалал</h4>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3 text-center">
                <div>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase">Идэвхтэй</p>
                  <p className="font-mono font-black text-sm text-rose-400">{occupiedCount}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase">Нээлттэй</p>
                  <p className="font-mono font-black text-sm text-emerald-400">{availableCount}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase">Засвар</p>
                  <p className="font-mono font-black text-sm text-amber-500">{maintenanceCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System capacity & statistics column */}
          <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-purple-400 font-mono">System Node Diagnostics</p>
                <h4 className="font-display font-bold text-sm text-foreground uppercase mt-0.5">Системийн төлөв</h4>
              </div>
              <span className="text-[9px] font-bold font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                BRANCH-01 / CENTRAL
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 flex-1 items-center">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-muted-foreground font-mono flex items-center gap-1">
                  <Server className="w-3 h-3 text-purple-400" /> System
                </span>
                <p className="font-mono font-black text-lg text-foreground">{totalStations} Stations</p>
                <p className="text-[9px] text-muted-foreground font-mono">({occupiedCount} Active nodes)</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-muted-foreground font-mono flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-cyan-400" /> Database
                </span>
                <p className="font-mono font-black text-lg text-foreground">1.4 GB / 10 GB</p>
                <p className="text-[9px] text-muted-foreground font-mono">Prisma Local Database</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-muted-foreground font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Backup
                </span>
                <p className="font-mono font-black text-lg text-foreground">6.3 GB / Daily</p>
                <p className="text-[9px] text-muted-foreground font-mono">Security Cloud Sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Resource Usage telemetry */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-5 border-b border-border/40 pb-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-pink-400 font-mono">Hardware Load Monitoring</p>
              <h4 className="font-display font-bold text-sm text-foreground uppercase mt-0.5">Тоног Төхөөрөмжийн ачаалал</h4>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5 animate-pulse">
              <Activity className="w-3.5 h-3.5 text-pink-400" /> Live Diagnostics
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* CPU utilization */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-foreground uppercase flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Load</span>
                <span className="font-black text-cyan-400">42%</span>
              </div>
              <div className="h-2 bg-muted/60 rounded-full overflow-hidden flex gap-0.5">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "42%" }} />
              </div>
              <p className="text-[9px] text-muted-foreground font-mono">Intel Xeon Core 3.6GHz x24</p>
            </div>

            {/* GPU utilization */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-foreground uppercase flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-pink-400" /> GPU Load</span>
                <span className="font-black text-pink-400">68%</span>
              </div>
              <div className="h-2 bg-muted/60 rounded-full overflow-hidden flex gap-0.5">
                <div className="h-full bg-pink-400 rounded-full" style={{ width: "68%" }} />
              </div>
              <p className="text-[9px] text-muted-foreground font-mono">Nvidia Grid Super RTX 4090 x4</p>
            </div>

            {/* RAM utilization */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-foreground uppercase flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-purple-400" /> RAM Memory</span>
                <span className="font-black text-purple-400">38%</span>
              </div>
              <div className="h-2 bg-muted/60 rounded-full overflow-hidden flex gap-0.5">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: "38%" }} />
              </div>
              <p className="text-[9px] text-muted-foreground font-mono">256 GB ECC DDR5 Buffered</p>
            </div>
          </div>
        </div>

        {/* Active System Services Table */}
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden p-6 relative">
          <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 font-mono">Active Daemons & Processes</p>
              <h4 className="font-display font-bold text-sm text-foreground uppercase mt-0.5">Идэвхтэй Процессууд</h4>
            </div>
            <button onClick={() => pcs.refresh()} className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-[10px] uppercase font-bold font-mono">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/40">
                  {["Үйлчилгээний нэр", "Процесс", "CPU", "Санах ой", "Төлөв"].map((h, i) => (
                    <th key={h} className={`text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono py-2 ${i === 0 ? "" : "text-right px-4"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {MOCK_PROCESSES.map((proc) => (
                  <tr key={proc.pid} className="hover:bg-background/25 transition-colors">
                    <td className="py-3 text-xs font-bold text-foreground flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                      {proc.name}
                    </td>
                    <td className="py-3 text-xs font-mono text-muted-foreground text-right px-4">PID {proc.pid}</td>
                    <td className="py-3 text-xs font-mono text-cyan-400 font-bold text-right px-4">{proc.cpu}</td>
                    <td className="py-3 text-xs font-mono text-muted-foreground text-right px-4">{proc.ram}</td>
                    <td className="py-3 text-xs text-right px-4">
                      <span className={`text-[9px] font-black uppercase tracking-wider ${proc.color}`}>
                        {proc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
