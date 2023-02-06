import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Grid, Container } from '@mui/material';

import { BASE_URL, INSTRUCTOR_ROUTES } from 'src/constants';
import Footer from 'src/components/Footer';
import { TableCellComponent, TableComponent } from 'src/components/TableComponents';
import Header from 'src/components/Header';

function InstructorsList({ running }) {
  const navigate = useNavigate();

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, [running]);

  const fetchInstructors = () => {
    setLoading(true);
    axios
      .get(BASE_URL + INSTRUCTOR_ROUTES, {
        params: { running },
        withCredentials: true
      })
      .then((res) => {
        setInstructors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        if (err.response.status == 401) {
          navigate('/login');
        }
        if (err.response.status == 500) {
          navigate('/server-error');
        }
        setLoading(false);
      });
  };

  return (
    <>
      <Header
        msg={[
          `Instructors List`,
          `${running ? 'Running' : 'All'} Instructors`,
          `View details of ${running ? 'running' : 'all'} instructors`
        ]}
      />
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <TableComponent
              msg={[`Instructors List`, `Select any Instructor to view their details`]}
              columns={[
                { style: { width: 200 }, align: 'center', label: 'Instructor ID' },
                { style: { width: 200 }, align: 'center', label: 'Name' },
                { style: { width: 200 }, align: 'center', label: 'Department' }
              ]}
              rows={instructors.map((instructor) => ({
                key: instructor.id,
                search: instructor.id,
                onClick: (e) => navigate(`/instructor/${instructor.id}`),
                cells: (
                  <>
                    <TableCellComponent value={instructor.id} align="center" />
                    <TableCellComponent value={instructor.name} align="center" />
                    <TableCellComponent value={instructor.dept_name} align="center" />
                  </>
                )
              }))}
              search={true}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default InstructorsList;
