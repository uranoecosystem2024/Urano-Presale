import { Stack } from "@mui/material";
import TokenSelectionTextField from "@/components/MainSection/TokenSelectionTextField";
import usdc from "@/assets/images/usdc.webp";
import urano from "@/assets/images/uranoTokenIcon.webp";




const TokensSelection = () => {
    return (
        <Stack width={"100%"} direction={{xs: "column",lg:"row"}} justifyContent={"space-between"} alignItems={"center"} gap={{xs: 2, lg: 0}}>
            <Stack width={{xs:"100%",lg:"40%"}}>
                <TokenSelectionTextField value={0} label="Pay with stablecoin" tokenIconSrc={usdc.src} tokenSymbol="USDC" />
            </Stack>
            <Stack width={{xs:"100%",lg:"40%"}}>
                <TokenSelectionTextField value={0} label="Receive URANO" tokenIconSrc={urano.src} tokenSymbol="URANO" />
            </Stack>

        </Stack>
    )
}

export default TokensSelection;
