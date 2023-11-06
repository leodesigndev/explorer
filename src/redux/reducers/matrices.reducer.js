import { MatricesTypes } from "../types";

const initialState = {
 
  dataMatrices: [],
  isDataMatricesLoading: false,
  isDataMatricesError: false,

  selectedDataMatrix: null ,




  selectedField : {} ,
  selectedFieldPathName : [] , // data table constrian require an array since in multi select mode it will hold a colleciton rather

  groupedPrompts : [] ,
  matrixSchema : [] ,
  dataTableColumns : [] ,
  // promptsFlattened : [] ,
  isGroupedPromptLoading: false,
  isGroupedPromptError: false,

  createMapStep2PromptOptions : []


};

const MatricesReducer = (state = initialState , action ) => {
	

	switch (action.type) {
	
	  case MatricesTypes.DATAMATRICES_REQUEST:
			return {
        ...state,
        isDataMatricesLoading: true,
  			isDataMatricesError: false
	    };

	  case MatricesTypes.DATAMATRICES_REQUEST_SUCCESS:

			return {
        ...state,
        dataMatrices: action.data.matrices,
        isDataMatricesLoading: false,
  			isDataMatricesError: false
	    };

	  case MatricesTypes.DATAMATRICES_REQUEST_ERROR:

			return {
        ...state,
        isDataMatricesLoading: false,
  			isDataMatricesError: true
	    };

	  case MatricesTypes.CHANGE_SELECTED_MATRICE:

			return {
        ...state,
        selectedDataMatrix: action.payload
	    };







	  case MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST:
			return {
        ...state,
        isGroupedPromptLoading: true,
  			isGroupedPromptError: false
	    };


	  case MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST_SUCCESS:
			return {
	    	...state,
	    	groupedPrompts: action.data.groupedPrompts,
	    	matrixSchema : action.data.matrixSchema ,
	    	dataTableColumns : action.data.matrixSchema ,
	    	isGroupedPromptLoading: false,
	      isGroupedPromptError: false
	    };


	  case MatricesTypes.LOAD_GROUPED_PROMPT_REQUEST_ERROR:
			return {
	    	...state,
	    	isGroupedPromptLoading: false,
	      isGroupedPromptError: true
	    };


	  case MatricesTypes.SET_GROUPED_PROMPT_REQUEST:
			return {
	    	...state,
	    	groupedPrompts: action.payload
	    };
























	  case MatricesTypes.SET_PROMPT_OPTIONS:
			return {
	    	...state,
	      	createMapStep2PromptOptions: action.payload
	    };


	  case MatricesTypes.SET_SELECTED_FIELD:
			return {
	    	...state,
	      	selectedField: action.payload,
	      	selectedFieldPathName : [action.payload.path_name]
	    };


		default:
    	return state;
	}
};

export default MatricesReducer ;