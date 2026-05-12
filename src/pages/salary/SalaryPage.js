import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  calculateSalary,
  getUserSalary,
  getAllSalary,
} from "../../api/salaryApi";
import { getAllStaff } from "../../api/staffApi";

function SalaryPage() {
  const [staffList, setStaffList] = useState([]);
  const [salaryList, setSalaryList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchStaff();
    fetchAllSalary();
  }, []);

  const fetchStaff = async () => {
    try {
      const data = await getAllStaff();
      setStaffList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllSalary = async () => {
    try {
      const data = await getAllSalary(year, month);
      setSalaryList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    setError("");
    try {
      if (selectedUserId) {
        const data = await getUserSalary(selectedUserId);
        setSalaryList(data.filter((s) => s.year === year && s.month === month));
      } else {
        fetchAllSalary();
      }
    } catch (err) {
      setError("급여 조회에 실패했습니다.");
    }
  };

  const handleCalculate = async () => {
    if (!selectedUserId) {
      setError("직원을 선택해주세요.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      await calculateSalary(selectedUserId, year, month);
      setSuccess("급여 정산이 완료되었습니다.");
      handleSearch();
    } catch (err) {
      setError("이미 정산된 급여이거나 출퇴근 기록이 없습니다.");
    }
  };

  return (
    <Layout>
      <div>
        <h2 style={styles.title}>급여 관리</h2>

        <div style={styles.filterBox}>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={styles.select}
          >
            <option value="">전체 직원</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={styles.select}
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            style={styles.select}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <button onClick={handleSearch} style={styles.searchBtn}>
            조회
          </button>
          <button onClick={handleCalculate} style={styles.calcBtn}>
            정산
          </button>
        </div>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>직원명</th>
              <th style={styles.th}>년/월</th>
              <th style={styles.th}>총 근무시간</th>
              <th style={styles.th}>기본급</th>
              <th style={styles.th}>주휴수당</th>
              <th style={styles.th}>최종 급여</th>
              <th style={styles.th}>정산일</th>
            </tr>
          </thead>
          <tbody>
            {salaryList.map((item) => (
              <tr key={item.id} style={styles.tableRow}>
                <td style={styles.td}>{item.userName}</td>
                <td style={styles.td}>
                  {item.year}년 {item.month}월
                </td>
                <td style={styles.td}>{item.totalHours}시간</td>
                <td style={styles.td}>{item.baseSalary.toLocaleString()}원</td>
                <td style={styles.td}>
                  {item.weeklyHolidayPay.toLocaleString()}원
                </td>
                <td style={styles.td}>
                  <strong>{item.totalSalary.toLocaleString()}원</strong>
                </td>
                <td style={styles.td}>
                  {new Date(item.settledAt).toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {salaryList.length === 0 && (
          <div style={styles.empty}>급여 정산 내역이 없습니다.</div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  filterBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    cursor: "pointer",
  },
  searchBtn: {
    padding: "8px 16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  calcBtn: {
    padding: "8px 16px",
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
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "14px",
  },
};

export default SalaryPage;
