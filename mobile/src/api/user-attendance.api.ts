import apiClient from "./apiClient";

const userAttendanceApi = {
  create: async (courseId:string, studentId:string) => {
    const url = `/user-attendance`
    const rsp = await apiClient.post(url, {courseId, studentId})
    return rsp.data
  },
  get: async () => {
    const url = `/user-attendance`
    const rsp = await apiClient.get(url)
    return rsp.data
  },
};


export default userAttendanceApi