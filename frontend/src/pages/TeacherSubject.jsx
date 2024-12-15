import React, { useEffect, useState } from "react";
import "../styles/teacherSubjects.css";

const TeacherSubjects = () => {
  return (
    <main className="teacher-main">
        <h1>Pasirinkite dėstomą dalyką</h1>
        <section className="teacher-section">
          <a className="subject-link" href="/teacherSubjectDetails">Programų sistemų testavimas</a>
          <a className="subject-link" href="/teacherSubjectDetails">Programavimo kalba python</a>
          <a className="subject-link" href="/teacherSubjectDetails">Infoamcinių sistemų serverio dalies kūrimas</a>
          <a className="subject-link" href="/teacherSubjectDetails">Infoamcinių sistemų kliento dalies kūrimas</a>
          <a className="subject-link" href="/teacherSubjectDetails">Programavimo kalba C#</a>
        </section>
    </main>
  );
};

export default TeacherSubjects;