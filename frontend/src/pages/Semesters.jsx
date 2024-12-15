import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/semesters.css';
import { apiAuth } from "../api";
import StudentView from "./StudentView";

export default function Semesters() {
     const [semesters, setSemesters] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
          const fetchSemesters = async () => {
               try {
                    const response = await apiAuth("/students/semesters");
                    const data = await response.json();
                    console.log(data);
                    setSemesters(data);
               } catch (error) {
                    setError("Failed to load semesters");
               } finally {
                    setLoading(false);
               }
          };

          fetchSemesters();
     }, []);

     if (loading) {
          return <div>Loading...</div>; 
     }

     if (error) {
          return <div>{error}</div>; 
     }

     return (
          <main>
               <div className="container">
                    <section className="semester">
                    {!semesters||semesters.length === 0 ? (
                              <div>No available semesters</div>
                         ) : (
                              semesters.semesters.map((semester, index) => (
                                   <Link key={index} to={`/studentView/${semester.id}`}>
                                        <h1>{semester.name}</h1>
                                        <p>
                                             {semester.start} - {semester.end}
                                        </p>
                                   </Link>
                              ))??<div></div>
                         )}
                    </section>
               </div>
          </main>
     );
}