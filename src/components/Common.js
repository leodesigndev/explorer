import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as d3 from "d3";
import axios from 'axios';
import { store } from "../redux";
import { MapDesignActions , MatricesActions , ExplorerActions } from "../redux/actions";
import Inputs from "../configs/inputs";
import mapboxMap from "../configs/mapBox";
import {arrayUnique , getRange , between , toFixed2 , apiBaseUrl }  from "../utilities/Helpers" ;
import {LEGEND_WIDTH } from "../utilities/constant";
import NotificationDialog from './NotificationDialog';


const getFilterOperator = (fieldDetail) => {

  let op = "EQUAL" ;
  if(["select" , "multiselect"].includes(fieldDetail.prompt_type)){
    if(fieldDetail.isRangeFilter){
      op = "IN_RANGE" ;
    }else{
      op = "IN" ;
    }
  }

  return op ;
}

export const labelsUpdate = (pathName , values) => {

	const {getState , dispatch} = store ;
 	let state = getState() ;

 	let groupedFields = [...state.matrices.groupedPrompts] ;

	groupedFields = groupedFields.map((group , groupIndex) => {
		return {
			...group,
			fields: group.fields.map((field , fieldIndex) => {
				if(field.path_name == pathName ){ 
					if(values.constructor === Array){
						
						let currentOptions = state.mapdesign.promptOptions;

						values = values.map(val => {
		            	return currentOptions.find(option => option.id == val );
		            });

		            return {
		            	...field,
		            	capturedValue: values // @TODO preformat this into a string that can be displaye onto datatable
		            };

					}else{ // text field input
						
						return {
		              ...field,
		              value: values // @TODO we could use the same container `capturedValue` and let the datatable handle the parsing ? 
		            };
					}
				}
				return field ;
			})
		};
	});

	dispatch(MatricesActions.setGroupedPrompts(groupedFields));

}

export const labelsUpdate2 = (pathName , values , options = null ) => {

	const {getState , dispatch} = store ;
 	let state = getState() ;

 	let groupedFields = [...state.matrices.groupedPrompts] ;

 	groupedFields = groupedFields.map((group , groupIndex) => {
 		return {
 			...group,
 			fields: group.fields.map((field , fieldIndex) => {
 				if(field.path_name == pathName ){
 					if(values.constructor === Array){
 						
 						// OEM let currentOptions = state.mapdesign.promptOptions;
 						let currentOptions = options ? options[pathName] : state.mapdesign.promptOptions;

 						values = values.map(val => {
            	return currentOptions.find(option => option.id == val );
            });

            return {
            	...field,
            	capturedValue: values // @TODO preformat this into a string that can be displaye onto datatable
            };
 						

 					}else{ // text field input

 						return {
              ...field,
              value: values // @TODO we could use the same container `capturedValue` and let the datatable handle the parsing ? 
            };
 					}	
 				}

 				return field ;
 			})
 		};

 	});

 	dispatch(MatricesActions.setGroupedPrompts(groupedFields));


}


export const inputCapture = (values , promptDetail) => {

	const {dispatch} = store ;
	
	const pathName = promptDetail.path_name;
  console.log('values.length >>>>', typeof values , values.length );
  if(values.length){

  	Inputs.step2Captured[pathName] = values;
  	
    // capture filters ?
    if(promptDetail.grouped == 'filters'){
    	Inputs.step2FiltersCaptured[pathName] = {
    		values,
    		filterOperator : getFilterOperator(promptDetail),
    		type: promptDetail.data_type,
		    field : promptDetail.realName ,
		    displayLabel: promptDetail.display_label
    	};
    }

	}else{

		delete Inputs.step2Captured[pathName];

		if(promptDetail.grouped == 'filters'){ // remove filter
	   		delete Inputs.step2FiltersCaptured[pathName]; 
		}
	}

	// dispatch(MapDesignActions.setFilters(Inputs.step2FiltersCaptured));
	
}


