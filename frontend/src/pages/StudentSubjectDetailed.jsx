import React, { useEffect, useState } from "react";
import "../styles/studentSubjectDetailed.css";
import { useParams } from "react-router-dom";
import { apiAuth } from "../api";

const StudentSubjectDetailed = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [grades, setGrades] = useState([]);
  const [subjectData, setSubjectData] = useState({ tasks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const url = `https://localhost:7097/student/subject?Id=${subjectId}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error details:", errorText);
          throw new Error(`Request failed: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Response data:", data);
        setSubject(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        if (subject && subject.grade_types) {
          const gradeResponses = await Promise.all(
            subject.grade_types.map(async (gradeType) => {
              const url = `https://localhost:7097/student/grade?Id=${gradeType.id}`;
              const response = await fetch(url, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
              });
              if (!response.ok) {
                const errorText = await response.text();
                console.error("Error details:", errorText);
                throw new Error(`Request failed: ${response.status}`);
              }
              
              var result = await response.json();

              console.log(result);
              return result;
            })
          );

          setGrades(gradeResponses);
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchGrades();
  }, [subject]);

  useEffect(() => {
    if (subject && grades) {
      const types = subject.grade_types || [];
      const result = types.map((gradeType) => {

        const matchedGrade = grades.find((grade) => grade.grade_type_id === gradeType.id);

        return {
          name: gradeType.name,
          percentage: gradeType.percentage,
          value: matchedGrade ? matchedGrade?.value : "-",
        };
      });

      setSubjectData({ tasks: result });
    }
  }, [subject, grades]);

  if (loading) {
    return <main>Loading...</main>;
  }

  if (error) {
    return <main>Error: {error.message}</main>;
  }

  return (
    <div className="student-subject-detailed-container">
      <div className="student-subject-detailed-header">
        <h1 className="student-subject-detailed-title">{subject?.subject.name || "N/A"}</h1>
        <p className="student-subject-detailed-code">{subject?.subject.id || "N/A"}</p>
      </div>
      <div className="student-subject-detailed-info">
        <p>Kreditai: 6</p>
        <p>
          Dėstytojas: {subject?.teacher_name ? `${subject.teacher_name}` : "N/A"}
        </p>
      </div>
      <div className="student-subject-detailed-grades">
        <h2>Įvertinimai</h2>
        <table className="student-subject-detailed-table">
          <thead>
            <tr>
              <th>Užduotis</th>
              <th>Svoris</th>
              <th>Įvertinimas</th>
            </tr>
          </thead>
          <tbody>
            {subjectData.tasks && subjectData.tasks.length > 0 ? (
              subjectData.tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{task.percentage}%</td>
                  <td>{task.value !== null ? task.value : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No tasks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSubjectDetailed;
