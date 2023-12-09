import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import apiClient from "../../services/apiClient.js";

const AdminDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [homeschoolName, setHomeschoolName] = useState("Hatfield Home School");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
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

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], name: value };
    setSubjects(updatedSubjects);
  };

  const handleUpdateSubject = async (subject) => {
    try {
      await apiClient.put(`/subjects/${subject.subjectId}`, subject);
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const handleInputBlur = (subject) => {
    if (subject.name !== "") {
      handleUpdateSubject(subject);
    } else {
      subject.name = null;
      handleUpdateSubject(subject);
    }
  };

  const handleDeleteClick = (subjectId) => {
    setShowDeleteModal(true);
    setDeleteSubjectId(subjectId);
  };

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
      <Button onClick={addSubject}>Add Subject</Button>

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