export const yieldMap = async({scaleType = "linear" , fit = true , geoFilter = null } = {}) => {

	const {getState , dispatch} = store ;
	let state = getState() ;

	// alert(state.mapdesign.savedMap.analytical_model_base_id);


	let matrixId ;

	if(state.mapdesign.selectedSavedMapId){ // @TODO populate step 1 instead ?
		matrixId = state.mapdesign.savedMap.analytical_model_base_id ;
	}else{
		matrixId = Inputs.step1Captured['data_set'][0] ;
	}
	

	let mapData = {
		// OEM matrixId : Inputs.step1Captured['data_set'][0] ,
		matrixId ,
		capturedInputs : Inputs.step2Captured,
		capturedFilters : Inputs.step2FiltersCaptured,
		scaleType ,
		gridType : 'square',
		geoFilter
	};

	console.log('mapData>>><>>>', mapData );

	handleTogglePleaseWait(true);

	let data = await axios.post(
		`${apiBaseUrl()}/api/explorer/maps/compute_yield_map_data`,
		mapData,
		{
	      headers: {
	        "Content-Type": 'application/json',
	        "Authorization": `Bearer ${state.auth.user.token}`
	      }
	    }
	).then( (response) => {

		handleTogglePleaseWait(false);
		dispatch(MapDesignActions.setIsMapRefreshDue(false));
		dispatch(MapDesignActions.setPlotRecord(response.data.plotRecords));
		// dispatch(MapDesignActions.setTotalRecord(response.data.plotRecords.length));

		return response.data ;

	}).catch((error) => {
		console.log(error);
	});

	let steps = getRange(data.maxDensity , data.minDensity , 5); 
	let colorRange = [
		'#0002fd' , // strong blue index -> relative low // @TODO fix the relative associated meanings
		'#00fffc' , // light blue index -> relative mid-low
		'#008300' , // strong green index -> relative mid-low
		'#fefc01' , // yellow index -> [relative high
		'#ff0501'  // red index -> relative high]
	];
	// let scale = d3.scaleLinear(steps, colorRange );
	

	let width = LEGEND_WIDTH ;
	let scaleColor = d3.scaleLinear(steps, colorRange );
	let scaleLinear = d3.scaleLinear([steps[0] , steps[steps.length - 1] ], [0 , width] );
	let scaleLog = d3.scaleLog([steps[0] , steps[steps.length - 1] ], [0 , width] );

	let matchExpression = ['match', ['get', 'density']];
	data.densities.forEach((uniqueDensity) => {
		// OEM let rgbColor =  scale(uniqueDensity);  // default linear
		let rgbColor =  scaleColor(uniqueDensity);  // default linear
		if(scaleType == 'logarithm'){
			let xLog = scaleLog(uniqueDensity);
			let val = scaleLinear.invert(xLog);
			rgbColor =  scaleColor(val);
    }
    matchExpression.push(`${uniqueDensity}` ,  rgbColor ); // parse values to srting to meet mapboxgl constrain only allow 'string' , integer
	});
	matchExpression.push('#ffffff');



	/*
	* density map layer...
	*/
	if(!mapboxMap.map.getSource('hexgrid-source')){ // density grid source
		
		mapboxMap.map.addSource('hexgrid-source', {
		  'type': 'geojson',
		  'data': data.hexGrid,
		  'generateId' : true
		});

	}else{ // the source already exist

		mapboxMap.map.getSource('hexgrid-source').setData(data.hexGrid);
	}

	if (!mapboxMap.map.getLayer('grid-layer')) { // density grid layer


		mapboxMap.map.addLayer({
			'id': 'grid-layer',
			'type': 'fill',
			'source' : 'hexgrid-source' ,
			'layout': {},
			'paint': {
				'fill-color' : matchExpression ,
				'fill-opacity': [ 'match', ['get', 'density'],
				  '0' , 0,
				  //'0' , 1,
				  1 
				]
			}
		});


		// update properties bases on config
		if(data.meta.IsShowGrid == 'Yes'){
		  //mapboxMap.map.setLayoutProperty('grid-layer', 'visibility', 'visible');
		  mapboxMap.map.setPaintProperty('grid-layer', 'fill-outline-color', 'black' );  
		}else{
		  //mapboxMap.map.setLayoutProperty('grid-layer', 'visibility', 'none');
		  mapboxMap.map.setPaintProperty('grid-layer', 'fill-outline-color', 'transparent' );
		}

	}else{

  	mapboxMap.map.setPaintProperty( 'grid-layer', 'fill-color', matchExpression );

	}



	/*
	* records point layer ...
	*/

	if(!mapboxMap.map.getSource('records-source')){

  	// records mapables
    mapboxMap.map.addSource('records-source', {
      'type': 'geojson',
      'data': data.points,
      'generateId' : true
    });

    mapboxMap.map.addLayer({
      'id': 'records-layer',
      'type': 'circle',
      'source': 'records-source',
      'paint': {
        'circle-radius': 3, // OEM 4
        'circle-stroke-width': 1,
        'circle-color': 'black', // red | black
        'circle-stroke-color': 'white' // OEM 'white' | yellow
      }
    });

    
    if(data.meta.IsShowDataPoint == 'Yes'){
      mapboxMap.map.setLayoutProperty('records-layer', 'visibility', 'visible');
    }else{
      mapboxMap.map.setLayoutProperty('records-layer', 'visibility', 'none');
    }
    store.dispatch(MapDesignActions.setShowDataPoints(data.meta.IsShowDataPoint == 'Yes'));
   

  }else{ // the source already exist
    mapboxMap.map.getSource('records-source').setData(data.points);
  }























  /**
   *  test geojson layer +++
  */
  /*
  if(!mapboxMap.map.getSource('maine')){

  
	   // Add a data source containing GeoJSON data.
	  mapboxMap.map.addSource('maine', {
	      'type': 'geojson',
	      'data': {
	          'type': 'Feature',
	          'geometry': {
	              'type': 'Polygon',
	              // These coordinates outline Maine.
	              'coordinates': [
	                  [
	                      [-67.13734, 45.13745],
	                      [-66.96466, 44.8097],
	                      [-68.03252, 44.3252],
	                      [-69.06, 43.98],
	                      [-70.11617, 43.68405],
	                      [-70.64573, 43.09008],
	                      [-70.75102, 43.08003],
	                      [-70.79761, 43.21973],
	                      [-70.98176, 43.36789],
	                      [-70.94416, 43.46633],
	                      [-71.08482, 45.30524],
	                      [-70.66002, 45.46022],
	                      [-70.30495, 45.91479],
	                      [-70.00014, 46.69317],
	                      [-69.23708, 47.44777],
	                      [-68.90478, 47.18479],
	                      [-68.2343, 47.35462],
	                      [-67.79035, 47.06624],
	                      [-67.79141, 45.70258],
	                      [-67.13734, 45.13745]
	                  ]
	              ]
	          }
	      }
	  });

	  // Add a new layer to visualize the polygon.
	  mapboxMap.map.addLayer({
	      'id': 'maine',
	      'type': 'fill',
	      'source': 'maine', // reference the data source
	      'layout': {},
	      'paint': {
	          'fill-color': '#0080ff', // blue color fill
	          'fill-opacity': 0.5
	      }
	  });
	  // Add a black outline around the polygon.
	  mapboxMap.map.addLayer({
	      'id': 'outline',
	      'type': 'line',
	      'source': 'maine',
	      'layout': {},
	      'paint': {
	          'line-color': '#000',
	          'line-width': 3
	      }
	  });


  }
  */




  




















	/**
   *  test BBOX+++
  */
  
  /* OEM @TODO make a configuration that can show theses layers in debug mode...
  if(!mapboxMap.map.getSource('mmm10')){

    mapboxMap.map.addSource('mmm10', {
      type : 'geojson',
      data: data.bboxPoly
    });

    mapboxMap.map.addLayer({
      'id': 'mmm10_layer',
      'type': 'fill',
      'source': 'mmm10', // reference the data source
      'layout': {
        'visibility' : 'visible' // visible | none
      },
      'paint': {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.9
      }
    });

  }else{
    mapboxMap.map.getSource('mmm10').setData(data.bboxPoly);
  }
  */

  // console.log("data.bboxPoly <<<", data.bboxPoly) ;

  
  // the streched bbox
  // +++ test padded bbox poly
  /* OEM 
  if(!mapboxMap.map.getSource('mmm11')){

    mapboxMap.map.addSource('mmm11', {
      type : 'geojson',
      data: data.bboxPoly2
    });

    mapboxMap.map.addLayer({
      'id': 'mmm11_layer',
      'type': 'fill',
      'source': 'mmm11', // reference the data source
      'layout': {
        'visibility' : 'visible' // visible | none
      },
      'paint': {
      'fill-color': '#FF3300', // blue color fill
      'fill-opacity': 0.4
      }
    });

  }else{
    mapboxMap.map.getSource('mmm11').setData(data.bboxPoly2);
  }
  */


  // the streched bbox2
  // +++ test padded bbox poly
  /* OEM 2
  if(!mapboxMap.map.getSource('mmm12')){

    mapboxMap.map.addSource('mmm12', {
      type : 'geojson',
      data: data.bboxMmmPolyGo
    });

    mapboxMap.map.addLayer({
      'id': 'mmm12_layer',
      'type': 'fill',
      'source': 'mmm12', // reference the data source
      'layout': {
        'visibility' : 'visible' // visible | none
      },
      'paint': {
      'fill-color': '#98F19E', // blue color fill
      'fill-opacity': 0.6
      }
    });

  }else{
    mapboxMap.map.getSource('mmm12').setData(data.bboxMmmPolyGo);
  }
  */



  /*
  if(!mapboxMap.map.getSource('mmm13')){

    mapboxMap.map.addSource('mmm13', {
      type : 'geojson',
      data: data.translatedPolygonesGo[2]
    });

    mapboxMap.map.addLayer({
      'id': 'mmm13_layer',
      'type': 'fill',
      'source': 'mmm13', // reference the data source
      'layout': {
        'visibility' : 'visible' // visible | none
      },
      'paint': {
      'fill-color': '#98F19E', // blue color fill
      'fill-opacity': 0.9
      }
    });

  }else{
    mapboxMap.map.getSource('mmm13').setData(data.translatedPolygonesGo[2]);
  }
  */


  


  
  


   // console.log('data.bboxPoly <<>>>', data.bboxPoly);


	/**
   *  test marker +++
  */
  /*
  // Create a default Marker and add it to the map.
	const marker1 = new mapboxgl.Marker()
	// OEM .setLngLat([1, 1])
	.setLngLat([-2, 2.4])
	.addTo(mapboxMap.map);

	*/

	/*
	// Create a default Marker and add it to the map.
	const marker2 = new mapboxgl.Marker()
	// OEM .setLngLat([1, 1])
	.setLngLat([-2, 0]) // bboxPolyCordNW ???
	.addTo(mapboxMap.map);
	*/
	

	/*
	const marker3 = new mapboxgl.Marker()
	// OEM .setLngLat([1, 1])
	.setLngLat([-2.6665066048867536, 1.7336362156736072])
	.addTo(mapboxMap.map);
	*/

	/*
	const marker4 = new mapboxgl.Marker()
	.setLngLat([0.6662465510286145, 0.666201512351908])
	.addTo(mapboxMap.map);
	*/


	if(fit){
		const v2 = new mapboxgl.LngLatBounds( data.meta.mapBoundCoordSW , data.meta.mapBoundCoordNE );
	  mapboxMap.map.fitBounds( v2 , {
			padding: 50
		});
	}


	// show number of dropped point ?
	if(data.filteringConfig && data.filteringConfig.doThisOption && data.filteringConfig.numbDroppedPoints){

		setTimeout(() => {

			NotificationDialog({
		    title : 'Dynamic Data Logger',
		    type : 'information',
		    // msg , a string or a function returning jsx
		    msg : () => {
		      return(
		        <>
		          <div> Droped {data.droppedRecord.length} records due to outlier filtering on {data.filteringConfig.numbStdDeviations} standard deviations  </div>
		        </>
		      )
		    }
		  });

		} , 700 );

	}

	

	
	// set filters
	dispatch(MapDesignActions.setFilters(Inputs.step2FiltersCaptured));
	

  return { steps , colorRange} ;
  
}



