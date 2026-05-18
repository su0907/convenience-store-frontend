import api from "./axios";

export const getAllNotices = async () => {
  const response = await api.get("/api/notice");
  return response.data;
};

export const createNotice = async (data) => {
  const response = await api.post("/api/notice", data);
  return response.data;
};

export const updateNotice = async (noticeId, data) => {
  const response = await api.put(`/api/notice/${noticeId}`, data);
  return response.data;
};

export const deleteNotice = async (noticeId) => {
  await api.delete(`/api/notice/${noticeId}`);
};
