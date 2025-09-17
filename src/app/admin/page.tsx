"use client"

import { Stack, Typography } from '@mui/material';
import AdminHeader from '@/components/admin/adminHeader';
import Footer from '@/components/Footer';
import { useTheme } from '@mui/material/styles';
import RoundStatusManagement, { type RoundStatusItem } from '@/components/admin/roundStatusManagement';
import InstitutionalRoundAccess from '@/components/admin/institutionalRoundAccess';
import InstitutionalAllowlist from '@/components/admin/institutionalAllowlist';
import ManualSepaPurchase from '@/components/admin/manualSEPAPurchase';
import WithdrawUnsoldTokens from '@/components/admin/withdrawUnsoldTokens';
import { useState } from 'react';

const rounds: RoundStatusItem[] = [
    { id: "seed", title: "Seed Round", active: true },
    { id: "strat", title: "Strategic Round", active: false },
    { id: "inst", title: "institutional Round", active: false },
    { id: "priv", title: "Private round", active: false },
    { id: "comm", title: "Community round", active: false },
];

export default function Admin() {
    const theme = useTheme();
    const [publicAccess, setPublicAccess] = useState(true);

    return (
        <Stack
            direction="column"
            minHeight="100dvh"
            height={"fit-content"}
            width={"100%"}
            position={"relative"}
            alignItems={"center"}
            px={{ xs: 0, lg: 6 }}
            py={{ xs: 0, lg: 3 }}
        >
            <AdminHeader />

            <Stack flex={1} width={{ xs: "95%", lg: "65%" }} py={4} alignItems={"center"} justifyContent="start" gap={{ xs: 0.75, lg: 1.5 }} sx={{ position: "relative" }}>
                <Typography className="conthrax" variant="h3" sx={{
                    fontSize: { xs: "1.4rem", lg: "2rem" },
                    fontWeight: 600,
                    background: theme.palette.uranoGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginTop: 4,
                }}>Admin Panel</Typography>
                <Typography variant="h6" sx={{
                    fontSize: { xs: "0.5rem", lg: "0.875rem" },
                    fontWeight: 400,
                    color: theme.palette.text.primary,
                }}>Manage token presale rounds and vesting parameters</Typography>
            </Stack>

            <Stack width={{ xs: "95%", lg: "65%" }} marginBottom={4} gap={2}>
                <Stack sx={{
                    backgroundColor: theme.palette.presaleCardBg.main,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    borderRadius: 2,
                    padding: 3,
                    gap: 2,
                }}>
                    <RoundStatusManagement
                        rounds={rounds}
                        singleActive
                        onChange={(next, changedId) => {
                            // persist to API or contract here
                            console.log({ changedId, next });
                        }}
                        onShowMore={(id) => {
                            // open drawer / route / dialog with details for `id`
                            console.log("show more for", id);
                        }}
                    />
                </Stack>

                <Stack sx={{
                    backgroundColor: theme.palette.presaleCardBg.main,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    borderRadius: 2,
                    padding: 3,
                    gap: 2,
                }}>
                    <InstitutionalRoundAccess
                        value={publicAccess}
                        onChange={setPublicAccess}
                        subtitleOn="Public access enabled"
                        subtitleOff="Public access disabled"
                    />
                </Stack>

                <Stack sx={{
                    backgroundColor: theme.palette.presaleCardBg.main,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    borderRadius: 2,
                    padding: 3,
                    gap: 2,
                }}>
                    <InstitutionalAllowlist
                        rounds={rounds.map(r => ({ id: r.id, label: r.title }))}
                        onAdd={(addr, r) => console.log("add", addr, r)}
                        onRemove={(addr, r) => console.log("remove", addr, r)}
                    />
                </Stack>

                <Stack sx={{
                    backgroundColor: theme.palette.presaleCardBg.main,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    borderRadius: 2,
                    padding: 3,
                    gap: 2,
                }}>
                    <ManualSepaPurchase
                        rounds={rounds.map(r => ({ id: r.id, label: r.title }))}
                        onSubmit={(payload) => {
                            // wire to your API later
                            console.log("SEPA payload", payload);
                        }}
                    />
                </Stack>

                <Stack sx={{
                    backgroundColor: theme.palette.presaleCardBg.main,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    borderRadius: 2,
                    padding: 3,
                    gap: 2,
                }}>
                    <WithdrawUnsoldTokens
                        rounds={rounds.map(r => ({ id: r.id, label: r.title }))}
                        onWithdraw={(addr, roundId) => console.log("withdraw", addr, roundId)}
                    />
                </Stack>
            </Stack>

            <Footer />
        </Stack >
    );
}
