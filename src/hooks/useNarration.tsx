import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { NarrationEngine } from "../audio/NarrationEngine";
import { storySegments } from "../config/birthdayStory";

const NarrationContext = createContext<NarrationEngine | null>(null);

export function NarrationProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<NarrationEngine | null>(null);
  if (!engineRef.current) engineRef.current = new NarrationEngine(storySegments);
  const engine = engineRef.current;

  useEffect(() => {
    engine.prepare();
    return () => engine.dispose();
  }, [engine]);

  return <NarrationContext.Provider value={engine}>{children}</NarrationContext.Provider>;
}

export function useNarrationEngine() {
  const engine = useContext(NarrationContext);
  if (!engine) throw new Error("NarrationProvider is missing");
  return engine;
}
