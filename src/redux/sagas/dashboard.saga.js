import { put, call, takeLatest, all } from "redux-saga/effects";
import { DashboardService } from "../services";
import { DashboardTypes } from "../types";

const dashboardService = new DashboardService();

export function* read(action) {

	console.log("entered");

	try {

		const res = yield call(dashboardService.read, action.payload);

		if (res.error) {
			yield put({
		    	type: DashboardTypes.DASHBOARD_ERROR,
		    	error: res.message,
		    });
		}else{
			yield put({ type: DashboardTypes.DASHBOARD_SUCCESS, data: res });
		}

	}catch(error){
		yield put({ type: DashboardTypes.DASHBOARD_ERROR, error });
	}

}


export function* loadDataMatrices(action){

	try {

		const res = yield call(dashboardService.loadDataMatrices, action.payload);

		if (res.error) {

			yield put({
        type: DashboardTypes.DATAMATRICES_REQUEST_ERROR,
        error: res.message,
      });

		}else {
    	yield put({ type: DashboardTypes.DATAMATRICES_REQUEST_SUCCESS, data: res });
    }

	}catch (error) {
		yield put({ type: DashboardTypes.DATAMATRICES_REQUEST_ERROR, error });
	}

}


export function* loadSavedMaps(action){

	try {

		const res = yield call(dashboardService.loadSavedMaps, action.payload);

		if (res.error) {

			yield put({
        type: DashboardTypes.SAVED_MAPS_REQUEST_ERROR,
        error: res.message,
      });

		}else {
    	yield put({ type: DashboardTypes.SAVED_MAPS_REQUEST_SUCCESS, data: res });
    }

	}catch (error) {
		yield put({ type: DashboardTypes.SAVED_MAPS_REQUEST_ERROR, error });
	}

}

export default function* allSaga() {
  yield all([
  	takeLatest(DashboardTypes.DASHBOARD_REQUEST, read),

  	takeLatest(DashboardTypes.DATAMATRICES_REQUEST, loadDataMatrices) ,
  	takeLatest(DashboardTypes.SAVED_MAPS_REQUEST, loadSavedMaps) ,
  	
  ]);
}


