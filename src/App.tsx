import * as React from 'react';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TopNav from './navigation/TopNav';
import SideNav, { DrawerHeader } from './navigation/SideNav';
import { Routes, Route } from 'react-router-dom';
import { routes } from './router/Routes';

// Sidebar dimensions
const DRAWER_WIDTH = 220;
const COLLAPSED_WIDTH = 60;

const PageLoader = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
    <CircularProgress size={32} />
  </Box>
);

export default function App() {
  const [open, setOpen] = useState<boolean>(true);
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem('themeMode') as any) || 'dark'
  );

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#09090b' : '#f8fafc',
        paper: mode === 'dark' ? '#18181b' : '#ffffff',
      },
      primary: { main: '#3b82f6' },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    },
    typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            backgroundImage: 'none',
          },
        },
      },
    }
  }), [mode]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>

        <TopNav
          open={open}
          handleDrawerToggle={() => setOpen(!open)}
          mode={mode}
          toggleMode={() => setMode(m => m === 'light' ? 'dark' : 'light')}
        />

        <SideNav open={open} handleDrawerToggle={() => setOpen(!open)} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            transition: theme.transitions.create(['margin-left', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            // Logic: Shifts the entire main container based on Sidebar width
            marginLeft: isMobile ? 0 : open ? `${DRAWER_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
            width: isMobile ? '100%' : `calc(100% - ${open ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)`,
          }}
        >
          <DrawerHeader />

          {/* Viewport: pl (padding-left) set to near-zero to remove the gap */}
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            pl: { xs: 2, md: 0.5 }, // Tightest possible gap from sidebar
            pr: { xs: 2, md: 6 },   // Significant right padding to keep space on the other side
            py: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Anchored to the left
          }}>

            {/* Content Wrapper */}
            <Box sx={{
              width: '100%',
              maxWidth: '1440px', // Wider allowed area
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              ml: 0,
            }}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {routes.map(({ path, element }) => (
                    <Route
                      key={path}
                      path={path}
                      element={React.cloneElement(element as React.ReactElement<any>, { mode })}
                    />
                  ))}
                </Routes>
              </Suspense>
            </Box>

          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}