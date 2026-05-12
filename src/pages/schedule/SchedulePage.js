import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Layout from "../../components/Layout";
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../api/scheduleApi";
import { getAllStaff } from "../../api/staffApi";

function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    workDate: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetchSchedules();
    fetchStaff();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await getAllSchedules();
      const mapped = data.map((s) => ({
        id: String(s.id),
        title: `${s.userName} ${s.startTime}~${s.endTime}`,
        date: s.workDate,
        extendedProps: s,
      }));
      setEvents(mapped);
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

  const handleDateClick = (info) => {
    setSelectedEvent(null);
    setForm({ userId: "", workDate: info.dateStr, startTime: "", endTime: "" });
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const props = info.event.extendedProps;
    setSelectedEvent({ id: info.event.id, ...props });
    setForm({
      userId: String(props.userId || ""),
      workDate: props.workDate,
      startTime: props.startTime,
      endTime: props.endTime,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: parseInt(form.userId),
        workDate: form.workDate,
        startTime: form.startTime,
        endTime: form.endTime,
      };
      if (selectedEvent) {
        await updateSchedule(selectedEvent.id, payload);
      } else {
        await createSchedule(payload);
      }
      setShowModal(false);
      fetchSchedules();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await deleteSchedule(selectedEvent.id);
      setShowModal(false);
      fetchSchedules();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div>
        <h2 style={styles.title}>스케줄 관리</h2>
        <p style={styles.hint}>날짜를 클릭하면 스케줄을 등록할 수 있어요.</p>

        <div style={styles.calendarBox}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            locale="ko"
            height="auto"
          />
        </div>

        {showModal && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>
                {selectedEvent ? "스케줄 수정/삭제" : "스케줄 등록"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                  <label>직원</label>
                  <select
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">직원 선택</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label>날짜</label>
                  <input
                    name="workDate"
                    type="date"
                    value={form.workDate}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>출근 시간</label>
                  <input
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>퇴근 시간</label>
                  <input
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.btnGroup}>
                  {selectedEvent && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      style={styles.deleteBtn}
                    >
                      삭제
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={styles.cancelBtn}
                  >
                    취소
                  </button>
                  <button type="submit" style={styles.submitBtn}>
                    {selectedEvent ? "수정" : "등록"}
                  </button>
                </div>
              </form>
            </div>
          </div>
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
    marginBottom: "8px",
  },
  hint: {
    fontSize: "13px",
    color: "#999",
    marginBottom: "20px",
  },
  calendarBox: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "30px",
    width: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
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
  btnGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "20px",
  },
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "auto",
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
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default SchedulePage;
