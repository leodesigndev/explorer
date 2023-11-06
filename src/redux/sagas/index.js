import { all, fork } from "redux-saga/effects";

// Sagas
// Import your sagas here!

import authSaga from "./auth.saga";
import dashboardSaga from "./dashboard.saga";
import matricesSaga from "./matrices.saga";
import explorerSaga from "./explorer.saga";
import mapdesignSaga from "./mapdesign.saga";

// Connect types to sagas
const rootSaga = function* root() {
	yield all([
		// Seperate the sagas by comma
		fork(authSaga),
		fork(dashboardSaga),
		fork(matricesSaga),
		fork(explorerSaga),
		fork(mapdesignSaga)
	]);
}

export default rootSaga;
