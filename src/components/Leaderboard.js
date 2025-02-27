import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
  Grid
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axiosInstance.get('/users/user/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        toast.error('Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderCurrentUserStats = () => {
    if (!leaderboard?.userPoints) return null;

    return (
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="bold">
            Your Rankings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <EmojiEventsIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Overall Rank Points
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {leaderboard.userPoints.rankPoints}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <WorkspacePremiumIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Weekly Points
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {leaderboard.userPoints.weeklyPoints}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    );
  };

  const handleUserClick = async (username) => {
    try {
      // Use the leaderboard profile endpoint instead
      const response = await axiosInstance.get(`/users/user/leaderboard/profile/${username}`);
      // Navigate to profile with the fetched data
      navigate(`/profile/${username}`, { 
        state: { profileData: response.data }
      });
    } catch (error) {
      toast.error('Failed to load user profile');
    }
  };

  const getMedalColor = (position) => {
    switch (position) {
      case 1: return theme.palette.warning.light; // Gold
      case 2: return theme.palette.grey[400];     // Silver
      case 3: return theme.palette.warning.dark;  // Bronze
      default: return theme.palette.grey[300];
    }
  };

  const renderRankIcon = (position) => {
    switch (position) {
      case 1:
        return <EmojiEventsIcon sx={{ color: getMedalColor(1), fontSize: 28 }} />;
      case 2:
        return <WorkspacePremiumIcon sx={{ color: getMedalColor(2), fontSize: 28 }} />;
      case 3:
        return <MilitaryTechIcon sx={{ color: getMedalColor(3), fontSize: 28 }} />;
      default:
        return <Typography variant="h6" color="text.secondary">{position}</Typography>;
    }
  };

  const renderLeaderboardList = (data) => {
    const sortedUsers = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .map(([username, points], index) => ({
        position: index + 1,
        username,
        points
      }));

    return (
      <Stack spacing={2} sx={{ mt: 3 }}>
        {sortedUsers.map((user) => (
          <Paper
            key={user.username}
            elevation={0}
            onClick={() => handleUserClick(user.username)}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'background.default',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateX(8px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box 
                sx={{ 
                  minWidth: 50,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {renderRankIcon(user.position)}
              </Box>
              
              <Avatar 
                src={`https://api.dicebear.com/8.x/pixel-art/png?seed=${user.username}`}
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: '2px solid',
                  borderColor: getMedalColor(user.position)
                }}
              />
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {user.username}
                </Typography>
              </Box>
              
              <Chip 
                label={`${user.points} points`}
                color="primary"
                variant={user.position <= 3 ? "filled" : "outlined"}
                size="small"
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Leaderboard
      </Typography>
      
      {renderCurrentUserStats()}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab label="Overall Ranking" />
          <Tab label="Weekly Ranking" />
        </Tabs>
      </Box>

      {activeTab === 0 && leaderboard && renderLeaderboardList(leaderboard.rank)}
      {activeTab === 1 && leaderboard && renderLeaderboardList(leaderboard.weeklyRank)}
    </Container>
  );
}

export default Leaderboard; 