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
      px={6}
      py={3}
    >
      <Header />
      <Stack flex={1} px={5} py={2} justifyContent="end" gap={4}>
        <MainSection />
        <HowItWorks />
      </Stack>
      <Footer />
    </Stack>
  );
}
