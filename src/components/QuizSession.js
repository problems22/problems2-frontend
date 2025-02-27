import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function QuizSession() {
  const location = useLocation();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [startTime] = useState(Date.now());
  const [openStopDialog, setOpenStopDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);

  useEffect(() => {
    console.log('Location state:', location.state);
    if (location.state?.questions) {
      const questionsList = location.state.questions;
      setQuestions(questionsList);
      
      // Set the time limit from the quiz data
      if (location.state.timeLimit) {
        setTimeLimit(location.state.timeLimit * 60); // Convert minutes to seconds
      }
      
      // Initialize answers object based on question types
      const initialAnswers = questionsList.reduce((acc, question) => {
        if (question.content.type === 'MULTIPLE_SELECT') {
          acc[question.id] = [];
        } else {
          acc[question.id] = '';
        }
        return acc;
      }, {});
      
      setAnswers(initialAnswers);
      setIsLoading(false);
    } else {
      toast.error('Quiz session not properly initialized. Please start the quiz again.');
      navigate(`/quiz/${quizId}`);
    }
  }, [location.state, quizId, navigate]);

  // Update the timer effect
  useEffect(() => {
    if (!timeLimit) return; // Don't start timer if timeLimit is not set

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = timeLimit - elapsed;
      
      if (remaining <= 0) {
        clearInterval(timer);
        handleSubmit();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, timeLimit]); // Add timeLimit to dependencies

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value, type) => {
    if (type === 'MULTIPLE_SELECT') {
      setAnswers(prev => {
        const currentAnswers = prev[questionId] || [];
        if (currentAnswers.includes(value)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter(v => v !== value)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, value]
          };
        }
      });
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatAnswersForSubmission = () => {
    return {
      answers: questions.map(question => {
        const answer = answers[question.id];
        const type = question.content.type;
        
        let formattedAnswer = {
          questionId: question.id,
          type: type
        };

        switch (type) {
          case 'MULTIPLE_CHOICE':
            formattedAnswer.selectedOption = question.content.options.indexOf(answer);
            break;
          case 'FILL_IN_THE_BLANK':
            formattedAnswer.correctAnswer = answer;
            break;
          case 'MULTIPLE_SELECT':
            formattedAnswer.correctOptions = answer.map(opt => 
              question.content.options.indexOf(opt)
            );
            break;
          default:
            break;
        }

        return formattedAnswer;
      })
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData = formatAnswersForSubmission();
      const response = await axiosInstance.post(
        `/quizzes/quiz/answer/submit/${quizId}`,
        submitData
      );
      navigate(`/quiz/${quizId}/result`, { state: { result: response.data } });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('Error setting up the request. Please try again later.');
      }
      setIsSubmitting(false);
    }
  };

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await axiosInstance.post(`/quizzes/quiz/stop/${quizId}`);
      toast.success('Quiz stopped successfully');
      navigate(`/quiz/${quizId}`);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('Error setting up the request. Please try again later.');
      }
      setIsStopping(false);
    }
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!questions.length) {
    return <p>No questions available. Please try starting the quiz again.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const { type, question, options } = currentQuestion.content;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Stack spacing={3}>
        {/* Progress and Timer Bar */}
        <Paper 
          sx={{ 
            p: 2, 
            borderRadius: 2,
            position: 'sticky',
            top: 16,
            zIndex: 1,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Stack spacing={2}>
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              {timeLeft && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(timeLeft)}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Stack>
        </Paper>

        {/* Question Card */}
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" component="h1" fontWeight={600}>
              {question}
            </Typography>

            <FormControl component="fieldset">
              {type === 'MULTIPLE_CHOICE' && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value, type)}
                >
                  <Stack spacing={2}>
                    {options.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              )}

              {type === 'MULTIPLE_SELECT' && (
                <FormGroup>
                  <Stack spacing={2}>
                    {options.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={answers[currentQuestion.id]?.includes(option)}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, option, type)}
                          />
                        }
                        label={option}
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </FormGroup>
              )}

              {type === 'FILL_IN_THE_BLANK' && (
                <TextField
                  fullWidth
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value, type)}
                  placeholder="Type your answer here..."
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              )}
            </FormControl>
          </Stack>
        </Paper>

        {/* Navigation Buttons */}
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => setOpenStopDialog(true)}
            disabled={isSubmitting || isStopping}
            startIcon={<StopIcon />}
            color="error"
            sx={{
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Stop Quiz
          </Button>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0 || isSubmitting || isStopping}
              startIcon={<NavigateBeforeIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Previous
            </Button>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setOpenSubmitDialog(true)}
                disabled={isSubmitting || isStopping}
                startIcon={<SendIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                disabled={currentQuestionIndex === questions.length - 1 || isSubmitting || isStopping}
                endIcon={<NavigateNextIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Next
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Stop Quiz Dialog */}
      <Dialog
        open={openStopDialog}
        onClose={() => setOpenStopDialog(false)}
      >
        <DialogTitle>Stop Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to stop the quiz? This action cannot be undone and your progress will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenStopDialog(false)}
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStop}
            variant="contained"
            color="error"
            disabled={isStopping}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.2s'
            }}
          >
            {isStopping ? 'Stopping...' : 'Stop Quiz'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Quiz Dialog */}
      <Dialog
        open={openSubmitDialog}
        onClose={() => setOpenSubmitDialog(false)}
      >
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your answers? Make sure you have reviewed all questions.
            {questions.some(q => !answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0)) && (
              <Typography color="error.main" sx={{ mt: 2 }}>
                Warning: You have unanswered questions.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenSubmitDialog(false)}
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Review Questions
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.2s'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default QuizSession; 