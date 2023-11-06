import { put, call, takeLatest, all } from "redux-saga/effects";
import { ExplorerService } from "../services";
import { ExplorerTypes } from "../types";

const explorerService = new ExplorerService();

export function* saveFavouriteFields(action) {

	try {

		const res = yield call(explorerService.read, action.payload);

		if (res.error) {
			yield put({
		    	type: ExplorerTypes.DASHBOARD_ERROR,
		    	error: res.message,
		    });
		}else{
			yield put({ type: ExplorerTypes.DASHBOARD_SUCCESS, data: res });
		}

	}catch(error){
		yield put({ type: ExplorerTypes.DASHBOARD_ERROR, error });
	}

}


export function* getFieldAndOptions(action) {

	try {

		const res = yield call(explorerService.getFieldAndOptions, action.payload);

		if (res.error) {
			yield put({
		    	type: ExplorerTypes.GET_FIELD_AND_OPTIONS_ERROR,
		    	error: res.message,
		    });
		}else{
			yield put({ type: ExplorerTypes.GET_FIELD_AND_OPTIONS_SUCCESS, data: res });
		}

	}catch(error){
		yield put({ type: ExplorerTypes.GET_FIELD_AND_OPTIONS_ERROR, error });
	}

}


export function* getPromptOptions(action) {

	try {

		const res = yield call(explorerService.getPromptOptions, action.payload);

		if (res.error) {
			yield put({
		    	type: ExplorerTypes.GET_PROMPT_OPTIONS_ERROR,
		    	error: res.message,
		    });
		}else{
			yield put({ type: ExplorerTypes.GET_PROMPT_OPTIONS_SUCCESS, data: res });
			action.callback(res); 
		}

	}catch(error){
		yield put({ type: ExplorerTypes.GET_PROMPT_OPTIONS_ERROR, error });
	}

}


export function* saveConfig(action) {

	try {

		const res = yield call(explorerService.saveConfig, action.payload);

		if (res.error) {
			yield put({
		    	type: ExplorerTypes.SAVE_CONFIG_ERROR,
		    	error: res.message,
		    });
		}else{
			yield put({ type: ExplorerTypes.SAVE_CONFIG_SUCCESS, data: res });
			if(action.callback) action.callback(res) ;
		}

	}catch(error){
		yield put({ type: ExplorerTypes.SAVE_CONFIG_ERROR, error });
	}

}

export function* loadConfig(action) {

	try {

		const res = yield call(explorerService.loadConfig, action.payload);

		if (res.error) {
			yield put({
		    	type: ExplorerTypes.LOAD_CONFIG_ERROR,
		    	error: res.message,
		    });
		}else{
			yield put({ type: ExplorerTypes.LOAD_CONFIG_SUCCESS, data: res });
		}

	}catch(error){
		yield put({ type: ExplorerTypes.LOAD_CONFIG_ERROR, error });
	}

}

export default function* allSaga() {
  yield all([
  	takeLatest(ExplorerTypes.FAVOURITE_FIELD_SAVE_REQUEST, saveFavouriteFields),
  	takeLatest(ExplorerTypes.GET_FIELD_AND_OPTIONS_REQUEST, getFieldAndOptions),
  	takeLatest(ExplorerTypes.GET_PROMPT_OPTIONS_REQUEST, getPromptOptions),
  	takeLatest(ExplorerTypes.SAVE_CONFIG_REQUEST, saveConfig),
  	takeLatest(ExplorerTypes.LOAD_CONFIG_REQUEST, loadConfig)
  ]);
}


