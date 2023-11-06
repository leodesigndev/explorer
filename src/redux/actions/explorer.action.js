import { ExplorerTypes } from "../types";


export const setTabKeyLandingPage = (data) => ({
  type: ExplorerTypes.UPDATE_TABKEY_LANDING ,
  payload: data,
})

export const toggleOffCanvasAnalysisPromptLabels = (data) => ({
  type: ExplorerTypes.TOGGLE_OFF_CANVAS_PROMPTS_LABELS ,
  payload: data,
})


export const toggleOffCanvasAnalysisPromptInputs = (data) => ({
  type: ExplorerTypes.TOGGLE_OFF_CANVAS_PROMPTS_INPUTS ,
  payload: data,
})


export const setTabKeyLeftSideBar = (data) => ({
  type: ExplorerTypes.UPDATE_TABKEY_LEFT_SIDEBAR ,
  payload: data,
})

export const setTabKeyImportType = (data) => ({
  type: ExplorerTypes.UPDATE_TABKEY_IMPORT_TYPE ,
  payload: data,
})

export const setFavouriteFieldsGrouped = (data) => ({
  type: ExplorerTypes.SET_FAVOURITE_FIELD_GROUPED ,
  payload: data,
})

export const saveConfigFavouriteFields = (data) => ({
  type: ExplorerTypes.FAVOURITE_FIELD_SAVE_REQUEST ,
  payload: data,
})

export const setIsAnalysisInProgress = (data) => ({
  type: ExplorerTypes.SET_ANALYSIS_IN_PROGRESS ,
  payload: data,
})

export const setDataTableColumns = (data) => ({
  type: ExplorerTypes.SET_DATA_TABLE_COLUMNS ,
  payload: data,
})

export const setFieldAndOptions = (data) => ({
  type: ExplorerTypes.GET_FIELD_AND_OPTIONS_REQUEST ,
  payload: data,
})


export const setFieldAndOptionsWithoutService = (data) => ({
  type: ExplorerTypes.GET_FIELD_AND_OPTIONS_REQUEST_WITHOUT_SERVICE ,
  payload: data,
})

export const setGroupedPromptsAndPrompts = (data) => ({
  type: ExplorerTypes.SET_GROUPED_PROMPTS_AND_PROMPTS ,
  payload: data,
})


export const getPromptOptions = (data , callback) => ({
  type: ExplorerTypes.GET_PROMPT_OPTIONS_REQUEST ,
  payload: data,
  callback
})


export const setGroupedPrompts = (data) => ({
  type: ExplorerTypes.SET_GROUPED_PROMPTS ,
  payload: data,
})

export const setPrompts = (data) => ({
  type: ExplorerTypes.SET_PROMPTS ,
  payload: data,
})

export const setPromptSelectionBadges = (data) => ({
  type: ExplorerTypes.SET_PROMPT_SELECTION_BADGES ,
  payload: data,
})

export const saveConfig= (data , callback = null) => ({
  type: ExplorerTypes.SAVE_CONFIG_REQUEST ,
  payload: data,
  callback
})


export const loadConfig = (data) => ({ // @TODO deprecate this ?
  type: ExplorerTypes.LOAD_CONFIG_REQUEST,
  payload: data,
})

export const setConfig = (data) => ({
  type: ExplorerTypes.SET_CONFIG,
  payload: data,
})

export const setPleaseWait = (data) => ({
  type: ExplorerTypes.SET_PLEASE_WAIT,
  payload: data,
})

export const setGeneralConfig = (data) => ({ // @TODO deprecate this ?
  type: ExplorerTypes.SET_GENERAL_CONFIG,
  payload: data,
})

export const setGeneralConfigs = (data) => ({ // @TODO deprecate this ?
  type: ExplorerTypes.SET_GENERAL_CONFIGS,
  payload: data,
})


export const setMmmOptions = (data) => ({
  type: ExplorerTypes.SET_MMM_OPTIONS,
  payload: data,
})


export const setFlashToast = (data) => ({
  type: ExplorerTypes.SET_FLASH_TOAST,
  payload: data,
})








