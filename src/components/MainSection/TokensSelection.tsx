"use client"

import { useEffect, useState } from "react";
import { Stack, IconButton } from "@mui/material";
import TokenSelectionTextField from "@/components/MainSection/TokenSelectionTextField";
import usdc from "@/assets/images/usdc1.webp";
import urano from "@/assets/images/urano1.webp";
import { AiOutlineSwap } from "react-icons/ai";
import { useTheme } from "@mui/material/styles";

const TokensSelection = () => {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [convertedValue, setConvertedValue] = useState(0);

    const RATE = 33.3;

    const round = (n: number, dp = 6) =>
        Math.round(n * 10 ** dp) / 10 ** dp;
      
      useEffect(() => {
        setConvertedValue(round(Number(value) * RATE, 6)); // choose dp (2/4/6) as needed
      }, [value]);
      
    return (
        <Stack width={"100%"} direction={{xs: "column",lg:"row"}} justifyContent={"space-between"} alignItems={"center"} gap={{xs: 2, lg: 1.5}}>
            <Stack width={{xs:"100%",lg:"auto"}}>
                <TokenSelectionTextField value={value} label="Pay with stablecoin" tokenIconSrc={usdc.src} tokenSymbol="USDC" onChange={(v) => setValue(v)} />
            </Stack>
            <IconButton sx={{
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${theme.palette.headerBorder.main}`,
                borderRadius: "50%",
                padding: "0.6rem",
                backdropFilter: "blur(8.2px)",
                transform: {xs: "rotate(90deg)", lg: "rotate(0deg)"},
                "&:hover":{
                    border: `1px solid ${theme.palette.text.secondary}`
                }
            }}>
                <AiOutlineSwap size={20} color="#14EFC0" />
            </IconButton>
            <Stack width={{xs:"100%",lg:"auto"}}>
                <TokenSelectionTextField value={convertedValue} label="Receive URANO" tokenIconSrc={urano.src} tokenSymbol="URANO" />
            </Stack>

        </Stack>
    )
}

export default TokensSelection;
