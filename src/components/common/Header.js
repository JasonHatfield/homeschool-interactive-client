import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const onTeacherDashboard = location.pathname === "/teacher";
  const onAdminDashboard = location.pathname === "/admin";

  const renderDashboardButton = () => {
    if (onTeacherDashboard) {
      return (
        <div className="text-center">
          {" "}
          {/* Center the button */}
          <Button variant="outline-success" onClick={() => navigate("/admin")}>
            Admin Dashboard
          </Button>
        </div>
      );
    } else if (onAdminDashboard) {
      return (
        <div className="text-center">
          {" "}
          {/* Center the button */}
          <Button
            variant="outline-success"
            onClick={() => navigate("/teacher")}
          >
            Teacher Dashboard
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand
        style={{ cursor: "default", display: "flex", justifyContent: "center" }}
      >
        Homeschool Interactive
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">{renderDashboardButton()}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
