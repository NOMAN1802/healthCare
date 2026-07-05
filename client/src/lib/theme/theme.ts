import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
   // Base radius unit = 4px → all MUI components that use `borderRadius: X`
   // will resolve to multiples of 4px. Setting shape.borderRadius = 4 makes
   // the default MUI radius (1 unit) equal to 4px (Tailwind's rounded-sm).
   shape: {
      borderRadius: 1,
   },

   palette: {
      primary: {
         main: '#1586FD',
      },
      secondary: {
         main: '#666f73',
         light: '#f8f8f8',
      },
   },

   components: {
      MuiButton: {
         defaultProps: {
            variant: 'contained',
         },
         styleOverrides: {
            root: {
               padding: '8px 24px',
               borderRadius: 1,
               textTransform: 'none',
            },
         },
      },
      MuiCard: {
         styleOverrides: {
            root: {
               borderRadius: 1,
            },
         },
      },
      MuiPaper: {
         styleOverrides: {
            root: {
               borderRadius: 1,
            },
         },
      },
      MuiDialog: {
         styleOverrides: {
            paper: {
               borderRadius: 1,
            },
         },
      },
      MuiChip: {
         styleOverrides: {
            root: {
               borderRadius: 1,
            },
         },
      },
      MuiTextField: {
         styleOverrides: {
            root: {
               '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
               },
            },
         },
      },
      MuiSelect: {
         styleOverrides: {
            outlined: {
               borderRadius: 1,
            },
         },
      },
      MuiTableContainer: {
         styleOverrides: {
            root: {
               borderRadius: 1,
            },
         },
      },
      MuiTableCell: {
         styleOverrides: {
            root: {
               '&:first-of-type': {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
               },
               '&:last-of-type': {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
               },
            },
         },
      },
      MuiAlert: {
         styleOverrides: {
            root: {
               borderRadius: 1,
            },
         },
      },
      MuiContainer: {
         defaultProps: {
            maxWidth: 'lg',
         },
      },
   },
   typography: {
      body1: {
         color: '#0B1134CC',
      },
   },
});

theme.shadows[1] = '0px 5px 22px lightgray';
