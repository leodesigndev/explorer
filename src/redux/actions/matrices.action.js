import { MatricesTypes } from "../types";

export const loadDataMatrices = (data) => ({
  type: MatricesTypes.DATAMATRICES_REQUEST ,
  payload: data,
})

export const saveConfigFavouriteFields = (data) => ({
  type: MatricesTypes.FAVOURITE_FIELD_SAVE_REQUEST ,
  payload: data,
})

export const setSelectedMatrice = (data) => ({
  type: MatricesTypes.CHANGE_SELECTED_MATRICE ,
  payload: data,
})



export const setSelectedField = (data) => ({
  type: MatricesTypes.SET_SELECTED_FIELD ,
  payload: data,
})

export const setGroupedPromptLabels = (data) => ({
  type: MatricesTypes.SET_GROUPED_PROMPT_LABELS ,
  payload: data,
})

export const setPromptOptions = (data) => ({
  type: MatricesTypes.SET_PROMPT_OPTIONS ,
  payload: data,
})


export const loadGroupedPrompts = (data , callback = ()=>{}  ) => ({
  type: MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST ,
  payload: data,
  callback
})


export const setGroupedPrompts = (data) => ({
  type: MatricesTypes.SET_GROUPED_PROMPT_REQUEST ,
  payload: data,
})










