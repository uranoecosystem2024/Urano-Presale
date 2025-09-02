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
      transparentPaper: string
      headerBorder: string
      cardBorder1: string
      cardBorder2: string
      footerBorder: string
    }
  
    interface PaletteOptions {
        uranoGradient: string
      uranoGreen1: {
        main: string
      }
      uranoGreen2: {
        main: string
      }
      transparentPaper: string
      headerBorder: string
      cardBorder1: string
      cardBorder2: string
      footerBorder: string
    }
  }

const themeOptions: ThemeOptions = {
    palette: {
      mode: 'dark',
      uranoGradient: 'linear-gradient(90deg, #5EBBC3 0%, #6DE7C2 100%)',
      uranoGreen1: { main: '#5EBBC3' },
      uranoGreen2: { main: '#6DE7C2' },
      transparentPaper: 'rgba(21, 21, 21, 0.52)',
      headerBorder: '#242424',
      footerBorder: '#2E2E2E',
      cardBorder1: '#242424',
      cardBorder2: 'linear-gradient(0deg, #242424, #242424), linear-gradient(260.63deg, rgba(107, 226, 194, 0.82) 2.15%, rgba(0, 0, 0, 0) 52.96%, #6BE2C2 100%)',
      primary: { main: '#000000' },
      secondary: { main: '#000000' },
      background: { default: '#131313', paper: '#151515' },
      text: { primary: '#ffffff' },
      error: { main: '#FF0000' },
      warning: { main: '#FFA500' },
      info: { main: '#0000FF' },
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
