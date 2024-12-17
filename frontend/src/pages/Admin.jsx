import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import { requestAuth, requestAuthPost } from "../utils/newApi";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('student');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await requestAuth("/admin/users");
            console.log(response);
            setUsers(response);
        };
        fetchUsers();
    }, []);


    const handleSubmit  = async (e) => {
        e.preventDefault();
        const newUser = { id: Date.now(), username, userType };

        const response = await requestAuthPost("/admin/user",{username, password, userType})

        setUsers([...users, newUser]);
        setUsername(''); 
        setPassword('');
        setUserType('Student');
    };



    return (
        <main className="admin-main">
            <div className="admin-add-user">
                <h2 className="admin-title">Pridėti naują vartotoją</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                        <label htmlFor="username" className="admin-label">Vartotojo vardas:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="username"
                            className="admin-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="userPassword" className="admin-label">Slaptazodis:</label>
                        <input
                            type="password"
                            id="password"
                            className="admin-input"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="userType" className="admin-label">Vartotojo tipas:</label>
                        <select
                            id="userType"
                            className="admin-select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="student">Studentas</option>
                            <option value="teacher">Lektorius</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="admin-button">
                        Pridėti vartotoją
                    </button>
                </form>
            </div>

            <div className="admin-user-list">
                <h2 className="admin-title">Esami vartotojai</h2>
                <ul className="admin-user-items">
                    {users.map(user => (
                        <li key={user.username} className="admin-user-item">
                            <span className="admin-user-info">
                               username: {user.username}, type: {user.userType}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default Admin;
