import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const UserLogin = Loader(lazy(() => import('src/screens/UserLogin')));
const UserDetails = Loader(lazy(() => import('src/screens/UserDetails')));
const CourseRegistration = Loader(lazy(() => import('src/screens/CourseRegistration')));
const CourseDetails = Loader(lazy(() => import('src/screens/CourseDetails')));
const InstructorDetails = Loader(lazy(() => import('src/screens/InstructorDetails')));
const CoursesList = Loader(lazy(() => import('src/screens/CoursesList')));
const DepartmentsList = Loader(lazy(() => import('src/screens/DepartmentsList')));
const InstructorsList = Loader(lazy(() => import('src/screens/InstructorsList')));
const Status404 = Loader(lazy(() => import('src/screens/Status404')));

const routes = [
  {
    path: '',
    element: <Navigate to="home" replace />
  },
  {
    path: 'login',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <UserLogin />
      }
    ]
  },
  {
    path: 'home',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <UserDetails />
      },
      {
        path: 'registration',
        element: <CourseRegistration />
      }
    ]
  },
  {
    path: 'course',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <CoursesList />
      },
      {
        path: ':course_id',
        element: <CourseDetails />
      }
    ]
  },
  {
    path: 'course/running',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <DepartmentsList running={true} />
      },
      {
        path: ':dept_name',
        element: <CoursesList running={true} />
      }
    ]
  },
  {
    path: 'department',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <DepartmentsList />
      },
      {
        path: ':dept_name',
        element: <CoursesList />
      }
    ]
  },
  {
    path: 'instructor',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <InstructorsList />
      },
      {
        path: ':instructor_id',
        element: <InstructorDetails />
      }
    ]
  },
  {
    path: '*',
    element: <Status404 />
  }
];

export default routes;
