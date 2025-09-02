import { Stack } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <Stack width="100%" height="100%" minHeight="100vh" direction="column" justifyContent="space-between" alignItems="center" paddingX={6} paddingY={3}>
      <Header />
      <Footer />
    </Stack>
  );
}
