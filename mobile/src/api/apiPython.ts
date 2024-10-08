
import axios from "axios";
import { routerStore, useRouter } from "../store/router.store";


const pythonUrl = 'http://10.0.2.2:5000/'  
const apiPython = axios.create({
    baseURL: pythonUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: true,
});
const { navigate } : any = useRouter

apiPython.interceptors.response.use(
    response => {
      // If the response is successful, just return the response
      return response;
    },
    error => {
      // Check if the response status is 401
      if (error.response && error.response.status === 401) {
        routerStore.actions.navigate('/login')
      }
      return Promise.reject(error);
    }
  );
export default apiPython;