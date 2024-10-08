import { User } from "../models/db.model";
import apiClient from "./apiClient";
export interface CreateUserInput {
  phone: string,
  email: string,
  password: string,
  role: number,
};
export interface UserInfo {
  _id: string,
  phone: string,
  email: string,
  password: string,
  role: number,
};
export interface Timetable {
  startTime: number,
  endTime: number,
  name: string,
  dayInWeek: number,
  room: string,
}
const userApi = {
  getAll: async () => {
    const url = `/user`
    const rsp = await apiClient.get<UserInfo[]>(url)
    return rsp.data
  },
  getProfile: async () => {
    try{
      const url = `/user/profile`;
      const rsp = await apiClient.get<User>(url);
      return rsp.data
    }catch(e){
      console.log(e)
    }
  },
  createUser: async (data: CreateUserInput) => {
    console.log("createUser")
    const url = `/user/create`;
    try {
      const rsp = await apiClient.post<CreateUserInput>(url, data);
      return rsp.data;
    } catch (error) {
      throw error;
    }
  },
  edit: async (data: UserInfo) => {
    console.log("edit")
    const { _id, password, ...dataWithOutId } = data
    const url = `/user/${data._id}`
    const rsp = await apiClient.patch<any>(url, dataWithOutId)
    return rsp.data
  },
  delete: async (id: string) => {
    const url = `/user/${id}`
    const rsp = await apiClient.delete<string>(url)
    return rsp.data
  },
  studentTimetable: async () => {
    const url = `/user/student/timetable`
    const rsp = await apiClient.get<Timetable[]>(url)
    return rsp.data
  },
  lecturerTimetable: async () => {
    const url = `/user/lecturer/timetable`
    const rsp = await apiClient.get<[]>(url)
    return rsp.data
  },
  deviceId: async (id: string) => {
    const url = `/user/device`
    const rsp = await apiClient.patch(url, { id })
    return rsp.data
  },
  logOut: async () => {
    const url = `/user/logout`
    const rsp = await apiClient.post(url)
    return rsp.data
  },
  hasFaceInput: async () => {
    return apiClient.get('/user/has-face-input')
  },
  setFCMToken: async (id: string, fcmToken: string) => {
    // console.log("====================================setFCMToken")
    // console.log("====================================setFCMToken")
    // console.log("====================================setFCMToken")
    // console.log(id)
    // console.log(fcmToken)
    return apiClient.patch(`/user/${id}/fcmtoken`, { token: fcmToken });
  }
};


export default userApi