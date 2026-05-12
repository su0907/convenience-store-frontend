import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAllAttendance, getUserAttendance } from "../../api/attendanceApi";
import { getAllStaff } from "../../api/staffApi";

function AttendancePage() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchAllAttendance();
    fetchStaff();
  }, []);

  const fetchAllAttendance = async () => {
    try {
      const data = await getAllAttendance();
      setAttendanceList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await getAllStaff();
      setStaffList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserChange = async (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    try {
      if (userId === "") {
        fetchAllAttendance();
      } else {
        const data = await getUserAttendance(userId);
        setAttendanceList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleString("ko-KR");
  };

  return (
    <Layout>
      <div>
        <div style={styles.header}>
          <h2 style={styles.title}>출퇴근 현황</h2>
          <select
            value={selectedUserId}
            onChange={handleUserChange}
            style={styles.select}
          >
            <option value="">전체 직원</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>직원명</th>
              <th style={styles.th}>근무일</th>
              <th style={styles.th}>출근시간</th>
              <th style={styles.th}>퇴근시간</th>
              <th style={styles.th}>근무시간</th>
              <th style={styles.th}>상태</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((item) => (
              <tr key={item.id} style={styles.tableRow}>
                <td style={styles.td}>{item.id}</td>
                <td style={styles.td}>{item.userName}</td>
                <td style={styles.td}>{item.workDate}</td>
                <td style={styles.td}>{formatDateTime(item.clockIn)}</td>
                <td style={styles.td}>{formatDateTime(item.clockOut)}</td>
                <td style={styles.td}>
                  {item.workHours ? `${item.workHours}시간` : "-"}
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: item.clockOut ? "#2ecc71" : "#e67e22",
                    }}
                  >
                    {item.clockOut ? "퇴근" : "근무중"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {attendanceList.length === 0 && (
          <div style={styles.empty}>출퇴근 기록이 없습니다.</div>
        )}
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
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    cursor: "pointer",
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
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "14px",
  },
};

export default AttendancePage;
