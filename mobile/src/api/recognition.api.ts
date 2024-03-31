import apiClient from "./apiClient";

const recognitionApi = {
  voiceVerify: async () => {
    const url = `/voice/verify`;
    const rsp = await apiClient.get(url);
    return rsp.data
  },
  addFace: async (landmark: number[][][]) => {
    const url = `/user/face/add`;
    const rsp = await apiClient.post(url, { landmark });
    return rsp.data
  },
  verifyFace: async (landmark: number[][][]) => {
    const url = `/user/face/verify`;
    const rsp = await apiClient.post(url, { landmark });
    return rsp.data
  },
};

export default recognitionApi
