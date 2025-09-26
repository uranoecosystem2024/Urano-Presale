"use client";

import { useEffect, useMemo, useState } from "react";
import { Stack, IconButton } from "@mui/material";
import TokenSelectionTextField from "@/components/MainSection/TokenSelectionTextField";
import usdc from "@/assets/images/usdc1.webp";
import urano from "@/assets/images/urano1.webp";
import { AiOutlineSwap } from "react-icons/ai";
import { useTheme } from "@mui/material/styles";

import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { getBalance } from "thirdweb/extensions/erc20";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/thirdwebClient";
import { parseUnits } from "viem";

const RATE = 33.3; // 1 USDC = 33.3 URANO (example)
const AMOUNT_STORAGE_KEY = "urano:purchaseAmount:v1";
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA as `0x${string}` | undefined;
const ZERO: `0x${string}` = "0x0000000000000000000000000000000000000000";

const TokensSelection = () => {
  const theme = useTheme();
  const [value, setValue] = useState<number>(0);
  const [convertedValue, setConvertedValue] = useState<number>(0);

  const account = useActiveAccount();
  const address = account?.address as `0x${string}` | undefined;

  // USDC contract (Sepolia)
  const usdcContract = useMemo(() => {
    if (!USDC_ADDRESS) return undefined;
    return getContract({ client, address: USDC_ADDRESS, chain: sepolia });
  }, []);

  // Fallback contract (keeps types happy; call is gated via 'enabled')
  const fallbackContract = useMemo(
    () => getContract({ client, address: ZERO, chain: sepolia }),
    []
  );

  const readEnabled = Boolean(address && usdcContract);

  // helpful logs in dev if something is missing
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (!USDC_ADDRESS) {
        console.warn("NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA is missing; USDC balance cannot be read.");
      }
      if (!address) {
        console.warn("Wallet not connected; USDC balance cannot be read.");
      }
    }
  }, [address]);

  // Always pass a valid params object; gate with queryOptions.enabled
  const { data: usdcBal } = useReadContract(getBalance, {
    contract: readEnabled ? usdcContract! : fallbackContract,
    address: readEnabled ? address! : ZERO,
    queryOptions: {
      enabled: readEnabled,
      // optional niceties:
      refetchInterval: 15_000,
      retry: 3,
    },
  });

  // Compute URANO received from USDC
  useEffect(() => {
    const raw = Number(value || 0) * RATE;
    const rounded = Number(raw.toFixed(2));
    setConvertedValue(rounded);
  }, [value]);

  // Publish amount so the CTA can reflect "Insert amount" when value is 0
  useEffect(() => {
    try {
      localStorage.setItem(AMOUNT_STORAGE_KEY, String(value || 0));
      window.dispatchEvent(new Event("urano:amount"));
    } catch {
      /* noop */
    }
  }, [value]);

  // Check insufficient funds
  const insufficient = useMemo(() => {
    if (!usdcBal || !Number.isFinite(value)) return false;
    const dec = usdcBal.decimals ?? 6;
    try {
      const want = parseUnits((value || 0).toString(), dec);
      return want > usdcBal.value;
    } catch {
      return true;
    }
  }, [value, usdcBal]);

  // Helper text below the USDC input
  const usdcHelper: string = useMemo(() => {
    if (!usdcBal) return "Balance: -- USDC";
    const amount = Number(usdcBal.displayValue);
    const balStr = Number.isFinite(amount)
      ? `${amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${usdcBal.symbol ?? "USDC"}`
      : `-- ${usdcBal.symbol ?? "USDC"}`;
    return insufficient ? "Insufficient balance" : `Balance: ${balStr}`;
  }, [usdcBal, insufficient]);

  return (
    <Stack
      width={"100%"}
      direction={{ xs: "column", lg: "row" }}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={{ xs: 2, lg: 1 }}
    >
      <Stack width={{ xs: "100%", lg: "45%" }}>
        <TokenSelectionTextField
          value={value}
          label="Pay with stablecoin"
          tokenIconSrc={usdc.src}
          tokenSymbol="USDC"
          onChange={(v) => setValue(Number.isFinite(v) && v >= 0 ? v : 0)}
          error={insufficient}
          helperText={usdcHelper}
        />
      </Stack>

      <IconButton
        sx={{
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.headerBorder.main}`,
          borderRadius: "50%",
          padding: "0.6rem",
          backdropFilter: "blur(8.2px)",
          transform: { xs: "rotate(90deg)", lg: "rotate(0deg)" },
          "&:hover": { border: `1px solid ${theme.palette.text.secondary}` },
        }}
        onClick={() => {
          // reserved for swap UX; keeping button for layout parity
        }}
      >
        <AiOutlineSwap size={20} color="#14EFC0" />
      </IconButton>

      <Stack width={{ xs: "100%", lg: "45%" }}>
        <TokenSelectionTextField
          value={convertedValue}
          label="Receive URANO"
          tokenIconSrc={urano.src}
          tokenSymbol="URANO"
          helperText={"Balance: -- URANO"}
        />
      </Stack>
    </Stack>
  );
};

export default TokensSelection;
