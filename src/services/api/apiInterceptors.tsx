import axios from "axios";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const appAxxios = axios.create({
  baseURL: BASE_URL,
});

appAxxios.interceptors.request.use(async (config) => {
  const accessToken = AsyncStorage.getItem("token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
