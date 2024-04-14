import axios from 'axios';
import apiClient from './apiClient';
export interface SubjectForm {
  _id: string;
  name: string;
  room: string;
  students: string[];
  lecturers: string[];
  startTime: number;
  endTime: number;
  dayInWeek: number;
}
const subjectApi = {
  getAll: async () => {
    const url = `/subject`;
    const rsp = await apiClient.get<any[]>(url);
    return rsp.data;
  },
  create: async (data: any) => {
    try {
      const url = `/subject`;
      const rsp = await apiClient.post(url, data);
      return rsp.data;
    } catch (e) {
      console.log(e);
    }
  },
  edit: async (data: SubjectForm) => {
    const {_id, ...subjectWithOutId} = data;
    console.log(subjectWithOutId)
    const url = `/subject/${data._id}`;
    const rsp = await apiClient.patch(url, subjectWithOutId);
    return rsp.data;
  },
  delete: async (id: string) => {
    const url = `/subject/${id}`;
    const rsp = await apiClient.delete<string>(url);
    return rsp.data;
  },
  addStudent: async (id: string, studentid: any) => {
    const url = `/subject/${id}`;
    const rsp = await apiClient.post(url, studentid);
    return rsp.data;
  },
};

export default subjectApi;
