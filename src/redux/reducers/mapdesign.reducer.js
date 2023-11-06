import { MapDesignTypes } from "../types";
import Inputs from "../../configs/inputs";
import { HOME_VIEW_CONFIG } from "../../utilities/constant";

const initialState = {
	tabKeyActiveInput : '',
	
	tabKeyFields: 'tabs_field_group-setup' ,
	selectedField : [],

	mapZoom: 0 ,
	mapLong: 0,
	mapLat: 0,
	x: 0,
	y: 0,

	showLegendToolTip:false,
	showLegendToolTipTrigger:'legend', // legend | grid
	valueTooltip : 0 ,
	offsetTooltip: 0 ,
	backgroundTooltip : "black" ,
	steps:[] ,
	colorRange:[],
	
	scaleType: 'linear', // linear | logarithm
	mapValue: null,
	aggregationValue: null,
	showDataPoints : false ,
	showGrid : false,

	isDrawingGeoFilter : false,
	geoFilterBox : [] ,


	// OEM capturedFilters : [] ,
	capturedFilters : {} ,
	plotRecords : [] ,
	totalRecords : 0 ,

	isMapRefreshDue : false ,

	lastMapResetTime : 0,

	mapData : {
		mapBoundCoordSW : null ,
		mapBoundCoordNE : null
	},


	showOffCanvasAnalysisPromptLabels : false ,
	showOffCanvasAnalysisPromptInputs : false,

	createMapStep1PromptOptions : [] ,
	createMapStep1SelectedPrompt : {},
	createMapStep1SelectedPromptPathName : [],
	groupedPrompts:[],

	promptOptions : [],
	isPromptOptionsLoading: false,
	isPromptOptionsError: false,



	step1Prompts : [
	    {
	      id: 1,
	      name: "map_creation_method",
	      label: "Map Creation Method",
	      prompt_type: 'select',
	      options: [
	        {
	          id : 1,
	          value : "historical_data",
	          label : "Historical Data"
	        },
	        {
	          id : 2,
	          value : "ai_model",
	          label : "AI Model"
	        }
	      ],
	    },
	    {
	      id: 2,
	      name: "data_set",
	      label: "Choose Dataset",
	      prompt_type: 'select',
	      options: 'compute'
	    },
	    {
	      id: 3,
	      name: "ai_model",
	      label: "Choose AI Model",
	      prompt_type: 'select',
	      options: 'compute',
	    }    
	],


	qualifyFilterStep1Prompts : null,

	selectedSavedMapId : 0,
	
	savedMap : null ,
	isSavedMapLoading : false ,
	isSavedMapError : false ,


	isMapSaved:false ,

	/*
	configs : {
		[HOME_VIEW_CONFIG]: {},
	}
	*/
	tabKeyToggleMapView : 'tabs_toggle_map-designer' , // tabs_toggle_map-datatable | tabs_toggle_map-designer

};

