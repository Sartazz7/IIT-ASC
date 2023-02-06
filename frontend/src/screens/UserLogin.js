import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Grid, Divider, Card, CardHeader, CardContent, TextField, Box, Button, CircularProgress } from '@mui/material';

import { BASE_URL, STUDENT_ROUTES } from 'src/constants';
import TabsComponent from 'src/components/TabsComponent';

function UserLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    id: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    id: '',
    password: ''
  });

  const handleLoginSubmit = (e) => {
    setLoading(true);
    axios
      .post(BASE_URL + STUDENT_ROUTES + '/login', loginData, {
        withCredentials: true
      })
      .then((res) => {
        navigate('/home');
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const handleRegisterSubmit = (e) => {
    setLoading(true);
    axios
      .post(BASE_URL + STUDENT_ROUTES + '/register', registerData, {
        withCredentials: true
      })
      .then((res) => {
        toast.success('Registration successful');
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const authForm = (data, setData, msg, submitHandler) => (
    <Card>
      <CardHeader title={msg[0]} />
      <Divider />
      <CardContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 2 }
          }}
          noValidate
        >
          <TextField
            required
            label="ID"
            value={data.id}
            onChange={(e) => setData({ ...data, id: e.target.value })}
            style={{ width: '90%' }}
          />
          <TextField
            required
            label="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            style={{ width: '90%' }}
          />
          {loading ? (
            <CircularProgress size={64} disableShrink thickness={3} />
          ) : (
            <Button sx={{ margin: 2 }} variant="contained" onClick={submitHandler}>
              {msg[1]}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={0}>
      <Grid item xs={3.5}>
        <TabsComponent
          msg={[`ASC Login`, `IITB ASC`, `Login to your account`]}
          tabs={[
            {
              value: 'login',
              label: 'Login',
              component: authForm(loginData, setLoginData, [`Login with your credentials`, 'Login'], handleLoginSubmit)
            },
            {
              value: 'register',
              label: 'Register',
              component: authForm(
                registerData,
                setRegisterData,
                [`Register with your student ID`, 'Register'],
                handleRegisterSubmit
              )
            }
          ]}
          loading={loading}
          refresh={false}
        />
      </Grid>
    </Grid>
  );
}

export default UserLogin;
