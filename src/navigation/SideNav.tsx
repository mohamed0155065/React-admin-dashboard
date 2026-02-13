import * as React from 'react';
import { styled, useTheme, alpha, Theme, CSSObject } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SvgIconProps } from '@mui/material/SvgIcon';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import ContactsIcon from '@mui/icons-material/Contacts';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QuizIcon from '@mui/icons-material/Quiz';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// ================= Constants =================
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

// ================= Types =================
type IconComponent = React.ComponentType<SvgIconProps>;

interface NavItemData {
  path: string;
  label: string;
  Icon: IconComponent;
  badge?: string;
}

interface NavSection {
  label: string; // Used for unique keys but not displayed as text
  items: NavItemData[];
}

interface SideNavProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

interface NavItemProps {
  item: NavItemData;
  open: boolean;
  isActive: boolean;
  onClick: () => void;
}

interface UserAvatarBlockProps {
  open: boolean;
}

// ================= Sidebar Sections =================
const sideNavSections: NavSection[] = [
  {
    label: 'Main',
    items: [
      { path: '/', label: 'Dashboard', Icon: HomeIcon },
      { path: '/groups', label: 'Groups', Icon: GroupIcon },
      { path: '/contacts', label: 'Contacts', Icon: ContactsIcon },
      { path: '/invoices', label: 'Invoices', Icon: ReceiptIcon, badge: '3' },
    ],
  },
  {
    label: 'User',
    items: [
      { path: '/profile', label: 'Profile', Icon: PersonIcon },
      { path: '/calendar', label: 'Calendar', Icon: CalendarMonthIcon },
      { path: '/faq', label: 'FAQ', Icon: QuizIcon },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { path: '/bar', label: 'Bar Chart', Icon: BarChartIcon },
      { path: '/pie', label: 'Pie Chart', Icon: PieChartIcon },
      { path: '/line', label: 'Line Chart', Icon: ShowChartIcon },
    ],
  },
];

// ================= Drawer Mixins =================
const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  overflowY: 'auto',
  '&::-webkit-scrollbar': { width: 4 },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.primary.main, 0.2),
    borderRadius: 4,
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: COLLAPSED_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  overflowY: 'hidden',
});

// ================= Styled Drawer =================
const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    borderRight: `1px solid ${theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.07)'
      }`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '4px 0 24px rgba(0,0,0,0.4)'
        : '4px 0 24px rgba(0,0,0,0.06)',
    ...(open ? openedMixin(theme) : closedMixin(theme)),
  },
}));

