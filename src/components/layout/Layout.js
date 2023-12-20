import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

/**
 * Renders the layout of the application.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {ReactNode} The rendered layout.
 */
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
