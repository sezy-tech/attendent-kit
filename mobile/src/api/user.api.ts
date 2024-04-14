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
export interface Timetable {
  startTime : number,
  endTime : number,
  name : string,
  dayInWeek : number,
  room : string,
}
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
  },
  edit : async(data : UserInfo )=>{
    const {_id,password,...dataWithOutId} = data
    const url = `/user/${data._id}`
    const rsp = await apiClient.patch<any>(url,dataWithOutId)
    return rsp.data
  },
  delete : async (id : string)=>{
    const url = `/user/${id}`
    const rsp = await apiClient.delete<string>(url)
    return rsp.data
  },
  studentTimetable : async()=>{
    const url = `/user/student/timetable`
    const rsp = await apiClient.get<Timetable[]>(url)
    return rsp.data
  },
  lecturerTimetable : async( )=>{
    const url = `/user/lecturer/timetable`
    const rsp = await apiClient.get<[]>(url)
    return rsp.data
  },
  deviceId : async(id : string)=>{
    const url = `/user/device`
    const rsp = await apiClient.patch(url,{id})
    return rsp.data
  },
  logOut : async()=>{
    const url = `/user/logout`
    const rsp = await apiClient.post(url)
    return rsp.data
  }
};


export default userApi