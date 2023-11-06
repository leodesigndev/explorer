import { put, call, takeLatest, all } from "redux-saga/effects";
import { MapdesignService } from "../services";
import { MapDesignTypes } from "../types"; 

const mapdesignService = new MapdesignService();

export function* getPromptOptions(action){

	try {

		const res = yield call(mapdesignService.getPromptOptions, action.payload);

		if (res.error) {

			yield put({
        type: MapDesignTypes.LOAD_OPTIONS_ERROR,
        error: res.message,
      });

		}else {
    	yield put({ type: MapDesignTypes.LOAD_OPTIONS_SUCCESS, data: res });
    }

	}catch (error) {
		yield put({ type: MapDesignTypes.LOAD_OPTIONS_ERROR, error });
	}

}


export function* loadMap(action){

	try {

		const res = yield call(mapdesignService.loadMap, action.payload);

		if (res.error) {

			yield put({
        type: MapDesignTypes.LOAD_MAP_ERROR,
        error: res.message,
      });

		}else {
    	yield put({ type: MapDesignTypes.LOAD_MAP_SUCCESS, data: res });
    	action.callback(res);
    }

	}catch (error) {
		yield put({ type: MapDesignTypes.LOAD_MAP_ERROR, error });
	}

}

export default function* allSaga() {
  yield all([
  	takeLatest(MapDesignTypes.LOAD_OPTIONS, getPromptOptions),
  	takeLatest(MapDesignTypes.LOAD_MAP, loadMap)
  ]);
}