//+++ @TODO unify the bellow

export const step1LabelsUpdate = (pathName , values) => {

	const {getState , dispatch} = store ;
 	let state = getState() ;

 	let groupedFields = [...state.matrices.groupedPrompts] ;
  	
  	groupedFields = groupedFields.map((group , groupIndex) => {
  		return {
  			...group,
  			fields: group.fields.map((field , fieldIndex) => {
  				if(field.path_name == pathName ){ 
  					if(values.constructor === Array){
  						
  						let currentOptions = state.mapdesign.promptOptions;

  						values = values.map(val => {
			            	return currentOptions.find(option => option.id == val );
			            });

			            return {
			            	...field,
			            	capturedValue: values // @TODO preformat this into a string that can be displaye onto datatable
			            };

  					}else{ // text field input
  						
  						return {
			              ...field,
			              value: values // @TODO we could use the same container `capturedValue` and let the datatable handle the parsing ? 
			            };
  					}
  				}
  				return field ;
  			})
  		};
  	});

  	dispatch(MatricesActions.setGroupedPrompts(groupedFields));

}

export const step1InputCapture = (values , promptDetail) => {
	
	const name = promptDetail.name;

	if(values.length){
  	Inputs.step1Captured[name] = values;
	}else{

		delete Inputs.step1Captured[name];
	}
}



