import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UpdateCourse from './components/UpdateCourse';
import Authenticated from './components/Authenticated';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import PrivateRoute from './components/PrivateRoute';


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="signin" element={<UserSignIn />} />
        <Route path="signup" element={<UserSignUp />} />
        <Route path="signout" element={<UserSignOut />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/update" element={<UpdateCourse />} />
        <Route path="/courses/create" element={<CreateCourse />} />
        <Route element={<PrivateRoute />}>
          <Route path="authenticated" element={<Authenticated />} />
          </Route> 
         {/* <Route path="*" element={<NotFound />} />  */}
      </Routes>
    </Router>
  );
};

export default App;