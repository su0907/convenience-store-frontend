import api from "./axios";

export const calculateSalary = async (userId, year, month) => {
  const response = await api.post(
    `/api/salary/calculate/${userId}?year=${year}&month=${month}`,
  );
  return response.data;
};

export const getUserSalary = async (userId) => {
  const response = await api.get(`/api/salary/${userId}`);
  return response.data;
};

export const getAllSalary = async (year, month) => {
  const response = await api.get(`/api/salary/all?year=${year}&month=${month}`);
  return response.data;
};
