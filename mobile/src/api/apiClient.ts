// import axios from "axios";
// import { routerStore, useRouter } from "../store/router.store";

// // const baseURL = 'https://attendent-kit-x6bv.onrender.com/';
// // const baseURL = 'http://10.0.2.2:3001/';
// const baseURL = 'http://localhost:3001/';
// const { navigate } : any = useRouter
// const apiClient = axios.create({
//     baseURL,
//     headers: {
//         "Content-Type": "application/json",
//     },
//     timeout: 10000,
//     withCredentials: true,
// });
// apiClient.interceptors.response.use(
//     response => {
//       // If the response is successful, just return the response
//       return response;
//     },
//     error => {
//       // Check if the response status is 401
//       if (error.response && error.response.status === 401) {
//         // Redirect user to login page
//         // Adapt this line to use your front-end router's redirection method if needed
//         routerStore.actions.navigate('/login')
//       }
//       // Return any error messages that are not related to 401 status
//       return Promise.reject(error);
//     }
//   );
// export default apiClient;
import axios from "axios";
import { routerStore, useRouter } from "../store/router.store";

// const baseURL = 'https://attendance-kit.ngrok.app'
const baseURL = 'https://aasiu.ngrok.app';

const { navigate } : any = useRouter
const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: true,
});
apiClient.interceptors.response.use(
    response => {
      // If the response is successful, just return the response
      return response;
    },
    error => {
      // Check if the response status is 401
      if (error.response && error.response.status === 401) {
        // Redirect user to login page
        // Adapt this line to use your front-end router's redirection method if needed
        routerStore.actions.navigate('/login')
      }
      // Return any error messages that are not related to 401 status
      return Promise.reject(error);
    }
  );
export default apiClient;