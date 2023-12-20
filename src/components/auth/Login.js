import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';

const useRedirectAfterLogin = () => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const redirectPath = authState.role === 'ROLE_TEACHER' ? '/teacher' : '/student';

        if (authState.isLoggedIn && location.pathname !== redirectPath) {
            navigate(redirectPath, { replace: true });
        } else if (authState.loginError) {
            alert(authState.loginError);
        }
    }, [authState, navigate, location.pathname]);
};

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const { login } = useContext(AuthContext);

    useRedirectAfterLogin();

    const handleChange = (e) => {
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.username || !credentials.password) {
            alert("Please enter both username and password.");
            return;
        }
        await login(credentials);
    };

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
