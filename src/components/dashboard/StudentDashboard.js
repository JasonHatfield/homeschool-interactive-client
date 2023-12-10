import React, { useState, useEffect, useCallback } from "react";
import { Table, Form, Container } from "react-bootstrap";
import apiClient from "../../services/apiClient";

// Utility function for date formatting
const formatDate = (date) => date.toISOString().split("T")[0];

/**
 * Represents the student dashboard component.
 * This component displays the student's information, current time, and a list of assignments.
 * It also allows the student to toggle the status of each assignment.
 */
const StudentDashboard = () => {
    // State variables
    const [assignments, setAssignments] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [gradeLevel, setGradeLevel] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    /**
     * Fetches the student's data from the server.
     * Updates the student's name and grade level in the state.
     */
    const fetchStudentData = useCallback(async () => {
        try {
            const studentResponse = await apiClient.get("/students/1");
            const { firstName, lastName, gradeLevel } = studentResponse.data;
            setStudentName(`${firstName} ${lastName}`);
            setGradeLevel(gradeLevel);
        } catch (error) {
            console.error("Failed to fetch student data:", error);
        }
    }, []);

    /**
     * Fetches the assignments from the server.
     * Updates the assignments in the state.
     */
    const fetchAssignments = useCallback(async () => {
        try {
            const assignmentsResponse = await apiClient.get("/assignments");
            setAssignments(assignmentsResponse.data);
        } catch (error) {
            console.error("Failed to fetch assignments:", error);
        }
    }, []);

    /**
     * Updates the current time every second.
     * Clears the interval when the component is unmounted.
     */
    useEffect(() => {
        fetchStudentData();
        fetchAssignments();

        const updateTime = () => setCurrentTime(new Date());
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [fetchStudentData, fetchAssignments]);

    /**
     * Handles the toggling of an assignment's status.
     * Updates the assignment's status in the state and sends a request to the server to update the status.
     * @param {number} assignmentId - The ID of the assignment.
     * @param {string} currentStatus - The current status of the assignment.
     */
    const handleToggleAssignmentStatus = async (assignmentId, currentStatus) => {
        if (!assignmentId) {
            console.error("Undefined assignment ID");
            return;
        }

        const newStatus = currentStatus === "Review" ? "Incomplete" : "Review";
        try {
            const response = await apiClient.put(
                `/assignments/${assignmentId}/status`,
                null,
                {
                    params: { status: newStatus },
                }
            );

            if (response.status === 200) {
                setAssignments((prevAssignments) =>
                    prevAssignments.map((assignment) =>
                        assignment.assignmentId === assignmentId
                            ? { ...assignment, status: newStatus }
                            : assignment
                    )
                );
            } else {
                console.error(
                    "Failed to update assignment status. Status code:",
                    response.status
                );
            }
        } catch (error) {
            console.error("Error updating assignment status:", error);
        }
    };

    /**
     * Sorts the assignments by due date in ascending order.
     * Updates the assignments in the state if they are different from the sorted assignments.
     */
    useEffect(() => {
        const sortedAssignments = [...assignments].sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );

        // Check if sortedAssignments is different from current assignments
        if (!areArraysEqual(sortedAssignments, assignments)) {
            setAssignments(sortedAssignments);
        }
    }, [assignments]);

    /**
     * Utility function to compare two arrays for equality.
     * @param {Array} arr1 - The first array.
     * @param {Array} arr2 - The second array.
     * @returns {boolean} - True if the arrays are equal, false otherwise.
     */
    function areArraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    // JSX markup
    return (
        <Container>
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
                        <tr
                            key={assignment.assignmentId}
                            className={assignment.status === "Accepted" ? "greyed-out" : ""}
                        >
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={
                                        assignment.status === "Review" ||
                                        assignment.status === "Accepted"
                                    }
                                    onChange={() =>
                                        handleToggleAssignmentStatus(
                                            assignment.assignmentId,
                                            assignment.status
                                        )
                                    }
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
