import { AuthTypes } from "../types";
import DelphiEnv from '../../components/DelphiEnv';
import {bypassAuth }  from "../../utilities/Helpers" ;

let initialState = {
  user: {},
  isLoggedIn: false,
  isLoading: false,
  errorMessage: "",
};

if(DelphiEnv.isParentEnv()){ // @TODO ensure we also inforce with environment check ? 

  const result = bypassAuth();

  initialState = {
    ...initialState,
    user: {
      ...result.user,
      accessToken : result.accessToken,
      refreshToken : result.refreshToken,
      token: result.accessToken ? result.accessToken : result.refreshToken
    },
    isLoading: false,
    errorMessage: "",
    isLoggedIn: true,
  };
}

const AuthReducer = (state = initialState, action) => {

	switch (action.type) {
    case AuthTypes.LOGIN_REQUEST:
    case AuthTypes.AUTO_LOGIN_REQUEST:
      return {
        ...state,
        user: {},
        isLoading: true,
        errorMessage: "",
        isLoggedIn: false,
      };

    /* @TOTO handle signup here or let the DDM/Monitor handle it ?
    case AuthTypes.SIGNUP_REQUEST:
      return {
        ...state,
        user: {},
        isLoading: true,
        errorMessage: "",
        isLoggedIn: false,
      };
    */
    case AuthTypes.LOGIN_SUCCESS:
    case AuthTypes.AUTO_LOGIN_SUCCESS:

      return {
        ...state,
        user : {
          ...action.data.result.user ,
          accessToken : action.data.result.accessToken,
          refreshToken : action.data.result.refreshToken,
          token: action.data.result.accessToken ? action.data.result.accessToken : action.data.result.refreshToken // @TODO review ? refreshToken first
        },
        isLoading: false,
        errorMessage: "",
        isLoggedIn: true
      };


      /* OEM
      return {
        ...state,
        // OEM user: action.data,
        user: {
          ...action.data.result,
          token: action.data.result.accessToken ? action.data.result.accessToken : action.data.result.refreshToken // @TODO review ? refreshToken first
        },
        isLoading: false,
        errorMessage: "",
        isLoggedIn: true,
      };
      */
      /* OEM
      case AuthTypes.SIGNUP_SUCCESS:
        return {
          ...state,
          user: action.data,
          isLoading: false,
          errorMessage: "",
          isLoggedIn: true,
        };
      */
    case AuthTypes.LOGIN_ERROR:
    case AuthTypes.AUTO_LOGIN_ERROR:
      return {
        ...state,
        user: action.error,
        isLoading: false,
        errorMessage: action.error.message,
        isLoggedIn: false,
      };
    case AuthTypes.LOGOUT_REQUEST:
      return {
        ...state,
        user: {},
        errorMessage: "",
        isLoggedIn: false,
      };
    case AuthTypes.TOGGLE_LOADING:
      return {
        ...state,
        user: {},
        errorMessage: "",
        isLoggedIn: false,
        loading: true,
      };

    case AuthTypes.SET_USER:
      
      return {
        ...state,
        user: {
          ...state.user,
          id : action.payload.user.id,
          name :  action.payload.user.name ,
          username :  action.payload.user.username ,
          role :  action.payload.user.role,
          accessToken : action.payload.accessToken,
          refreshToken : action.payload.refreshToken,
          token: action.payload.accessToken ? action.payload.accessToken : action.payload.refreshToken 
        }
      };
    
    default:
      return state;
  }

}

export default AuthReducer;