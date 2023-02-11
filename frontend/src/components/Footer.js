import { Box, Container, Link, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box pb={4} display={{ xs: 'block', md: 'flex' }} alignItems="center" textAlign={{ xs: 'center', md: 'left' }} justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">&copy; Lab 4 : CS 387 Spring 2022 - ASC@IITB</Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          Crafted by{' '}
          <Link href="" target="_blank" rel="noopener noreferrer">
            Sartaj
          </Link>
          {' and '}
          <Link href="" target="_blank" rel="noopener noreferrer">
            Margav
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
