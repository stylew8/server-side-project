import React, { useState } from "react";
import "../styles/index.css";

import studentImg from "../images/student.png";
import teacherImg from "../images/teacher.png";
import adminImg from "../images/whiteboard.png";
import LoginForm from "../pages/LoginFrom";

export default function Main() {
    const [flippedCard, setFlippedCard] = useState(null);

    const handleFlip = (cardType) => {
        setFlippedCard(flippedCard === cardType ? null : cardType);
    };

    const handleFormClick = (event) => {
        // Prevent flip when clicking inside the form
        event.stopPropagation();
    };

    return (
        <main className="landing-page">
            <h1>Prašome prisijungti prie paskyros</h1>
            <section>
                <div
                    className={`card ${flippedCard === "student" ? "flipped" : ""}`}
                    onClick={() => handleFlip("student")}
                >
                    <div className="front">
                        <img src={studentImg} alt="Student" />
                        <h2>Studentas</h2>
                    </div>
                    <div className="back" onClick={handleFormClick}>
                        <LoginForm userType="student" />
                    </div>
                </div>
                <div
                    className={`card ${flippedCard === "teacher" ? "flipped" : ""}`}
                    onClick={() => handleFlip("teacher")}
                >
                    <div className="front">
                        <img src={teacherImg} alt="Teacher" />
                        <h2>Mokytojas</h2>
                    </div>
                    <div className="back" onClick={handleFormClick}>
                        <LoginForm userType="teacher" />
                    </div>
                </div>
                <div
                    className={`card ${flippedCard === "admin" ? "flipped" : ""}`}
                    onClick={() => handleFlip("admin")}
                >
                    <div className="front">
                        <img src={adminImg} alt="Admin" />
                        <h2>Administratorius</h2>
                    </div>
                    <div className="back" onClick={handleFormClick}>
                        <LoginForm userType="admin" />
                    </div>
                </div>
            </section>
        </main>
    );
}