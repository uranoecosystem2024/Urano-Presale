import { Stack } from "@mui/material";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main>
      <Stack direction="column" justifyContent="space-between" alignItems="center" paddingX={6} paddingY={3}>
      <Header />

      </Stack>
    </main>
  );
}
