import { createMuiTheme } from '@material-ui/core/styles';

const customTheme = (darkMode) =>
  createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#2a00e7' : '#f3cf06',
      },
      secondary: {
        main: darkMode ? '#8b84e6' : '#003b03',
      },
    },
    overrides: {
      MuiMenuItem: {
        root: {
          '&$selected': {
            borderRight: '2px solid #000000',
            fontWeight: '800',
          },
        },
      },
      MuiPopover: {
        paper: {
          borderRadius: 3,
        },
      },
      MuiButton: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
      MuiChip: {
        root: {
          borderRadius: 3,
          padding: '0px',
        },
        outlined: {
          backgroundColor: darkMode ? '#004bbb48' : '#0669486e',
        },
      },
    },
    props: {
      MuiButton: {
        disableElevation: true,
      },
    },
  });

export default customTheme;
