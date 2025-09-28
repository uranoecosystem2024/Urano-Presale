"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Stack, Typography, Switch, useTheme } from "@mui/material";
import { useActiveAccount } from "thirdweb/react";
import {
  readInstitutionalPublic,
  setInstitutionalPublic,
  canEditInstitutionalPublic,
} from "@/utils/admin/institutionalAccess";
import { toast } from "react-toastify"; // ⬅️ add

export type InstitutionalRoundAccessProps = {
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  title?: string;
  subtitleOn?: string;
  subtitleOff?: string;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try { return JSON.stringify(err); } catch { return "Unknown error"; }
}

export default function InstitutionalRoundAccess({
  value,
  defaultValue = false,
  onChange,
  disabled = false,
  title = "Institutional Round Access",
  subtitleOn = "Public access enabled",
  subtitleOff = "Public access disabled",
}: InstitutionalRoundAccessProps) {
  const theme = useTheme();
  const account = useActiveAccount();
  const [on, setOn] = useState<boolean>(value ?? defaultValue);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const descId = useId();

  const isControlled = typeof value === "boolean";

  useEffect(() => {
    if (isControlled) setOn(value);
  }, [isControlled, value]);

  useEffect(() => {
    if (isControlled) return;

    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        const [isPublic, editable] = await Promise.all([
          readInstitutionalPublic(),
          canEditInstitutionalPublic(account ?? undefined), // admin-only now
        ]);
        if (!cancelled) {
          setOn(isPublic);
          setCanEdit(editable);
        }
      } catch (e) {
        console.error("Failed to read institutional public flag:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => { cancelled = true; };
  }, [isControlled, account]);

  const handleToggle = async (next: boolean) => {
    if (isControlled) {
      onChange?.(next);
      return;
    }

    const prev = on;

    try {
      if (!account) {
        toast.error("No wallet connected. Please connect an authorized wallet.");
        return;
      }

      setLoading(true);
      setOn(next); // optimistic

      const editable = await canEditInstitutionalPublic(account);
      if (!editable) {
        throw new Error("Current wallet is not allowed to change this setting.");
      }

      await setInstitutionalPublic(account, next);
      onChange?.(next);
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      console.error(msg);
      setOn(prev);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const cardSx = {
    backgroundColor: theme.palette.presaleCardBg.main,
    border: `1px solid ${on ? theme.palette.uranoGreen1.main : theme.palette.headerBorder.main}`,
    borderRadius: 2,
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 2.25 },
    transition: "border-color .15s ease, box-shadow .15s ease, opacity .15s ease",
    boxShadow: on ? `0 0 0 1px rgba(107,226,194,.22)` : "none",
    opacity: loading ? 0.7 : 1,
  } as const;

  const switchSx = {
    "& .MuiSwitch-track": { backgroundColor: theme.palette.grey[700], opacity: 1 },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: theme.palette.uranoGreen1.main,
      "& + .MuiSwitch-track": { backgroundColor: theme.palette.uranoGreen1.main, opacity: 1 },
    },
  } as const;

  const switchDisabled = useMemo(
    () => disabled || loading || (!isControlled && !canEdit),
    [disabled, loading, isControlled, canEdit]
  );

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={cardSx}>
      <Stack gap={0.5}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography id={descId} variant="body1" sx={{ color: theme.palette.text.secondary }}>
          {on ? subtitleOn : subtitleOff}
        </Typography>
        {!isControlled && !canEdit && (
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Connect a wallet with <b>admin</b> or <b>manager</b> role to edit.
          </Typography>
        )}
      </Stack>

      <Switch
        checked={on}
        onChange={(e) => handleToggle(e.target.checked)}
        disabled={switchDisabled}
        sx={switchSx}
        inputProps={{ "aria-label": `${title} toggle`, "aria-describedby": descId }}
      />
    </Stack>
  );
}
