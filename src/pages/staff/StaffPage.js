import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAllStaff, registerStaff } from "../../api/staffApi";

function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    hourlyWage: "",
    role: "STAFF",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const data = await getAllStaff();
      setStaffList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await registerStaff({
        ...form,
        hourlyWage: parseInt(form.hourlyWage),
      });
      setSuccess("직원이 등록되었습니다.");
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        hourlyWage: "",
        role: "STAFF",
      });
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      setError("직원 등록에 실패했습니다.");
    }
  };

  return (
    <Layout>
      <div>
        <div style={styles.header}>
          <h2 style={styles.title}>직원 관리</h2>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "닫기" : "+ 직원 등록"}
          </button>
        </div>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {showForm && (
          <div style={styles.formBox}>
            <h3 style={styles.formTitle}>직원 등록</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label>이름</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>이메일</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>비밀번호</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>전화번호</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>시급</label>
                  <input
                    name="hourlyWage"
                    type="number"
                    value={form.hourlyWage}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>역할</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="STAFF">알바생</option>
                    <option value="MANAGER">점장</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>
                등록
              </button>
            </form>
          </div>
        )}

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>이메일</th>
              <th style={styles.th}>전화번호</th>
              <th style={styles.th}>시급</th>
              <th style={styles.th}>역할</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} style={styles.tableRow}>
                <td style={styles.td}>{staff.id}</td>
                <td style={styles.td}>{staff.name}</td>
                <td style={styles.td}>{staff.email}</td>
                <td style={styles.td}>{staff.phone || "-"}</td>
                <td style={styles.td}>{staff.hourlyWage.toLocaleString()}원</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor:
                        staff.role === "MANAGER" ? "#3498db" : "#2ecc71",
                    }}
                  >
                    {staff.role === "MANAGER" ? "점장" : "알바생"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  addBtn: {
    padding: "8px 16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  formBox: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "10px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  formTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#2c3e50",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  submitBtn: {
    padding: "10px 24px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
  },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "13px",
    color: "#666",
    fontWeight: "600",
    borderBottom: "1px solid #e0e0e0",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#333",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
  },
  success: {
    color: "#2ecc71",
    marginBottom: "12px",
    fontSize: "14px",
  },
  error: {
    color: "#e74c3c",
    marginBottom: "12px",
    fontSize: "14px",
  },
};

export default StaffPage;
