import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const { authState, login } = useContext(AuthContext);
    const [redirectTo, setRedirectTo] = useState(null);

    // Effect for handling redirection
    useEffect(() => {
        if (authState.isLoggedIn && authState.role) {
            const redirectPath = authState.role === 'ROLE_TEACHER' ? '/teacher' : '/student';
            setRedirectTo(redirectPath);
        }
    }, [authState.isLoggedIn, authState.role]); // Only re-run if these specific properties change

    // Effect for handling login error
    useEffect(() => {
        if (authState.loginError) {
            alert(authState.loginError);
        }
    }, [authState.loginError]); // Only re-run if loginError changes

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.username || !credentials.password) {
            alert("Please enter both username and password.");
            return;
        }
        await login(credentials);
    };

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
