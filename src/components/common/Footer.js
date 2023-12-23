import React from "react";
import { Container } from "react-bootstrap";

// Define the Footer component
const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start">
            <Container className="p-4">
                {/* Commented out the div element for the copyright notice */}
                {/* <div
                    className="text-center p-3"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                >
                    © 2023 Homeschool Interactive
                </div> */}
            </Container>
        </footer>
    );
};

export default Footer;
