import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import "leaflet/dist/leaflet.css";
import { RecordingProvider } from "./recording/RecordingProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecordingProvider>
        <AppRoutes />
      </RecordingProvider>
    </BrowserRouter>
  </React.StrictMode>
);