// ================= Nav Item =================
const NavItem: React.FC<NavItemProps> = ({ item, open, isActive, onClick }) => {
  const { label, Icon, badge } = item;

  const button = (
    <ListItemButton
      onClick={onClick}
      sx={{
        mx: 1,
        my: 0.25,
        px: open ? 1.75 : 0,
        py: 1.1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
        gap: open ? 1.5 : 0,
        position: 'relative',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? 'primary.main' : 'transparent',
        color: isActive ? '#fff' : 'text.secondary',
        '&:hover': {
          backgroundColor: isActive
            ? 'primary.dark'
            : (theme: Theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.07)'
                : 'rgba(25, 118, 210, 0.07)',
          color: isActive ? '#fff' : 'primary.main',
          transform: 'translateX(2px)',
        },
        ...(isActive && {
          boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: 28 }}>
        <Icon sx={{ fontSize: 22 }} />
        {badge && !open && (
          <Box sx={{
            position: 'absolute', top: -4, right: -6, width: 16, height: 16,
            borderRadius: '50%', backgroundColor: 'error.main', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff',
          }}>
            {badge}
          </Box>
        )}
      </Box>

      {open && (
        <>
          <ListItemText
            primary={label}
            primaryTypographyProps={{ fontSize: 13.5, fontWeight: isActive ? 600 : 500, letterSpacing: '0.01em' }}
            sx={{ my: 0 }}
          />
          {badge && (
            <Chip
              label={badge} size="small" color={isActive ? 'default' : 'error'}
              sx={{
                height: 18, fontSize: 10, fontWeight: 700, ml: 'auto',
                bgcolor: isActive ? 'rgba(255,255,255,0.25)' : undefined,
                color: isActive ? '#fff' : undefined,
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
          )}
        </>
      )}
    </ListItemButton>
  );

  return open ? button : <Tooltip title={label} placement="right" arrow>{button}</Tooltip>;
};

// ================= User Avatar Block =================
const UserAvatarBlock: React.FC<UserAvatarBlockProps> = ({ open }) => (
  <Box sx={{
    display: 'flex', flexDirection: open ? 'row' : 'column',
    alignItems: 'center', justifyContent: open ? 'flex-start' : 'center',
    gap: open ? 1.5 : 0, mx: open ? 1.5 : 0, px: open ? 1.5 : 0, py: 2,
    borderRadius: open ? '12px' : 0,
    background: open ? (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(25, 118, 210, 0.05)' : 'transparent',
    transition: 'all 0.35s ease',
  }}>
    <Box sx={{ position: 'relative', flexShrink: 0 }}>
      <Avatar
        src="/صوره البدله والنضاره.jpg"
        alt="Mohamed"
        sx={{
          width: open ? 44 : 38, height: open ? 44 : 38, border: '2px solid',
          borderColor: 'primary.main', transition: 'all 0.35s ease',
          boxShadow: '0 0 0 3px rgba(25,118,210,0.15)',
        }}
      />
      <Box sx={{
        position: 'absolute', bottom: 1, right: 1, width: 10, height: 10,
        borderRadius: '50%', backgroundColor: '#22c55e', border: '2px solid',
        borderColor: (theme: Theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff',
      }} />
    </Box>

    {open && (
      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
        <Typography fontWeight={700} fontSize={14} sx={{ lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Mohamed
        </Typography>
        <Typography fontSize={11.5} fontWeight={500} sx={{ color: 'primary.main', letterSpacing: '0.04em' }}>
          Admin
        </Typography>
      </Box>
    )}
  </Box>
);

// ================= Toggle Button =================
const ToggleButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  width: 28, height: 28, borderRadius: '8px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(4px)',
  transition: 'all 0.2s ease',
  '&:hover': { background: theme.palette.primary.main, borderColor: theme.palette.primary.main, color: '#fff', transform: 'scale(1.05)' },
}));

// ================= Drawer Header =================
export const DrawerHeader = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: theme.spacing(0, 1.5), ...theme.mixins.toolbar,
}));

// ================= Main Component =================
const SideNav: React.FC<SideNavProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isActive = (path: string): boolean => location.pathname === path;

  // On mobile: use temporary drawer
  if (isMobile) {
    return (
      <MuiDrawer
        variant="temporary" open={open} onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            background: theme.palette.mode === 'dark' ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            borderRight: 'none', boxShadow: '8px 0 32px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DrawerHeader sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography fontWeight={800} fontSize={15} letterSpacing="0.02em" color="primary">Admin Panel</Typography>
          <ToggleButton onClick={handleDrawerToggle} size="small"><CloseIcon sx={{ fontSize: 16 }} /></ToggleButton>
        </DrawerHeader>

        <Box sx={{ px: 1, pb: 1 }}><UserAvatarBlock open={true} /></Box>
        <Divider sx={{ mx: 2, opacity: 0.5 }} />

        <List disablePadding sx={{ pt: 1 }}>
          {sideNavSections.map((section, sIdx) => (
            <Box key={section.label}>
              {/* Divider between sections on mobile */}
              {sIdx !== 0 && <Divider sx={{ my: 1, mx: 2, opacity: 0.5 }} />}
              {section.items.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <NavItem
                    item={item} open={true} isActive={isActive(item.path)}
                    onClick={() => { navigate(item.path); handleDrawerToggle(); }}
                  />
                </ListItem>
              ))}
            </Box>
          ))}
        </List>
      </MuiDrawer>
    );
  }

  // Desktop: permanent collapsible drawer
  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader>
        {open && <Typography fontWeight={800} fontSize={15} letterSpacing="0.02em" color="primary" sx={{ pl: 0.5 }}>Admin Panel</Typography>}
        <ToggleButton onClick={handleDrawerToggle} size="small" sx={{ ml: 'auto' }}>
          {open ? <CloseIcon sx={{ fontSize: 15 }} /> : <MenuIcon sx={{ fontSize: 15 }} />}
        </ToggleButton>
      </DrawerHeader>

      <Box sx={{ pb: 0.5 }}><UserAvatarBlock open={open} /></Box>
      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <List
        disablePadding
        sx={{
          pt: 1, pb: 2, overflowY: open ? 'auto' : 'hidden', overflowX: 'hidden', flexGrow: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.2), borderRadius: 4 },
        }}
      >
        {sideNavSections.map((section, sIdx) => (
          <Box key={section.label}>
            {/* THIS IS THE SECTION SEPARATOR (DIVIDER) */}
            {sIdx !== 0 && (
              <Divider
                sx={{
                  my: 1.5,
                  mx: open ? 2.5 : 2,
                  opacity: 0.5,
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
                }}
              />
            )}

            {section.items.map((item) => (
              <ListItem key={item.path} disablePadding>
                <NavItem
                  item={item} open={open} isActive={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                />
              </ListItem>
            ))}
          </Box>
        ))}
      </List>

      {open && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e', flexShrink: 0 }} />
          <Typography fontSize={11} color="text.disabled" fontWeight={500}>v1.0.0 · All systems normal</Typography>
        </Box>
      )}
    </StyledDrawer>
  );
};

export default SideNav;