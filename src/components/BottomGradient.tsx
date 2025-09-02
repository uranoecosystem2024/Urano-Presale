import { Box } from "@mui/material";
import Image from "next/image";
import bottomGradient from "@/assets/images/bottomGradient.webp";

const BottomGradient = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "50%",          // or "50vh" if you want a fixed visual size
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Image
        src={bottomGradient}
        alt="Bottom Gradient"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      
    </Box>
  );
};

export default BottomGradient;
