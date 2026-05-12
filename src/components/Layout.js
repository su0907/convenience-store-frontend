import React from "react";
import Sidebar from "./Sidebar";
import { getUserInfo } from "../utils/auth";

function Layout({ children }) {
  const { name, role } = getUserInfo();

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.header}>
          <span style={styles.userInfo}>
            {name} ({role === "MANAGER" ? "점장" : "알바생"})
          </span>
        </div>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f6fa",
  },
  header: {
    backgroundColor: "white",
    padding: "16px 24px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  userInfo: {
    fontSize: "14px",
    color: "#555",
  },
  content: {
    padding: "24px",
    flex: 1,
  },
};

export default Layout;
