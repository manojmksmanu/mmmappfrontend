import axios from "axios";
import { BASE_URL } from "./config";
const API_URL = `${BASE_URL}/api`;
export const getAllContry = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/country/get-all`);
    return response.data;
  } catch (err: any) {
    console.error(
      "Failed to fetch users:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
};
export const getAllSubjects = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/subject/get-all`);
    return response.data;
  } catch (err: any) {
    console.error(
      "Failed to fetch users:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
};
