import Axios from "axios";
import { AUTH_API_BASE_URL , DDL_BASE_API_URL } from "./constant";
// const header = {
//   "Content-Type":
//     "application/x-www-form-urlencoded; charset=UTF-8;application/json",
// };

class AuthService {
  async login(data) {
    try {
      const response = await Axios.post(`${AUTH_API_BASE_URL}/api/explorer/users/login`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async autoLogin(data = {}) {
    try {
      const response = await Axios.post(`${DDL_BASE_API_URL}/api/explorer/users/auto_login`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signup(data) {
    try {
      const response = await Axios.post(`${AUTH_API_BASE_URL}auth/signup`, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export default AuthService;
