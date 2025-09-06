import React from "react";
import ReactDOM from "react-dom/client";   // 👈 this is the missing import
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
