import React, { useState } from "react";
import { apiNoAuth } from "../api";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ userType }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
            username: username,
            password: password,
            authType: userType,
        };
    
        try {
            const response = await apiNoAuth('/auth/login', 'POST', data);
            const result = await response.json();  
    
            if (result.jwtToken) {
                console.log('Login successful:', result.jwtToken);
                localStorage.setItem("jwt", result.jwtToken);
                window.location = "/";
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <main>
            <form onSubmit={handleSubmit} className="p-4 m-5 login-form">
                <h2 className="text-center mb-4">Prisijungimas</h2>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Vardas</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Įveskite vardą"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Slaptažodis</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Įveskite slaptažodį"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-secondary w-100" disabled={loading}>
                    {loading ? "Prašome palaukti..." : "Prisijungti"}
                </button>
            </form>
        </main>
    );
}

export default LoginForm;