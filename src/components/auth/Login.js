import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

/**
 * Represents the Login component.
 * This component is responsible for rendering the login form and handling user authentication.
 */
const Login = () => {
    // State to store the user's login credentials
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    // Access the login function from the AuthContext
    const { login } = useContext(AuthContext);

    /**
     * Handles the change event for input fields.
     * Updates the credentials state with the new value.
     * @param {Object} e - The event object.
     */
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    /**
     * Handles the form submission event.
     * Calls the login function with the user's credentials.
     * @param {Object} e - The event object.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        login(credentials);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
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
