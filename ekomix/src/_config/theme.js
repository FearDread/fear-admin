import { createTheme } from "@material-ui/core";

const theme = createTheme({
   palette: {
      mode: 'dark',
      primary: {
         main: '#020202',
         light: '#160202',
         contrastText: '#ffffff',
         dark: '#6d0e04',
       },
       secondary: {
         main: '#710202',
         light: '#620303',
         dark: 'rgba(0,0,0,0.86)',
       },
      background: {
        default: 'rgba(0,0,0,0.46)',
        paper: 'rgba(0,0,0,0.95)',
      },
      text: {
        secondary: 'rgba(125,9,9,0.7)',
        primary: '#fdf9f9',
      },
      info: {
        main: '#4e0701',
      },
      divider: 'rgba(94,24,24,0.91)',
    },
    overrides: {
      MuiAppBar: {
        colorInherit: {
          backgroundColor: '#689f38',
          color: '#fff',
        },
      },
    },
    props: {
      MuiAppBar: {
        color: 'inherit',
      },
      MuiButton: {
        size: 'small',
      },
      MuiButtonGroup: {
        size: 'small',
      },
      MuiCheckbox: {
        size: 'small',
      },
      MuiFab: {
        size: 'small',
      },
      MuiFormControl: {
        margin: 'dense',
        size: 'small',
      },
      MuiFormHelperText: {
        margin: 'dense',
      },
      MuiIconButton: {
        size: 'small',
      },
      MuiInputBase: {
        margin: 'dense',
      },
      MuiInputLabel: {
        margin: 'dense',
      },
      MuiRadio: {
        size: 'small',
      },
      MuiSwitch: {
        size: 'small',
      },
      MuiTextField: {
        margin: 'dense',
        size: 'small',
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 300,
      fontWeightBold: 600,
      htmlFontSize: 18,
      fontFamily: 'Droid Sans',
    },
});

export default theme;
