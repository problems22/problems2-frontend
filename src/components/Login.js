import { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/users/user/login', formData);
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

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            minHeight: '450px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Stack spacing={3} sx={{ flex: 1 }}>
            <Box textAlign="center" sx={{ mb: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please sign in to continue
              </Typography>
            </Box>

            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  id="username"
                  label="Username"
                  variant="outlined"
                  required
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  disabled={isLoading}
                />

                <TextField
                  fullWidth
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>

            <Stack spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
              <Link 
                to="/register"
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Typography 
                  variant="body2" 
                  color="primary"
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Don't have an account? Sign Up
                </Typography>
              </Link>
              <Link 
                to="/change-password"
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.main'
                    }
                  }}
                >
                  Change your password
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 