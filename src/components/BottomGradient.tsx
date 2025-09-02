import { Box } from "@mui/material";

import Image from "next/image";
import bottomGradient from "@/assets/images/bottomGradient.webp";

const BottomGradient = () => {
    return (
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                background: 'linear-gradient(180deg, #131313 0%, rgba(19, 19, 19, 0.00) 100%)',
            }}></Box>
            <Image src={bottomGradient} alt="Bottom Gradient" fill style={{ zIndex: 0 }} />
        </Box>
    )
}

export default BottomGradient;
