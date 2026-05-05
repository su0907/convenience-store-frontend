export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const saveUserInfo = (name, role) => {
  localStorage.setItem("name", name);
  localStorage.setItem("role", role);
};

export const getUserInfo = () => {
  return {
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
  };
};

export const removeUserInfo = () => {
  localStorage.removeItem("name");
  localStorage.removeItem("role");
};

export const logout = () => {
  removeToken();
  removeUserInfo();
};

export const isLoggedIn = () => {
  return !!getToken();
};