const MapDesignReducer = (state = initialState , action ) => {
	
	switch (action.type) {
		case MapDesignTypes.UPDATE_TABKEY_FIELDS:

			return {
		    	...state,
		      tabKeyFields: action.payload
		    };

		case MapDesignTypes.UPDATE_SELECTED_FIELD:

			return {
		    	...state,
		      selectedField: action.payload
		    };

		case MapDesignTypes.UPDATE_TABKEY_ACTIVE_INPUT:

			return {
		    	...state,
		      tabKeyActiveInput: action.payload
		    };

		case MapDesignTypes.UPDATE_MAP_ZOOM:
			return {
		    	...state,
		      mapZoom: action.payload
		    };

		case MapDesignTypes.UPDATE_MAP_LONG:

			return {
		    	...state,
		      mapLong: action.payload
		    };

		case MapDesignTypes.UPDATE_MAP_LAT:

			return {
		    	...state,
		      mapLat: action.payload
		    };

		case MapDesignTypes.UPDATE_XY:
			return {
		    	...state,
		      x: action.payload.x,
		      y: action.payload.y
		    };

		case MapDesignTypes.TOGGLE_LEGEND_TOOLTIP:
			return {
		    	...state,
		      showLegendToolTip: action.payload.show,
		      showLegendToolTipTrigger: action.payload.trigger
		    };

		case MapDesignTypes.UPDATE_LEGEND:
			return {
		    	...state,
		      steps: action.payload.steps,
		      colorRange: action.payload.colorRange
		    };

		case MapDesignTypes.UPDATE_VALUE_TOOLTIP:
			return {
		    	...state,
		      valueTooltip: action.payload
		    };

		case MapDesignTypes.UPDATE_OFFSET_TOOLTIP:
			return {
		    	...state,
		      offsetTooltip: action.payload
		    };

		case MapDesignTypes.UPDATE_BACKGROUND_TOOLTIP:
			return {
		    	...state,
		      backgroundTooltip: action.payload
		    };

		case MapDesignTypes.UPDATE_SCALE_TYPE:
			return {
		    	...state,
		      scaleType: action.payload
		    };

		case MapDesignTypes.UPDATE_MAP_VALUE:
			return {
		    	...state,
		      mapValue: action.payload
		    };

		case MapDesignTypes.UPDATE_AGGREGATION_VALUE:
			return {
		    	...state,
		      aggregationValue: action.payload
		    };

		case MapDesignTypes.TOGGLE_SHOW_DATA_POINTS:
			return {
		    	...state,
		      showDataPoints: action.payload
		    };

		case MapDesignTypes.TOGGLE_SHOW_GRID:
			return {
		    	...state,
		      showGrid: action.payload
		    };

		case MapDesignTypes.TOGGLE_IS_DRAWING_GEO_FILTER:
			return {
		    	...state,
		      isDrawingGeoFilter: action.payload
		    };

		case MapDesignTypes.UPDATE_GEO_FILTER_BOX:
			return {
		    	...state,
		      geoFilterBox: action.payload
		    };


		case MapDesignTypes.SET_FILTER:
			return {
		    	...state,
		      capturedFilters: {...action.payload}
		    };

		case MapDesignTypes.SET_TOTAL_RECORD:
			return {
		    	...state,
		      totalRecords: action.payload
		    };

		case MapDesignTypes.SET_IS_MAP_REFRESH_DUE:
			return {
		    	...state,
		      isMapRefreshDue: action.payload
		    };

		
		case MapDesignTypes.SET_LAST_MAP_RESET_TIME:
			return {
		    	...state,
		      lastMapResetTime: action.payload
		    };


		case MapDesignTypes.SET_MAP_BOUND_COORD:
			return {
		    	...state,
		      mapData: {
		      	...state.mapData ,
		      	mapBoundCoordSW : action.payload.boundCoordSW , 
		      	mapBoundCoordNE : action.payload.boundCoordNE , 
		      }
		    };


		case MapDesignTypes.SET_CREATE_MAP_STEP1_PROMPT_OPTIONS:
			return {
		    	...state,
		     	createMapStep1PromptOptions: action.payload
		    };

		case MapDesignTypes.SET_CREATE_MAP_STEP1_SELECTED_PROMPT:
			return {
		    	...state,
		     	createMapStep1SelectedPrompt: action.payload,
		     	createMapStep1SelectedPromptPathName:  [action.payload.name]
		    };


		case MapDesignTypes.SET_OPTIONS:

			Inputs.options[action.payload.pathName] = action.payload.options ;

			return {
		    	...state,
		     	promptOptions: action.payload.options
		    };





		case MapDesignTypes.LOAD_OPTIONS:

			return {
		    	...state,
		    	isPromptOptionsLoading: true,
	  			isPromptOptionsError: false
		    };

		case MapDesignTypes.LOAD_OPTIONS_SUCCESS:
			
			Inputs.options[action.data.pathName] = action.data.options ;

			return {
		    	...state,
		     	promptOptions: action.data.options,
		     	isPromptOptionsLoading: false,
	  			isPromptOptionsError: false
		    };

		case MapDesignTypes.LOAD_OPTIONS_ERROR:

			return {
		    	...state,
		     	isPromptOptionsLoading: false,
	  			isPromptOptionsError: true
		    };








		case MapDesignTypes.TOGGLE_OFF_CANVAS_PROMPTS_LABELS:
		
			return {
	    	...state,
	      showOffCanvasAnalysisPromptLabels: action.payload
	    };



	    case MapDesignTypes.TOGGLE_OFF_CANVAS_PROMPTS_INPUTS:
		
			return {
	    	...state,
	      showOffCanvasAnalysisPromptInputs: action.payload
	    };


	    case MapDesignTypes.SET_STEP1_PROMPTS:
		
			return {
	    	...state,
	      step1Prompts: action.payload
	    };


	    case MapDesignTypes.SET_QUALIFY_FILTER_STEP1_PROMPTS:
		
			return {
	    	...state,
	      qualifyFilterStep1Prompts: action.payload
	    };


	    case MapDesignTypes.SET_SELECTED_SAVED_MAP_ID:
		
			return {
	    	...state,
	      selectedSavedMapId: action.payload
	    };
	
	
		case MapDesignTypes.LOAD_MAP:

			return {
		    	...state,
		    	isSavedMapLoading: true,
	  			isSavedMapError: false
		    };

		case MapDesignTypes.LOAD_MAP_SUCCESS:
			
			return {
		    	...state,
		     	savedMap: action.data.map,
		     	isSavedMapLoading: false,
	  			isSavedMapError: false
		    };

		case MapDesignTypes.SET_SAVED_MAP:
			
			return {
		    	...state,
		     	savedMap: action.payload
		    };

		case MapDesignTypes.LOAD_MAP_ERROR:

			return {
		    	...state,
		     	isSavedMapLoading: false,
	  			isSavedMapError: true
		    };


		case MapDesignTypes.SET_PLOT_RECORDS:

			return {
		    	...state,
		     	plotRecords: [...action.payload]
		    };


		case MapDesignTypes.TOGGLE_MAP_VIEW:

			return {
		    	...state,
		     	tabKeyToggleMapView: action.payload
		    };


		case MapDesignTypes.SET_IS_MAP_SAVED:

			return {
		    	...state,
		     	isMapSaved: action.payload
		    };



		default:
    	return state;
	}
};

export default MapDesignReducer ;