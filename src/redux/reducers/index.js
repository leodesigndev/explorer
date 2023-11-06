import {combineReducers} from 'redux';
import { routerReducer } from "react-router-redux";

import AuthReducer from './auth.reducer';
import DashboardReducer from './dashboard.reducer';
import MapDesignReducer from './mapdesign.reducer';
import ExplorerReducer from './explorer.reducer';
import MatricesReducer from './matrices.reducer';

const allReducers = {
	// Put all of the reducers here!
	auth : AuthReducer,
	dashboard : DashboardReducer,
	mapdesign : MapDesignReducer,
	explorer : ExplorerReducer,
	matrices : MatricesReducer
};

const rootReducer = combineReducers(allReducers);

export default rootReducer