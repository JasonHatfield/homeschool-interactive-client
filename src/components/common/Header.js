import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

/**
 * Header component for the application.
 * Renders the navigation bar with a brand name and a dashboard button.
 */
const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const onTeacherDashboard = location.pathname === "/teacher";
    const onAdminDashboard = location.pathname === "/admin";

    /**
     * Renders the dashboard button based on the current location.
     * @returns {JSX.Element|null} The dashboard button JSX element or null if not on a dashboard page.
     */
    const renderDashboardButton = () => {
        if (onTeacherDashboard) {
            return (
                <div className="text-center">
                    {/* Center the button */}
                    <Button variant="outline-success" onClick={() => navigate("/admin")}>
                        Admin Dashboard
                    </Button>
                </div>
            );
        } else if (onAdminDashboard) {
            return (
                <div className="text-center">
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
