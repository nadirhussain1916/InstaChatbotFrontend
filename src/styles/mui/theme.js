import { createTheme } from '@mui/material';

// Clean minimalistic color palette for content creators
const mainDark = '#090040';      // Deep navy
const mainPurple = '#471396';    // Deep purple
const accentPurple = '#B13BFF';  // Bright purple
const accentYellow = '#FFCC00';  // Golden yellow

// Clean background colors
const lightBg = '#ffffff';

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
    mode: 'light',
    primary: {
      main: mainPurple,
      light: accentPurple,
      dark: mainDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: accentPurple,
      light: '#e0b3ff',
      dark: mainPurple,
      contrastText: '#ffffff',
    },
    accent: {
      main: accentYellow,
      light: '#fff3b3',
      dark: '#e6b800',
      contrastText: '#090040',
    },
    background: {
      default: mainDark,
      paper: lightBg,
    },
    text: {
      primary: '#090040',
      secondary: 'rgba(9, 0, 64, 0.7)',
      disabled: 'rgba(9, 0, 64, 0.4)',
    },
    divider: 'rgba(177, 59, 255, 0.1)',
    instagram: {
      main: accentPurple,
      light: mainPurple,
      dark: mainDark,
      contrastText: '#ffffff',
    },
    success: {
      main: '#16A34A',
      light: '#4ADE80',
      dark: '#15803D',
    },
    warning: {
      main: accentYellow,
      light: '#FEF08A',
      dark: '#CA8A04',
    },
    error: {
      main: '#DC2626',
      light: '#F87171',
      dark: '#B91C1C',
    },
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '2.25rem',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '2rem',
      },

      '@media (max-width: 570px)': {
        fontSize: '1.75rem',
      },
    },

    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.3,

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '2rem',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '1.75rem',
      },

      '@media (max-width: 570px)': {
        fontSize: '1.5rem',
      },
    },

    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.4,

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '1.5rem',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '1.375rem',
      },

      '@media (max-width: 570px)': {
        fontSize: '1.125rem',
      },
    },

    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.4,

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '1.25rem',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '1.125rem',
      },

      '@media (max-width: 570px)': {
        fontSize: '1rem',
      },
    },

    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '-0.025em',
      lineHeight: 1.5,

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '1.125rem',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '1rem',
      },

      '@media (max-width: 570px)': {
        fontSize: '0.875rem',
      },
    },

    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      letterSpacing: '-0.025em',
      lineHeight: 1.5,

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '1rem',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '0.875rem',
      },

      '@media (max-width: 570px)': {
        fontSize: '0.8125rem',
      },
    },

    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,

      '@media (min-width: 768px) and (max-width: 991px)': {
        fontSize: '0.875rem',
      },

      '@media (max-width: 768px) and (min-width: 570px)': {
        fontSize: '0.875rem',
      },

      '@media (max-width: 570px)': {
        fontSize: '0.8125rem',
      },
    },

    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.8)',
    },

    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.025em',
      textTransform: 'none',
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
          borderColor: 'rgba(177, 59, 255, 0.2)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(177, 59, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(9, 0, 64, 0.08)',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#ffffff',
            borderRadius: '8px',
            '& fieldset': {
              borderColor: 'rgba(177, 59, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(177, 59, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: accentPurple,
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(9, 0, 64, 0.7)',
            '&.Mui-focused': {
              color: accentPurple,
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#090040',
          },
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
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '12px',
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: mainPurple,
            border: 'none',
            boxShadow: '0 2px 8px rgba(71, 19, 150, 0.2)',
            '&:hover': {
              background: accentPurple,
              boxShadow: '0 4px 12px rgba(177, 59, 255, 0.3)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            background: accentYellow,
            color: mainDark,
            border: 'none',
            boxShadow: '0 2px 8px rgba(255, 204, 0, 0.2)',
            '&:hover': {
              background: '#e6b800',
              boxShadow: '0 4px 12px rgba(255, 204, 0, 0.3)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            border: `1px solid ${accentPurple}`,
            color: accentPurple,
            background: 'transparent',
            '&:hover': {
              background: accentPurple,
              color: '#ffffff',
              border: `1px solid ${accentPurple}`,
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {
            border: `1px solid ${accentYellow}`,
            color: accentYellow,
            background: 'transparent',
            '&:hover': {
              color: mainDark,
              background: accentYellow,
              border: `1px solid ${accentYellow}`,
            },
          },
        },
      ],
    },
  },
});

export default theme;
