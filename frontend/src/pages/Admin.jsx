import React, { useState, useEffect } from "react";
import "../styles/admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        // Fetch users from your backend API
        // This is a placeholder. Replace with actual API call
        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUserId) {
            // Update existing user
            const updatedUsers = users.map(user => 
                user.id === editingUserId ? { ...user, username, userType } : user
            );
            setUsers(updatedUsers);
            resetForm();
        } else {
            // Add new user
            const newUser = { id: Date.now(), username, password, userType };
            setUsers([...users, newUser]);
            resetForm();
        }
    };

    const handleDelete = (userId) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        resetForm();
    };

    const handleEdit = (user) => {
        setUsername(user.username);
        setUserType(user.userType);
        setEditingUserId(user.id);
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setUserType('student');
        setEditingUserId(null);
    };

    return (
        <main className="admin-main">
            <div className="admin-add-user">
                <h2 className="admin-title">{editingUserId ? 'Atnaujinti vartotoją' : 'Pridėti naują vartotoją'}</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                        <label htmlFor="username" className="admin-label">Vartotojo vardas:</label>
                        <input
                            type="text"
                            id="username"
                            className="admin-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    {!editingUserId && (
                        <div className="admin-form-group">
                            <label htmlFor="password" className="admin-label">Slaptažodis:</label>
                            <input
                                type="password"
                                id="password"
                                className="admin-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
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
                        </select>
                    </div>
                    <button type="submit" className="admin-button">
                        {editingUserId ? 'Atnaujinti vartotoją' : 'Pridėti vartotoją'}
                    </button>
                </form>
            </div>

            <div className="admin-user-list">
                <h2 className="admin-title">Esami vartotojai</h2>
                <ul className="admin-user-items">
                    {users.map(user => (
                        <li key={user.id} className="admin-user-item">
                            <span className="admin-user-info">
                                {user.username} ({user.userType})
                            </span>
                            <div className="admin-user-actions">
                                <button onClick={() => handleEdit(user)} className="admin-button admin-button-edit">
                                    Redaguoti
                                </button>
                                <button onClick={() => handleDelete(user.id)} className="admin-button admin-button-delete">
                                    Ištrinti
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default Admin;