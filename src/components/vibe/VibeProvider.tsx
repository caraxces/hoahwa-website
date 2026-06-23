"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  applyVibeToDocument,
  DEFAULT_VIBE,
  nextVibe,
  normalizeVibeId,
  readVibe,
  type VibeId,
  writeVibe,
} from "@/lib/vibe";

type VibeContextValue = {
  vibe: VibeId;
  setVibe: (vibe: VibeId) => void;
  toggleVibe: () => void;
};

const VibeContext = createContext<VibeContextValue | null>(null);

export function VibeProvider({ children }: { children: React.ReactNode }) {
  const [vibe, setVibeState] = useState<VibeId>(DEFAULT_VIBE);

  useEffect(() => {
    const stored = readVibe();
    setVibeState(stored);
    applyVibeToDocument(stored);
    // Migrate legacy localStorage values
    const raw = localStorage.getItem("hoahwa-vibe");
    const normalized = normalizeVibeId(raw);
    if (raw !== normalized) writeVibe(normalized);

    const onChange = (event: Event) => {
      const next = (event as CustomEvent<VibeId>).detail;
      if (next) setVibeState(next);
    };

    window.addEventListener("hoahwa:vibe-change", onChange);
    return () => window.removeEventListener("hoahwa:vibe-change", onChange);
  }, []);

  const setVibe = useCallback((next: VibeId) => {
    setVibeState(next);
    writeVibe(next);
  }, []);

  const toggleVibe = useCallback(() => {
    setVibeState((current) => {
      const next = nextVibe(current);
      writeVibe(next);
      return next;
    });
  }, []);

  return (
    <VibeContext.Provider value={{ vibe, setVibe, toggleVibe }}>
      {children}
    </VibeContext.Provider>
  );
}

export function useVibe() {
  const ctx = useContext(VibeContext);
  if (!ctx) {
    throw new Error("useVibe must be used within VibeProvider");
  }
  return ctx;
}
