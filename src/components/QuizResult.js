import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Grid,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';

function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      navigate('/quizzes');
    }
  }, [result, navigate]);

  if (!result) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatAverage = (number) => {
    return Number(number).toFixed(1);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 } }}>
      {/* Header Section */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/quizzes')}
        sx={{ 
          mb: 3,
          textTransform: 'none',
          borderRadius: 2
        }}
      >
        Back to Quizzes
      </Button>
      
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight={700} 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.75rem', sm: '2rem' },
          mb: 4
        }}
      >
        Quiz Results
      </Typography>

      {/* Score Overview Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={10}>
          {/* Points Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmojiEventsIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Your Score
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {result.obtainedPoints}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BarChartIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Average score: {formatAverage(result.averageObtainedPoints)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Time Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Time Taken
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {formatTime(result.timeTaken)}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Average time: {formatTime(Math.round(result.averageTimeTaken))}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Questions Summary Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          fontWeight={600} 
          gutterBottom
          sx={{ mb: 3, mt: 10 }}
        >
          Questions Summary
        </Typography>
        <Stack spacing={2}>
          {result.content.map((item, index) => (
            <Paper
              key={item.questionId}
              elevation={0}
              sx={{ 
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body1" fontWeight={500}>
                    Question {index + 1}
                  </Typography>
                  {item.correct ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Correct"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label="Incorrect"
                      color="error"
                      size="small"
                    />
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Submission Info */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Submitted on: {new Date(result.submissionDate).toLocaleString()}
        </Typography>
      </Box>

      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/quizzes')}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            py: 1.5,
            px: 4,
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            },
            transition: 'all 0.2s'
          }}
        >
          Back to All Quizzes
        </Button>
      </Box>
    </Container>
  );
}

export default QuizResult; 