import apiClient from "./apiClient";

const baseUrl = `user`;
const userApi = {
  get: () => {
    return apiClient.get<any>(baseUrl);
  },
};


export default userApi