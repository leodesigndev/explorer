import { MapDesignTypes } from "../types";

// @TODO group some actions ? // @TODO make actions of map design
export const setTabKeyFields = (data) => ({
  type: MapDesignTypes.UPDATE_TABKEY_FIELDS ,
  payload: data,
})

export const setSelectedField = (data) => ({
  type: MapDesignTypes.UPDATE_SELECTED_FIELD ,
  payload: data,
})

export const setTabKeyActiveInput = (data) => ({
  type: MapDesignTypes.UPDATE_TABKEY_ACTIVE_INPUT ,
  payload: data,
})

export const setMapZoom = (data) => ({
  type: MapDesignTypes.UPDATE_MAP_ZOOM ,
  payload: data,
})

export const setMapLong = (data) => ({
  type: MapDesignTypes.UPDATE_MAP_LONG ,
  payload: data,
})

export const setMapLat = (data) => ({
  type: MapDesignTypes.UPDATE_MAP_LAT ,
  payload: data,
})

export const setMapXY = (data) => ({
  type: MapDesignTypes.UPDATE_XY ,
  payload: data,
})

export const setShowLegendToolTip = (data) => ({
  type: MapDesignTypes.TOGGLE_LEGEND_TOOLTIP ,
  payload: data,
})

export const setLegendData = (data) => ({
  type: MapDesignTypes.UPDATE_LEGEND ,
  payload: data,
})

export const setValueTooltip = (data) => ({
  type: MapDesignTypes.UPDATE_VALUE_TOOLTIP ,
  payload: data,
})

export const setOffsetTooltip = (data) => ({
  type: MapDesignTypes.UPDATE_OFFSET_TOOLTIP ,
  payload: data,
})


export const setBackgroundTooltip = (data) => ({
  type: MapDesignTypes.UPDATE_BACKGROUND_TOOLTIP ,
  payload: data,
})

export const setScaleType = (data) => ({
  type: MapDesignTypes.UPDATE_SCALE_TYPE ,
  payload: data,
})

export const setMapValue = (data) => ({
  type: MapDesignTypes.UPDATE_MAP_VALUE ,
  payload: data,
})

export const setAggregationValue = (data) => ({
  type: MapDesignTypes.UPDATE_AGGREGATION_VALUE ,
  payload: data,
})

export const setShowDataPoints = (data) => ({
  type: MapDesignTypes.TOGGLE_SHOW_DATA_POINTS ,
  payload: data,
})

export const setShowGrid = (data) => ({
  type: MapDesignTypes.TOGGLE_SHOW_GRID ,
  payload: data,
})

export const setIsDrawingGeoFilter = (data) => ({
  type: MapDesignTypes.TOGGLE_IS_DRAWING_GEO_FILTER ,
  payload: data,
})

export const setGeoFilterBox = (data) => ({
  type: MapDesignTypes.UPDATE_GEO_FILTER_BOX ,
  payload: data,
})

export const setFilters = (data) => ({
  type: MapDesignTypes.SET_FILTER ,
  payload: data,
})


export const setTotalRecord = (data) => ({
  type: MapDesignTypes.SET_TOTAL_RECORD ,
  payload: data,
})


export const setIsMapRefreshDue = (data) => ({
  type: MapDesignTypes.SET_IS_MAP_REFRESH_DUE ,
  payload: data,
})


export const setLastMapResetTime = (data) => ({
  type: MapDesignTypes.SET_LAST_MAP_RESET_TIME ,
  payload: data,
})


export const setMapBoundCoord = (data) => ({
  type: MapDesignTypes.SET_MAP_BOUND_COORD ,
  payload: data,
})











export const setCreateMapStep1PromptOptions = (data) => ({
  type: MapDesignTypes.SET_CREATE_MAP_STEP1_PROMPT_OPTIONS ,
  payload: data,
})

export const setCreateMapStep1SelectedPrompt = (data) => ({
  type: MapDesignTypes.SET_CREATE_MAP_STEP1_SELECTED_PROMPT ,
  payload: data,
})


export const setOptions = (data) => ({
  type: MapDesignTypes.SET_OPTIONS ,
  payload: data,
})


export const loadOptions = (data) => ({
  type: MapDesignTypes.LOAD_OPTIONS ,
  payload: data,
})



export const toggleOffCanvasAnalysisPromptLabels = (data) => ({
  type: MapDesignTypes.TOGGLE_OFF_CANVAS_PROMPTS_LABELS ,
  payload: data,
})


export const toggleOffCanvasAnalysisPromptInputs = (data) => ({
  type: MapDesignTypes.TOGGLE_OFF_CANVAS_PROMPTS_INPUTS ,
  payload: data,
})


export const setStep1Prompts = (data) => ({
  type: MapDesignTypes.SET_STEP1_PROMPTS ,
  payload: data,
})

export const setQualifyFilterStep1Prompts = (data) => ({
  type: MapDesignTypes.SET_QUALIFY_FILTER_STEP1_PROMPTS ,
  payload: data,
})

export const setSelectedSavedMapId = (data) => ({
  type: MapDesignTypes.SET_SELECTED_SAVED_MAP_ID ,
  payload: data,
})


export const loadMap = (data , callback = ()=>{} ) => ({
  type: MapDesignTypes.LOAD_MAP ,
  payload: data,
  callback
})

export const setSavedMap = (data , callback = ()=>{} ) => ({
  type: MapDesignTypes.SET_SAVED_MAP ,
  payload: data,
  callback
})


export const setPlotRecord = (data) => ({
  type: MapDesignTypes.SET_PLOT_RECORDS ,
  payload: data,
})


/*
export const saveHomeViewConfig = (data , callback = ()=>{} ) => ({
  type: MapDesignTypes.SAVE_HOME_VIEW_CONFIG_REQUEST ,
  payload: data,
  callback
})
*/


export const toggleMapView = (data) => ({
  type: MapDesignTypes.TOGGLE_MAP_VIEW ,
  payload: data,
})


export const setIsMapSaved = (data) => ({
  type: MapDesignTypes.SET_IS_MAP_SAVED ,
  payload: data,
})



