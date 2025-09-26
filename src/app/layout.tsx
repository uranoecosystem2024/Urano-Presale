import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { type Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { Providers } from "@/app/providers";
import { Box, Container } from "@mui/material";
import BottomGradient from "@/components/BottomGradient";
import CookieConsent from "@/components/cookiesPopUp";
import MobileGradient from "@/components/mobileGradient";
import AnimatedSVGPreloader from "@/components/AnimatedSVGPreloader";

export const metadata: Metadata = {
  title: "Urano - Presale",
  description: "Urano Ecosystem - $URANO Token Presale",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const hostGrotesk = Host_Grotesk({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={hostGrotesk.className}>
        <Providers>
          {/* Wrapper establishes the containing block for the absolute gradient */}
          <Box component="main" sx={{ position: "relative", minHeight: "100dvh" }}>
            <Container
              maxWidth="xl"
              sx={{ position: "relative", zIndex: 1, height: "fit-content" }}
            >
              {children}
              <CookieConsent />
            </Container>
            <MobileGradient height={"40%"} top={"25vh"} type="bottom" opacity={0.75} />
            <MobileGradient height={"30%"} bottom={"10vh"} type="bottom" opacity={0.75} />
            <BottomGradient />
            <AnimatedSVGPreloader
              scale={0.6}
              textSrc="/urano-text.svg"     // ensure this is in /public
              textScale={0.4}               // optional; defaults to same as logo
              textGapPx={20}                // optional spacing
              textFadeMs={800}              // optional fade speed for the text
            />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
