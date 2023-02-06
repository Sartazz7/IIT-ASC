import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Card, TableCell, Tooltip, IconButton, Box, Typography, Divider, CardContent } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { BASE_URL, COURSE_ROUTES, STUDENT_ROUTES } from 'src/constants';
import { InfoComponent } from 'src/components/InfoComponents';
import { SubTableComponent, TableCellComponent, TableComponent } from 'src/components/TableComponents';
import TabsComponent from 'src/components/TabsComponent';

function UserDetails() {
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo] = useState({});
  const [currentCourses, setCurrentCourses] = useState([]);
  const [previousCourses, setPreviousCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(BASE_URL + STUDENT_ROUTES, { withCredentials: true })
      .then((res) => {
        setStudentInfo(res.data.student_info);
        setPreviousCourses(res.data.previous_courses);
        setCurrentCourses(res.data.current_courses);
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

  const dropCourse = (course) => {
    setLoading(true);
    axios
      .post(BASE_URL + COURSE_ROUTES + '/drop', { ...course }, { withCredentials: true })
      .then((res) => {
        toast.success(`Successfully dropped course ${course.course_id}`);
        window.location.reload(false);
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

  const studentInfoComponent = (
    <Card>
      <InfoComponent
        msg={[`Personal Details`, `All your academic personal details`]}
        data={[
          { key: 'Student ID', value: studentInfo.id },
          { key: 'Name', value: studentInfo.name },
          { key: 'Department', value: studentInfo.dept_name },
          { key: 'Total Credits', value: studentInfo.tot_cred }
        ]}
      />
    </Card>
  );

  const currentCoursesComponent = (
    <TableComponent
      msg={[
        'Registered Courses',
        `Courses registered in Year ${currentCourses[0]?.year} ${currentCourses[0]?.semester} semester`
      ]}
      columns={[
        { style: { width: 150 }, align: 'center', label: 'Course' },
        { style: { width: 150 }, align: 'center', label: 'Section' },
        { style: { width: 300 }, label: 'Title' },
        { style: { width: 200 }, label: 'Department' },
        { style: { width: 150 }, align: 'center', label: 'Credits' },
        { style: { width: 150 }, align: 'center', label: 'Drop' }
      ]}
      rows={currentCourses.map((course) => ({
        key: course.course_id + course.sec_id + course.year + course.semester,
        onClick: (e) => navigate(`/course/${course.course_id}`),
        cells: (
          <>
            <TableCellComponent value={course.course_id} align="center" />
            <TableCellComponent value={course.sec_id} align="center" />
            <TableCellComponent value={course.title} />
            <TableCellComponent value={course.dept_name} />
            <TableCellComponent value={course.credits} align="center" />
            <TableCell align="center">
              <Tooltip title="Drop" arrow align="right">
                <IconButton
                  sx={{ color: 'red' }}
                  color="inherit"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    dropCourse(course);
                  }}
                >
                  <DeleteTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </>
        )
      }))}
    />
  );

  const previousCoursesComponent = (
    <Card>
      <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" gutterBottom>
            Courses Undertaken
          </Typography>
          <Typography variant="subtitle2">Courses registered in previous years</Typography>
        </Box>
      </Box>
      <Divider />
      {previousCourses.map(([year, semesterCourses]) => (
        <div key={year}>
          {semesterCourses.map(([semester, courses]) => (
            <div key={semester}>
              <CardContent>
                <Divider />
                <SubTableComponent
                  columns={[
                    { style: { width: 150 }, label: 'Course' },
                    { style: { width: 150 }, label: 'Section' },
                    { style: { width: 300 }, label: 'Title' },
                    { style: { width: 200 }, label: 'Department' },
                    { style: { width: 150 }, label: 'Credits' },
                    { style: { width: 150 }, label: 'Grade' }
                  ]}
                  rows={courses.map((course) => ({
                    key: course.course_id + course.sec_id,
                    onClick: (e) => navigate(`/course/${course.course_id}`),
                    cells: (
                      <>
                        <TableCellComponent value={course.course_id} />
                        <TableCellComponent value={course.sec_id} />
                        <TableCellComponent value={course.title} />
                        <TableCellComponent value={course.dept_name} />
                        <TableCellComponent value={course.credits} />
                        <TableCellComponent value={course.grade} />
                      </>
                    )
                  }))}
                  title={`Year ${year}, ${semester} semester`}
                />
              </CardContent>
            </div>
          ))}
        </div>
      ))}
    </Card>
  );

  return (
    <TabsComponent
      msg={[`User Details`, `Welcome, ${studentInfo.name}!`, `Manage your Academics with MyASC IITB system`]}
      tabs={[
        { value: 'student_info', label: 'Personal Details', component: studentInfoComponent },
        { value: 'previous_courses', label: 'Previous Courses', component: previousCoursesComponent },
        { value: 'current_courses', label: 'Current Courses', component: currentCoursesComponent }
      ]}
      loading={loading}
    />
  );
}

export default UserDetails;
