import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  ButtonGroup,
  Form,
  Container,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import apiClient from "../../services/apiClient";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

const DATE_FILTERS = {
  TODAY: "Today",
  THIS_WEEK: "ThisWeek",
  MONTH: "Month",
};

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editableAssignment, setEditableAssignment] = useState({});
  const [originalStudentData, setOriginalStudentData] = useState({});
  const [subjects, setSubjects] = useState([]);

  const fetchStudentData = useCallback(async () => {
    try {
      const studentResponse = await apiClient.get("/students/1");
      const { firstName, lastName, gradeLevel } = studentResponse.data;
      const studentData = { firstName, lastName, gradeLevel };
      setStudent(studentData);
      setOriginalStudentData(studentData); // Set original data
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }, []);

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (value !== originalStudentData[name]) {
      try {
        const updatedStudent = { ...student, [name]: value };
        await apiClient.put(`/students/1`, updatedStudent); // Update the student data in the backend
        setOriginalStudentData(updatedStudent); // Update original student data
      } catch (error) {
        console.error("Error updating student data:", error);
      }
    }
  };

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await apiClient.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }, []);

  const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      // Format the date directly without adjusting for the timezone
      return date.toISOString().split("T")[0];
    } else {
      return ""; // or any default value you prefer
    }
  };

  const formatDateForFields = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months start at 0
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } else {
      return ""; // or any default value you prefer
    }
  };

  const handleInputChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleEditAssignment = (assignment) => {
    const defaultDate = new Date();
    let dueDate = defaultDate;
    if (assignment.dueDate) {
      dueDate = new Date(assignment.dueDate);
      if (isNaN(dueDate)) {
        dueDate = defaultDate; // Fallback to default if an invalid date
      }
    }

    setEditableAssignment({
      ...assignment,
      dueDate: dueDate.toISOString(),
      subjectId: assignment.subjectId, // Ensure the correct subject ID is set
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saveAssignment = async () => {
    try {
      // Update the assignment data in the backend
      await apiClient.put(
        `/assignments/${editableAssignment.assignmentId}`,
        editableAssignment
      );

      // Update the assignment in the state with the edited data
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.assignmentId === editableAssignment.assignmentId
            ? editableAssignment
            : assignment
        )
      );

      // Close the modal
      closeModal();
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  useEffect(() => {
    // Set initial fromDate and toDate
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    setFromDate(new Date(0));
    setToDate(today);

    fetchStudentData();
    fetchSubjects();
  }, [fetchStudentData, fetchSubjects]);

  useEffect(() => {
    // Refactored useEffect for fetching assignments
    const fetchAssignments = async () => {
      const start = fromDate instanceof Date ? fromDate : new Date(0);
      const end = toDate instanceof Date ? toDate : new Date();
      try {
        const response = await apiClient.get("/assignments/range", {
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
        });

        // Parse due dates as Date objects and sort assignments
        const sortedAssignments = response.data
          .map((assignment) => ({
            ...assignment,
            dueDate: new Date(assignment.dueDate), // Parse due date as Date object
          }))
          .sort((a, b) => a.dueDate - b.dueDate); // Sort by due date

        setAssignments(sortedAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, [fromDate, toDate]);

  const handleDateFilterButtonClick = (filterType) => {
    let start = new Date();
    let end = new Date();

    switch (filterType) {
      case DATE_FILTERS.TODAY:
        start.setHours(0, 0, 0, 0); // Start of the day
        end.setHours(23, 59, 59, 999); // End of the day
        break;
      case DATE_FILTERS.THIS_WEEK:
        start = startOfWeek(start, { weekStartsOn: 1 });
        end = endOfWeek(end, { weekStartsOn: 1 });
        break;
      case DATE_FILTERS.MONTH:
        start = startOfMonth(start);
        end = endOfMonth(end);
        break;
      default:
      // Default case logic
    }

    setFromDate(start);
    setToDate(end);
  };

  return (
    <Container>
      <h1>Teacher Dashboard</h1>
      <Form>
        {/* Student Information Form */}
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
          <Form.Group>
            <Form.Label>Grade Level</Form.Label>
            <Form.Control
              as="select"
              name="gradeLevel"
              value={student.gradeLevel}
              onChange={handleInputChange}
              onBlur={handleBlur}
            >
              {[...Array(12).keys()].map((grade) => (
                <option key={grade + 1} value={grade + 1}>
                  {grade + 1}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Group>
      </Form>

      {/* Date Filters and Assignment Table */}
      <ButtonGroup className="mb-1">
        <Button onClick={() => handleDateFilterButtonClick(DATE_FILTERS.TODAY)}>
          Today
        </Button>
        <Button
          onClick={() => handleDateFilterButtonClick(DATE_FILTERS.THIS_WEEK)}
        >
          This Week
        </Button>
        <Button onClick={() => handleDateFilterButtonClick(DATE_FILTERS.MONTH)}>
          Month
        </Button>
      </ButtonGroup>

      <Row className="mb-3">
        <Col>
          <Form.Label>From</Form.Label>
          <Form.Control
            type="date"
            value={fromDate ? formatDateForFields(fromDate) : ""}
            onChange={(e) => setFromDate(new Date(e.target.value))}
          />
          <Form.Label>To</Form.Label>
          <Form.Control
            type="date"
            value={toDate ? formatDateForFields(toDate) : ""}
            onChange={(e) => setToDate(new Date(e.target.value))}
          />
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
                <Button
                  variant="primary"
                  onClick={() => handleEditAssignment(assignment)}
                >
                  Edit
                </Button>
              </td>
              <td>{formatDate(new Date(assignment.dueDate))}</td>
              <td>{assignment.subject.name}</td>
              <td>{assignment.description}</td>
              <td>{assignment.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Editing Assignment */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Dropdown for Subjects */}
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                as="select"
                value={editableAssignment.subjectId || ""}
                onChange={(e) =>
                  setEditableAssignment({
                    ...editableAssignment,
                    subjectId: e.target.value,
                  })
                }
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Long Assignment Description */}
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editableAssignment.description || ""}
                onChange={(e) =>
                  setEditableAssignment({
                    ...editableAssignment,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* Assignment Status */}
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editableAssignment.subjectId || ""}
                onChange={(e) =>
                  setEditableAssignment({
                    ...editableAssignment,
                    subjectId: e.target.value,
                  })
                }
              >
                {["Incomplete", "Review", "Accepted"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Single Date Picker for Due Date */}
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formatDate(
                  editableAssignment.dueDate
                    ? new Date(editableAssignment.dueDate)
                    : ""
                )}
                onChange={(e) =>
                  setEditableAssignment({
                    ...editableAssignment,
                    dueDate: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </Form.Group>

            {/* Link Box */}
            <Form.Group>
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                value={editableAssignment.link || ""}
                onChange={(e) =>
                  setEditableAssignment({
                    ...editableAssignment,
                    link: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={saveAssignment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeacherDashboard;
