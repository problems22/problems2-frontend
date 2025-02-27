import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import TimelineIcon from '@mui/icons-material/Timeline';
import CircularProgress from '@mui/material/CircularProgress';
import { format as formatDate, formatDistanceToNow, subYears, startOfDay } from 'date-fns';
import GradeIcon from '@mui/icons-material/Grade';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Rectangle,
  ScatterChart,
  Scatter,
} from 'recharts';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0';
  return Number(value).toFixed(decimals);
};

// Helper functions
const formatTime = (seconds) => {
  if (!seconds) return '0s';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0 
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

const getRankMedal = (rankTitle) => {
  const ranks = {
    RECRUIT: '🔰',
    APPRENTICE: '🥉',
    NOVICE: '🥈',
    WARRIOR: '🥇',
    ELITE_SOLDIER: '⚔️',
    GLADIATOR: '🛡️',
    CHAMPION: '👑',
    VETERAN: '🏆',
    WARLORD: '⚡',
    MASTER_FIGHTER: '🌟',
    GRANDMASTER: '💫',
    LEGEND: '🌈',
    SHADOW_SLAYER: '🌑',
    TITAN: '🌋',
    MYTHIC_CONQUEROR: '🔮',
    IMMORTAL_GUARDIAN: '🌠',
    CELESTIAL_KNIGHT: '✨',
    GOD_OF_WAR: '🎯',
    ETERNAL_OVERLORD: '💎',
    ASCENDED_DEITY: '👻'
  };
  return ranks[rankTitle] || '🎮';
};

function Profile() {
  const { username } = useParams();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If we have profile data from navigation state, use it
        if (location.state?.profileData) {
          setProfile(location.state.profileData);
          setIsLoading(false);
          return;
        }

        // Otherwise fetch the full profile
        const response = await axiosInstance.get(
          username ? `/users/user/leaderboard/profile/${username}` : '/users/user/profile'
        );
        setProfile(response.data);
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, location.state]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return null;
  }

  const DIFFICULTY_COLORS = {
    EASY: '#4caf50',
    MEDIUM: '#ff9800',
    HARD: '#f44336'
  };

  const getProgressColor = (rate) => {
    if (rate >= 70) return 'success.main';
    if (rate >= 40) return 'warning.main';
    return 'error.main';
  };

  // Transform activity data for the heatmap
  const transformActivityData = () => {
    if (!profile.quizzesOverTime) return [];
    
    // Create an array of all dates between first and last submission
    const dates = Object.keys(profile.quizzesOverTime).sort();
    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    
    // Create a map of date to count for quick lookup
    const countMap = {};
    Object.entries(profile.quizzesOverTime).forEach(([dateStr, count]) => {
      const formattedDate = formatDate(new Date(dateStr), 'MMM dd');
      countMap[formattedDate] = (countMap[formattedDate] || 0) + count;
    });

    // Fill in missing dates with 0
    const result = [];
    let currentDate = firstDate;
    while (currentDate <= lastDate) {
      const formattedDate = formatDate(currentDate, 'MMM dd');
      result.push({
        date: formattedDate,
        value: countMap[formattedDate] || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  };

  const handleResultClick = (result) => {
    navigate(`/quiz/${result.quizId}/result`, { 
      state: { result }
    });
  };

  // Add this helper function to check if we're viewing a leaderboard profile
  const isLeaderboardProfile = () => {
    return username && !profile?.recentResults;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 3,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Avatar
              src={profile.avatar}
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                border: '4px solid',
                borderColor: 'primary.main'
              }}
            />
            <Box sx={{ 
              flex: 1, 
              textAlign: { xs: 'center', sm: 'left' },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              justifyContent: 'space-between',
              gap: 2
            }}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {profile.username}
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  alignItems={{ xs: 'center', sm: 'flex-start' }}
                >
                  <Chip
                    icon={<MilitaryTechIcon />}
                    label={profile.rankTitle}
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Member since {formatDate(new Date(profile.memberSince), 'MMMM d, yyyy')}
                  </Typography>
                </Stack>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<LeaderboardIcon />}
                onClick={() => navigate('/leaderboard')}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                View Leaderboard
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Overview */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {profile.stats.correctAnswers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Correct Answers
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <CancelIcon color="error" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {profile.stats.incorrectAnswers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Incorrect Answers
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <TimerIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {formatTime(profile.totalTimeTaken)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Time
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {profile.stats.totalAttempts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Attempts
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Rank Progress Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" gutterBottom>
                    {getRankMedal(profile.rankTitle)}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {profile.rankTitle.replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(profile.rankPoints)} Points
                  </Typography>
                </Box>
                
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Next Rank
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatNumber(profile.nextRankPoints - profile.rankPoints)} points needed
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((profile.rankPoints / profile.nextRankPoints) * 100, 100)} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main'
                      }
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Stats Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Performance Stats
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ color: getProgressColor(profile.accuracyRate) }}
                  >
                    {formatNumber(profile.accuracyRate, 1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accuracy Rate
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {formatNumber(profile.averagePointsPerQuiz, 1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Points
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {formatNumber(profile.averageTimeTaken, 1)}m
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Time
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {formatNumber(profile.weeklyPoints)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weekly Points
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Chart */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Activity
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transformActivityData()}>
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      allowDecimals={false}
                      domain={[0, 'auto']}  // This ensures the Y-axis starts at 0 and scales properly
                      label={{ 
                        value: 'Submissions', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: 12 }
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} submissions`]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      fill="url(#colorActivity)"
                      dot={{ fill: theme.palette.primary.main }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quizzes by Difficulty */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quizzes by Difficulty
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {['EASY', 'MEDIUM', 'HARD'].map((difficulty) => {
                  const count = profile.quizzesByDifficulty[difficulty] || 0;
                  const color = DIFFICULTY_COLORS[difficulty];
                  
                  return (
                    <Box key={difficulty}>
                      <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center" 
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {count} {count === 1 ? 'quiz' : 'quizzes'}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: color,
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Results Card - Conditionally render */}
        {!isLeaderboardProfile() && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recent Results
                </Typography>
                <Stack spacing={2}>
                  {profile.recentResults?.map((result, index) => {
                    const correctCount = result.content.filter(q => q.correct).length;
                    const incorrectCount = result.content.length - correctCount;
                    const accuracy = (correctCount / result.content.length) * 100;
                    
                    return (
                      <Paper 
                        key={index}
                        onClick={() => handleResultClick(result)}
                        sx={{ 
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'background.default',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                                {formatDistanceToNow(new Date(result.submissionDate))} ago
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={6} sm={2}>
                                <Stack spacing={0.5}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                                    <Typography>{correctCount}</Typography>
                                  </Stack>
                                  <Typography variant="body2" color="text.secondary">Correct</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={6} sm={2}>
                                <Stack spacing={0.5}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <CancelIcon color="error" sx={{ fontSize: 20 }} />
                                    <Typography>{incorrectCount}</Typography>
                                  </Stack>
                                  <Typography variant="body2" color="text.secondary">Incorrect</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={6} sm={2}>
                                <Stack spacing={0.5}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <EmojiEventsIcon color="primary" sx={{ fontSize: 20 }} />
                                    <Typography>{result.obtainedPoints}</Typography>
                                  </Stack>
                                  <Typography variant="body2" color="text.secondary">Points</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={6} sm={2}>
                                <Stack spacing={0.5}>
                                  <Typography fontWeight="medium">
                                    {formatTime(result.timeTaken)}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">Time</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={6} sm={2}>
                                <Stack spacing={0.5}>
                                  <Typography 
                                    fontWeight="medium"
                                    sx={{ color: getProgressColor(accuracy) }}
                                  >
                                    {formatNumber(accuracy, 1)}%
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">Accuracy</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Profile; 