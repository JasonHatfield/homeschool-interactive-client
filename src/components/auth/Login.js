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

/**
 * Represents the Login component.
 * This component is responsible for rendering the login form and handling user authentication.
 */
const Login = () => {
    // State for storing the user's login credentials
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    // Accessing the login function from the AuthContext
    const { login } = useContext(AuthContext);

    // Custom hook for redirecting the user after successful login
    useRedirectAfterLogin();

    /**
     * Handles the change event of the input fields.
     * Updates the credentials state with the new values.
     * @param {Object} e - The event object.
     */
    const handleChange = (e) => {
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [e.target.name]: e.target.value
        }));
    };

    /**
     * Handles the submit event of the login form.
     * Performs validation and calls the login function.
     * @param {Object} e - The event object.
     */
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
