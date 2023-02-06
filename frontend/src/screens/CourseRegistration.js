import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TableCell, Box, FormControl, MenuItem, Select, Tooltip, IconButton, Grid, Container } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { BASE_URL, COURSE_ROUTES } from 'src/constants';
import Footer from 'src/components/Footer';
import { TableCellComponent, TableComponent } from 'src/components/TableComponents';
import Header from 'src/components/Header';

function CourseRegistration() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRunningCourses();
  }, []);

  const fetchRunningCourses = () => {
    setLoading(true);
    axios
      .get(BASE_URL + COURSE_ROUTES + '/running', { withCredentials: true })
      .then((res) => {
        setCourses(
          res.data.map((course) => {
            course.sec_id = '0';
            return course;
          })
        );
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

  const registerCourse = (course) => {
    if (course.sec_id == 0) {
      toast.error('Section not selected!');
      return;
    }
    const section = course.sections.find((section) => section.sec_id == course.sec_id);
    setLoading(true);
    axios
      .post(
        BASE_URL + COURSE_ROUTES + '/register',
        { ...section, course_id: course.course_id },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(`Successfully registered course ${course.course_id}`);
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

  const sectionDropDown = (course) => (
    <Box width={100}>
      <FormControl fullWidth variant="outlined">
        <Select
          onChange={(e) => {
            setCourses(
              courses.map((_course) => {
                if (_course.course_id == course.course_id) _course.sec_id = e.target.value || '0';
                return _course;
              })
            );
          }}
          value={course.sec_id}
        >
          <MenuItem key={'0'} value={'0'} onClick={(e) => e.stopPropagation()}>
            None
          </MenuItem>
          {course.sections.map((section) => (
            <MenuItem key={section.sec_id} value={section.sec_id} onClick={(e) => e.stopPropagation()}>
              {section.sec_id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <>
      <Header msg={[`Course Registration`, `Running Courses`, `Registration open for the running courses`]} />
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <TableComponent
              msg={[`Register Courses`, `Select your own section`]}
              columns={[
                { style: { width: 150 }, align: 'left', label: 'Course ID' },
                { style: { width: 300 }, align: 'left', label: 'Title' },
                { style: { width: 200 }, align: 'left', label: 'Department' },
                { style: { width: 200 }, align: 'center', label: 'Credits' },
                { style: { width: 120 }, align: 'center', label: 'Sections' },
                { style: { width: 200 }, align: 'center', label: 'Register' }
              ]}
              rows={courses.map((course) => ({
                key: course.course_id,
                search: course.course_id,
                onClick: (e) => navigate(`/course/${course.course_id}`),
                cells: (
                  <>
                    <TableCellComponent value={course.course_id} align="left" />
                    <TableCellComponent value={course.title} align="left" />
                    <TableCellComponent value={course.dept_name} align="left" />
                    <TableCellComponent value={course.credits} align="center" />
                    <TableCellComponent value={sectionDropDown(course)} align="center" />
                    <TableCell align="center">
                      <Tooltip title="Register Course" arrow>
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            registerCourse(course);
                          }}
                        >
                          <AddBoxIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
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

export default CourseRegistration;
