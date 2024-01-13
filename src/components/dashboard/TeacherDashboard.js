import React, { useState, useEffect, useContext } from "react";
import { Table, Button, ButtonGroup, Form, Container, Modal, Row, Col } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { AuthContext } from "../../context/AuthContext";

// Define date filter options
const DATE_FILTERS = {
    TODAY: "Today",
    THIS_WEEK: "ThisWeek",
    MONTH: "Month",
};

const TeacherDashboard = () => {
    // State variables
    const [assignments, setAssignments] = useState([]);
    const [fromDate, setFromDate] = useState(new Date(0));
    const [toDate, setToDate] = useState(new Date());
    const [student, setStudent] = useState({ id: 1, firstName: "", lastName: "", gradeLevel: "" });
    const [showModal, setShowModal] = useState(false);
    const [editableAssignment, setEditableAssignment] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { logout } = useContext(AuthContext);

    // Fetch student data from API
    const fetchStudentData = async () => {
        try {
            const { data } = await apiClient.get("/students/1");
            setStudent(prevStudent => ({ ...prevStudent, ...data }));
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    // Fetch subjects from API
    const fetchSubjects = async () => {
        try {
            const { data } = await apiClient.get("/subjects");
            setSubjects(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    // Function to fetch initial assignments data
    const fetchInitialAssignments = async () => {
        try {
            const { data } = await apiClient.get("/assignments");
            const nonAcceptedAssignments = data
                .filter(assignment => assignment.status !== 'Accepted')
                .map(assignment => ({ ...assignment, dueDate: new Date(assignment.dueDate) }))
                .sort((a, b) => a.dueDate - b.dueDate);

            if (nonAcceptedAssignments.length) {
                const oldestAssignmentDate = nonAcceptedAssignments[0].dueDate;
                setFromDate(oldestAssignmentDate);
                setToDate(new Date()); // Setting to today's date
            }

            setAssignments(nonAcceptedAssignments);
        } catch (error) {
            console.error("Error fetching initial assignments:", error);
        }
    };

    // Fetch assignments within selected date range from API
    const fetchAssignments = async (startDate, endDate) => {
        try {
            const { data } = await apiClient.get("/assignments/range", { params: { startDate, endDate } });
            setAssignments(data.map(assignment => ({ ...assignment, dueDate: new Date(assignment.dueDate) })));
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        // Fetch initial data only once
        if (isInitialLoad) {
            fetchInitialAssignments();
            fetchStudentData();
            fetchSubjects();
            setIsInitialLoad(false);
        } else {
            // Fetch assignments whenever fromDate or toDate changes
            const startDate = fromDate.toISOString();
            const endDate = toDate.toISOString();
            fetchAssignments(startDate, endDate);
        }
    }, [fromDate, toDate, isInitialLoad]);

    // Handle logout
    const handleLogout = () => {
        logout();
    };

    // Handle input change for student data
    const handleInputChange = e => {
        const { name, value } = e.target;
        setStudent(prevStudent => ({ ...prevStudent, [name]: value }));
    };

    // Update student data on blur
    const updateStudentData = async () => {
        try {
            await apiClient.put(`/students/${student.id}`, student);
        } catch (error) {
            console.error("Error updating student data:", error);
        }
    };

    // Handle date filter button click
// Handle date filter button click
// Handle date filter button click
    const handleDateFilterButtonClick = filterType => {
        let start = new Date();
        let end = new Date();
        switch (filterType) {
            case DATE_FILTERS.TODAY:
                start = new Date(start.setHours(0, 0, 0, 0));
                end = new Date(start.setHours(23, 59, 59, 999)); // Set end of the day for 'Today'
                break;
            case DATE_FILTERS.THIS_WEEK:
                start = startOfWeek(start, { weekStartsOn: 1 });
                end = endOfWeek(end, { weekStartsOn: 1 });
                end = new Date(end.setDate(end.getDate() - 1));
                end.setHours(23, 59, 59, 999); // Set end of the day for 'This Week'
                break;
            case DATE_FILTERS.MONTH:
                start = startOfMonth(start);
                end = endOfMonth(start); // Change here to use 'start' as the reference date
                end.setHours(23, 59, 59, 999); // Set end of the day for 'This Month'
                break;
            default:
                return;
        }
        setFromDate(start);
        setToDate(end);
        fetchAssignments(start.toISOString(), end.toISOString());
    };

    // Handle edit assignment button click
    const handleEditAssignment = (assignment) => {
        setEditableAssignment({...assignment, subjectId: assignment.subject.subjectId});
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Save assignment changes
    const saveAssignment = async () => {
        try {
            const updatedAssignment = {
                ...editableAssignment,
                dueDate: editableAssignment.dueDate.toISOString(),
                subject: subjects.find(subj => subj.subjectId === editableAssignment.subjectId)
            };

            await apiClient.put(`/assignments/${editableAssignment.assignmentId}`, updatedAssignment);
            setAssignments(assignments.map(a => a.assignmentId === editableAssignment.assignmentId ? { ...a, dueDate: new Date(updatedAssignment.dueDate) } : a));
            closeModal();
        } catch (error) {
            console.error("Error saving assignment:", error);
        }
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
                        onBlur={updateStudentData}
                    />
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={student.lastName}
                        onChange={handleInputChange}
                        onBlur={updateStudentData}
                    />
                    <Form.Label>Grade Level</Form.Label>
                    <Form.Control
                        as="select"
                        name="gradeLevel"
                        value={student.gradeLevel}
                        onChange={handleInputChange}
                        onBlur={updateStudentData}
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
                            <Form.Control as="select" value={editableAssignment.subjectId || ""} onChange={(e) => setEditableAssignment({ ...editableAssignment, subjectId: Number(e.target.value) })}>
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
                            <Form.Control as="select" value={editableAssignment.status || ""}
                                          onChange={(e) =>
                                              setEditableAssignment(
                                                  {
                                                      ...editableAssignment,
                                                      status: e.target.value
                                                  })}
                            >
                                {["Incomplete", "Review", "Accepted"].map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" value={editableAssignment.dueDate ?
                                new Date(editableAssignment.dueDate).toISOString().split('T')[0] : ""}
                                          onChange={(e) =>
                                              setEditableAssignment(
                                                  {
                                                      ...editableAssignment,
                                                      dueDate: new Date(e.target.value) })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Link</Form.Label>
                            <Form.Control type="text" value={editableAssignment.link || ""}
                                          onChange={(e) =>
                                              setEditableAssignment(
                                                  {
                                                  ...editableAssignment,
                                                  link: e.target.value
                                              })}
                            />
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
