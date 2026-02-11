import axios from "axios";

const API_BASE = typeof __API_BASE__ !== "undefined" ? __API_BASE__ : "https://horntrax-api.herokuapp.com";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

export async function login(username, password){
  const u = String(username || "").trim();
  const res = await api.post(`/users/login/${encodeURIComponent(u)}`, { password: String(password || "") });
  return res.data;
}

export async function registerUser({ username, email, password }){
  const res = await api.post("/users/add", {
    username: String(username || "").trim(),
    email: String(email || "").trim(),
    password: String(password || ""),
  });
  return res.data;
}

export async function getLoanersByUserId(userid){
  const res = await api.get(`/loaners/useridfind/${encodeURIComponent(String(userid))}`);
  return res.data;
}

export async function addLoaner(payload){
  const res = await api.post("/loaners/add", payload);
  return res.data;
}

export async function updateLoaner(id, payload){
  const res = await api.post(`/loaners/update/${encodeURIComponent(String(id))}`, payload);
  return res.data;
}

export async function deleteLoaner(id){
  const res = await api.get(`/loaners/delete/${encodeURIComponent(String(id))}`);
  return res.data;
}
