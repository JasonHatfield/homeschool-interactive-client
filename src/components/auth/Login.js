import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const { login } = useContext(AuthContext);

    const [showUsernamePlaceholder, setShowUsernamePlaceholder] = useState(true);
    const [showPasswordPlaceholder, setShowPasswordPlaceholder] = useState(true);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            // Display an elegant and modern warning
            alert("Please enter both username and password.");
        } else {
            login(credentials);
        }
    };

    const handleUsernameInputFocus = () => {
        setShowUsernamePlaceholder(false);
    };

    const handlePasswordInputFocus = () => {
        setShowPasswordPlaceholder(false);
    };

    const handleUsernameInputBlur = () => {
        if (credentials.username === "") {
            setShowUsernamePlaceholder(true);
        }
    };

    const handlePasswordInputBlur = () => {
        if (credentials.password === "") {
            setShowPasswordPlaceholder(true);
        }
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
                    onFocus={handleUsernameInputFocus}
                    onBlur={handleUsernameInputBlur}
                    placeholder={showUsernamePlaceholder ? "Username" : ""}
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    onFocus={handlePasswordInputFocus}
                    onBlur={handlePasswordInputBlur}
                    placeholder={showPasswordPlaceholder ? "Password" : ""}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
