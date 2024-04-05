import apiClient from "./apiClient";

const recognitionApi = {
  voiceVerify: async () => {
    const url = `/voice/verify`;
    const rsp = await apiClient.get(url);
    return rsp.data
  },
  addFace: async (landmark: number[][]) => {
    const url = `/user-recognition/face/add`;
    const rsp = await apiClient.post<boolean>(url, { landmark });
    return rsp.data
  },
  verifyFace: async (landmark: number[][]) => {
    const url = `/user-recognition/face/verify`;
    const rsp = await apiClient.post<boolean>(url, { landmark });
    return rsp.data
  },
  addSpeech : async (voice : string)=>{
    const url = `/user-recognition/speech/add`;
    const rsp = await apiClient.post<boolean>(url, { path : voice });
    return rsp.data
  },
  verifySpeech: async (voice : string) => {
    const url = `/user-recognition/speech/verify`;
    const rsp = await apiClient.post<boolean>(url, { path : voice });
    return rsp.data
  },
};

export default recognitionApi
