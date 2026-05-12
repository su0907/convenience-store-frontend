import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";

const menuItems = [
  { path: "/staff", label: "직원 관리" },
  { path: "/attendance", label: "출퇴근 현황" },
  { path: "/schedule", label: "스케줄 관리" },
  { path: "/salary", label: "급여 관리" },
  { path: "/handover", label: "인수인계" },
  { path: "/notice", label: "공지사항" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>편의점 관리</div>
      <nav>
        {menuItems.map((item) => (
          <div
            key={item.path}
            style={{
              ...styles.menuItem,
              ...(location.pathname === item.path ? styles.active : {}),
            }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </nav>
      <div style={styles.logoutBtn} onClick={handleLogout}>
        로그아웃
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    minHeight: "100vh",
    backgroundColor: "#2c3e50",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  logo: {
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    padding: "20px",
    borderBottom: "1px solid #3d5166",
    marginBottom: "10px",
  },
  menuItem: {
    color: "#bdc3c7",
    padding: "14px 24px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.2s",
  },
  active: {
    backgroundColor: "#3d5166",
    color: "white",
    borderLeft: "3px solid #3498db",
  },
  logoutBtn: {
    color: "#e74c3c",
    padding: "14px 24px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "auto",
    borderTop: "1px solid #3d5166",
  },
};

export default Sidebar;
