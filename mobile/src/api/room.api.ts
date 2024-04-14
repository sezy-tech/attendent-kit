import axios from "axios";
import apiClient from "./apiClient";
export interface Room {
    _id : string,
    name :string,
}
const roomApi = {
getAllRoom: async () => {
    const url = `/room/`;
    const rsp = await apiClient.get<Room[]>(url);
    return rsp.data
},
getRoom: async (id:string) => {
  const url = `/room/${id}`;
  const rsp = await apiClient.get<Room>(url);
  return rsp.data
},
  createRoom : async (name : string) => {
    const url = `/room`
    const rsp = await apiClient.post(url, { name : name })
    return rsp.data
  },
  editRoom : async (id : string, name : string) => {
    const url = `/room/${id}`
    const rsp = await apiClient.patch<string>(url,{name})
    return rsp.data
  },
  deleteRoom : async (id : string)=>{
    const url = `/room/${id}`
    const rsp = await apiClient.delete<string>(url)
    return rsp.data
  }
};


export default roomApi