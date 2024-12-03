import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import { useAuthStore } from "../storage/authStore";
// Define the User interface
interface User {
  _id: string;
  name: string;
  userType: any;
}

const API_URL = BASE_URL;

export const signup = async (
  name: string,
  email: string,
  password: string,
  userType: string,
  phoneNumber: string,
  phoneCountry: any,
  whatsappNumber: string,
  whatsappCountry: any,
  selectedSubjects?: string[]
): Promise<void> => {
  try {
    const data: any = {
      name,
      email,
      password,
      userType,
      phoneNumber,
      phoneCountry: phoneCountry._id,
      whatsappNumber,
      whatsappCountry: whatsappCountry._id,
    };
    if (userType === "Tutor") {
      data.subjects = selectedSubjects;
    }
    const response = await axios.post(`${API_URL}/api/auth/signup`, data);
    return response.data.message;
  } catch (error: any) {
    console.error(
      "Signup failed:",
      error.response ? error.response.data.message : error.message
    );
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const login = async (
  email: string,
  userType: string,
  password: string,
  setToken: any,
  setLoggedUser: any
): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      userType,
      password,
    });
    const data = response.data;
    if (data.token) {
      setToken(data.token);
      setLoggedUser(data.user);
    }
    return data;
  } catch (error: any) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error.message;
  }
};

export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const otpConfirm = async (email: string, otp: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/confirm-otp`, {
      email,
      otp,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const deleteUser = async (
  email: string,
  password: string,
  token: any
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/delete-account`,
      { email, password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.message;
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateExpoPushToken = async (
  user: User,
  expoToken: string,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/updatePushToken`,
      { userId: user._id, expoPushToken: expoToken },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
