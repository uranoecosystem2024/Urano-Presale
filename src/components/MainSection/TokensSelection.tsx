"use client"

import { useState } from "react";
import { Stack } from "@mui/material";
import TokenSelectionTextField from "@/components/MainSection/TokenSelectionTextField";
import usdc from "@/assets/images/usdc1.webp";
import urano from "@/assets/images/urano1.webp";




const TokensSelection = () => {
    const [value, setValue] = useState(0);
    const [convertedValue, setConvertedValue] = useState(0);
    return (
        <Stack width={"100%"} direction={{xs: "column",lg:"row"}} justifyContent={"space-between"} alignItems={"center"} gap={{xs: 2, lg: 0}}>
            <Stack width={{xs:"100%",lg:"40%"}}>
                <TokenSelectionTextField value={value} label="Pay with stablecoin" tokenIconSrc={usdc.src} tokenSymbol="USDC" onChange={(v) => setValue(v)} />
            </Stack>
            <Stack width={{xs:"100%",lg:"40%"}}>
                <TokenSelectionTextField value={value * 3.33} label="Receive URANO" tokenIconSrc={urano.src} tokenSymbol="URANO" />
            </Stack>

        </Stack>
    )
}

export default TokensSelection;
