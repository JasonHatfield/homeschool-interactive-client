import React, { useState, useEffect, useCallback, useContext } from "react";
import { Table, Form, Container, Button } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import { AuthContext } from "../../context/AuthContext";

const formatDate = (date) => date.toISOString().split("T")[0];

const StudentDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [gradeLevel, setGradeLevel] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { authState, logout } = useContext(AuthContext);
    const userId = authState.userId;

    const handleLogout = () => {
        logout();
    };

    const fetchStudentData = useCallback(async () => {
        try {
            const studentResponse = await apiClient.get(`/students/${userId}`);
            const { firstName, lastName, gradeLevel } = studentResponse.data;
            setStudentName(`${firstName} ${lastName}`);
            setGradeLevel(gradeLevel);
        } catch (error) {
            console.error("Failed to fetch student data:", error);
        }
    }, [userId]);

    const fetchAssignments = useCallback(async () => {
        try {
            const assignmentsResponse = await apiClient.get("/assignments");
            setAssignments(assignmentsResponse.data);
        } catch (error) {
            console.error("Failed to fetch assignments:", error);
        }
    }, []);

    useEffect(() => {
        fetchStudentData();
        fetchAssignments();

        const updateTime = () => setCurrentTime(new Date());
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [fetchStudentData, fetchAssignments]);

    const handleToggleAssignmentStatus = async (assignmentId, currentStatus) => {
        if (!assignmentId) {
            console.error("Undefined assignment ID");
            return;
        }

        const newStatus = currentStatus === "Review" ? "Incomplete" : "Review";
        try {
            await apiClient.put(`/assignments/${assignmentId}/status`, { status: newStatus });
            setAssignments(prevAssignments =>
                prevAssignments.map(assignment =>
                    assignment.assignmentId === assignmentId
                        ? { ...assignment, status: newStatus }
                        : assignment
                )
            );
        } catch (error) {
            console.error("Error updating assignment status:", error);
        }
    };

    useEffect(() => {
        const sortedAssignments = [...assignments].sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );

        if (JSON.stringify(sortedAssignments) !== JSON.stringify(assignments)) {
            setAssignments(sortedAssignments);
        }
    }, [assignments]);

    return (
        <Container>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
            <div className="student-info text-center">
                <h1>Hatfield Home School</h1>
                <h2>{studentName}</h2>
                <h3>Grade: {gradeLevel}</h3>
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
