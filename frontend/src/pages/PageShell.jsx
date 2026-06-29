import React from "react";

export default function PageShell({ title, subtitle, children = null }) {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children || (
        <div className="glass-card rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Backend microservice is ready for this page.</p>
        </div>
      )}
    </section>
  );
}
