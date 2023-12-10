import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import apiClient from "../../services/apiClient.js";

/**
 * AdminDashboard component represents the dashboard for the admin user.
 * It allows the admin to manage subjects for the homeschool.
 */
const AdminDashboard = () => {
    // State to store subjects
    const [subjects, setSubjects] = useState([]);
    // State to store homeschool name
    const [homeschoolName, setHomeschoolName] = useState("Hatfield Home School");
    // State to control delete modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // State to store subject id to be deleted
    const [deleteSubjectId, setDeleteSubjectId] = useState(null);
    // State to control error modal visibility
    const [showErrorModal, setShowErrorModal] = useState(false);
    // State to store error message
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Fetch subjects on component mount
        const fetchSubjects = async () => {
            try {
                const response = await apiClient.get("/subjects");
                setSubjects(response.data.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchSubjects();
    }, []);

    /**
     * Updates the subject name in the subjects array.
     * @param {number} index - The index of the subject in the subjects array.
     * @param {string} value - The new value for the subject name.
     */
    const handleSubjectChange = (index, value) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index] = { ...updatedSubjects[index], name: value };
        setSubjects(updatedSubjects);
    };

    /**
     * Updates the subject on the server.
     * @param {object} subject - The subject object to be updated.
     */
    const handleUpdateSubject = async (subject) => {
        try {
            await apiClient.put(`/subjects/${subject.subjectId}`, subject);
        } catch (error) {
            console.error("Error updating subject:", error);
        }
    };

    /**
     * Handles the input blur event.
     * If the subject name is not empty, it updates the subject on the server.
     * If the subject name is empty, it sets the subject name to null and updates the subject on the server.
     * @param {object} subject - The subject object.
     */
    const handleInputBlur = (subject) => {
        if (subject.name !== "") {
            handleUpdateSubject(subject);
        } else {
            subject.name = null;
            handleUpdateSubject(subject);
        }
    };

    /**
     * Shows the delete modal and sets the subject id to be deleted.
     * @param {number} subjectId - The id of the subject to be deleted.
     */
    const handleDeleteClick = (subjectId) => {
        setShowDeleteModal(true);
        setDeleteSubjectId(subjectId);
    };

    /**
     * Confirms the deletion of the subject.
     * Deletes the subject on the server and updates the subjects state.
     * Shows an error modal if the subject is being used by an assignment.
     */
    const confirmDeletion = async () => {
        try {
            await apiClient.delete(`/subjects/${deleteSubjectId}`);
            setSubjects(
                subjects.filter((subject) => subject.subjectId !== deleteSubjectId)
            );
            setShowDeleteModal(false);
        } catch (error) {
            if (error.response && error.response.status === 500) {
                setErrorMessage(
                    "This subject cannot be deleted because it is being used by an assignment."
                );
                setShowErrorModal(true);
            } else {
                // Handle other kinds of errors
            }
        }
    };

    /**
     * Adds a new subject.
     * Sends a POST request to the server to create a new subject.
     * Updates the subjects state with the newly created subject.
     */
    const addSubject = async () => {
        try {
            const newSubject = { name: "New Subject" };
            const response = await apiClient.post("/subjects", newSubject);
            setSubjects([...subjects, response.data]);
        } catch (error) {
            console.error("Error adding new subject:", error);
        }
    };

    return (
        <div className="container">
            {/* Homeschool Name */}
            <h1 className="text-center">
                <Form.Control
                    type="text"
                    value={homeschoolName}
                    onChange={(e) => setHomeschoolName(e.target.value)}
                    placeholder="Enter Homeschool Name"
                    className="bold-input bigger-input custom-input"
                />
            </h1>
            <hr />
            <h2 className="text-center">Subjects</h2>
            {/* Subject List */}
            {subjects.map((subject, index) => (
                <Form key={subject.subjectId}>
                    <Form.Group className="d-flex align-items-center">
                        <Form.Control
                            type="text"
                            value={subject.name || ""}
                            onChange={(e) => handleSubjectChange(index, e.target.value)}
                            onBlur={() => handleInputBlur(subject)}
                            placeholder="Enter Subject"
                            className="mb-2"
                        />
                        <FaTrashAlt onClick={() => handleDeleteClick(subject.subjectId)} />
                    </Form.Group>
                </Form>
            ))}
            {/* Add Subject Button */}
            <Button onClick={addSubject}>Add Subject</Button>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this subject?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeletion}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Error Modal */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
