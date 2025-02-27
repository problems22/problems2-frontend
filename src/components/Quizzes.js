import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
  Pagination,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Separate state for form inputs and actual filters
  const [formInputs, setFormInputs] = useState({
    searchTerm: '',
    difficulty: '',
    tags: [],
    minQuestions: '',
    maxQuestions: '',
    pageSize: 10
  });
  
  // State for active filters that will trigger API calls
  const [activeFilters, setActiveFilters] = useState({
    searchTerm: '',
    difficulty: '',
    tags: [],
    minQuestions: '',
    maxQuestions: '',
    pageSize: 10
  });

  const [tagInput, setTagInput] = useState('');

  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: activeFilters.pageSize
      });

      if (activeFilters.searchTerm) params.append('searchTerm', activeFilters.searchTerm);
      if (activeFilters.difficulty) params.append('difficulty', activeFilters.difficulty);
      if (activeFilters.tags.length > 0) activeFilters.tags.forEach(tag => params.append('tags', tag));
      if (activeFilters.minQuestions) params.append('withMinimumNumberOfQuestions', activeFilters.minQuestions);
      if (activeFilters.maxQuestions) params.append('withMaximumNumberOfQuestions', activeFilters.maxQuestions);

      const response = await axiosInstance.get(`/quizzes?${params}`);
      setQuizzes(response.data.quizzes);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
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

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/quizzes/stats');
      setStats(response.data);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('Error setting up the request. Please try again later.');
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, activeFilters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = tagInput.trim();
      if (!value) return;

      setFormInputs(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, value])]
      }));
      
      // Clear the input
      setTagInput('');
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setActiveFilters(formInputs);
    setCurrentPage(1);
  };

  const handleReset = () => {
    const defaultFilters = {
      searchTerm: '',
      difficulty: '',
      tags: [],
      minQuestions: '',
      maxQuestions: '',
      pageSize: 10
    };
    setFormInputs(defaultFilters);
    setActiveFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header Section */}
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Explore Quizzes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse through our collection of quizzes, filter by difficulty, or search for specific topics.
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              name="searchTerm"
              placeholder="Search quizzes by name or description..."
              value={formInputs.searchTerm}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ backgroundColor: 'background.paper' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Select
                name="difficulty"
                value={formInputs.difficulty}
                onChange={handleInputChange}
                displayEmpty
                sx={{ backgroundColor: 'background.paper' }}
              >
                <MenuItem value="">All Difficulties</MenuItem>
                <MenuItem value="EASY">Easy</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HARD">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid 
          container 
          spacing={3}
          alignItems="flex-start"
          sx={{ px: { xs: 0, sm: 0 } }}
        >
          {/* Left Side - Filters & Stats */}
          <Grid 
            item 
            xs={12} 
            md={3}
            sx={{ 
              position: { md: 'sticky' },
              top: { md: 24 },
              mb: { xs: 3, md: 0 },
              px: { xs: 2, sm: 0 } // Add horizontal padding on mobile
            }}
          >
            <Stack spacing={3}>
              {/* Stats Summary */}
              {stats && (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Quick Stats
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Total Quizzes:</Typography>
                      <Typography variant="body2" fontWeight={500}>{stats.totalQuizzes}</Typography>
                    </Stack>
                    <Divider />
                    <Stack spacing={1}>
                      <Chip 
                        label={`${stats.totalEasyQuizzes} Easy`}
                        color="success"
                        size="small"
                        variant="outlined"
                        sx={{ justifyContent: 'flex-start' }}
                      />
                      <Chip 
                        label={`${stats.totalMediumQuizzes} Medium`}
                        color="warning"
                        size="small"
                        variant="outlined"
                        sx={{ justifyContent: 'flex-start' }}
                      />
                      <Chip 
                        label={`${stats.totalHardQuizzes} Hard`}
                        color="error"
                        size="small"
                        variant="outlined"
                        sx={{ justifyContent: 'flex-start' }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              )}

              {/* Advanced Filters */}
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Advanced Filters
                </Typography>
                <form onSubmit={handleFilterSubmit}>
                  <Stack spacing={2}>
                    <Box>
                      {formInputs.tags.length > 0 && (
                        <Stack 
                          direction="row" 
                          spacing={1} 
                          flexWrap="wrap" 
                          sx={{ mb: 1.5, gap: 1 }}
                        >
                          {formInputs.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              onDelete={() => {
                                setFormInputs(prev => ({
                                  ...prev,
                                  tags: prev.tags.filter((_, i) => i !== index)
                                }));
                              }}
                              sx={{ 
                                my: 0.5,  // Add vertical margin
                                height: 24 // Consistent height
                              }}
                            />
                          ))}
                        </Stack>
                      )}
                      <TextField
                        fullWidth
                        name="tags"
                        label="Tags"
                        placeholder="Type tag and press Enter or comma"
                        helperText="Press Enter or comma after each tag"
                        value={tagInput}
                        onChange={handleTagsChange}
                        onKeyDown={handleTagInputKeyDown}
                        size="small"
                      />
                    </Box>
                    <TextField
                      fullWidth
                      type="number"
                      name="minQuestions"
                      label="Min. Questions"
                      value={formInputs.minQuestions}
                      onChange={handleInputChange}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      type="number"
                      name="maxQuestions"
                      label="Max. Questions"
                      value={formInputs.maxQuestions}
                      onChange={handleInputChange}
                      size="small"
                    />
                    
                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleReset}
                        disabled={isLoading}
                        startIcon={<RestartAltIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Reset
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        startIcon={<FilterAltIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Apply
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </Paper>

              {/* Popular Tags */}
              {stats && (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Popular Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {Object.entries(stats.totalTags)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([tag, count]) => (
                        <Chip 
                          key={tag}
                          label={`${tag} (${count})`}
                          size="small"
                          onClick={() => {
                            setFormInputs(prev => ({
                              ...prev,
                              tags: [...new Set([...prev.tags, tag])]
                            }));
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>

          {/* Right Side - Quiz List */}
          <Grid 
            item 
            xs={12} 
            md={9}
            sx={{ 
              px: { xs: 2, sm: 0 } // Add horizontal padding on mobile
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : quizzes.length > 0 ? (
              <Stack spacing={3}>
                <Grid 
                  container 
                  spacing={3}
                  sx={{ 
                    width: '100%',
                    margin: 0
                  }}
                >
                  {quizzes.map(quiz => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      key={quiz.id}
                    >
                      <Card 
                        sx={{
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
                        <CardActionArea 
                          onClick={() => handleQuizClick(quiz.id)}
                          sx={{ height: '100%', p: 2 }}
                        >
                          <CardContent>
                            <Stack spacing={2}>
                              <Typography variant="h6" component="h2">
                                {quiz.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {quiz.description}
                              </Typography>
                              
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Chip
                                  size="small"
                                  color={
                                    quiz.difficulty === 'EASY' ? 'success' :
                                    quiz.difficulty === 'MEDIUM' ? 'warning' : 'error'
                                  }
                                  label={quiz.difficulty}
                                />
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <QuizIcon fontSize="small" color="action" />
                                  <Typography variant="body2" color="text.secondary">
                                    {quiz.numberOfQuestions}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <AccessTimeIcon fontSize="small" color="action" />
                                  <Typography variant="body2" color="text.secondary">
                                    {quiz.timeLimit}m
                                  </Typography>
                                </Stack>
                              </Stack>

                              {quiz.tags.length > 0 && (
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                  {quiz.tags.map(tag => (
                                    <Chip
                                      key={tag}
                                      label={tag}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Stack>
                              )}
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {totalPages > 1 && (
                  <Stack alignItems="center" sx={{ mt: 3, width: '100%' }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, page) => setCurrentPage(page)}
                      disabled={isLoading}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            ) : (
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }}
              >
                <Typography color="text.secondary">
                  No quizzes found matching your criteria. Try adjusting your filters.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

export default Quizzes; 