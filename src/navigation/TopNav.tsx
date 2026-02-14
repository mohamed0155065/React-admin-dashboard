import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { styled, useTheme, alpha, Theme } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ================== Constants ==================
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

// ================== Type Definitions ==================
interface AppBarStyledProps extends MuiAppBarProps {
    open?: boolean;
    ismobile?: string;
}

type ThemeMode = 'light' | 'dark';

interface TopNavProps {
    open: boolean;
    handleDrawerToggle: () => void;
    mode: ThemeMode;
    toggleMode: () => void;
}

interface Notification {
    id: number;
    title: string;
    description: string;
    time: string;
    read: boolean;
    color: string;
    initials: string;
}

// ================== Mock Notifications ==================
const mockNotifications: Notification[] = [
    { id: 1, title: 'New Invoice', description: 'Invoice #1042 has been paid.', time: '2 min ago', read: false, color: '#22c55e', initials: 'IN' },
    { id: 2, title: 'New Member', description: 'Sarah joined the design team.', time: '18 min ago', read: false, color: '#3b82f6', initials: 'SM' },
    { id: 3, title: 'Server Alert', description: 'CPU usage exceeded 90%.', time: '1 hr ago', read: true, color: '#f59e0b', initials: 'SA' },
    { id: 4, title: 'Deployment Done', description: 'v2.4.1 deployed successfully.', time: '3 hr ago', read: true, color: '#8b5cf6', initials: 'DD' },
];

// ================== Styled Components ==================

// AppBar with responsive width for mobile / collapsed / open
const StyledAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'ismobile',
})<AppBarStyledProps>(({ theme, open, ismobile }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backdropFilter: 'blur(12px)',
    background: theme.palette.mode === 'dark'
        ? 'rgba(15, 23, 42, 0.85)'
        : 'rgba(255, 255, 255, 0.88)',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
    boxShadow: 'none',
    color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b',

    // Mobile
    ...(ismobile === 'true' && { marginLeft: 0, width: '100%' }),

    // Desktop collapsed
    ...(ismobile !== 'true' && !open && {
        marginLeft: COLLAPSED_WIDTH,
        width: `calc(100% - ${COLLAPSED_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    }),

    // Desktop open
    ...(ismobile !== 'true' && open && {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Search Input
const SearchBox = styled(TextField)(({ theme }: { theme: Theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        fontSize: 13.5,
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        '& fieldset': { border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` },
        '&:hover fieldset': { borderColor: theme.palette.primary.main },
        '&.Mui-focused': {
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.09)' : '#fff',
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
            '& fieldset': { borderColor: theme.palette.primary.main },
        },
    },
    '& input::placeholder': { fontSize: 13.5, opacity: 0.6 },
}));

// IconButton with hover & theme styling
const NavIconButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
    width: 36,
    height: 36,
    borderRadius: '9px',
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        color: theme.palette.primary.main,
    },
}));

// ================== Notifications Popover ==================
interface NotifPopoverProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    notifications: Notification[];
    onMarkAllRead: () => void;
}

const NotificationsPopover: React.FC<NotifPopoverProps> = ({
    anchorEl, onClose, notifications, onMarkAllRead,
}) => {
    const theme = useTheme();
    const unread = notifications.filter((n) => !n.read).length;

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
                sx: {
                    mt: 1, width: 340, borderRadius: '14px',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    boxShadow: theme.palette.mode === 'dark' ? '0 16px 48px rgba(0,0,0,0.5)' : '0 16px 48px rgba(0,0,0,0.12)',
                    background: theme.palette.mode === 'dark' ? '#1e293b' : '#fff',
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header with unread count */}
            <Box sx={{ px: 2.5, py: 1.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={700} fontSize={14}>Notifications</Typography>
                    {unread > 0 && <Chip label={unread} size="small" color="error" sx={{ height: 18, fontSize: 10, '& .MuiChip-label': { px: 0.75 } }} />}
                </Box>
                <Tooltip title="Mark all as read">
                    <span>
                        <NavIconButton size="small" onClick={onMarkAllRead} disabled={unread === 0}>
                            <DoneAllIcon sx={{ fontSize: 17 }} />
                        </NavIconButton>
                    </span>
                </Tooltip>
            </Box>

            <Divider sx={{ opacity: 0.5 }} />

            {/* List of notifications */}
            <List disablePadding sx={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.map((notif, idx) => (
                    <React.Fragment key={notif.id}>
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                px: 2.5, py: 1.5, gap: 1.5,
                                background: !notif.read ? theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(25,118,210,0.03)' : 'transparent',
                                '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' },
                            }}
                        >
                            <ListItemAvatar sx={{ minWidth: 40, mt: 0.25 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: notif.color, fontSize: 11, fontWeight: 700 }}>
                                    {notif.initials}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <Typography fontSize={13} fontWeight={notif.read ? 500 : 700}>{notif.title}</Typography>
                                        {!notif.read && <FiberManualRecordIcon sx={{ fontSize: 8, color: 'primary.main' }} />}
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography fontSize={12} color="text.secondary" sx={{ lineHeight: 1.4 }}>{notif.description}</Typography>
                                        <Typography fontSize={11} color="text.disabled" sx={{ mt: 0.25 }}>{notif.time}</Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                        {idx < notifications.length - 1 && <Divider component="li" sx={{ opacity: 0.35 }} />}
                    </React.Fragment>
                ))}
            </List>

            <Divider sx={{ opacity: 0.5 }} />
            <Box sx={{ px: 2.5, py: 1.25, textAlign: 'center' }}>
                <Typography fontSize={12.5} fontWeight={600} color="primary"
                    sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={onClose}>
                    View all notifications
                </Typography>
            </Box>
        </Popover>
    );
};

