import api from "./axios";

export const getAllStaff = async () => {
  const response = await api.get("/api/users");
  return response.data;
};

export const registerStaff = async (data) => {
  const response = await api.post("/api/auth/signup", data);
  return response.data;
};
