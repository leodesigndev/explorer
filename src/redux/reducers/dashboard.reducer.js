import { DashboardTypes } from "../types";
import {REMOVE_DATAMATRIX_FILTERED, RESET_DATAMATRIX_NAME} from "../types/dashboard.types";

const initialState = {
  dashboard: {},
  isLoading: false,
  isError: false,

  // @TODO unify with `matrices` reducers
  dataMatrices: [],
  isDataMatricesLoading: false,
  isDataMatricesError: false ,
  // END @TODO unify with `matrices` reducers

  savedMaps: [],
  isSavedMapsLoading: false,
  isSavedMapsError: false ,


  panels:{}, //jspannels

  selectedPlotingOption: '',
  promptsGrouped:[], // prompts grouped with no options
  promptsAndOptionsGrouped:[], // prompt and fully computed options
  promptsAndOptions:[] , // flattened list for prompt and option before compute options // @TODO make config so we can toggle to async options compute

  tabKeyWidgetRecentSaved : 'tabs_datatable-recent' , // defaulted

  recordsResult : null
};

const DashboardReducer = (state = initialState , action ) => {


	switch (action.type) {
		case DashboardTypes.DASHBOARD_REQUEST:

			return {
	    	...state,
	      isLoading: true,
	      isError: false,
	    };

		case DashboardTypes.DASHBOARD_SUCCESS:

			return {
        ...state,
        dashboard: action.data,
        isLoading: false,
        isError: false,
	    };

		case DashboardTypes.DASHBOARD_ERROR:

			return {
        ...state,
        isLoading: false,
        isError: true,
	    };

	  case DashboardTypes.DATAMATRICES_REQUEST:
			return {
        ...state,
        isDataMatricesLoading: true,
  			isDataMatricesError: false
	    };

	  case DashboardTypes.DATAMATRICES_REQUEST_SUCCESS:

			return {
        ...state,
        dataMatrices: action.data.matrices,
        isDataMatricesLoading: false,
  			isDataMatricesError: false
	    };

    case DashboardTypes.REMOVE_DATAMATRIX:
      const dataMatricesCopy = state.dataMatrices.filter(matrix => matrix.id !== action.payload.id)
      return {
        ...state,
        dataMatrices: dataMatricesCopy
      };

    case DashboardTypes.REMOVE_DATAMATRIX_FILTERED:
      return {
        ...state,
        dataMatrices: action.data.matrices,
      };

    case DashboardTypes.UPDATE_DATAMATRIX_CUSTOM_LABEL:
      const index = state.dataMatrices.findIndex(matrix => matrix.id === action.payload.matrixID)
      let tempList = [...state.dataMatrices]
      tempList[index] = {...tempList[index], custom_label: action.payload.customLabel}

      return {
        ...state,
        dataMatrices: [...tempList]
      }

    case DashboardTypes.RESET_DATAMATRIX_NAME:
      const matrixIndex = state.dataMatrices.findIndex(matrix => matrix.id === action.payload.matrixID)
      let temp_array = [...state.dataMatrices]
      temp_array[matrixIndex] = {...temp_array[matrixIndex], custom_label: null}

      return {
        ...state,
        dataMatrices: [...temp_array]
      }

	  case DashboardTypes.DATAMATRICES_REQUEST_ERROR:

			return {
        ...state,
        isDataMatricesLoading: false,
  			isDataMatricesError: true
	    };


	  case DashboardTypes.UPDATE_PANELS:

			return {
        ...state,
        panels: action.payload
	    };


	  case DashboardTypes.UPDATE_SELECTED_PLOT_OPTION:

			return {
        ...state,
        selectedPlotingOption: action.payload
	    };

	  case DashboardTypes.UPDATE_PROMPTS_AND_OPTIONS_GROUPED:

			return {
        ...state,
        promptsAndOptionsGrouped: action.payload
	    };


	  case DashboardTypes.UPDATE_PROMPTS_AND_OPTIONS:

			return {
        ...state,
        promptsAndOptions: action.payload
	    };

	  case DashboardTypes.UPDATE_PROMPTS_GROUPED:

			return {
        ...state,
        promptsGrouped: action.payload
	    };


	  case DashboardTypes.SAVED_MAPS_REQUEST:
			return {
        ...state,
        isSavedMapsLoading: true,
  			isSavedMapsError: false
	    };

	  case DashboardTypes.SAVED_MAPS_REQUEST_SUCCESS:

			return {
        ...state,
        savedMaps: action.data.maps,
        isSavedMapsLoading: false,
  			isSavedMapsError: false
	    };

	  case DashboardTypes.SAVED_MAPS_REQUEST_ERROR:

			return {
        ...state,
        isSavedMapsLoading: false,
  			isSavedMapsError: true
	    };


	  case DashboardTypes.UPDATE_TABKEY_WIDGET_RECENT_SAVED:

			return {
        ...state,
        tabKeyWidgetRecentSaved: action.payload
	    };

	  // @TODO deprecate
	  case DashboardTypes.UPDATE_RECORDS_RESULT:

			return {
        ...state,
        recordsResult: action.payload
	    };


	    case DashboardTypes.UPDATE_DATA_MATRIX_CONTENT:
	    console.log('action >>>' , action)
			return {
        ...state,
        dataMatrices: action.payload
	    };


		default:
    	return state;
	}
};

export default DashboardReducer ;
