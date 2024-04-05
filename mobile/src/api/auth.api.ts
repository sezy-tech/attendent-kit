import { LoginRequest, LoginResponse } from "../models/auth.model";
import apiClient from "./apiClient";

const baseUrl = `auth`;
const authApi = {
  login: (loginRequest: LoginRequest) => {
    console.log()
    return apiClient.post<LoginResponse>(`${baseUrl}/login`, loginRequest);
  },
};


export default authApi