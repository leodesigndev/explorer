import { put, call, takeLatest, all } from "redux-saga/effects";
import { MatricesService } from "../services";
import { MatricesTypes } from "../types"; 

const matricesService = new MatricesService();

export function* loadDataMatrices(action){

	try {

		const res = yield call(matricesService.loadDataMatrices, action.payload);

		if (res.error) {

			yield put({
        type: MatricesTypes.DATAMATRICES_REQUEST_ERROR,
        error: res.message,
      });

		}else {
    	yield put({ type: MatricesTypes.DATAMATRICES_REQUEST_SUCCESS, data: res });
    }

	}catch (error) {
		yield put({ type: MatricesTypes.DATAMATRICES_REQUEST_ERROR, error });
	}

}

export function* saveConfigFavouriteFields(action){

	try {

		const res = yield call(matricesService.edit, action.payload);

		if (res.error) {

			yield put({
       	type: MatricesTypes.FAVOURITE_FIELD_SAVE_REQUEST_ERROR,
        error: res.message,
      });

		}else {

    	yield put({ type: MatricesTypes.CHANGE_SELECTED_MATRICE, payload: res.matrix });
    }

	}catch (error) {
		yield put({ type: MatricesTypes.FAVOURITE_FIELD_SAVE_REQUEST_ERROR, error });
	}

}

export function* loadGroupedPrompts(action){

	try {

		const res = yield call(matricesService.loadGroupedPrompts, action.payload);

		if (res.error) {

			yield put({
        type: MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST_ERROR,
        error: res.message,
      });

		}else {
    	yield put({ type: MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST_SUCCESS, data: res });
    	action.callback(res);
    }

	}catch (error) {
		yield put({ type: MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST_ERROR, error });
	}

}



export default function* allSaga() {
  yield all([
  	takeLatest(MatricesTypes.DATAMATRICES_REQUEST, loadDataMatrices) ,
  	takeLatest(MatricesTypes.FAVOURITE_FIELD_SAVE_REQUEST, saveConfigFavouriteFields),
  	takeLatest(MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST, loadGroupedPrompts)

  ]);
}


