import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Card, CardContent } from '@mui/material';

import { BASE_URL, COURSE_ROUTES } from 'src/constants';
import TabsComponent from 'src/components/TabsComponent';
import { SubTableComponent, TableCellComponent, TableComponent } from 'src/components/TableComponents';
import { InfoComponent } from 'src/components/InfoComponents';

function CourseDetails() {
  const navigate = useNavigate();
  const { course_id: id } = useParams();

  const [courseInfo, setCourseInfo] = useState({});
  const [prereqs, setPrereqs] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(BASE_URL + COURSE_ROUTES + `/${id}`, { withCredentials: true })
      .then((res) => {
        setCourseInfo(res.data.course);
        setPrereqs(res.data.prereqs);
        setInstructors(res.data.teaches);
        setSections(res.data.course.sections);
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

  const courseInfoComponent = (
    <Card>
      <InfoComponent
        msg={[`Course Details`, `All the sections and details about the course`]}
        data={[
          { key: 'Course ID', value: courseInfo.course_id },
          { key: 'Title', value: courseInfo.title },
          { key: 'Department', value: courseInfo.dept_name },
          { key: 'Credits', value: courseInfo.credits }
        ]}
      />
      <CardContent>
        <SubTableComponent
          columns={[
            { style: { width: 150 }, align: 'center', label: 'Section ID' },
            { style: { width: 150 }, align: 'center', label: 'Time Slot' },
            { style: { width: 150 }, align: 'center', label: 'Year' },
            { style: { width: 200 }, align: 'center', label: 'Semester' },
            { style: { width: 200 }, align: 'center', label: 'Building' },
            { style: { width: 150 }, align: 'center', label: 'Room Number' }
          ]}
          rows={sections.map((section) => ({
            key: section.sec_id + section.year + section.semester,
            cells: (
              <>
                <TableCellComponent value={section.sec_id} align="center" />
                <TableCellComponent value={section.time_slot_id} align="center" />
                <TableCellComponent value={section.year} align="center" />
                <TableCellComponent value={section.semester} align="center" />
                <TableCellComponent value={section.building} align="center" />
                <TableCellComponent value={section.room_number} align="center" />
              </>
            )
          }))}
          title={courseInfo.course_id + ' sections'}
        />
      </CardContent>
    </Card>
  );

  const instructorsComponent = (
    <TableComponent
      msg={[
        `Instructors for the course ${courseInfo.course_id}`,
        `Get information about instructors across all sections`
      ]}
      columns={[
        { style: { width: 150 }, align: 'center', label: 'Instructor ID' },
        { style: { width: 200 }, align: 'left', label: 'Name' },
        { style: { width: 200 }, align: 'left', label: 'Department' },
        { style: { width: 300 }, align: 'center', label: 'Section ID' },
        { style: { width: 200 }, align: 'center', label: 'Year' },
        { style: { width: 150 }, align: 'center', label: 'Semester' }
      ]}
      rows={instructors.map((instructor) => ({
        key: instructor.id,
        onClick: (e) => navigate(`/instructor/${instructor.id}`),
        cells: (
          <>
            <TableCellComponent value={instructor.id} align="center" />
            <TableCellComponent value={instructor.name} />
            <TableCellComponent value={instructor.dept_name} />
            <TableCellComponent value={instructor.sec_id} align="center" />
            <TableCellComponent value={instructor.year} align="center" />
            <TableCellComponent value={instructor.semester} align="center" />
          </>
        )
      }))}
    />
  );

  const prereqsComponent = (
    <TableComponent
      msg={[
        `Prereqs for the course ${courseInfo.course_id}`,
        ` Get all the preres completed before registering for the course`
      ]}
      columns={[
        { style: { width: 150 }, align: 'center', label: 'Prereq ID' },
        { style: { width: 300 }, align: 'left', label: 'Title' },
        { style: { width: 200 }, align: 'left', label: 'Department' },
        { style: { width: 150 }, align: 'center', label: 'Credits' }
      ]}
      rows={prereqs.map((prereq) => ({
        key: prereq.prereq_id,
        onClick: (e) => navigate(`/course/${prereq.prereq_id}`),
        cells: (
          <>
            <TableCellComponent value={prereq.prereq_id} align="center" />
            <TableCellComponent value={prereq.title} />
            <TableCellComponent value={prereq.dept_name} />
            <TableCellComponent value={prereq.credits} align="center" />
          </>
        )
      }))}
    />
  );

  return (
    <TabsComponent
      msg={[`Course Details`, `Course ${courseInfo.course_id}`, `Get all information about ${courseInfo.title}`]}
      tabs={[
        { value: 'course_info', label: 'Course Details', component: courseInfoComponent },
        { value: 'prereqs', label: 'Prereqs', component: prereqsComponent },
        { value: 'instructors', label: 'Instructors', component: instructorsComponent }
      ]}
      loading={loading}
    />
  );
}

export default CourseDetails;
