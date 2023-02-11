import { Box, CardContent, Divider, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

const TextWrapper = styled('span')(
  ({ theme }) => `
    display: inline-block;
    align-items: center;

    &.flexItem {
        display: inline-flex;
    }
    
    &.MuiText {

        &-black {
        color: ${theme.palette.common.black}
        }

        &-primary {
        color: ${theme.palette.primary.main}
        }
        
        &-secondary {
        color: ${theme.palette.secondary.main}
        }
        
        &-success {
        color: ${theme.palette.success.main}
        }
        
        &-warning {
        color: ${theme.palette.warning.main}
        }
            
        &-error {
        color: ${theme.palette.error.main}
        }
        
        &-info {
        color: ${theme.palette.info.main}
        }
    }
  `
);

const Text = ({ className, color = 'secondary', flex, children, ...rest }) => {
  return (
    <TextWrapper className={clsx('MuiText-' + color, { flexItem: flex })} {...rest}>
      {children}
    </TextWrapper>
  );
};

Text.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'success', 'info', 'black'])
};

const InfoValueComponent = ({ element }) => {
  return (
    <>
      <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} key={element.key}>
        <Box pr={3} pb={2}>
          {element.key}:
        </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <Text color="black">
          <b>{element.value}</b>
        </Text>
      </Grid>
    </>
  );
};

const InfoComponent = ({ data, msg }) => {
  return (
    <>
      <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" gutterBottom>
            {msg[0]}
          </Typography>
          <Typography variant="subtitle2">{msg[1]}</Typography>
        </Box>
      </Box>
      <Divider />
      <CardContent sx={{ p: 4 }}>
        <Typography variant="subtitle2">
          <Grid container spacing={0}>
            {data.map((element) => {
              return <InfoValueComponent key={element.key} element={element} />;
            })}
          </Grid>
        </Typography>
      </CardContent>
    </>
  );
};

export { InfoComponent };
