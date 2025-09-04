import Image from "next/image";
import bottomGradient from "@/assets/images/mg1.png";
import middleGradient from "@/assets/images/mobileMiddleGradient.webp";

const MobileGradient = ({ height, top, bottom, type, opacity }: { height: number | string, top?: number | string, bottom?: number | string, type: "bottom" | "middle", opacity?: number }) => {
    return (

        <Image
            src={type === "bottom" ? bottomGradient : middleGradient}
            className="mobileGradient"
            alt="Mobile Gradient"
            priority
            style={{
                objectFit: "cover",
                position: "absolute",
                left: 0,
                right: 0,
                zIndex: 0,
                bottom: bottom && !top ? bottom : "unset",
                top: top && !bottom ? top : "unset",
                pointerEvents: "none",
                width: "100vw",
                height: height,
                opacity: opacity,
            }}
        />

    );
};

export default MobileGradient;
