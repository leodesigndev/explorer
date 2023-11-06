import { apiBaseUrl , authBaseUrl }  from "../../utilities/Helpers" ;
export const AUTH_API_BASE_URL = authBaseUrl() ; // auth service  DDM / Monitor
export const DDL_BASE_API_URL = AUTH_API_BASE_URL ;
export const BASE_API_URL = apiBaseUrl();
export const TEST_API_URL = `http://localhost.test:4205`;
