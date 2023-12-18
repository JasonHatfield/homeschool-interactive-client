import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Registration = () => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
        role: "STUDENT",
    });
    const [usernameWarning, setUsernameWarning] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { register } = useContext(AuthContext);

    // Correctly used handleChange function
    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameWarning("");
        setSuccessMessage("");

        if (!userInfo.username || !userInfo.password) {
            alert("Please enter both username and password.");
        } else {
            try {
                await register(userInfo);
                setSuccessMessage("User successfully created!");
                setTimeout(() => setSuccessMessage(""), 3000); // Hide message after 3 seconds
                setUserInfo({ username: "", password: "", role: "STUDENT" }); // Reset form fields
            } catch (error) {
                if (error.message.includes("Username is already taken")) {
                    setUsernameWarning(error.message);
                } else {
                    alert(error.message);
                }
            }
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
                    onChange={handleChange} // Correctly using handleChange
                    placeholder="Username"
                    required
                />
                {usernameWarning && <div className="warning">{usernameWarning}</div>}
                <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleChange} // Correctly using handleChange
                    placeholder="Password"
                    required
                />
                <select
                    name="role"
                    value={userInfo.role}
                    onChange={handleChange}
                    className="form-control" // Apply the same class used for input elements
                    required
                >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                </select>
                <button type="submit">Register</button>
                {successMessage && <div className="success">{successMessage}</div>}
            </form>
        </div>
    );
};

export default Registration;
