import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import Layout from "./components/Layout";
import StaffPage from "./pages/staff/StaffPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import SchedulePage from "./pages/schedule/SchedulePage";
import SalaryPage from "./pages/salary/SalaryPage";
import HandoverPage from "./pages/handover/HandoverPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/salary" element={<SalaryPage />} />
        <Route path="/handover" element={<HandoverPage />} />
        <Route
          path="/notice"
          element={
            <Layout>
              <div>공지사항 (준비중)</div>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
