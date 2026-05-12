import api from "./axios";

export const getAllAttendance = async () => {
  const response = await api.get("/api/attendance/all");
  return response.data;
};

export const getUserAttendance = async (userId) => {
  const response = await api.get(`/api/attendance/${userId}`);
  return response.data;
};
