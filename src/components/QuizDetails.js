import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function QuizDetails() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizDetails, setQuizDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [previousQuizId, setPreviousQuizId] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axiosInstance.get(`/quizzes/quiz/details/${quizId}`);
        setQuizDetails(response.data);
      } catch (error) {
        if (error.response?.error === 'QuizNotFoundException') {
          navigate('/quizzes');
        } else if (error.response) {
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

    fetchQuizDetails();
  }, [quizId, navigate]);

  const handleStartQuiz = async () => {
    setIsStarting(true);
    try {
      const response = await axiosInstance.post(`/quizzes/quiz/start/${quizId}`);
      navigate(`/quiz/${quizId}/session`, { 
        state: { 
          questions: response.data.questionsWithoutCorrectAnswers,
          timeLimit: quiz.timeLimit
        } 
      });
    } catch (error) {
      if (error.response?.status === 409 && error.response?.data?.error === 'InvalidQuizStateException') {
        const previousId = error.response?.data?.quizId || quizId;
        setPreviousQuizId(previousId);
        setOpenDialog(true);
      } else if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('Error setting up the request. Please try again later.');
      }
      setIsStarting(false);
    }
  };

  const handleStopPreviousQuiz = async () => {
    try {
      await axiosInstance.post(`/quizzes/quiz/stop/${previousQuizId}`);
      handleStartQuiz();
    } catch (error) {
      toast.error('Failed to stop the previous quiz. Please try again.');
    } finally {
      setOpenDialog(false);
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let currentPage = 1;
      let yPosition = 20;
      const margin = 20;
      const pageEndThreshold = pageHeight - 20; // Leave some space at bottom
      
      // Helper function to add page decorations
      const addPageDecorations = () => {
        pdf.saveGraphicsState();
        pdf.setGState(new pdf.GState({ opacity: 0.1 }));
        pdf.setFontSize(40);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Problems2', pageWidth/2, pageHeight/2, {
          align: 'center',
          angle: 45
        });
        pdf.restoreGraphicsState();
        
        // Add page number
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${currentPage}`, pageWidth/2, pageHeight - 10, { align: 'center' });
      };

      // Helper function to check and add new page if needed
      const checkAndAddNewPage = (requiredSpace) => {
        if (yPosition + requiredSpace > pageEndThreshold) {
          addPageDecorations();
          pdf.addPage();
          currentPage++;
          yPosition = margin;
        }
      };

      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(44, 62, 80);
      pdf.text(quiz.name, pageWidth/2, yPosition, { align: 'center' });
      
      yPosition += 15;
      
      // Add quiz info
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Difficulty: ${quiz.difficulty}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Time Limit: ${quiz.timeLimit} minutes`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Number of Questions: ${quiz.numberOfQuestions}`, margin, yPosition);
      yPosition += 10;
      
      // Add description
      pdf.setFontSize(11);
      const splitDescription = pdf.splitTextToSize(quiz.description, pageWidth - 40);
      checkAndAddNewPage(splitDescription.length * 7);
      pdf.text(splitDescription, margin, yPosition);
      yPosition += (splitDescription.length * 7) + 10;
      
      // Add rules
      checkAndAddNewPage(30);
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Rules:', margin, yPosition);
      yPosition += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      const splitRules = pdf.splitTextToSize(rules, pageWidth - 40);
      pdf.text(splitRules, margin, yPosition);
      yPosition += (splitRules.length * 7) + 10;
      
      // Add instructions
      checkAndAddNewPage(30);
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Instructions:', margin, yPosition);
      yPosition += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      const splitInstructions = pdf.splitTextToSize(instructions, pageWidth - 40);
      pdf.text(splitInstructions, margin, yPosition);
      yPosition += (splitInstructions.length * 7) + 15;

      // Add questions
      try {
        const response = await axiosInstance.get(`/quizzes/quiz/questions/${quizId}`);
        const questions = response.data.questionsWithoutCorrectAnswers;

        // Add Questions header
        checkAndAddNewPage(20);
        pdf.setFontSize(16);
        pdf.setTextColor(44, 62, 80);
        pdf.text('Questions', margin, yPosition);
        yPosition += 10;

        questions.forEach((question, index) => {
          // Estimate space needed for this question
          const questionText = pdf.splitTextToSize(question.content.question, pageWidth - 50);
          let requiredSpace = 20 + (questionText.length * 7);

          if ((question.content.type === 'MULTIPLE_CHOICE' || question.content.type === 'MULTIPLE_SELECT') 
              && question.content.options) {
            requiredSpace += (question.content.options.length * 7) + 5;
          }

          checkAndAddNewPage(requiredSpace);

          // Question number and text
          pdf.setFontSize(12);
          pdf.setTextColor(44, 62, 80);
          pdf.text(`${index + 1}. `, margin, yPosition);
          pdf.setTextColor(60, 60, 60);
          pdf.text(questionText, margin + 8, yPosition);
          yPosition += (questionText.length * 7) + 5;

          // Add options for both multiple choice and multiple select
          if ((question.content.type === 'MULTIPLE_CHOICE' || question.content.type === 'MULTIPLE_SELECT') 
              && question.content.options) {
            question.content.options.forEach((option, optIndex) => {
              // Draw circle or square
              if (question.content.type === 'MULTIPLE_SELECT') {
                // Draw square
                pdf.rect(margin + 10, yPosition - 4, 4, 4);
              } else {
                // Draw circle
                pdf.circle(margin + 12, yPosition - 2, 2);
              }
              
              // Add option text directly after the checkbox/circle
              const splitOption = pdf.splitTextToSize(option, pageWidth - 70);
              pdf.text(splitOption, margin + 18, yPosition);
              
              yPosition += (splitOption.length * 7) + 3;
            });
            yPosition += 5;
          }
        });

        // Add decorations to the last page
        addPageDecorations();

      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to include questions in PDF');
      }
      
      // Save PDF
      pdf.save(`${quiz.name.toLowerCase().replace(/\s+/g, '-')}-details.pdf`);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
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

  if (!quizDetails) {
    return null;
  }

  const { quiz, rules, instructions } = quizDetails;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Stack spacing={{ xs: 2, sm: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/quizzes')}
            sx={{ 
              mb: { xs: 2, sm: 3 },
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Back to Quizzes
          </Button>
          
          <Button
            startIcon={<FileDownloadIcon />}
            onClick={generatePDF}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              ml: 2
            }}
          >
            Export PDF
          </Button>
        </Box>
        
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight={700} 
          gutterBottom
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem' }
          }}
        >
          {quiz.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {quiz.description}
        </Typography>

        {/* Quiz Information Card */}
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2} 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Chip
                size="medium"
                color={
                  quiz.difficulty === 'EASY' ? 'success' :
                  quiz.difficulty === 'MEDIUM' ? 'warning' : 'error'
                }
                label={quiz.difficulty}
              />
              <Stack 
                direction="row" 
                spacing={2}
                flexWrap="wrap"
                gap={2}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <QuizIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {quiz.numberOfQuestions} Questions
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {quiz.timeLimit} minutes
                  </Typography>
                </Stack>
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
        </Paper>

        {/* Rules and Instructions */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600} 
                gutterBottom
                sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
              >
                Rules
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {rules}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600} 
                gutterBottom
                sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
              >
                Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {instructions}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz} 
            disabled={isStarting}
            startIcon={<PlayArrowIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              py: { xs: 1, sm: 1.5 },
              px: { xs: 3, sm: 4 },
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.2s'
            }}
          >
            {isStarting ? 'Starting Quiz...' : 'Start Quiz'}
          </Button>
        </Box>
      </Stack>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="quiz-state-dialog-title"
        aria-describedby="quiz-state-dialog-description"
      >
        <DialogTitle id="quiz-state-dialog-title">
          Active Quiz Session Found
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="quiz-state-dialog-description">
            You have an active quiz session. Would you like to stop it and start this new quiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStopPreviousQuiz}
            variant="contained"
            color="error"
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
            Stop Previous Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default QuizDetails; 