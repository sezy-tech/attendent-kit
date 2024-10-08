import axios from 'axios';
import apiClient from './apiClient';
import apiPython from './apiPython';
const recognitionApi = {
  voiceVerify: async () => {
    const url = `/voice/verify`;
    const rsp = await apiClient.get(url);
    return rsp.data;
  },
  addFace: async (landmark: number[][]) => {
    const url = `/user-recognition/face/add`;
    const rsp = await apiClient.post<boolean>(url, {landmark});
    return rsp.data;
  },

  // addFaces: async (formData: FormData) => {
  //   const url = `/user-recognition/face/addfaces`;
  //   try {
  //     const response = await apiClient.post(url, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     console.log('Response data:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error adding face:', error);
  //     throw error;
  //   }
  // },

  addFaces: async (formData: FormData) => {
    const url = '/ai/face/addfaces';
    try {
      const response = await apiClient.post(url, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      // console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding face:', error);
      throw error;
    }
  },

  verifyFace: async (landmark: number[][]) => {
    const url = `/user-recognition/face/verify`;
    const rsp = await apiClient.post<boolean>(url, {landmark});
    return rsp.data;
  },
  verifyFace2: async (formData: FormData) => {
    const url = `/ai/face/verify`;
    try {
      const response = await apiClient.post(url, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error verify face:', error);
      throw error;
    }
  },
  addSpeech: async (voice: string) => {
    const url = `/user-recognition/speech/add`;
    const rsp = await apiClient.post<boolean>(url, {path: voice});
    return rsp.data;
  },
  verifySpeech: async (voice: string) => {
    const url = `/user-recognition/speech/verify`;
    const rsp = await apiClient.post<boolean>(url, {path: voice});
    return rsp.data;
  },
};

export default recognitionApi;
