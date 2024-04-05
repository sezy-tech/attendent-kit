import { User } from "../models/db.model";
import apiClient from "./apiClient";
export interface CreateUserInput {
  phone : string,
  email : string,
  password: string,
  role: number,
};
export interface UserInfo {
  _id: string,
  phone : string,
  email : string,
  password: string,
  role: number,
};
const userApi = {
  getAll: async () => {
    const url = `/user`
    const rsp = await apiClient.get<UserInfo[]>(url)
    return rsp.data
  },
  getProfile: async () => {
    const url = `/user/profile`;
    const rsp = await apiClient.get<User>(url);
    return rsp.data
  },
  createUser : async(data :CreateUserInput )=>{
    const url = `/user`
    const rsp = await apiClient.post<CreateUserInput>(url,data)
    return rsp.data
  }
};


export default userApi