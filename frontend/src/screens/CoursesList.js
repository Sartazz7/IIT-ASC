import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Grid, Container } from '@mui/material';

import { BASE_URL, COURSE_ROUTES } from 'src/constants';
import Footer from 'src/components/Footer';
import { TableCellComponent, TableComponent } from 'src/components/TableComponents';
import Header from 'src/components/Header';

function CoursesList({ running }) {
  const navigate = useNavigate();
  const { dept_name } = useParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [running, dept_name]);

  const fetchCourses = () => {
    setLoading(true);
    axios
      .get(BASE_URL + COURSE_ROUTES, {
        params: { running, dept_name },
        withCredentials: true
      })
      .then((res) => {
        setCourses(res.data);
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
        msg={[
          `Courses List`,
          `${running ? 'Running' : 'All'}${dept_name ? ` ${dept_name}` : ''} Courses`,
          `View details of ${running ? 'running' : 'all'}${dept_name ? ` ${dept_name}` : ''} courses`
        ]}
      />
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <TableComponent
              msg={[`Courses List`, `Select any course to view the details`]}
              columns={[
                { style: { width: 150 }, align: 'left', label: 'Course ID' },
                { style: { width: 300 }, align: 'left', label: 'Title' },
                { style: { width: 200 }, align: 'left', label: 'Department' },
                { style: { width: 150 }, align: 'center', label: 'Credits' }
              ]}
              rows={courses.map((course) => ({
                key: course.course_id,
                search: course.course_id + course.title,
                onClick: (e) => navigate(`/course/${course.course_id}`),
                cells: (
                  <>
                    <TableCellComponent value={course.course_id} align="left" />
                    <TableCellComponent value={course.title} align="left" />
                    <TableCellComponent value={course.dept_name} align="left" />
                    <TableCellComponent value={course.credits} align="center" />
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

export default CoursesList;
