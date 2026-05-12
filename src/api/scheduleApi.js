import api from "./axios";

export const getAllSchedules = async () => {
  const response = await api.get("/api/schedule/all");
  return response.data;
};

export const createSchedule = async (data) => {
  const response = await api.post("/api/schedule", data);
  return response.data;
};

export const updateSchedule = async (scheduleId, data) => {
  const response = await api.put(`/api/schedule/${scheduleId}`, data);
  return response.data;
};

export const deleteSchedule = async (scheduleId) => {
  await api.delete(`/api/schedule/${scheduleId}`);
};
