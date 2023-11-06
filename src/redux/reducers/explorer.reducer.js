import { ExplorerTypes } from "../types";
import Inputs from "../../configs/inputs";
import { LANGUAGE_CONFIG , THEME_CONFIG , FILTERING_CONFIG , MAPPER_CONFIG , COLUMNS_CONFIG , MAP_LAYERS_CONFIG , FAVOURITE_FIELDS_CONFIG , HOME_VIEW_CONFIG } from "../../utilities/constant";

const initialState = {
	theme: 'light' , // light | dark
	isMapDesigner: false ,
	isAnalysisInProgress: false ,
	isMapDesignerDatatable: false , // @TODO deprecate this ?
	tabKeyLandingPage : 'tabs_main-open' , // tabs_main-landing-welcome | tabs_main-upload-file | tabs_main-open
	tabKeyImportType: 'tabs_import-type-browse' , // tabs_import-type-browse |tabs_import-type-ddldatabase
	//tabKeyLeftSideBar: 'tabs_left_sidebar-home' , // tabs_left_sidebar-home | tabs_left_sidebar-map-display
	showOffCanvasAnalysisPromptLabels : false ,
	showOffCanvasAnalysisPromptInputs : false,

	dataTableColumns : [] ,

	favouriteFieldsGroupedGeneralFiltering : [] ,
	favouriteFieldsGroupedLatitudeFiltering : [] ,
	favouriteFieldsGroupedLongitudeFiltering : [] ,

	promptInputWithOptions : {},
	isPromptAndOptionsLoading : false,
	isPromptAndOptionsError : false,

	groupedPrompts : [] ,
	prompts : [],
	promptSelectionBadges : {}, // selectionTags
	isPromptLoading : false,
	isPromptError : false,

	pleaseWait: false,

	configs : {
		[LANGUAGE_CONFIG]: {}, 
		[THEME_CONFIG]: {},
		[FILTERING_CONFIG] : {} ,
		[MAPPER_CONFIG] : {} ,

		[COLUMNS_CONFIG] : {},
		[MAP_LAYERS_CONFIG] : {} ,
		[FAVOURITE_FIELDS_CONFIG] : {},

		[HOME_VIEW_CONFIG] : {}

	},

	generalConfigs : {
		[LANGUAGE_CONFIG]: {
			selectedLanguage : 'en' // default
		}, 
		[THEME_CONFIG]: {
			isDarkTheme : false , // false | ''
			theme : 'light'
		}
	},


	mmmOptions : [], // list of option that are show as row on the table

	flashToast : {
		show : false ,
		type: "success" , // success | error | warning , info 
		msg: "" ,
		position: "middle-center" // top-start ,  top-center , top-end , middle-start , middle-center , middle-end ,  bottom-start , bottom-center , bottom-end
	}


};

