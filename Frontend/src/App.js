import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import FireSafetyChatbot from "./pages/FireSafetyChatbot";
import FireRiskMonitor from "./pages/FireRiskMonitor";
import SafeRouteFinder from "./pages/SafeRouteFinder";

//  ADD THESE TWO
import CommunityReports from './pages/CommunityReports';
import FireIncidentReport from './pages/FireIncidentReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/chatbot" element={<FireSafetyChatbot />} />
        <Route path="/fire-risk" element={<FireRiskMonitor/>} />
        <Route path="/safe-route" element={<SafeRouteFinder />} />

        {/*  COMMUNITY FIRE REPORTS */}
        <Route path="/community-reports" element={<CommunityReports />} />
        <Route path="/incident-report" element={<FireIncidentReport />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
