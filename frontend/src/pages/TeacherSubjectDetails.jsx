import React, { useState, useEffect } from "react";
import { requestAuthPost, requestAuth } from "../utils/newApi";
import { useParams } from "react-router-dom";

const TeacherSubjectsDetails = () => {
  const { subjectId } = useParams();
  const [students, setStudents] = useState([]);
  const [columns, setColumns] = useState([]);
  const [subjectName, setSubjectName] = useState("");

  const fetchStudents = async () => {
    const result = await requestAuth(`/teacher/subject?Id=${subjectId}`);
    const columns = result.columns;
    setStudents(result.students);
    setColumns(columns);
    setSubjectName(result.subjectName);
  };

  useEffect(() => {
    fetchStudents();
  }, [subjectId]);

  const handleGradeChange = (e, studentId, columnId) => {
    const newGrade = e.target.value === '' ? 0 : Number(e.target.value);

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
            ...student,
            grades: student.grades.map((grade) =>
              grade.gradeTypeId === columnId
                ? { ...grade, value: newGrade }
                : grade
            ),
          }
          : student
      )
    );
  };

  const handleGradeBlur = async (e, studentId, columnId) => {
    const newGrade = e.target.value;

    if (newGrade < 0 || newGrade > 10 || isNaN(newGrade) || newGrade == null) {
      alert("Grade from 1 to 10");
      return;
    }

    const response = await requestAuthPost(`/teacher/update-grade?StudentId=${studentId}`, {
      gradeTypeId: columnId,
      newGrade: newGrade
    });

    if (response.statusCode == 200) {
      fetchStudents();
    } else {
      alert("Klaida atnaujint pazymi");
    }
  };

  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState('');


  const handleCreateGradeType = async () => {
    if (!name || !percentage) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await requestAuthPost("/teacher/gradeType",
        {
          name: name,
          percentage: Number(percentage),
          subjectId: subjectId
        });

      if (!response.statusCode == 200) {
        throw new Error('Failed to create grade type');
      }

      window.location.reload();
      setName('');
      setPercentage('');
    } catch (error) {
      console.error('Error creating grade type:', error);
      alert('Error creating grade type. Try again.');
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main style={{ height: "100%", margin: "100px 0" }}>
      <section className="academic-info-system">
        <h1>{`${subjectName}`}</h1>

        <div className="controls">
              <input
                type="text"
                placeholder="Paieška"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="class-stats">
                <p>Viso studentų: {filteredStudents.length}</p>
              </div>
        </div>

        <div className="two-column-layout">
          <div className="left-column">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vardas</th>
                  {columns.map((column) => (
                    <th key={column.id}>{column.column} ({column.percentage}%)</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>

                    {columns.map((column) => {
                      const grade = student.grades.find(
                        (g) => g.gradeTypeId === column.id
                      );

                      return (
                        <td key={column.id}>
                          <input
                            type="number"
                            placeholder="-"
                            {...(grade && grade.value !== undefined && grade.value !== null
                              ? { value: grade.value, onChange: (e) => handleGradeChange(e, student.id, column.id) }
                              : { defaultValue: '', onChange: (e) => handleGradeChange(e, student.id, column.id) }
                            )}
                            onChange={(e) => handleGradeChange(e, student.id, column.id)}
                            onBlur={(e) => handleGradeBlur(e, student.id, column.id)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="right-column">
            <div className="student-details">
              <h2>Grade type creator</h2>
              <div className="edit-student-info">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Percentage"
                />
                <button onClick={handleCreateGradeType}>Create new type of grade</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TeacherSubjectsDetails;
