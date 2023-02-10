import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Card } from '@mui/material';

import { BASE_URL, INSTRUCTOR_ROUTES } from 'src/constants';
import TabsComponent from 'src/components/TabsComponent';
import { InfoComponent } from 'src/components/InfoComponents';
import { TableCellComponent, TableComponent } from 'src/components/TableComponents';

function InstructorDetails() {
  const { instructor_id: id } = useParams();
  const navigate = useNavigate();

  const [instructorInfo, setInstructorInfo] = useState({});
  const [currentCourses, setCurrentCourses] = useState([]);
  const [previousCourses, setPreviousCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(BASE_URL + INSTRUCTOR_ROUTES + `/${id}`, { withCredentials: true })
      .then((res) => {
        setInstructorInfo(res.data.instructor_info);
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

  const instructorInfoComponent = (
    <Card>
      <InfoComponent
        msg={[`Instructor Details`, `All courses and details about ${instructorInfo.name}`]}
        data={[
          { key: 'Instructor ID', value: instructorInfo.id },
          { key: 'Name', value: instructorInfo.name },
          { key: 'Department', value: instructorInfo.dept_name }
        ]}
      />
    </Card>
  );

  const previousCoursesComponent = (
    <TableComponent
      msg={[`Previous Courses`, `Get all previous courses information by ${instructorInfo.name}`]}
      columns={[
        { style: { width: 150 }, align: 'center', label: 'Course' },
        { style: { width: 200 }, align: 'center', label: 'Section' },
        { style: { width: 250 }, label: 'Title' },
        { style: { width: 200 }, label: 'Department' },
        { style: { width: 150 }, align: 'center', label: 'Credits' },
        { style: { width: 200 }, align: 'center', label: 'Year' },
        { style: { width: 150 }, align: 'center', label: 'Semester' }
      ]}
      rows={previousCourses.map((course) => ({
        key: course.course_id,
        onClick: (e) => navigate(`/course/${course.course_id}`),
        cells: (
          <>
            <TableCellComponent value={course.course_id} align="center" />
            <TableCellComponent value={course.sec_id} align="center" />
            <TableCellComponent value={course.title} />
            <TableCellComponent value={course.dept_name} />
            <TableCellComponent value={course.credits} align="center" />
            <TableCellComponent value={course.year} align="center" />
            <TableCellComponent value={course.semester} align="center" />
          </>
        )
      }))}
    />
  );

  const currentCoursesComponent = (
    <TableComponent
      msg={[`Current Courses`, `Courses taught by the instructor ${instructorInfo.name} in current semester`]}
      columns={[
        { style: { width: 150 }, align: 'center', label: 'Course' },
        { style: { width: 200 }, align: 'center', label: 'Section' },
        { style: { width: 250 }, label: 'Title' },
        { style: { width: 200 }, label: 'Department' },
        { style: { width: 150 }, align: 'center', label: 'Credits' },
        { style: { width: 200 }, align: 'center', label: 'Year' },
        { style: { width: 150 }, align: 'center', label: 'Semester' }
      ]}
      rows={currentCourses.map((course) => ({
        key: course.course_id,
        onClick: (e) => navigate(`/course/${course.course_id}`),
        cells: (
          <>
            <TableCellComponent value={course.course_id} align="center" />
            <TableCellComponent value={course.sec_id} align="center" />
            <TableCellComponent value={course.title} />
            <TableCellComponent value={course.dept_name} />
            <TableCellComponent value={course.credits} align="center" />
            <TableCellComponent value={course.year} align="center" />
            <TableCellComponent value={course.semester} align="center" />
          </>
        )
      }))}
    />
  );

  return (
    <TabsComponent
      msg={[
        `Instructor Details`,
        `Instructor ID ${instructorInfo.id}`,
        `Get all information about ${instructorInfo.name}`
      ]}
      tabs={[
        { value: 'instructor_info', label: 'Instructor Details', component: instructorInfoComponent },
        { value: 'previous_courses', label: 'Previous Courses', component: previousCoursesComponent },
        { value: 'current_courses', label: 'Current Courses', component: currentCoursesComponent }
      ]}
      loading={loading}
    />
  );
}

export default InstructorDetails;
