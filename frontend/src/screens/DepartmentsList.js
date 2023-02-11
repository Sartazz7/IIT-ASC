import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Grid, Container } from '@mui/material';

import { BASE_URL, COURSE_ROUTES } from 'src/constants';
import Footer from 'src/components/Footer';
import { TableCellComponent, TableComponent } from 'src/components/TableComponents';
import Header from 'src/components/Header';

function DepartmentsList({ running }) {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, [running]);

  const fetchDepartments = () => {
    setLoading(true);
    axios
      .get(BASE_URL + COURSE_ROUTES + '/departments', { params: { running }, withCredentials: true })
      .then((res) => {
        setDepartments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        if (err.response.status == 401) {
          navigate('/login');
        }
        setLoading(false);
      });
  };

  return (
    <>
      <Header
        msg={[`Departments List`, `${running ? 'Running' : 'All'} Departments`, `View details of ${running ? 'running' : 'all'} departments`]}
      />
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <TableComponent
              msg={[`Departments List`, `Select any department to view its courses`]}
              columns={[
                { style: { width: 300 }, align: 'center', label: 'Department Name' },
                { style: { width: 300 }, align: 'center', label: 'Building' }
              ]}
              rows={departments.map((department) => ({
                key: department.dept_name,
                search: department.dept_name,
                onClick: (e) => navigate(running ? `/course/running/${department.dept_name}` : `/department/${department.dept_name}`),
                cells: (
                  <>
                    <TableCellComponent value={department.dept_name} align="center" />
                    <TableCellComponent value={department.building} align="center" />
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

export default DepartmentsList;
