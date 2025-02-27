import {
  Container,
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQ() {
  const faqs = [
    {
      question: "What is Problems2.com?",
      answer: "Problems2.com is an interactive quiz-solving platform where users can test their knowledge, track progress, and compete with friends."
    },
    {
      question: "How do I create an account?",
      answer: "Click on the \"Sign Up\" button, provide your email, username, and password, and follow the verification instructions sent to your email."
    },
    {
      question: "Is Problems2.com free to use?",
      answer: "Yes! The platform is free to use. However, we may introduce premium features in the future."
    },
    {
      question: "How does the quiz cooldown work?",
      answer: "Each quiz has a cooldown period that prevents immediate reattempts to ensure fair competition. The cooldown duration varies by quiz."
    },
    {
      question: "Can I change my answers during a quiz?",
      answer: "Yes, if you choose the \"Review All Questions Before Submission\" mode. However, if you select the \"Instant Feedback\" mode, answers are final."
    },
    {
      question: "How are rank points calculated?",
      answer: "Rank points are awarded based on quiz difficulty, accuracy, and completion time. Higher difficulty quizzes yield more points."
    },
    {
      question: "Can I download quizzes?",
      answer: "Yes! You can download quiz questions as a PDF, but the file will not include additional instructions or solutions."
    },
    {
      question: "How can I report a problem or inappropriate content?",
      answer: "Please use the \"Report Issue\" button on the quiz page or contact us at support@problems2.com."
    },
    {
      question: "How does the leaderboard work?",
      answer: "The leaderboard ranks users based on their total rank points. There are global and weekly leaderboards. The top three users receive special badges."
    },
    {
      question: "Can I reset my password?",
      answer: "Yes! Go to the login page, click \"Forgot Password,\" and follow the steps to reset it."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can request account deletion via the \"Settings\" page or by contacting support@problems2.com."
    },
    {
      question: "I'm an admin. How do I manage quizzes?",
      answer: "Admins can add, edit, delete quizzes, manage users, and update platform settings via the Admin Dashboard."
    }
  ];

  return (
    <Fade in={true} timeout={800}>
      <Container 
        component="main" 
        maxWidth="md"
        sx={{
          minHeight: '100vh',
          mb: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 4 },
            background: '#ffffff',
            borderRadius: 4,
            boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                p: 2,
                borderRadius: '50%',
                mb: 2,
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.2)',
              }}
            >
              <QuestionAnswerIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
                textAlign: 'center'
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748b',
                textAlign: 'center',
                maxWidth: 600
              }}
            >
              Find answers to common questions about Problems2.com
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 1,
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  borderRadius: '8px !important',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.05)',
                  '&.Mui-expanded': {
                    margin: '0 0 8px 0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                  sx={{
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#f1f5f9'
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b'
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    sx={{
                      color: '#64748b'
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b'
              }}
            >
              If you have any other questions, feel free to{' '}
              <Typography
                component="span"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600
                }}
              >
                reach out to us!
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
}

export default FAQ; 