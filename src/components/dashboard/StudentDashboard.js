import React, { useState, useEffect, useCallback } from "react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Table, Button, ButtonGroup, Form, Container } from "react-bootstrap";
import DatePicker from "../custom/CustomDatePicker";
import apiClient from "../../services/apiClient";

const DATE_FILTERS = {
  TODAY: "Today",
  THIS_WEEK: "ThisWeek",
  MONTH: "Month",
};

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([
    new Date(),
    new Date(),
  ]);
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchStudentData = useCallback(async () => {
    try {
      const studentResponse = await apiClient.get("/students/1");
      const { firstName, lastName, gradeLevel } = studentResponse.data;
      setStudentName(`${firstName} ${lastName}`);
      setGradeLevel(gradeLevel);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }, []);

  const fetchAssignmentsByDateRange = useCallback(async (start, end) => {
    try {
      const formattedStart = formatDate(start);
      const adjustedEnd = new Date(end);
      adjustedEnd.setHours(23, 59, 59, 999);

      const assignmentsResponse = await apiClient.get("/assignments/range", {
        params: { startDate: formattedStart, endDate: formatDate(adjustedEnd) },
      });
      setAssignments(assignmentsResponse.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
    fetchAssignmentsByDateRange(selectedDateRange[0], selectedDateRange[1]);

    const updateTime = () => {
      setCurrentTime(new Date());
    };

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [fetchStudentData, fetchAssignmentsByDateRange, selectedDateRange]);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleDateRangeChange = (start, end) => {
    setSelectedDateRange([start, end]);
  };

  const handleToggleAssignmentStatus = async (assignmentId, currentStatus) => {
    if (!assignmentId) {
      console.error("Assignment ID is undefined");
      return;
    }

    const newStatus = currentStatus === "Review" ? "Incomplete" : "Review";
    try {
      const response = await apiClient.put(
        `/assignments/${assignmentId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.status === 200) {
        updateAssignmentStatus(assignmentId, newStatus);
      } else {
        console.error(
          "Error updating assignment status. Status code:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error updating assignment status:", error);
    }
  };

  const updateAssignmentStatus = (assignmentId, newStatus) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.assignmentId === assignmentId
          ? { ...assignment, status: newStatus }
          : assignment
      )
    );
  };

  const handleDateFilterButtonClick = (filterType) => {
    let start, end;
    switch (filterType) {
      case DATE_FILTERS.TODAY:
        start = end = new Date();
        break;
      case DATE_FILTERS.THIS_WEEK:
        start = startOfWeek(new Date());
        end = endOfWeek(new Date());
        break;
      case DATE_FILTERS.MONTH:
        start = startOfMonth(new Date());
        end = endOfMonth(new Date());
        break;
      default:
        start = end = new Date();
    }
    handleDateRangeChange(start, end);
  };

  return (
    <Container>
      <div className="student-info text-center">
        <h1>Hatfield Home School</h1>
        <h2>{studentName}</h2>
        <h3>Grade: {gradeLevel}</h3>
        <p>Current Time: {currentTime.toLocaleTimeString()}</p>
      </div>

      <ButtonGroup>
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

      <DatePicker
        selectedDateRange={selectedDateRange}
        handleDateRangeChange={handleDateRangeChange}
      />

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
          {assignments.map((assignment) => {
            const currentDate = new Date();
            const startOfToday = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate()
            );
            const assignmentDueDate = new Date(assignment.dueDate);

            const isDueToday =
              assignmentDueDate >= startOfToday &&
              assignmentDueDate <= currentDate;
            const isNotComplete = assignment.status !== "Complete";

            if (
              isDueToday ||
              (assignmentDueDate < startOfToday && isNotComplete)
            ) {
              return (
                <tr
                  key={assignment.assignmentId}
                  className={`${
                    assignment.status === "Accepted"
                      ? "accepted-assignment"
                      : ""
                  } ${isDueToday ? "due-today-assignment" : ""}`}
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
              );
            } else {
              return null; // Hide assignments that are not due today and are complete
            }
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default StudentDashboard;
