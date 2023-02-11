import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Box, Container, styled, Typography, Grid } from '@mui/material';

const PageTitleStyle = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(4)};
`
);

const PageTitleWrapper = ({ children }) => {
  return (
    <PageTitleStyle className="MuiPageTitle-wrapper">
      <Container maxWidth="lg">{children}</Container>
    </PageTitleStyle>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

const Header = ({ msg }) => {
  return (
    <>
      <Helmet>
        <title>{msg[0]}</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {msg[1]}
            </Typography>
            <Typography variant="subtitle2">{msg[2]}</Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>
    </>
  );
};

export default Header;
