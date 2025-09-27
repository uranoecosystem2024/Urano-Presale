// components/admin/UploadWhitelistCsvModal.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  Stack,
  Typography,
  Box,
  useTheme,
  alpha,
  Button,
  LinearProgress,
  Paper,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";

import { parse } from "csv-parse/sync";

import dayjs, { type Dayjs } from "dayjs";

export type WhitelistCsvEntry = {
  address: `0x${string}`;
  preAssignedTokens: string; // human-readable string
  releaseDate: Date;
};

type RawCsvRow = {
  address?: string | null;
  amount?: string | number | null;
  release?: string | number | null;
};

export type UploadWhitelistCsvModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (rows: WhitelistCsvEntry[]) => void;
  title?: string;
  subtitle?: string;
};

function isAddressLike(a?: string | null): a is `0x${string}` {
  if (!a) return false;
  const s = a.trim();
  return s.startsWith("0x") && s.length === 42;
}

function toDate(input: string | number | null | undefined): Date | null {
  if (input == null) return null;

  if (typeof input === "number") {
    // treat as ms if >= 1e12, else seconds
    return input < 1e12 ? new Date(input * 1000) : new Date(input);
  }

  const raw = String(input).trim();
  if (!raw) return null;

  const candidates: (string | Dayjs)[] = [
    dayjs(raw),
    dayjs(raw, "YYYY-MM-DD HH:mm", true),
    dayjs(raw, "YYYY/MM/DD HH:mm", true),
    dayjs(raw, "DD-MM-YYYY HH:mm", true),
    dayjs(raw, "DD/MM/YYYY HH:mm", true),
    dayjs(raw, "YYYY-MM-DD", true),
    dayjs(raw, "DD/MM/YYYY", true),
  ];

  for (const d of candidates) {
    const dd = dayjs(d);
    if (dd.isValid()) return dd.toDate();
  }
  return null;
}

function validateRow(row: RawCsvRow): {
  valid: boolean;
  normalized?: WhitelistCsvEntry;
  errors: string[];
} {
  const errs: string[] = [];

  const addr = row.address?.toString().trim();
  if (!isAddressLike(addr)) errs.push("Invalid or missing address (must be 0x… and 42 chars).");

  const amountStr = row.amount?.toString().trim() ?? "";
  if (!amountStr) errs.push("Missing amount.");
  else if (!/^\d+(\.\d+)?$/.test(amountStr)) errs.push("Amount must be a positive number.");

  const release = toDate(row.release ?? null);
  if (!release) errs.push("Invalid or missing release date/time.");

  if (errs.length > 0 || !addr || !release || !amountStr) {
    return { valid: false, errors: errs };
  }

  return {
    valid: true,
    normalized: {
      address: addr as `0x${string}`,
      preAssignedTokens: amountStr,
      releaseDate: release,
    },
    errors: [],
  };
}

/** Safe object check (not null, not array) */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/** Safely get a field as string (or undefined). Coerces numbers, ignores others. */
function getString(obj: unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return undefined;
}

