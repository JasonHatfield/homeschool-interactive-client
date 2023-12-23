import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Container, Button } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import { AuthContext } from "../../context/AuthContext";

const formatDate = (date) => date.toISOString().split("T")[0];

/**
 * Represents the student dashboard component.
 * 
 * @returns {JSX.Element} The student dashboard component.
 */
const StudentDashboard = () => {
    // State variables
    const [assignments, setAssignments] = useState([]);
    const [studentData, setStudentData] = useState({ firstName: "", lastName: "", gradeLevel: null });
    const [currentTime, setCurrentTime] = useState(new Date());
    const { authState, logout } = useContext(AuthContext);

    // Fetch student data and assignments on component mount
    useEffect(() => {
        /**
         * Fetches the student data from the server.
         */
        const fetchStudentData = async () => {
            if (!authState.isLoggedIn) {
                console.error("User not logged in");
                return;
            }
            try {
                const response = await apiClient.get(`/students/${authState.userId}`);
                setStudentData(response.data);
            } catch (error) {
                console.error("Failed to fetch student data:", error);
            }
        };

        /**
         * Fetches the assignments for the student from the server.
         */
        const fetchAssignments = async () => {
            if (!authState.isLoggedIn) {
                console.error("User not logged in");
                return;
            }
            try {
                const response = await apiClient.get(`/assignments/student/${authState.userId}`);
                setAssignments(response.data);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
            }
        };

        fetchStudentData();
        fetchAssignments();
    }, [authState]);

    // Update current time every second
    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(intervalId);
    }, []);

    /**
     * Handles toggling the status of an assignment.
     * 
     * @param {string} assignmentId - The ID of the assignment.
     * @param {string} currentStatus - The current status of the assignment.
     */
    const handleToggleAssignmentStatus = async (assignmentId, currentStatus) => {
        if (!assignmentId) {
            console.error("Undefined assignment ID");
            return;
        }

        const newStatus = currentStatus === "Review" ? "Incomplete" : "Review";
        try {
            await apiClient.put(`/assignments/${assignmentId}/status?status=${newStatus}`);
            setAssignments((prevAssignments) =>
                prevAssignments.map((assignment) =>
                    assignment.assignmentId === assignmentId ? { ...assignment, status: newStatus } : assignment
                )
            );
        } catch (error) {
            console.error("Error updating assignment status:", error);
        }
    };

    return (
        <Container>
            <Button variant="danger" onClick={logout}>Logout</Button>
            <div className="student-info text-center">
                <h1>Hatfield Home School</h1>
                <h2>{studentData.firstName} {studentData.lastName}</h2>
                <h3>Grade: {studentData.gradeLevel}</h3>
                <p>Current Time: {currentTime.toLocaleTimeString()}</p>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th className="checkbox-column">Complete</th>
                        <th className="due-date-column">Due Date</th>
                        <th>Subject</th>
                        <th>Assignment Description</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.assignmentId} className={assignment.status === "Accepted" ? "greyed-out" : ""}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={assignment.status === "Review" || assignment.status === "Accepted"}
                                    onChange={() => handleToggleAssignmentStatus(assignment.assignmentId, assignment.status)}
                                    disabled={assignment.status === "Accepted"}
                                />
                            </td>
                            <td>{formatDate(new Date(assignment.dueDate))}</td>
                            <td>{assignment.subject.name}</td>
                            <td>{assignment.description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default StudentDashboard;
