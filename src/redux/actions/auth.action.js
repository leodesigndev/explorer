import { AuthTypes } from "../types";

export const login = (data) => ({
  type: AuthTypes.LOGIN_REQUEST,
  payload: data,
});

export const autoLogin = (data) => ({
  type: AuthTypes.AUTO_LOGIN_REQUEST,
  payload: data
});


/* @TODO handle registration at some point
export const signup = (data) => ({
  type: AuthTypes.SIGNUP_REQUEST,
  payload: data,
});
*/

export const load = () => ({
  type: AuthTypes.TOGGLE_LOADING,
});

export const logout = (data) => ({ // @TODO bind saga to clean up session...
  type: AuthTypes.LOGOUT_REQUEST,
  payload: data
});

export const setUser = (data) => ({
  type: AuthTypes.SET_USER,
  payload: data
});
