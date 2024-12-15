import React, { useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import '../styles/studentView.css';
import { apiAuth } from '../api';


const SemesterTable = ({ semester_id, setSemesterName }) => {
  const [subjectss, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubject = async () => {
      if (!semester_id) {
        setError("Semester ID is not provided");
        return;
      }

      try {
        const response = await apiAuth("/student/semester","GET", {Id:semester_id});
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.semester_name || !data.subjects) {
          setError("Invalid response from the server");
          return;
        }

        setSemesterName(data.semester_name);
        setSubjects(data.subjects);
      } catch (error) {
        console.error("Failed to fetch semester info:", error);
        setError("Could not load semester data. Please try again later.");
      }
    };

    fetchSubject();
  }, [semester_id]);

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div>
      {subjectss.length === 0 ? (
        <p className="no-data-message">There's no information available for this semester.</p>
      ) : (
        <table className="student-view-table">
          <thead className="student-view-table-header">
            <tr>
              <th className="student-view-table-header-cell">Dalyko/modulio kodas ir pavadinimas</th>
              <th className="student-view-table-header-cell">Forma, dėstomoji kalba, kreditų sk.</th>
              <th className="student-view-table-header-cell">Įskaitos požymis</th>
              <th className="student-view-table-header-cell">Data</th>
              <th className="student-view-table-header-cell">Tarpiniai įvertinimai</th>
            </tr>
          </thead>
          <tbody>
            {subjectss.map((subject) => (
              <tr key={subject.id} className="student-view-table-row">
                <td className="student-view-table-cell">{subject.id} {subject.name}</td>
                <td className="student-view-table-cell">1 L</td>
                <td className="student-view-table-cell">10</td>
                <td className="student-view-table-cell"></td>
                <td className="student-view-table-cell">
                  <a className="student-view-button" href={`/studentSubjectDetailed/${subject.id}`}>Peržiūreti</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


const StudentView = () => {
  const { semesterId } = useParams();

  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [semesterName, setSemesterName] = useState("");

  useEffect(()=>{
    const fetchStudentData = async () => {
      try {
        const infoMe = await apiAuth("/student/me");

        if (!infoMe.ok) {
          throw new Error(`API request failed with status ${infoMe.status}`);
        }

        const data = await infoMe.json();
        setStudentData(data);
      } catch (err) {
        console.error("Failed to fetch student info:", err);
        setError("Could not load student data. Please try again later.");
      }
    };

    fetchStudentData();
  },[]);

  if (error) {
    return (
      <div className="student-view-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="student-view-container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }


  return (
    <div className="student-view-container">
      <div className="student-view-card">
        <div className="student-view-card-header">
          <h1 className="student-view-title">Individualus studijų planas</h1>
          <p className="student-view-info-text">{studentData.student_id}, {studentData.full_name}</p>
          <p className="student-view-info-text">Elektronikos ir informatikos fakultetas</p>
          <p className="student-view-info-text">Studijų programa: {studentData.program_name}</p>
          <p className="student-view-info-text">Akademinė grupė: {studentData.group_name}</p>
        </div>
      </div>

      <div className="student-view-card">
        <div className="student-view-card-header">
          <h2 className="student-view-semester-title">{semesterName || "Loading..."}</h2>
        </div>
        <SemesterTable semester_id={semesterId}  setSemesterName={setSemesterName}/>
        <div className="student-view-card-header">
          <p className="student-view-summary-text">Studijų plano semestro apimtis: 27 kr.</p>
          <p className="student-view-summary-text">Atsiskaityta: 0 kr.</p>
        </div>
      </div>

      <p className="student-view-footer-text">
        Dėl plano keitimo ar pastebėtų netikslumų kreipkitės į savo fakulteto Studijų skyrių.
      </p>
    </div>
  );
};

export default StudentView;

