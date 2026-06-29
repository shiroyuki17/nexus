import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import PageTransition from "@/components/ui/PageTransition";

const COLLAPSED_KEY = "nexus_sidebar_collapsed";

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSED_KEY) === "true"; } catch { return false; }
  });

  // Sync with sidebar toggle
  useEffect(() => {
    const handler = () => {
      try { setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true"); } catch {}
    };
    window.addEventListener("storage", handler);
    // Poll since localStorage events don't fire in same tab
    const id = setInterval(handler, 80);
    return () => { window.removeEventListener("storage", handler); clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg flex">
      <Sidebar />
      <main
        className="flex-1 min-w-0 transition-all"
        style={{
          marginLeft: collapsed ? 64 : 228,
          transitionDuration: "280ms",
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)"
        }}
      >
        <div className="min-h-screen px-5 py-6 md:px-8 md:py-7 max-w-[1560px] mx-auto">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
