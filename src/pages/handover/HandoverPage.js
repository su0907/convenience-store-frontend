import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getTodayHandovers,
  getAllHandovers,
  getHandoversByDate,
} from "../../api/handoverApi";

function HandoverPage() {
  const [handoverList, setHandoverList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [viewMode, setViewMode] = useState("today");

  useEffect(() => {
    fetchTodayHandovers();
  }, []);

  const fetchTodayHandovers = async () => {
    try {
      const data = await getTodayHandovers();
      setHandoverList(data);
      setViewMode("today");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllHandovers = async () => {
    try {
      const data = await getAllHandovers();
      setHandoverList(data);
      setViewMode("all");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchByDate = async () => {
    if (!selectedDate) return;
    try {
      const data = await getHandoversByDate(selectedDate);
      setHandoverList(data);
      setViewMode("date");
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
        <h2 style={styles.title}>인수인계</h2>

        <div style={styles.filterBox}>
          <button
            onClick={fetchTodayHandovers}
            style={{
              ...styles.filterBtn,
              backgroundColor: viewMode === "today" ? "#3498db" : "#ecf0f1",
              color: viewMode === "today" ? "white" : "#333",
            }}
          >
            오늘
          </button>
          <button
            onClick={fetchAllHandovers}
            style={{
              ...styles.filterBtn,
              backgroundColor: viewMode === "all" ? "#3498db" : "#ecf0f1",
              color: viewMode === "all" ? "white" : "#333",
            }}
          >
            전체
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.dateInput}
          />
          <button onClick={fetchByDate} style={styles.searchBtn}>
            날짜 조회
          </button>
        </div>

        <div style={styles.cardList}>
          {handoverList.length === 0 ? (
            <div style={styles.empty}>인수인계 내역이 없습니다.</div>
          ) : (
            handoverList.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.userName}>{item.userName}</span>
                  <span style={styles.time}>
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <p style={styles.content}>{item.content}</p>
              </div>
            ))
          )}
        </div>
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
  filterBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  dateInput: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  searchBtn: {
    padding: "8px 16px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  userName: {
    fontWeight: "bold",
    fontSize: "15px",
    color: "#2c3e50",
  },
  time: {
    fontSize: "12px",
    color: "#999",
  },
  content: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    margin: 0,
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "14px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
};

export default HandoverPage;
