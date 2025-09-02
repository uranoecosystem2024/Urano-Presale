import "@/styles/globals.css";

import { type Metadata } from "next";
import { Host_Grotesk } from "next/font/google";

import { Providers } from "@/app/providers"

import { Container } from "@mui/material";

export const metadata: Metadata = {
  title: "Urano - Presale",
  description: "Urano Ecosystem - $URANO Token Presale",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={hostGrotesk.className}>
        <Providers>
          <Container maxWidth="xl">
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
