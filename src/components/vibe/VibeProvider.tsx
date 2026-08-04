"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  applyVibeToDocument,
  DEFAULT_VIBE,
  nextVibe,
  normalizeVibeId,
  readVibe,
  VIBE_STORAGE_KEY,
  type VibeId,
  writeVibe,
} from "@/lib/vibe";

type VibeContextValue = {
  vibe: VibeId;
  setVibe: (vibe: VibeId) => void;
  toggleVibe: () => void;
};

const VibeContext = createContext<VibeContextValue | null>(null);

/**
 * localStorage is the source of truth for the active vibe, so it is modelled as
 * an external store rather than mirrored into React state. `writeVibe` already
 * dispatches "hoahwa:vibe-change", which is what wakes every subscriber — so a
 * write from anywhere (including another tab) propagates without an effect.
 */
function subscribeVibe(onStoreChange: () => void): () => void {
  window.addEventListener("hoahwa:vibe-change", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("hoahwa:vibe-change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

// VibeId is a string union, so snapshots compare by value — no caching needed.
const getVibeSnapshot = (): VibeId => readVibe();
const getVibeServerSnapshot = (): VibeId => DEFAULT_VIBE;

export function VibeProvider({ children }: { children: React.ReactNode }) {
  const vibe = useSyncExternalStore(
    subscribeVibe,
    getVibeSnapshot,
    getVibeServerSnapshot,
  );

  // One-time migration of legacy stored values. No state to set — the store
  // read above already reflects whatever ends up in localStorage.
  useEffect(() => {
    const raw = localStorage.getItem(VIBE_STORAGE_KEY);
    const normalized = normalizeVibeId(raw);
    if (raw !== normalized) writeVibe(normalized);
    else applyVibeToDocument(normalized);
  }, []);

  const setVibe = useCallback((next: VibeId) => {
    writeVibe(next);
  }, []);

  const toggleVibe = useCallback(() => {
    writeVibe(nextVibe(readVibe()));
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
