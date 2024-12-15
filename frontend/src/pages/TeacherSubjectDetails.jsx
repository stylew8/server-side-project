import React, { useEffect, useState } from "react";
import "../styles/teacherSubjectDetails.css";
import '../styles/semestersDetails.css'
import { useParams } from "react-router-dom";

const TeacherSubjectsDetails = () => {

    const { subjectId } = useParams();
    
    const [students, setStudents] = useState([
        { id: 1, name: 'John Doe', major: 'Computer Science', semester: 1, grades: [85, 90, 78] },
        { id: 2, name: 'Jane Smith', major: 'Mathematics', semester: 2, grades: [92, 88, 95] },
        { id: 3, name: 'Bob Johnson', major: 'Physics', semester: 1, grades: [76, 82, 80] },
        { id: 4, name: 'Alice Brown', major: 'Chemistry', semester: 3, grades: [88, 91, 87] },
        { id: 5, name: 'Charlie Davis', major: 'Biology', semester: 2, grades: [79, 85, 83] },
        { id: 6, name: 'Eva Wilson', major: 'Psychology', semester: 4, grades: [94, 89, 92] },
        { id: 7, name: 'Frank Miller', major: 'Engineering', semester: 1, grades: [81, 86, 84] },
        { id: 8, name: 'Grace Lee', major: 'Economics', semester: 3, grades: [87, 90, 88] },
        { id: 9, name: 'Henry Taylor', major: 'History', semester: 2, grades: [82, 78, 85] },
        { id: 10, name: 'Ivy Chen', major: 'Art', semester: 1, grades: [93, 95, 91] },
      ]);
      
      const [searchTerm, setSearchTerm] = useState('');
      const [newGrade, setNewGrade] = useState('');
      const [selectedStudent, setSelectedStudent] = useState(null);
      const [editingGradeIndex, setEditingGradeIndex] = useState(null);
      const [editingName, setEditingName] = useState('');
      const [editingMajor, setEditingMajor] = useState('');
      const [editingSemester, setEditingSemester] = useState('');
    
      const calculateAverage = (grades) => {
        return grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : 'N/A';
      };
    
      const calculateClassAverage = () => {
        const allGrades = students.flatMap(student => student.grades);
        return calculateAverage(allGrades);
      };
    
      const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const addGrade = () => {
        if (selectedStudent && newGrade !== '') {
          const grade = parseFloat(newGrade);
          if (!isNaN(grade)) {
            setStudents(students.map(student =>
              student.id === selectedStudent.id
                ? { ...student, grades: [...student.grades, grade] }
                : student
            ));
            setNewGrade('');
          }
        }
      };
    
      const updateGrade = (index) => {
        if (selectedStudent && newGrade !== '') {
          const grade = parseFloat(newGrade);
          if (!isNaN(grade)) {
            setStudents(students.map(student =>
              student.id === selectedStudent.id
                ? { ...student, grades: student.grades.map((g, i) => i === index ? grade : g) }
                : student
            ));
            setNewGrade('');
            setEditingGradeIndex(null);
          }
        }
      };
    
      const deleteGrade = (index) => {
        setStudents(students.map(student =>
          student.id === selectedStudent.id
            ? { ...student, grades: student.grades.filter((_, i) => i !== index) }
            : student
        ));
      };
    
      const updateStudentInfo = () => {
        if (selectedStudent) {
          setStudents(students.map(student =>
            student.id === selectedStudent.id
              ? { ...student, name: editingName, major: editingMajor, semester: parseInt(editingSemester) }
              : student
          ));
          setSelectedStudent(prev => ({ ...prev, name: editingName, major: editingMajor, semester: parseInt(editingSemester) }));
        }
      };
    
      useEffect(() => {
        if (selectedStudent) {
          setEditingName(selectedStudent.name);
          setEditingMajor(selectedStudent.major);
          setEditingSemester(selectedStudent.semester.toString());
        } else {
          setEditingName('');
          setEditingMajor('');
          setEditingSemester('');
        }
      }, [selectedStudent]);
    
      return (
        <main style={{height: "100%", margin: "100px 0"}}>
          <section className="academic-info-system">
            {/* <h1>Informacija apie studentus</h1> */}
    
            <div className="controls">
              <input
                type="text"
                placeholder="Paieška"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="class-stats">
                <p>Viso studentų: {students.length}</p>
                <p>Visų studentų vidurkis: {calculateClassAverage()}</p>
              </div>
            </div>
    
            <div className="two-column-layout">
              <div className="left-column">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vardas</th>
                      <th>Studijų programa</th>
                      <th>Semestras</th>
                      <th>Įvertinimai</th>
                      <th>Vidurkis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} onClick={() => setSelectedStudent(student)}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.major}</td>
                        <td>{student.semester}</td>
                        <td>{student.grades.join(', ')}</td>
                        <td>{calculateAverage(student.grades)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
    
              <div className="right-column">
                <div className="student-details">
                  <h2>Studentų/o informacija</h2>
                  <div className="edit-student-info">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Vardas"
                    />
                    <input
                      type="text"
                      value={editingMajor}
                      onChange={(e) => setEditingMajor(e.target.value)}
                      placeholder="Studijų programa"
                    />
                    <input
                      type="number"
                      value={editingSemester}
                      onChange={(e) => setEditingSemester(e.target.value)}
                      placeholder="Semestras"
                    />
                    <button onClick={updateStudentInfo} disabled={!selectedStudent}>Update Info</button>
                  </div>
    
                  {selectedStudent ? (
                    <>
                      <h3>Įvertinimai studento:  {selectedStudent.name}</h3>
                      <ul className="grades-list">
                        {selectedStudent.grades.map((grade, index) => (
                          <li key={index}>
                            {editingGradeIndex === index ? (
                              <>
                                <input
                                  type="number"
                                  value={newGrade}
                                  onChange={(e) => setNewGrade(e.target.value)}
                                  placeholder="New grade"
                                />
                                <button onClick={() => updateGrade(index)}>Update</button>
                              </>
                            ) : (
                              <>
                                {grade}
                                <button onClick={() => setEditingGradeIndex(index)}>Taisyti</button>
                                <button onClick={() => deleteGrade(index)}>Ištrinti</button>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
    
                      <div className="add-grade">
                        <input
                          type="number"
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                          placeholder="Įveskite naują įvertį"
                        />
                        <button onClick={addGrade}>Pridėti įvertinimą</button>
                      </div>
                    </>
                  ) : (
                    <p>Pasirinkite studentą duomeų peržiūrai</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      );
};

export default TeacherSubjectsDetails;