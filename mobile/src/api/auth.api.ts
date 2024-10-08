import { LoginRequest, LoginResponse } from "../models/auth.model";
import apiClient from "./apiClient";

const baseUrl = '/auth';

const authApi = {
  login: (loginRequest: LoginRequest) => {
    // Optional: You can include additional logging or debugging if needed
    // console.log('Sending login request:', loginRequest);
    console.log(`${baseUrl}/login`);
    console.log(loginRequest);
    return apiClient.post<LoginResponse>(`${baseUrl}/login`, {
      ...loginRequest,
      studentId: loginRequest.studentId.toLowerCase(),
    });
  },
  logout: () => {
    return apiClient.post(`${baseUrl}/logout`);
  }
};

export default authApi;
