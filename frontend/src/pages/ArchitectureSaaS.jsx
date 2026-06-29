import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Gamepad2,
  Monitor,
  Server,
  ShieldCheck,
  ShoppingBasket,
  Trophy,
  Users
} from "lucide-react";

const modules = [
  { icon: Monitor, label: "PC Status", value: "24 stations", tone: "text-primary" },
  { icon: CalendarClock, label: "Reservations", value: "Live schedule", tone: "text-[hsl(var(--warning))]" },
  { icon: ShoppingBasket, label: "Food Orders", value: "Counter queue", tone: "text-[hsl(var(--success))]" },
  { icon: Trophy, label: "Tournaments", value: "Bracket ready", tone: "text-[hsl(var(--neon-purple))]" }
];

const stats = [
  ["API", "Online"],
  ["Database", "MySQL"],
  ["Role Access", "Admin / User / PC"],
  ["Frontend", "Vite React"]
];

const activity = [
  "Station 08 reserved for 18:30",
  "Counter received 3 active food orders",
  "Weekend tournament registration open",
  "Admin dashboard synced with local API"
];

function StatusPill({ children }) {
  return (
    <span className="inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export default function ArchitectureSaaS() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">NEXUS</p>
              <p className="mt-1 text-xs text-muted-foreground">Gaming center control panel</p>
            </div>
          </div>
          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Enter app <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-8 px-5 py-8 md:grid-cols-[0.92fr_1.08fr] md:px-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2">
              <StatusPill>Local API online</StatusPill>
              <StatusPill>Admin workspace</StatusPill>
              <StatusPill>PC booking system</StatusPill>
            </div>
            <h1 className="mt-7 text-4xl font-semibold leading-tight md:text-6xl">
              Run the gaming center from one clean dashboard.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Manage PCs, reservations, games, food orders, user balances, and tournaments from a single local control panel.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="http://localhost:4000/api/health"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                <Server className="h-4 w-4" /> Check API
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-sm font-semibold">Live Operations</p>
                  <p className="mt-1 text-xs text-muted-foreground">Demo company workspace</p>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] pulse-dot" />
                  Online
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {modules.map(item => (
                  <div key={item.label} className="rounded-lg border border-border bg-background p-4">
                    <item.icon className={`h-5 w-5 ${item.tone}`} />
                    <p className="mt-4 text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold">System</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {stats.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold">Recent Activity</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {activity.map(item => (
                    <div key={item} className="flex items-start gap-3 rounded-md bg-muted/50 px-3 py-2 text-sm">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
