import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const API_ML_URL = process.env.API_ML_URL;

export const axiosMl = axios.create({
  baseURL: API_ML_URL,
  headers: {
    accept: "application/json",
  },
});

axiosMl.interceptors.request.use(
  (request) => {
    return request;
  },
  (e) => {
    throw e;
  },
);
