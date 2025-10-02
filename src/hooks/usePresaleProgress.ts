// hooks/usePresaleProgress.ts
"use client";

import { useEffect, useState } from "react";
import { readPresaleProgress, type PresaleProgress } from "@/utils/progress";

type State = {
  loading: boolean;
  error: string | null;
  data: PresaleProgress | null;
};

export function usePresaleProgress(): State {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let cancelled = false;
  
    const run = async () => {
      try {
        const data = await readPresaleProgress();
        if (cancelled) return;
        setState({ loading: false, error: null, data });
      } catch (e: unknown) {
        if (cancelled) return;
        setState({
          loading: false,
          error: e instanceof Error ? e.message : "Failed to read progress",
          data: null,
        });
      }
    };
  
    void run(); // explicitly ignore the promise
  
    return () => {
      cancelled = true;
    };
  }, []);
  

  return state;
}
