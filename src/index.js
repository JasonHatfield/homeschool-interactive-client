import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

// Find the root element in your HTML
const container = document.getElementById("root");

// Create a root.
const root = createRoot(container);

// Initial render: Render your App component to the root.
root.render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* Wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
