import React, { useState, useEffect, useCallback, useContext } from "react";
import { Table, Button, ButtonGroup, Form, Container, Modal, Row, Col } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { AuthContext } from "../../context/AuthContext";

const DATE_FILTERS = {
    TODAY: "Today",
    THIS_WEEK: "ThisWeek",
    MONTH: "Month",
};

const TeacherDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [fromDate, setFromDate] = useState(new Date(0));
    const [toDate, setToDate] = useState(new Date());
    const [student, setStudent] = useState({ id: 1, firstName: "", lastName: "", gradeLevel: "" });
    const [showModal, setShowModal] = useState(false);
    const [editableAssignment, setEditableAssignment] = useState({});
    const [subjects, setSubjects] = useState([]);

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    const fetchStudentData = useCallback(async () => {
        try {
            const studentResponse = await apiClient.get("/students/1");
            const { firstName, lastName, gradeLevel } = studentResponse.data;
            setStudent({ ...student, firstName, lastName, gradeLevel });
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    }, []);

    const fetchSubjects = useCallback(async () => {
        try {
            const response = await apiClient.get("/subjects");
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    }, []);

    const fetchAssignments = useCallback(async () => {
        try {
            const response = await apiClient.get("/assignments/range", {
                params: {
                    startDate: fromDate.toISOString(),
                    endDate: toDate.toISOString(),
                },
            });
            setAssignments(response.data.map(assignment => ({
                ...assignment,
                dueDate: new Date(assignment.dueDate)
            })).sort((a, b) => a.dueDate - b.dueDate));
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        fetchStudentData();
        fetchSubjects();
        fetchAssignments();
    }, [fetchStudentData, fetchSubjects, fetchAssignments]);

    const handleInputChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const updateStudentData = async () => {
        try {
            await apiClient.put(`/students/${student.id}`, student);
        } catch (error) {
            console.error("Error updating student data:", error);
        }
    };

    const handleBlur = () => {
        updateStudentData();
    };

    const handleEditAssignment = (assignment) => {
        setEditableAssignment(assignment);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const saveAssignment = async () => {
        try {
            await apiClient.put(`/assignments/${editableAssignment.assignmentId}`, editableAssignment);
            setAssignments(assignments.map(a => a.assignmentId === editableAssignment.assignmentId ? editableAssignment : a));
            closeModal();
        } catch (error) {
            console.error("Error saving assignment:", error);
        }
    };

    const handleDateFilterButtonClick = (filterType) => {
        let start = new Date();
        let end = new Date();

        switch (filterType) {
            case DATE_FILTERS.TODAY:
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case DATE_FILTERS.THIS_WEEK:
                start = startOfWeek(start);
                end = endOfWeek(end);
                break;
            case DATE_FILTERS.MONTH:
                start = startOfMonth(start);
                end = endOfMonth(end);
                break;
            default:
                break;
        }

        setFromDate(start);
        setToDate(end);
    };


    return (
        <Container>
            <h1>Teacher Dashboard</h1>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>

            <Form>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        value={student.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={student.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    <Form.Label>Grade Level</Form.Label>
                    <Form.Control
                        as="select"
                        name="gradeLevel"
                        value={student.gradeLevel}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    >
                        {[...Array(12).keys()].map(grade => (
                            <option key={grade + 1} value={grade + 1}>{grade + 1}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Form>

            <ButtonGroup className="mb-1">
                <Button onClick={() => handleDateFilterButtonClick(DATE_FILTERS.TODAY)}>Today</Button>
                <Button onClick={() => handleDateFilterButtonClick(DATE_FILTERS.THIS_WEEK)}>This Week</Button>
                <Button onClick={() => handleDateFilterButtonClick(DATE_FILTERS.MONTH)}>Month</Button>
            </ButtonGroup>

            <Row className="mb-3">
                <Col>
                    <Form.Label>From</Form.Label>
                    <Form.Control type="date" value={fromDate.toISOString().split('T')[0]} onChange={(e) => setFromDate(new Date(e.target.value))} />
                    <Form.Label>To</Form.Label>
                    <Form.Control type="date" value={toDate.toISOString().split('T')[0]} onChange={(e) => setToDate(new Date(e.target.value))} />
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Edit</th>
                        <th>Due Date</th>
                        <th>Subject</th>
                        <th>Assignment Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.assignmentId}>
                            <td>
                                <Button variant="primary" onClick={() => handleEditAssignment(assignment)}>Edit</Button>
                            </td>
                            <td>{assignment.dueDate.toISOString().split('T')[0]}</td>
                            <td>{assignment.subject.name}</td>
                            <td>{assignment.description}</td>
                            <td>{assignment.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Subject</Form.Label>
                            <Form.Control as="select" value={editableAssignment.subjectId || ""} onChange={(e) => setEditableAssignment({ ...editableAssignment, subjectId: e.target.value })}>
                                {subjects.map((subject) => (
                                    <option key={subject.subjectId} value={subject.subjectId}>{subject.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={4} value={editableAssignment.description || ""} onChange={(e) => setEditableAssignment({ ...editableAssignment, description: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" value={editableAssignment.status || ""} onChange={(e) => setEditableAssignment({ ...editableAssignment, status: e.target.value })}>
                                {["Incomplete", "Review", "Accepted"].map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" value={editableAssignment.dueDate ? new Date(editableAssignment.dueDate).toISOString().split('T')[0] : ""} onChange={(e) => setEditableAssignment({ ...editableAssignment, dueDate: new Date(e.target.value).toISOString() })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Link</Form.Label>
                            <Form.Control type="text" value={editableAssignment.link || ""} onChange={(e) => setEditableAssignment({ ...editableAssignment, link: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="primary" onClick={saveAssignment}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TeacherDashboard;
