import axios from "axios";

export const monerooClient = axios.create({
  baseURL: "https://api.moneroo.io", // ✅ URL officielle Moneroo
  headers: {
    Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});
