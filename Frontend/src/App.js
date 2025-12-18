import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import FireSafetyChatbot from "./pages/FireSafetyChatbot";
import AreaFireRiskAdvanced from "./pages/AreaFireRiskAdvanced";
import SafeRouteFinder from "./pages/SafeRouteFinder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/chatbot" element={<FireSafetyChatbot />} />
        <Route path="/fire-risk-advanced" element={<AreaFireRiskAdvanced />} />
        <Route path="/safe-route" element={<SafeRouteFinder />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
