import { createTheme } from '@mui/material';

import { primary, secondary, yellow, green, purple, red  } from '@styles/common/colors';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },

  palette: {
    primary: {
      main: primary,
      light: 'rgba(0, 143, 213, 0.1)',
      dark: 'rgba(0, 143, 213, 0.2)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondary,
      light: '#EDECEC',
    },
    yellow: {
      main: yellow,
      light: 'rgba(255, 159, 41, 0.16)',
      brightLight: '#FEF9C3',
      dark: '#F59E0B',
    },
    green: {
      main: green,
      light: 'rgba(22, 163, 74, 0.1)',
      dark: 'rgba(22, 163, 74, 0.2)',
    },
    purple: {
      main: purple,
      light: 'rgba(153, 53, 254, 0.16)',
    },
    red: {
      main: red,
      light: 'rgba(220, 38, 38, 0.1)',
      dark: 'rgba(220, 38, 38, 0.15)',
    },
  },

  typography: {
    fontFamily: 'Montserrat, sans-serif',

    h1: {
      fontSize: '48px',
      fontWeight: '500',

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '35px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '30px',
      },

      '@media (max-width: 570px)': {
        fontSize: '25px',
      },
    },

    h2: {
      fontSize: '45px',
      fontWeight: '500',
      textTransform: 'capitalize',

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '32px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '28px',
      },

      '@media (max-width: 570px)': {
        fontSize: '22px',
      },
    },

    h3: {
      fontSize: '30px',
      fontWeight: '500',

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '24px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '22px',
      },

      '@media (max-width: 570px)': {
        fontSize: '18px',
      },
    },

    h5: {
      fontSize: '24px',
      fontWeight: '500',
      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '20px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '18px',
      },

      '@media (max-width: 570px)': {
        fontSize: '16px',
      },
    },

    h6: {
      fontSize: '18px',
      fontWeight: '400',
      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '17px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '16px',
      },

      '@media (max-width: 570px)': {
        fontSize: '15px',
      },
    },

    body1: {
      fontSize: '16px',

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '16px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '14px',
      },

      '@media (max-width: 570px)': {
        fontSize: '14px',
      },
    },

    label: {
      fontFamily: 'Roboto Flex, sans-serif',
      fontSize: '15px',
      color: '#422438',
      fontWeight: '500',

      '@media (max-width: 540px)': {
        fontSize: '14px',
      },
    },

    p: {
      '@media (min-width: 1650px) and (max-width: 1950px)': {
        fontSize: '18px',
      },
      '@media (min-width: 1950px)': {
        fontSize: '20px',
      },
    },

    title: {
      fontSize: '20px',
      fontFamily: 'Poppins, sans-serif',
      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '16px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '14px',
      },

      '@media (max-width: 570px)': {
        fontSize: '14px',
      },
    },

    caption: {
      fontSize: '14px',
      fontFamily: 'Poppins, sans-serif',
    },

    dashboardh1: {
      fontFamily: 'Roboto Flex, sans-serif',
      fontSize: '24px',
      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '16px',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '14px',
      },

      '@media (max-width: 570px)': {
        fontSize: '14px',
      },
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        fixed: false,
        maxWidth: 'xl',
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#EBECEF',
        },
      },
    },

    MuiTypography: {
      defaultProps: {
        variantMapping: {
          pageTitle: 'h1',
          title: 'h1',
          description: 'p',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            border: 'none',
            '&:hover': {
              background: primary,
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            border: 'none',
            '&:hover': {
              background: secondary,
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            '&:hover': {
              background: primary,
              color: '#ffffff',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {
            '&:hover': {
              color: '#ffffff',
              background: secondary,
            },
          },
        },
      ],
    },
  },
});

export default theme;
