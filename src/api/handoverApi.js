import api from "./axios";

export const getTodayHandovers = async () => {
  const response = await api.get("/api/handover/today");
  return response.data;
};

export const getAllHandovers = async () => {
  const response = await api.get("/api/handover/all");
  return response.data;
};

export const getHandoversByDate = async (date) => {
  const response = await api.get(`/api/handover/date?date=${date}`);
  return response.data;
};
