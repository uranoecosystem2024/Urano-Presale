// hooks/usePresaleCard.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ActiveRoundResult } from "@/utils/presaleCard";
import { readActiveRound, formatUsdc } from "@/utils/presaleCard";

type PresaleCardState = {
  loading: boolean;
  error: string | null;
  roundLabel: string | null;
  currentPriceStr: string | null;
  usdcDecimals: number;
  info: ActiveRoundResult["info"];
};

type UsePresaleCardDataOpts = {
  priceFractionDigits?: number; // default 5 to match "$0.03000"
};

/**
 * Hook that does ALL data fetching/formatting for the PresaleCard.
 * Component stays presentational.
 */
export function usePresaleCardData({ priceFractionDigits = 5 }: UsePresaleCardDataOpts = {}): PresaleCardState {
  const [state, setState] = useState<PresaleCardState>({
    loading: true,
    error: null,
    roundLabel: null,
    currentPriceStr: null,
    usdcDecimals: 6,
    info: null,
  });

  // keep deps explicit & stable
  const deps = useMemo(() => ({ priceFractionDigits }), [priceFractionDigits]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const result: ActiveRoundResult = await readActiveRound();

        if (cancelled) return;

        const { label, info, usdcDecimals } = result;

        if (label && info) {
          const price = `$${formatUsdc(info.tokenPrice, usdcDecimals, deps.priceFractionDigits)}`;
          setState({
            loading: false,
            error: null,
            roundLabel: label,
            currentPriceStr: price,
            usdcDecimals,
            info,
          });
        } else {
          setState({
            loading: false,
            error: null,
            roundLabel: null,
            currentPriceStr: null,
            usdcDecimals,
            info: null,
          });
        }
      } catch (e: unknown) {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : "Failed to load active round",
        }));
      }
    };

    void run(); // satisfy no-floating-promises

    return () => {
      cancelled = true;
    };
  }, [deps]);

  return state;
}
