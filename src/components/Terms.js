import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fade
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

function Terms() {
  const sections = [
    {
      title: '1. Introduction',
      content: 'Welcome to Problems2.com! These Terms of Service ("Terms") govern your access to and use of our platform, including our website and related services. By using our platform, you agree to comply with and be bound by these Terms. If you do not agree, please refrain from using our services.'
    },
    {
      title: '2. User Accounts',
      content: [
        'You must create an account to access certain features of our platform.',
        'You are responsible for maintaining the confidentiality of your login credentials.',
        'You agree to provide accurate and truthful information when registering.',
        'We reserve the right to suspend or terminate your account if we suspect any fraudulent or malicious activity.'
      ]
    },
    {
      title: '3. Use of Services',
      content: [
        'Our platform is designed for educational and entertainment purposes only.',
        'You agree not to engage in any activities that violate local, national, or international laws.',
        'You may not use automated tools or scripts to interact with our services unfairly.'
      ]
    },
    {
      title: '4. Content Ownership',
      content: [
        'Users retain ownership of the content they create, such as quiz responses and profile information.',
        'By submitting content, you grant Problems2.com a non-exclusive, royalty-free license to use, modify, and display it as necessary to provide the service.'
      ]
    },
    {
      title: '5. Prohibited Activities',
      content: [
        'Harassing, threatening, or abusing other users.',
        'Engaging in cheating or unfair practices.',
        'Attempting to hack, disrupt, or otherwise compromise our platform.',
        'Posting offensive, illegal, or inappropriate content.'
      ]
    },
    {
      title: '6. Privacy Policy',
      content: [
        'We collect and store user data in accordance with our Privacy Policy.',
        'By using our services, you consent to our data collection practices.'
      ]
    },
    {
      title: '7. Limitation of Liability',
      content: [
        'Problems2.com is provided "as is" without any warranties.',
        'We are not responsible for any damages, losses, or disruptions caused by your use of our services.'
      ]
    },
    {
      title: '8. Changes to These Terms',
      content: [
        'We reserve the right to update these Terms at any time.',
        'Continued use of our services after updates constitutes acceptance of the revised Terms.'
      ]
    },
    {
      title: '9. Contact Information',
      content: 'For any questions regarding these Terms, please contact us at support@problems2.com.'
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
              <GavelIcon sx={{ color: 'white', fontSize: 30 }} />
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
              Terms of Service
            </Typography>
          </Box>

          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  mb: 2
                }}
              >
                {section.title}
              </Typography>
              {Array.isArray(section.content) ? (
                <List disablePadding>
                  {section.content.map((item, i) => (
                    <ListItem key={i} sx={{ pl: 0 }}>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{
                          sx: { color: '#64748b' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748b',
                    mb: 2
                  }}
                >
                  {section.content}
                </Typography>
              )}
              {index < 8 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Paper>
      </Container>
    </Fade>
  );
}

export default Terms; 