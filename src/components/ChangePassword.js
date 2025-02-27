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
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    oldPassword: '',
    newPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/users/user/change-password', formData);
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
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your security credentials
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
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
                  id="oldPassword"
                  label="Current Password"
                  type={showPasswords.old ? 'text' : 'password'}
                  variant="outlined"
                  required
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                          edge="end"
                        >
                          {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  id="newPassword"
                  label="New Password"
                  type={showPasswords.new ? 'text' : 'password'}
                  variant="outlined"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={<KeyIcon />}
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
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </Stack>
            </form>

            <Box textAlign="center">
              <Link 
                to="/login"
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main'
                    }
                  }}
                >
                  Back to Sign In
                </Button>
              </Link>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default ChangePassword; 