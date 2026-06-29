import React from "react";

export default function DataPanel({ title, isLoading, error, emptyText, children }) {
  return (
    <div className="glass-card rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold text-foreground">{title}</h2>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && children}
      {!isLoading && !error && !children && (
        <p className="text-sm text-muted-foreground">{emptyText || "No data yet."}</p>
      )}
    </div>
  );
}
