'use client';
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import theme from '@/theme/theme';
import { ThirdwebProvider } from "thirdweb/react";
import { ToastContainer } from 'react-toastify';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme as Theme}>
        <CssBaseline />
        <ThirdwebProvider>
          {children}
          <ToastContainer position='bottom-right' />
        </ThirdwebProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