// ================== TopNav Component ==================
const TopNav: React.FC<TopNavProps> = ({ open, handleDrawerToggle, mode, toggleMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // ===== States =====
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);
    const unreadCount = notifications.filter((n) => !n.read).length;

    // ===== Search debounce =====
    useEffect(() => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            if (query.trim().length > 2) fetchSuggestions(query.trim());
            else setSuggestions([]);
        }, 300);
        return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
    }, [query]);

    const fetchSuggestions = (q: string) => {
        setLoading(true);
        setTimeout(() => {
            setSuggestions([`${q} Developer`, `${q} Designer`, `${q} Engineer`, `${q} Manager`]);
            setLoading(false);
        }, 500);
    };

    const handleMarkAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    return (
        <>
            {/* ===== AppBar ===== */}
            <StyledAppBar position="fixed" open={open} ismobile={String(isMobile)}>
                <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 60 }, px: { xs: 1.5, sm: 2 } }}>

                    {/* Menu toggle */}
                    <Tooltip title={open ? 'Collapse sidebar' : 'Expand sidebar'}>
                        <NavIconButton onClick={handleDrawerToggle} edge="start">
                            {open ? <MenuOpenIcon sx={{ fontSize: 21 }} /> : <MenuIcon sx={{ fontSize: 21 }} />}
                        </NavIconButton>
                    </Tooltip>

                    {/* Mobile Brand */}
                    {isMobile && (
                        <Typography fontWeight={800} fontSize={15} color="primary" sx={{ letterSpacing: '0.02em' }}>
                            Admin Panel
                        </Typography>
                    )}

                    {/* Search */}
                    {!isMobile ? (
                        <Box sx={{ width: { sm: 260, md: 320 }, ml: 1 }}>
                            <Autocomplete
                                freeSolo
                                open={searchOpen && suggestions.length > 0}
                                onOpen={() => setSearchOpen(true)}
                                onClose={() => setSearchOpen(false)}
                                options={suggestions}
                                loading={loading}
                                onInputChange={(_e, value) => setQuery(value)}
                                renderInput={(params) => (
                                    <SearchBox
                                        {...params}
                                        size="small"
                                        placeholder="Search anything…"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <>
                                                    {loading ? <CircularProgress size={14} color="inherit" /> :
                                                        query.length > 0 && (
                                                            <InputAdornment position="end">
                                                                <NavIconButton size="small" onClick={() => { setQuery(''); setSuggestions([]); }} sx={{ width: 22, height: 22 }}>
                                                                    <CloseIcon sx={{ fontSize: 13 }} />
                                                                </NavIconButton>
                                                            </InputAdornment>
                                                        )}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    ) : (
                        <Tooltip title="Search">
                            <NavIconButton sx={{ ml: 'auto' }}>
                                <SearchIcon sx={{ fontSize: 20 }} />
                            </NavIconButton>
                        </Tooltip>
                    )}

                    {!isMobile && <Box sx={{ flexGrow: 1 }} />}

                    {/* Right Actions: Theme, Notifications, Settings, User */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 } }}>

                        {/* Theme toggle */}
                        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <NavIconButton onClick={toggleMode}>
                                {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 19 }} /> : <DarkModeIcon sx={{ fontSize: 19 }} />}
                            </NavIconButton>
                        </Tooltip>

                        {/* Notifications */}
                        <Tooltip title="Notifications">
                            <NavIconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
                                <Badge badgeContent={unreadCount} color="error"
                                    sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16, top: 1, right: 1 } }}>
                                    <NotificationsIcon sx={{ fontSize: 20 }} />
                                </Badge>
                            </NavIconButton>
                        </Tooltip>

                        {/* Settings desktop only */}
                        {!isMobile && (
                            <Tooltip title="Settings">
                                <NavIconButton>
                                    <SettingsIcon sx={{ fontSize: 19 }} />
                                </NavIconButton>
                            </Tooltip>
                        )}

                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, opacity: 0.3, height: 22, alignSelf: 'center' }} />

                        {/* User */}
                        <Tooltip title="Mohamed · Admin">
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 1,
                                pl: 0.5, pr: 0.25, py: 0.5, borderRadius: '10px', cursor: 'pointer',
                                transition: 'background 0.2s',
                                '&:hover': { background: mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)' },
                            }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar src="/صوره البدله والنضاره.jpg" alt="Mohamed"
                                        sx={{ width: 30, height: 30, border: '2px solid', borderColor: 'primary.main', boxShadow: '0 0 0 2px rgba(25,118,210,0.2)' }} />
                                    <Box sx={{
                                        position: 'absolute', bottom: 0, right: 0, width: 8, height: 8,
                                        borderRadius: '50%', backgroundColor: '#22c55e',
                                        border: '1.5px solid', borderColor: mode === 'dark' ? '#0f172a' : '#ffffff',
                                    }} />
                                </Box>
                                {!isMobile && (
                                    <Box>
                                        <Typography fontSize={12.5} fontWeight={700} sx={{ lineHeight: 1.2 }}>Mohamed</Typography>
                                        <Typography fontSize={10.5} color="text.disabled" fontWeight={500}>Admin</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Tooltip>

                    </Box>
                </Toolbar>
            </StyledAppBar>

            {/* Notifications Popover */}
            <NotificationsPopover
                anchorEl={notifAnchor}
                onClose={() => setNotifAnchor(null)}
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
            />
        </>
    );
};

export default TopNav;
