import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../../api/noticeApi";

function NoticePage() {
  const [noticeList, setNoticeList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await getAllNotices();
      setNoticeList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setSelectedNotice(null);
    setForm({ title: "", content: "" });
    setShowForm(true);
  };

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setForm({ title: notice.title, content: notice.content });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (selectedNotice) {
        await updateNotice(selectedNotice.id, form);
      } else {
        await createNotice(form);
      }
      setShowForm(false);
      fetchNotices();
    } catch (err) {
      setError("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await deleteNotice(noticeId);
      fetchNotices();
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
          <h2 style={styles.title}>공지사항</h2>
          <button style={styles.addBtn} onClick={handleAdd}>
            + 공지 작성
          </button>
        </div>

        {showForm && (
          <div style={styles.formBox}>
            <h3 style={styles.formTitle}>
              {selectedNotice ? "공지 수정" : "공지 작성"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label>제목</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label>내용</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="내용을 입력하세요"
                  rows={4}
                  required
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.btnGroup}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={styles.cancelBtn}
                >
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {selectedNotice ? "수정" : "등록"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.cardList}>
          {noticeList.length === 0 ? (
            <div style={styles.empty}>공지사항이 없습니다.</div>
          ) : (
            noticeList.map((notice) => (
              <div key={notice.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.noticeTitle}>{notice.title}</h3>
                  <div style={styles.btnGroup}>
                    <button
                      onClick={() => handleEdit(notice)}
                      style={styles.editBtn}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      style={styles.deleteBtn}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p style={styles.content}>{notice.content}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.author}>{notice.userName}</span>
                  <span style={styles.time}>
                    {formatDateTime(notice.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
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
  inputGroup: {
    marginBottom: "14px",
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
  textarea: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    resize: "vertical",
  },
  btnGroup: {
    display: "flex",
    gap: "8px",
  },
  cancelBtn: {
    padding: "8px 16px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  submitBtn: {
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
    marginBottom: "10px",
  },
  noticeTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: 0,
  },
  editBtn: {
    padding: "4px 12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteBtn: {
    padding: "4px 12px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  content: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    margin: "0 0 12px 0",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: "13px",
    color: "#3498db",
    fontWeight: "bold",
  },
  time: {
    fontSize: "12px",
    color: "#999",
  },
  error: {
    color: "#e74c3c",
    fontSize: "13px",
    marginBottom: "10px",
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

export default NoticePage;
