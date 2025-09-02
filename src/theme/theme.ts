import { createTheme, type Theme, type ThemeOptions } from "@mui/material/styles";
declare module "@mui/material/styles" {
    interface Palette {
      uranoGradient: string
      uranoGreen1: {
        main: string
      }
      uranoGreen2: {
        main: string
      }
      transparentPaper: {
        main: string
      }
      headerBorder: {
        main: string
      }
      cardBorder1: {
        main: string
      }
      cardBorder2: {
        main: string
      }
      footerBorder: {
        main: string
      }
    }
  
    interface PaletteOptions {
      uranoGradient: string
      uranoGreen1: {
          main: string
      }
      uranoGreen2: {
        main: string
      }
      transparentPaper: {
        main: string
      }
      headerBorder: {
        main: string
      }
      cardBorder1: {
        main: string
      }
      cardBorder2: string
      footerBorder: {
        main: string
      }
    }
  }

const themeOptions: ThemeOptions = {
    palette: {
      mode: 'dark',
      uranoGradient: 'linear-gradient(90deg, #5EBBC3 0%, #6DE7C2 100%)',
      uranoGreen1: { main: '#5EBBC3' },
      uranoGreen2: { main: '#6DE7C2' },
      transparentPaper: { main: 'rgba(21, 21, 21, 0.52)' },
      headerBorder: { main: '#242424' },
      footerBorder: { main: '#2E2E2E' },
      cardBorder1: { main: '#242424' },
      cardBorder2: 'linear-gradient(0deg, #242424, #242424), linear-gradient(260.63deg, rgba(107, 226, 194, 0.82) 2.15%, rgba(0, 0, 0, 0) 52.96%, #6BE2C2 100%)',
      primary: { main: '#000000' },
      secondary: { main: '#2D2D2D' },
      background: { default: '#131313', paper: '#151515' },
      text: { primary: '#ffffff', secondary: '#9F9F9F', disabled: '#F5F5F5' },
      error: { main: '#FF0000' },
      warning: { main: '#FFA500' },
      info: { main: '#000000' },
      success: { main: '#008000' },
      divider: '#000000',
      action: {
        active: '#000000',
        hover: '#000000',
        selected: '#000000',
        disabled: '#000000',
        focus: '#000000',
      },
      tonalOffset: 0.2,
      contrastThreshold: 3,
    },
  };

const theme: Theme = createTheme(themeOptions);

export default theme;
