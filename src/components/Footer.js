import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Stack, Link, Divider } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

function Footer() {
  const footerLinks = [
    { text: 'Terms of Service', path: '/terms', icon: <SecurityIcon sx={{ fontSize: 20 }} /> },
    { text: 'Contact Us', path: '/contact', icon: <ContactSupportIcon sx={{ fontSize: 20 }} /> },
    { text: 'FAQ', path: '/faq', icon: <HelpOutlineIcon sx={{ fontSize: 20 }} /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 2,
                  py: 0.5,
                  px: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </Stack>
          
          <Divider />
          
          <Stack
            direction="column"
            spacing={1}
            alignItems="center"
          >
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              © {new Date().getFullYear()} Problems2
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
            >
              All rights reserved
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer; 