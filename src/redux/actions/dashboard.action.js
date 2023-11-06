import { DashboardTypes } from "../types";
import {REMOVE_DATAMATRIX_FILTERED, RESET_DATAMATRIX_NAME} from "../types/dashboard.types";

export const read = (data) => ({
  type: DashboardTypes.DASHBOARD_REQUEST,
  payload: data,
});

export const loadDataMatrices = (data) => ({
  type: DashboardTypes.DATAMATRICES_REQUEST ,
  payload: data,
})

export const loadSavedMaps = (data) => ({
  type: DashboardTypes.SAVED_MAPS_REQUEST ,
  payload: data,
})

export const updatePanels = (data) => ({
  type: DashboardTypes.UPDATE_PANELS ,
  payload: data,
})

export const setSelectedPlotingOption = (data) => ({
  type: DashboardTypes.UPDATE_SELECTED_PLOT_OPTION ,
  payload: data,
})

export const setPromptsAndOptionsGrouped = (data) => ({
  type: DashboardTypes.UPDATE_PROMPTS_AND_OPTIONS_GROUPED ,
  payload: data,
})

export const setPromptsAndOptions = (data) => ({
  type: DashboardTypes.UPDATE_PROMPTS_AND_OPTIONS ,
  payload: data,
})


export const setPromptsGrouped = (data) => ({
  type: DashboardTypes.UPDATE_PROMPTS_GROUPED ,
  payload: data,
})


export const setTabKeyWidgetRecentSaved = (data) => ({
  type: DashboardTypes.UPDATE_TABKEY_WIDGET_RECENT_SAVED ,
  payload: data,
})

export const setRecordsResult = (data) => ({
  type: DashboardTypes.UPDATE_RECORDS_RESULT ,
  payload: data,
})


export const addToDataMatrices = (data) => ({
  type: DashboardTypes.UPDATE_DATA_MATRIX_CONTENT,
  payload: data,
})

export const removeDataMatrixFromFilteredDashboard = (data) => ({
  type: DashboardTypes.REMOVE_DATAMATRIX_FILTERED,
  payload: data,
})

export const removeDataMatrixFromDashboard = (data) => ({
  type: DashboardTypes.REMOVE_DATAMATRIX,
  payload: data,
})

export const updateDataMatrixWithCustomLabel = (data) => ({
  type: DashboardTypes.UPDATE_DATAMATRIX_CUSTOM_LABEL,
  payload: data,
})

export const resetDataMatrixCustomLabel = (data) => ({
  type: DashboardTypes.RESET_DATAMATRIX_NAME,
  payload: data,
})









