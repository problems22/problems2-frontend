import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import axiosInstance from '../api/axios';

function Navbar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // This would normally come from an auth context/state
  const isLoggedIn = true;
  const userAvatar = 'avatar.jpg';

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    handleCloseUserMenu();

    try {
      const response = await axiosInstance.post('/users/user/logout');
      toast.success(response.data.message);
      navigate('/');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('Error setting up the request. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Quizzes', path: '/quizzes', icon: <QuizIcon /> },
    { text: 'Leaderboard', path: '/leaderboard', icon: <LeaderboardIcon /> },
  ];

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              mr: 2
            }}
          >
            Problems2
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.path} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={item.path}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {item.icon}
                    <Typography>{item.text}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            Problems2
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={handleCloseNavMenu}
                startIcon={item.icon}
                sx={{ color: 'text.primary' }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          <Box>
            {isLoggedIn ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar src={userAvatar} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/profile" 
                    onClick={handleCloseUserMenu}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                    ) : (
                      'Logout'
                    )}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 