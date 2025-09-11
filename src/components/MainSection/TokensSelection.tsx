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

    useEffect(() => {
        setConvertedValue(value * 33.3);
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
                backdropFilter: "blur(8.2px)"
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
