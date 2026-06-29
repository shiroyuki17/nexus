import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-6">
      <div className="glass-card rounded-lg p-8 text-center max-w-md">
        <h1 className="font-display text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The route you opened does not exist.</p>
        <Link className="inline-flex mt-6 text-primary hover:text-primary/80" to="/">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