export default function UploadWhitelistCsvModal({
  open,
  onClose,
  onConfirm,
  title = "Import CSV for whitelisting",
  subtitle = "Upload a CSV with columns: address, amount, release",
}: UploadWhitelistCsvModalProps) {
  const theme = useTheme<Theme>();
  const [fileName, setFileName] = useState<string>("");
  const [parsing, setParsing] = useState<boolean>(false);
  const [valid, setValid] = useState<WhitelistCsvEntry[]>([]);
  const [invalid, setInvalid] = useState<Array<{ row: RawCsvRow; errors: string[] }>>([]);

  const canConfirm = useMemo(() => valid.length > 0 && !parsing, [valid, parsing]);

  const handleFile = async (file: File): Promise<void> => {
    setParsing(true);
    setFileName(file.name);
    setValid([]);
    setInvalid([]);

    try {
      const csvText: string = await file.text();

      // Treat parse() output as unknown, then narrow safely.
      const parsedUnknown: unknown = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        bom: true,
        trim: true,
      });

      const rows: unknown[] = Array.isArray(parsedUnknown) ? parsedUnknown : [];

      const v: WhitelistCsvEntry[] = [];
      const inv: Array<{ row: RawCsvRow; errors: string[] }> = [];

      for (const raw of rows) {
        // Safely access possible header-case variants
        const address = getString(raw, "address") ?? getString(raw, "Address") ?? null;
        const amountStr = (getString(raw, "amount") ?? getString(raw, "Amount") ?? "").trim();
        const releaseStr = (getString(raw, "release") ?? getString(raw, "Release") ?? "").trim();

        const r: RawCsvRow = {
          address,
          amount: amountStr,
          release: releaseStr,
        };

        const check = validateRow(r);
        if (check.valid && check.normalized) v.push(check.normalized);
        else inv.push({ row: r, errors: check.errors });
      }

      setValid(v);
      setInvalid(inv);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown CSV parsing error.";
      setInvalid((prev) => prev.concat([{ row: {}, errors: [message] }]));
    } finally {
      setParsing(false);
    }
  };

  const resetAndClose = (): void => {
    setFileName("");
    setValid([]);
    setInvalid([]);
    setParsing(false);
    onClose();
  };

  const handleConfirm = (): void => {
    if (!canConfirm) return;
    onConfirm?.(valid);
    resetAndClose();
  };

  return (
    <Modal open={open} onClose={resetAndClose}>
      <Box
        sx={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 720,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: 24,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.palette.headerBorder?.main ?? "transparent"}`,
        }}
      >
        <Box
          sx={{
            background: theme.palette.background.paper,
            backdropFilter: "blur(10px)",
            p: 3,
            borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Title */}
          <Stack alignItems="center" gap={0.5} mb={1}>
            <Typography
              variant="h5"
              fontWeight={500}
              textAlign="center"
              sx={{
                background: theme.palette.text.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {subtitle}
            </Typography>
          </Stack>

          {/* Uploader */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              borderColor: theme.palette.headerBorder?.main ?? "divider",
              background: theme.palette.background.default,
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
              <Button
                component="label"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  backgroundColor: theme.palette.secondary.main,
                  border: `1px solid ${theme.palette.headerBorder?.main ?? "transparent"}`,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                    background: theme.palette?.transparentPaper?.main ?? "transparent",
                  },
                  whiteSpace: "nowrap",
                }}
              >
                Choose CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  hidden
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                />
              </Button>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {fileName || "No file selected"}
                </Typography>
              </Box>
            </Stack>

            {parsing && (
              <Box mt={2}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary">
                  Parsing CSV…
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Preview */}
          <Stack gap={1} mt={1}>
            <Typography variant="subtitle1">Preview</Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderColor: theme.palette.headerBorder?.main ?? "divider",
                background: theme.palette.background.default,
                maxHeight: 280,
                overflow: "auto",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Valid rows: {valid.length} {invalid.length > 0 ? `• Invalid rows: ${invalid.length}` : ""}
              </Typography>

              {valid.length > 0 ? (
                <Box
                  component="table"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    "& th, & td": {
                      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
                      p: 1,
                      textAlign: "left",
                      fontSize: 13,
                    },
                    "& th": { color: theme.palette.text.secondary, fontWeight: 500 },
                  }}
                >
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Amount (URANO)</th>
                      <th>Release</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valid.slice(0, 50).map((r, i) => (
                      <tr key={`${r.address}-${i}`}>
                        <td>{r.address}</td>
                        <td>{r.preAssignedTokens}</td>
                        <td>{dayjs(r.releaseDate).format("YYYY-MM-DD HH:mm")}</td>
                      </tr>
                    ))}
                    {valid.length > 50 && (
                      <tr>
                        <td colSpan={3}>
                          <Typography variant="caption" color="text.secondary">
                            Showing first 50 of {valid.length} rows…
                          </Typography>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No valid rows yet.
                </Typography>
              )}

              {invalid.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Invalid rows</Typography>
                  <Stack mt={1} gap={1}>
                    {invalid.slice(0, 5).map((inv, idx) => (
                      <Box key={idx}>
                        <Typography variant="body2" color="error">
                          • {inv.errors.join("; ")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {JSON.stringify(inv.row)}
                        </Typography>
                      </Box>
                    ))}
                    {invalid.length > 5 && (
                      <Typography variant="caption" color="text.secondary">
                        And {invalid.length - 5} more invalid rows…
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>

          {/* Actions */}
          <Stack direction={{ xs: "column", sm: "row" }} gap={2} mt={2}>
            <Button
              onClick={resetAndClose}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1.5,
                border: `1px solid ${theme.palette.headerBorder?.main ?? "transparent"}`,
                color: theme.palette.text.primary,
                background: theme.palette?.transparentPaper?.main ?? "transparent",
                "&:hover": { background: theme.palette.error.main },
                flex: 1,
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1.5,
                backgroundColor: theme.palette.secondary.main,
                border: `1px solid ${theme.palette.headerBorder?.main ?? "transparent"}`,
                color: theme.palette.text.primary,
                "&:hover": {
                  background: theme.palette?.uranoGradient ?? theme.palette.secondary.dark,
                  color: theme.palette.background.default,
                },
                flex: 1,
              }}
            >
              Use {valid.length} Row{valid.length === 1 ? "" : "s"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}
