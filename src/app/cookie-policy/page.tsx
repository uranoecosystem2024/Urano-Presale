import { Stack, Typography } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export default function Home() {
  return (
    <Stack
      direction="column"
      minHeight="100dvh"
      height={"fit-content"}
      width={"100%"}
      px={{ xs: 0, lg: 6 }}
      py={{xs: 0, lg: 3}}
    >
      <Header />
      <Stack flex={1} px={{ xs: 1, lg: 5 }} py={4} justifyContent="start" gap={{xs: 2, lg: 4}}>
        
      </Stack>
      <Footer />
    </Stack>
  );
}
