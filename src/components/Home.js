import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Solve & Compete",
      items: [
        "Wide range of quizzes categorized by difficulty",
        "Compete with friends & track your ranking",
        "Leaderboard with global and weekly rankings"
      ]
    },
    {
      title: "Track & Improve",
      items: [
        "Detailed performance stats on your profile",
        "Charts & insights to analyze your progress over time",
        "Tag-based tracking to identify your strengths"
      ]
    },
    {
      title: "Stay Organized",
      items: [
        "Download quizzes as PDFs for offline practice",
        "Multiple result viewing options",
        "Submission history with detailed breakdowns"
      ]
    }
  ];

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Hero Section */}
          <Stack 
            spacing={4} 
            alignItems="center" 
            textAlign="center"
            sx={{ mb: 4 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Welcome to Problems2 🎯
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 'sm', mx: 'auto' }}
            >
              The ultimate platform to test your skills, track progress, and compete with friends!
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
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
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </Stack>

          {/* Features Section */}
          <Box component="section">
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{ mb: 4, fontWeight: 700 }}
            >
              🚀 Features You'll Love
            </Typography>
            
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 2,
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Stack spacing={1.5}>
                      {feature.items.map((item, i) => (
                        <Typography
                          key={i}
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.875rem' }}
                        >
                          • {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Call to Action Section */}
          <Box
            component="section"
            sx={{
              textAlign: 'center',
              py: 4,
              px: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 2, fontWeight: 700 }}
            >
              🎯 Get Started Now!
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Login to access quizzes, compete, and track progress
              <br />
              New here? Sign up and start solving!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 4,
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
              Create Account
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default Home; 