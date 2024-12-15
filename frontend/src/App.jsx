import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { checkAuth } from "./utils/auth";

import Main from './pages/Main.jsx'
import Footer from './pages/Footer.jsx';
import Header from './pages/Header.jsx';
import HeaderLoggedIn from './pages/HeaderLoggedIn.jsx';
import LoginForm from './pages/LoginFrom.jsx';
import Semesters from './pages/Semesters.jsx';
import SemestersDetails from './pages/SemestersDetails.jsx';
import StudentView from './pages/StudentView.jsx';
import StudentSubjectDetailed from './pages/StudentSubjectDetailed.jsx';
import NotFound404 from './pages/NotFound404.jsx'
import Admin from './pages/Admin.jsx'
import TeacherSubjects from './pages/TeacherSubject.jsx'
import TeacherSubjectDetails from './pages/TeacherSubjectDetails.jsx'

import 'bootstrap/dist/css/bootstrap.css';
import '@popperjs/core/dist/cjs/popper.js';
import '../src/styles/site.css'
import { apiAuth } from "./api.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await apiAuth("/auth/verify-token");
        if (response.ok) {
          const data = await response.json();
          console.log(data.role);
          setIsAuthenticated(true);
          setUserRole(data.role);
        } else {
          setIsAuthenticated(false);
          setUserRole("");
        }
      } catch (error) {
        console.error("Failed to verify authentication:", error);
        setIsAuthenticated(false);
        setUserRole("");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

    const MainPage = ({userRole}) =>{
      switch (userRole) {
        case "Admin":
            return <Admin />;
        case "Teacher":
            return <TeacherSubjects />;
        case "Student":
            return <Semesters />;
        default:
          return <Main />; 
    }
  }

  return (
    <BrowserRouter>
      {isAuthenticated ? <HeaderLoggedIn /> : <Header />}
      <Routes>
        <Route path="/" element={<MainPage userRole={userRole}/>} />

        <Route path='/semestersDetails' element={<SemestersDetails />} />
        <Route path='/teacherSubjectDetails' element={<TeacherSubjectDetails />} />

        <Route path='/studentView/:semesterId' element={<StudentView />} />
        <Route path="/studentSubjectDetailed/:subjectId" element={<StudentSubjectDetailed />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
