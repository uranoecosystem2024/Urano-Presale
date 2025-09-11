import { Stack } from '@mui/material';
import Header from '@/components/Header';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import MainSection from '@/components/MainSection/MainSection';
import MobileHowItWorks from '@/app/mobileHowItWorks';
import Image from 'next/image';
import coin1 from '@/assets/images/coin1.webp';
import coin2 from '@/assets/images/coin2.webp';
import coin3 from '@/assets/images/coin3.webp';

export default function Home() {
  return (
    <Stack
      direction="column"
      minHeight="100dvh"
      height={"fit-content"}
      width={"100%"}
      position={"relative"}
      px={{ xs: 0, lg: 6 }}
      py={{ xs: 0, lg: 3 }}
    >
      <Header />
      <Image
        className="coinsDesktop"
        src={coin3}
        alt="coins urano"
        width={175}
        height={175}
        priority
        style={{ position: "absolute", top: "13%", right: "-4%", zIndex: 0 }}
      />
      <Stack flex={1} px={{ xs: 1, lg: 5 }} py={4} justifyContent="end" gap={{ xs: 2, lg: 4 }} sx={{ position: "relative", overflow: "hidden" }}>
        <MainSection />
        <Image
          className="coinsDesktop"
          src={coin1}
          alt="coins urano"
          width={130}
          height={130}
          style={{ position: "absolute", top: "60%", left: "20%", zIndex: 0 }}
        />
        <HowItWorks />
        <MobileHowItWorks />
      </Stack>
      <Image
        className="coinsDesktop"
        src={coin2}
        alt="coins urano"
        width={200}
        height={200}
        priority
        style={{ position: "absolute", bottom: "4%", left: "-5%", zIndex: 0 }}
      />
      <Footer />
    </Stack>
  );
}