export const toggleFilters = (e = null , status = null ) => {
	
	const {dispatch} = store ;
	const state = store.getState();

	if(!status){
		if(state.explorer.showOffCanvasAnalysisPromptLabels == false && state.explorer.showOffCanvasAnalysisPromptInputs == false ){
			status = true ;
		}else{
			status = false ;
		}
	}

	dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptInputs(status));
  dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptLabels(status));
  

  /* OEM 
  setTimeout(() => { // @TODO fix artifact , default scrolls are showing during animation, we could overflow hidden prior to custom scroll being attachables
    // setup gui stuff
    attachCustomScrolls();

  } , 300 ); // @TODO on offcanvas displayed callback ?
  */
}





// make a legend
// @TODO a legend that is crhoma based for narrow ranges
const Legend = (
  color ,
  {
    title,
    tickSize = 6,
    width = 256, // @TODO  320 | 255 | 256 ?
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {} ) => {

  function ramp(color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }


  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("overflow", "visible")
    .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  let svgGradientBar ; // +++ leodesign

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svgGradientBar = svg.append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }


  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
        {range() { return [marginLeft, width - marginRight]; }});

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
        = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

    x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }


  // Ordinal
  else {
    x = d3.scaleBand()
      .domain(color.domain())
      .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
      .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
      .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
      .tickSize(tickSize)
      .tickValues(tickValues))
    .call(tickAdjust)
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", marginLeft)
      .attr("y", marginTop + marginBottom - height - 6)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .attr("class", "title")
      .text(title));

  // OEM return svg.node();
  return [svg.node() , svgGradientBar ] ;
  
}


export const legend = ({color ,  ...options}) => {
  return Legend(color , options )
}




export const getOptionInfo = (pathName , humanize = true ) => {

	const state = store.getState();

	let prompt = state.matrices.groupedPrompts.flatMap(({fields}) => fields).find( prompt => prompt.path_name == pathName );

	let selectedValues ;

	if(["select" , "multiselect"].includes(prompt.prompt_type)){

		selectedValues = Inputs.step2Captured[pathName].map(val => {
    	return Inputs.options[pathName].find(option => option.id == val ); 
    });


		if(humanize){
      selectedValues = selectedValues.map(option => option.label).join(', ');
    }

	}else{ // assumed text... return the capture text value
    
    selectedValues = Inputs.step2Captured[pathName];

  }

  return selectedValues ;
}



export const handleTogglePleaseWait = (status) => {
  store.dispatch(ExplorerActions.setPleaseWait(status));
}