const ExplorerReducer = (state = initialState , action ) => {
	

	switch (action.type) {
		case ExplorerTypes.UPDATE_TABKEY_LANDING:

			return {
	    	...state,
	      tabKeyLandingPage: action.payload ,
	      isMapDesigner : ( action.payload === `tabs_main-map_designer`) || ( action.payload === `tabs_main-map_designer_datatable`) ,
	      isMapDesignerDatatable : ( action.payload === `tabs_main-map_designer_datatable`) 
	    };


	    case ExplorerTypes.UPDATE_TABKEY_IMPORT_TYPE:

			return {
	    	...state,
	      tabKeyImportType: action.payload ,
	      //isMapDesigner : ( action.payload === `tabs_main-map_designer`)
	    };
	    
	    case ExplorerTypes.TOGGLE_OFF_CANVAS_PROMPTS_LABELS:
		
			return {
	    	...state,
	      showOffCanvasAnalysisPromptLabels: action.payload
	    };


	    case ExplorerTypes.TOGGLE_OFF_CANVAS_PROMPTS_INPUTS:
		
			return {
	    	...state,
	      showOffCanvasAnalysisPromptInputs: action.payload
	    };

	    /* @TODO fully deprecate this
	    case ExplorerTypes.UPDATE_TABKEY_LEFT_SIDEBAR:
		
			return {
	    	...state,
	      tabKeyLeftSideBar:  action.payload
	    };
	    */

	    case ExplorerTypes.CHANGE_THEME:
	    
			return {
	    	...state,
	      theme: action.payload
	    };

	    case ExplorerTypes.SET_FAVOURITE_FIELD_GROUPED:
			return {
	    	...state,
	      // OEM favouriteFieldsGrouped: action.payload
	      favouriteFieldsGroupedGeneralFiltering: action.payload.grouped,
	      favouriteFieldsGroupedLatitudeFiltering: action.payload.groupedLatitude,
	      favouriteFieldsGroupedLongitudeFiltering: action.payload.groupedLongitude
	    };

	    case ExplorerTypes.SET_DATA_TABLE_COLUMNS:
			return {
	    	...state,
	    	dataTableColumns: action.payload
	    };


	    case ExplorerTypes.SET_ANALYSIS_IN_PROGRESS:
			return {
	    	...state,
	      isAnalysisInProgress: action.payload
	    };




	    case ExplorerTypes.GET_FIELD_AND_OPTIONS_REQUEST:
			return {
	    	...state,
	    	isPromptAndOptionsLoading: true,
  			isPromptAndOptionsError: false
	    };

	    case ExplorerTypes.GET_FIELD_AND_OPTIONS_ERROR:
			return {
	    	...state,
	    	isPromptAndOptionsLoading: false,
  			isPromptAndOptionsError: true
	    };


	    case ExplorerTypes.GET_FIELD_AND_OPTIONS_SUCCESS:
			return {
	    	...state,
	      	promptInputWithOptions: action.data.prompt,
	      	isPromptAndOptionsLoading: false,
  			isPromptAndOptionsError: false
	    };


	    case ExplorerTypes.GET_FIELD_AND_OPTIONS_REQUEST_WITHOUT_SERVICE:
			return {
	    	...state,
	      	promptInputWithOptions: action.payload,
	      	isPromptAndOptionsLoading: false,
  			isPromptAndOptionsError: false
	    };


	    case ExplorerTypes.SET_GROUPED_PROMPTS_AND_PROMPTS:
			return {
	    	...state,
	      	groupedPrompts: action.payload.groupedPrompts,
	      	prompts: action.payload.prompts
	    };


	    case ExplorerTypes.SET_GROUPED_PROMPTS:
			return {
	    	...state,
	      	groupedPrompts: action.payload
	    };


	    case ExplorerTypes.SET_PROMPTS:
			return {
	    	...state,
	      	prompts: action.payload
	    };



	    case ExplorerTypes.GET_PROMPT_OPTIONS_REQUEST:
			return {
	    	...state,
	    	isPromptLoading: true,
  			isPromptError: false
	    };

	    case ExplorerTypes.GET_PROMPT_OPTIONS_ERROR:
			return {
	    	...state,
	    	isPromptLoading: false,
  			isPromptError: true
	    };

	    case ExplorerTypes.GET_PROMPT_OPTIONS_SUCCESS:

	    	// memorize it (all options)
	    	Inputs.promptsMemo = Inputs.promptsMemo.map(field => { // @TODO depreate memo ?
	    		if(field.realName == action.data.prompt.detail.row.realName ){ // @TODO use path_name instead
	    			return {
	    				...field,
	    				options : action.data.prompt.options
	    			};
	    		}
	    		return field ;
	    	});

	    	return {
	    	...state,
	    	prompts: state.prompts.map(field => {
	    		if(field.realName == action.data.prompt.detail.row.realName ){ // @TODO use path_name instead
	    			
	    			return {
	    				...field,
	    				options : action.data.prompt.options
	    			};
	    		}
	    		return field ;
	    	})
	    };


	    case ExplorerTypes.SET_PROMPT_SELECTION_BADGES:

	    	// state.promptSelectionBadges[action.payload.fieldPathName]

			return {
	    	...state,
	      	promptSelectionBadges: action.payload
	    };


	    case ExplorerTypes.SET_PLEASE_WAIT:

			return {
	    	...state,
	      	pleaseWait: action.payload
	    };


	    case ExplorerTypes.LOAD_CONFIG_SUCCESS:

			return {
	    	...state,
	      	configs: {
	      		...state.configs ,
	      		[action.data.configKey] : action.data.config
	      	}
	    };

	    case ExplorerTypes.SET_CONFIG:

			return {
	    	...state,
	      	configs: {
	      		...state.configs ,
	      		[action.payload.key] : {
	      			...state.configs[action.payload.key],
	      			[action.payload.name] : action.payload.value
	      		}
	      	}
	    };



	    case ExplorerTypes.SET_GENERAL_CONFIG:

			return {
	    	...state,
	      	generalConfigs: {
	      		...state.generalConfigs ,
	      		[action.payload.key] : {
	      			...state.configs[action.payload.key],
	      			[action.payload.name] : action.payload.value
	      		}
	      	}
	    };


	    case ExplorerTypes.SET_GENERAL_CONFIGS:

			return {
	    	...state,
	      	generalConfigs: {
	      		...state.generalConfigs ,
	      		[action.payload.key] : {
	      			...state.configs[action.payload.key] ,
	      			...action.payload.value
	      		}
	      	}
	    };

	    case ExplorerTypes.SET_MMM_OPTIONS:

			return {
	    	...state,
	      	mmmOptions: action.payload
	    };



	    case ExplorerTypes.SET_FLASH_TOAST:

			return {
    		...state,
      	
	    	/* OEM
	      	flashToast: {
	      		...state.flashToast,
	      		show: action.payload.show
	      	}
	      	*/
	      	flashToast : {...state.flashToast , ...action.payload } 

	    };


	    
	   

		default:
    		return state;
	}
};

export default ExplorerReducer ;