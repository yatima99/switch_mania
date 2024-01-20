import { Box, Container, Typography, Link } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 4,
        backgroundColor: '#f5f5f5',
        color: 'text.secondary',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" gutterBottom>
          © {new Date().getFullYear()} Switch Mania
        </Typography>
        <Typography variant="body2" align="center">
          <Link href="/privacy-policy" color="inherit">
            プライバシーポリシー
          </Link>
          {' | '}
          <Link href="/terms-of-service" color="inherit">
            利用規約
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
