import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Registration = () => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
    });

    const { register } = useContext(AuthContext);

    const [showUsernamePlaceholder, setShowUsernamePlaceholder] = useState(true);
    const [showPasswordPlaceholder, setShowPasswordPlaceholder] = useState(true);

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userInfo.username || !userInfo.password) {
            // Display an elegant and modern warning
            alert("Please enter both username and password.");
        } else {
            register(userInfo);
        }
    };

    const handleUsernameInputFocus = () => {
        setShowUsernamePlaceholder(false);
    };

    const handlePasswordInputFocus = () => {
        setShowPasswordPlaceholder(false);
    };

    const handleUsernameInputBlur = () => {
        if (userInfo.username === "") {
            setShowUsernamePlaceholder(true);
        }
    };

    const handlePasswordInputBlur = () => {
        if (userInfo.password === "") {
            setShowPasswordPlaceholder(true);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Register a New User</h2>
                <input
                    type="text"
                    name="username"
                    value={userInfo.username}
                    onChange={handleChange}
                    onFocus={handleUsernameInputFocus}
                    onBlur={handleUsernameInputBlur}
                    placeholder={showUsernamePlaceholder ? "Username" : ""}
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleChange}
                    onFocus={handlePasswordInputFocus}
                    onBlur={handlePasswordInputBlur}
                    placeholder={showPasswordPlaceholder ? "Password" : ""}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Registration;
