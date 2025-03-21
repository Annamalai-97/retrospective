import API from "../api"; 

export const login = async (email, password) => {
  try {
    const response = await API.post("/api/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
