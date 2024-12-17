import React, { useEffect, useState } from "react";
import "../styles/teacherSubjects.css";
import {requestAuth} from "../utils/newApi";
import { Link } from "react-router-dom";

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    async function handleSubjects() {
      const result = await requestAuth("/teacher/subjects");

      console.log("RRR: ", result); 

      if (result && result.subjects && Array.isArray(result.subjects)) {
        setSubjects(result.subjects);
      } else {
        console.error("Invalid response format", result);
      }
    }

    handleSubjects();
  }, []); 

  return (
    <main className="teacher-main">
      <h1>Pasirinkite dėstomą dalyką</h1>
      <section className="teacher-section">
        {
          subjects.length === 0 ? (
            <div>No available subjects</div>
          ) : (
            subjects.map((subject, index) => (
              <Link className="subject-link" key={index} to={`/teacherSubjectDetails/${subject.id}`}>
                {subject.name}
              </Link>
            ))
          )
        }
      </section>
    </main>
  );
};

export default TeacherSubjects;
