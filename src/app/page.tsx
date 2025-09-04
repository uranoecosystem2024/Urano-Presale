import { Stack } from '@mui/material';
import Header from '@/components/Header';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import MainSection from '@/components/MainSection/MainSection';
export default function Home() {
  return (
    <Stack
      direction="column"
      minHeight="100dvh"
      height={"fit-content"}
      width={"100%"}
      px={{ xs: 0, lg: 6 }}
      py={3}
    >
      <Header />
      <Stack flex={1} px={{ xs: 2, lg: 5 }} py={4} justifyContent="end" gap={{xs: 2, lg: 4}}>
        <MainSection />
        <HowItWorks />
      </Stack>
      <Footer />
    </Stack>
  );
}
