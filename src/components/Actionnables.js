import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// import mapboxGLDrawRectangleDrag from 'mapboxgl-draw-rectangle-drag'; // this library interfere with dragPane of mapbox
// mapbox gl imports
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css' ; // @TODO this on index.js ...
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'; // non official package but works well
// import DrawRectangle from 'mapbox-gl-draw-rectangle-assisted-mode';

import axios from 'axios';

import { store } from "../redux";

import {
    CircleMode,
    DragCircleMode,
    DirectMode,
    SimpleSelectMode
} from 'mapbox-gl-draw-circle';

import alasql from 'alasql';
import * as d3 from "d3";
import * as turf from '@turf/turf';
// import chroma from "chroma-js"; // @TODO dreprecate this for D3

import Inputs from "../configs/inputs";

import {connect} from "react-redux" ;
import { DashboardActions , MatricesActions , MapDesignActions , ExplorerActions } from "../redux/actions";

import mapboxMap from "../configs/mapBox";
import matriceConfig from "../configs/matrice";

import {arrayUnique , getRange , between , toFixed2 , apiBaseUrl }  from "../utilities/Helpers" ;

import { BASE_API_URL } from "../redux/services/constant";
import { ACCESS_TOKEN_MAPBOX , MAPBOX_DEFAULT_CENTER , MAPBOX_DEFAULT_ZOOM , LEGEND_WIDTH } from "../utilities/constant";


export const attachCustomScrolls =  ( items = [] , config = {} ) => { // @TODO merge configs
  let targets = items.length ? items : ['selector-off-canvas-prompt-label' , 'selector-off-canvas-prompt-inputs' ] ;

  targets.map(target => {

    window.jQuery(`.${target}`).mCustomScrollbar({ 
      theme: "light",
      // OEM axis:"yx",
      axis:"y",
      setHeight: 613,
      // theme:"dark",
      scrollEasing : "linear",
      scrollInertia : 0,
      autoDraggerLength : false
    });

  });

}

const loadRecords = async(dataMatrix) => {
  // @TODO stream for extra large files ?

  //+++

  let plotRecords = [];

  // loading of the json
  if(dataMatrix.file_mime_type == 'application/json'){

    plotRecords =  await alasql([`SELECT * FROM json("${apiBaseUrl()}/uploads/${dataMatrix.file_name}")`]);
    plotRecords = plotRecords[0];

  }else if(dataMatrix.file_mime_type == 'text/csv'){
    plotRecords =  await alasql([`SELECT * FROM CSV("${apiBaseUrl()}/uploads/${dataMatrix.file_name}" , {headers:true, separator:","})`]) ;
    plotRecords = plotRecords[0];
  }

  matriceConfig.records = plotRecords ;

  //console.log('dataMatrix.file_mime_type >>>>>>', plotRecords );

  //END+++

  /* OEM
  let plotRecords =  await alasql([`SELECT * FROM CSV("${apiBaseUrl()}/uploads/${dataMatrix.file_name}" , {headers:true, separator:","})`]) ;
  plotRecords = plotRecords[0];
  */

  // matriceConfig.records = plotRecords ;
  // console.log('res3  >>> 1>>>>>>>>' , dataMatrix.file_mime_type );
  // return plotRecords ;
}

const loadConfig = async(matrix) => {
  // OEM return matriceConfig.fields.length && matriceConfig.groupedPrompt.length  ? matriceConfig : await fetch(`${BASE_API_URL}/uploads/${matrix.config_file_name}?time=${new Date().getTime()}`)
  return await fetch(`${BASE_API_URL}/uploads/${matrix.config_file_name}?time=${new Date().getTime()}`)
  .then((r) => r.json())
  .then((data) => {
    const { matrixSchema , groupedPrompts } = data ;

    // ## @TODO no need to store matrix options and field group once more ?

    // globals
    matriceConfig.fields = matrixSchema ; // JSON.parse(JSON.stringify(matrixSchema));
    matriceConfig.groupedPrompt = groupedPrompts ; // JSON.parse(JSON.stringify(groupedPrompts));
    matriceConfig.id = matrix.id ;

  });

}

export const  startCreateNewAnalysis = async (thePlotingOption = null , theSelectedDataMatrix = null ) => {

  const {getState , dispatch} = store ;
  let state = getState() ;

  let plotingOption = thePlotingOption ? thePlotingOption : state.dashboard.selectedPlotingOption ; 
  let selectedDataMatrix = theSelectedDataMatrix ? theSelectedDataMatrix : state.matrices.selectedDataMatrix ;
  console.log('selectedDataMatrix <><>', selectedDataMatrix );

  if(plotingOption != 'map' ){
    alert('only map works for now'); // @TODO jspanel error message
  }else{ // @TODO call a startMapAnalysis base function...

    await loadConfig(selectedDataMatrix);
    
    let groupedPrompts = matriceConfig.groupedPrompt ;
    const fields = matriceConfig.fields ;
    let firstField = matriceConfig.groupedPrompt[0].fields[0] ;
    let firstGroup = matriceConfig.groupedPrompt[0] ;


    // dispatch(DashboardActions.setPromptsAndOptionsGrouped(groupedPrompts));

    //+++
    let promptsAndOptions = [] ;
    // let defaults = {} ;

    groupedPrompts.forEach( (fieldGroup,fieldGroupIndex) => {
      fieldGroup.fields.forEach( (field,fieldIndex) => { // we keep the same order as the original field order
        promptsAndOptions.push(field);

        // default values
        /*
        if(field.prompt_type == "select" || field.prompt_type == 'multiselect' ){
          if(field.defaultSelected.length){
            defaults[field.path_name] = field ;
          }
        }else if(field.prompt_type == "text"){

        }
        */


      });
    });

    dispatch(ExplorerActions.setDataTableColumns(fields));
    dispatch(ExplorerActions.setGroupedPromptsAndPrompts({groupedPrompts: groupedPrompts , prompts: promptsAndOptions }));
    Inputs.promptsMemo = [...promptsAndOptions] ; // memorise all prompts and options
    dispatch(MapDesignActions.setSelectedField([firstField.path_name])) ;
    dispatch(MapDesignActions.setTotalRecord(parseInt(selectedDataMatrix.file_total_records))) ;

    // @TODO unify all into one GUI action ?
    dispatch(ExplorerActions.setTabKeyLandingPage(`tabs_main-map_designer`)) ; // @TODO make tab names constants
    dispatch(MapDesignActions.setTabKeyFields(`tabs_field_group-${firstGroup.groupName}`));
    
    dispatch(MapDesignActions.setTabKeyActiveInput(`tabs_field_inputs-${firstField.path_name}`));
    
    dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptLabels(true));
    dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptInputs(true)); // @TODO timeout with refesh selection state ?
    dispatch(ExplorerActions.setIsAnalysisInProgress(true));

    // OEM :-) initializeMap(state , dispatch); // we now using a map context to initialize the map

    // setup gui stuff
    attachCustomScrolls();
    //+++END

    return true ;

  }
  
}


// OEM export const initializeMap = (matrix = null , state , dispatch ) => {
export const initializeMap = (state , dispatch ) => { // @TODO deprecate this!

  function scaleLinearOnUnit (){

    let width = LEGEND_WIDTH ; // @TODO read from config ?
    const {steps, colorRange } = store.getState().mapdesign;
    return d3.scaleLinear([steps[0] , steps[steps.length - 1] ], [0 , width] );
  }

  
  function scaleLinearOnColor (){

    let width = LEGEND_WIDTH ; // @TODO read from config ?
    const {steps, colorRange } = store.getState().mapdesign;
    return d3.scaleLinear(steps, colorRange );
  }

    /* OEM
    function updateArea(e) {
      const data = mapboxMap.draw.getAll();
      const answer = document.getElementById('calculated-area');

      if (data.features.length > 0) {
        const area = turf.area(data);
        // Restrict the area to 2 decimal points.
        const rounded_area = Math.round(area * 100) / 100;
        answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
      } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
          alert('Click the map to draw a polygon.');
      }
    }
    */
    
    document.getElementById("mapbox-map").innerHTML = "";
    mapboxMap.map = null ;

    mapboxgl.accessToken = ACCESS_TOKEN_MAPBOX ;

    mapboxMap.map = new mapboxgl.Map({
      container: 'mapbox-map', // container id
      style: 'mapbox://styles/mapbox/streets-v11',
      center: MAPBOX_DEFAULT_CENTER ,
      zoom: MAPBOX_DEFAULT_ZOOM ,
      preserveDrawingBuffer: true, // useful for exporting... ?
      pitch: 0,
      "paint": {
        "fill-color": "#00ffff"
      }
    });

    // configure drawing tools
    mapboxMap.draw = new MapboxDraw({
      //defaultMode: "draw_circle",
      userProperties: true,
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle: DrawRectangle,

        draw_circle  : CircleMode,
        drag_circle  : DragCircleMode,
        direct_select: DirectMode,
        simple_select: SimpleSelectMode

        // draw_assisted_rectangle:DrawAssistedRectangle
      },
      displayControlsDefault: false ,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
      // polygon: true,
      // trash: true
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // OEM defaultMode: 'draw_polygon'

    });

    // bind it
    mapboxMap.map.addControl(mapboxMap.draw) ;

    mapboxMap.map.on('draw.create', async (e) => {

      if(store.getState().mapdesign.isDrawingGeoFilter){

        const data = mapboxMap.draw.getAll();

        if (data.features.length > 0) {

          let [minX , minY , maxX , maxY ] = turf.bbox(data.features[0]);

          store.dispatch(MapDesignActions.setGeoFilterBox([minX , minY , maxX , maxY ]));

          // OEM const {steps , colorRange} = await yieldMap(store.getState() , { geoFilter: [minX , minY , maxX , maxY ] });
          const {steps , colorRange} = await yieldMap({ geoFilter: [minX , minY , maxX , maxY ] });
          if(steps && colorRange){
            store.dispatch(MapDesignActions.setLegendData({steps, colorRange}));  
          }
          

          // OEM turf.getCoords(data.features[0]);
          // data.features[0].getCoords()

          console.log('[minX , minY , maxY , maxY ] >>>>>>>>>', [minX , minY , maxY , maxY ] );

        }

        console.log('data >>>>>> ', data );
        
        // plante the geo filter here to govert the field

        // yield map with filter

        // disable geo filter drawing
        store.dispatch(MapDesignActions.setIsDrawingGeoFilter(false));
      }

    });

    mapboxMap.map.on('draw.update', (e) => { // we dont update geo filter
      
    });

    mapboxMap.map.on('draw.delete', (e) => {
      
    });

    //mapboxMap.map.on('draw.delete', updateArea);
    //mapboxMap.map.on('draw.update', updateArea);

    // mapboxMap.map["dragPan"].disable();


    /* leav draw mode has is

    mapboxMap.draw.changeMode('draw_rectangle'); // non official added rectangle mode, // @TODO trigger on geo filter click
    // Provide the default radius as an option to CircleMode
    mapboxMap.draw.changeMode('draw_circle', { initialRadiusInKm: 0.5 });
    mapboxMap.draw.changeMode('drag_circle');

    */





    /* snippet, this is how you get the feature with draw mode rectangle
    var modes = MapboxDraw.modes;

    // browserify dist/index.js --standalone DrawRectangle | uglifyjs -c -m > mapbox-gl-draw-rectangle-mode.min.js
    modes.draw_rectangle = DrawRectangle.default;

    var draw = new MapboxDraw({
        modes: modes
    });
    map.addControl(draw);

    draw.changeMode('draw_rectangle');

    map.on('draw.create', function (feature) {
        console.log(feature);  // <<------------------------------
    });
    */


    
    mapboxMap.map.on('load', () => {
      mapboxMap.map.resize();
      mapboxMap.map.setPaintProperty('water', 'fill-color', '#9ab2cb');
      mapboxMap.map.setPaintProperty('water', 'fill-opacity', 1);
    });

    // disable double click zoom
    mapboxMap.map.doubleClickZoom.disable(); // snip map.doubleClickZoom.isEnabled() -> false
    mapboxMap.map.setRenderWorldCopies(true);

    mapboxMap.map.on('wheel', (e) => { //@TODO mobile support on pinch
      dispatch(MapDesignActions.setMapZoom(mapboxMap.map.getZoom()));
    });

    /* OEM temporary disable
    mapboxMap.map.on('mousemove', (e) => {
      let x =  e.point.x;
      let y =  e.point.y;

      let longLat = e.lngLat.wrap();

      dispatch(MapDesignActions.setMapLong(longLat.lng));
      dispatch(MapDesignActions.setMapLat(longLat.lat));
      dispatch(MapDesignActions.setMapXY({x , y }));

    });
    */


    //+++
    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      // offset: 25,
      // className: "apple-popup"
    });

    popup.on('close', function(e) {
      // alert('popu close');
    })

    mapboxMap.map.on('mouseenter' , 'grid-layer', (e) => {
      
      if(parseFloat(e.features[0].properties.density) > 0 ){
        /*OEM
        // Change the cursor style as a UI indicator.
        mapboxMap.map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        // OEM const description = e.features[0].properties.description;
        const description = 'popup content';

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        
        // Populate the popup and set its coordinates
        // based on the feature found.
        // OEM popup.setLngLat(coordinates).setHTML(description).addTo(mapboxMap.map);
        popup.setLngLat([150,-34]).setHTML(description).addTo(mapboxMap.map);
        */

      }

    }).on('mouseleave', 'grid-layer', () => {
      
      /*OEM
      mapboxMap.map.getCanvas().style.cursor = '';
      popup.remove();
      */
      
    });

    //END +++

    mapboxMap.map.on('mousemove' , 'grid-layer', (e) => {

      let density = e.features[0].properties.density ;

      if(density > 0){
        dispatch(MapDesignActions.setShowLegendToolTip({show:true , trigger : 'grid' }));
        dispatch(MapDesignActions.setValueTooltip(e.features[0].properties.density));
        dispatch(MapDesignActions.setOffsetTooltip(scaleLinearOnUnit()(density)));
        dispatch(MapDesignActions.setBackgroundTooltip(scaleLinearOnColor()(density))); // asking the color trough the unit rather ?
      }else{
        dispatch(MapDesignActions.setShowLegendToolTip({show:false , trigger : 'grid' }));
      }

      // access data needed to compute and shot the tool tip


      // @TODO deprecate this bellow...
      if(e.features[0].properties.density){
        document.getElementById("value-info-mmm").innerHTML = e.features[0].properties.density ; // @TODO mmm replace with correct one....
      }


    }).on('mouseout' , 'grid-layer', (e) => {
      dispatch(MapDesignActions.setShowLegendToolTip({show:false , trigger : 'grid' }));
    });



    /* OEM
    mapboxMap.map.on('dblclick' , 'grid-layer', (e) => {

    });
    */


}

export const computePromptsAndOptions = async  (dataMatrix , dispatch) => {

    let [ matrixFields , groupedPrompts ] = await readMatrixConfig(dataMatrix);
      
    // persist
    // OEM this.matrixSchema = matrixFields ; // field list
    //this.vwGroupedPrompt = groupedPrompts ;


    //+++ compute default values
    let defaults = {} ;
    groupedPrompts.forEach(group => {
      group.fields.forEach(field => {

        if(field.prompt_type == "select" || field.prompt_type == 'multiselect' ){

          if(field.defaultSelected.length){
            defaults[field.name] = {
              fieldUniqueName : field.name ,
              fieldPath: field.name ,
              type : field.data_type ,
              prompt_type : field.prompt_type ,
              values : field.defaultSelected // @TODO ensure value is one of offered options ? also make code rebust by checking if dome node exist before modifying class to prevent crash...
            }
          }

        }else if(field.prompt_type == "text"){

          if(field.value){ // @TODO rename to `defaultValue` ?
            defaults[field.name] = {
              fieldUniqueName : field.name ,
              fieldPath: field.name ,
              type : field.data_type ,
              prompt_type : field.prompt_type ,
              value : field.value // @TODO ensure value is one of offered options ? also make code rebust by checking if dome node exist before modifying class to prevent crash...
            }
          }

        }

      });
    });

    mapboxMap.promptsAndDefaultValues = defaults ;
    //END+++ compute default values



    // compute filter options
    //++++++++++++ computer filter
    let filtersPrompts = groupedPrompts.find(group => group.groupName == 'filters' );
    for (const [ fieldIndex , field ] of filtersPrompts.fields.entries()) {
      if(field.options == 'compute' ){


        //++++++ what we want todo

        // @TODO preload a json ?  adding support for other files type eg: .xlsx , .txt , .json , .sql , .sqlite
        // @TODO preload headers ?
        // @TODO method that focus on removing null values peraphs base on configs
        // @TODO support for standard deviation elimination and show number of dropped records based on config
        // @TODO implement alasql stream read for large datasets and/or joins ?
        let records =  await alasql(`SELECT ${field.realName} FROM ? WHERE ${field.realName} NOT IN('$null$' , '' , 'null' ) GROUP BY ${field.realName}`, [matriceConfig.records] );
        let options = records.map((item) => {

          let option = {
            id : item[field.realName] ,
            label : item[field.realName] , // @TODO computer this via tagged directives....
            selected : false // @TODO compute this via a different scoped collection of selected values ?
          };

          if(field.isImage){
            option.img = item.moonPhase ; // 'moonphase1.jpeg' ; // @TODO fix this... image resuting from the query
          }

          return option ;

        });

        filtersPrompts.fields[fieldIndex].options = options ;

        //++++++ END what we want todo




















        // @TODO preload a json ?  adding support for other files type eg: .xlsx , .txt , .json , .sql , .sqlite
        // @TODO preload headers ?
        // @TODO method that focus on removing null values peraphs base on configs
        // @TODO support for standard deviation elimination and show number of dropped records based on config
        // @TODO implement alasql stream read for large datasets and/or joins ?
        /* OEM
        await alasql([`SELECT ${field.realName} FROM CSV("${BASE_API_URL}/uploads/${dataMatrix.file_name}" , {headers:true, separator:","}) WHERE ${field.realName} NOT IN('$null$' , '' , 'null' )   GROUP BY ${field.realName} `]) 
          .then(function(res){ console.log('records  >>>> 2 >>>>>>>' , res );
            let options = res[0].map((item) => {

              let option = {
                id : item[field.realName] ,
                label : item[field.realName] , // @TODO computer this via tagged directives....
                selected : false // @TODO compute this via a different scoped collection of selected values ?
              };

              if(field.isImage){
                option.img = item.moonPhase ; // 'moonphase1.jpeg' ; // @TODO fix this... image resuting from the query
              }

              return option ;

            });

            // aggragate the options
            filtersPrompts.fields[fieldIndex].options = options ; // @TODO we might need to load filter options async for performance gains ? OR show a preloader ?


          }).catch(function(err){
            console.log('Does the file exist? There was an error:', err);
          });

          

        */











        /* OEM replacement 
        let records =  await alasql(`SELECT ${field.realName} FROM ? WHERE ${field.realName} NOT IN('$null$' , '' , 'null' ) GROUP BY ${field.realName}`, [matriceConfig.records] );
        if (records.length){

          let options = records.map((item) => {

            let option = {
              id : item[field.realName] ,
              label : item[field.realName] , // @TODO computer this via tagged directives....
              selected : false // @TODO compute this via a different scoped collection of selected values ?
            };

            if(field.isImage){
              option.img = item.moonPhase ; // 'moonphase1.jpeg' ; // @TODO fix this... image resuting from the query
            }

            return option ;

          });
          
          filtersPrompts.fields[fieldIndex].options = options ;
        }

        */


















      }
    }
    //++++++++++++ END computer filter


    

    // mutate by aggregation
    let groupedPromptsWithOptions = [groupedPrompts[0] , filtersPrompts ] ; // @TODO make more dynamic ?


    // update state
    dispatch(DashboardActions.setPromptsGrouped(groupedPrompts));
    dispatch(DashboardActions.setPromptsAndOptionsGrouped(groupedPromptsWithOptions));

    // compute flattened fields and options
    let promptsAndOptions = [] ;
    groupedPrompts.forEach( (fieldGroup,fieldGroupIndex) => {
      fieldGroup.fields.forEach( (field,fieldIndex) => { // we keep the same order as the original field order
        promptsAndOptions.push(field);
      });
    });

    // persist
    dispatch(DashboardActions.setPromptsAndOptions(promptsAndOptions));
    
    return [groupedPrompts[0] , groupedPrompts[0].fields[0] , promptsAndOptions ];

}


export const readMatrixConfig = async (matrix = null ) => {

  return matriceConfig.fields.length && matriceConfig.groupedPrompt.length  ? [matriceConfig.fields , matriceConfig.groupedPrompt ] : await loadConfig(matrix)
    .then(async()=> await loadRecords(matrix))
    .then(() => {
      return [matriceConfig.fields , matriceConfig.groupedPrompt ] ;
    });

}

// make a legend
// @TODO a legend that is crhoma based for narrow ranges
const Legend = (
  color ,
  {
    title,
    tickSize = 6,
    width = 320, // @TODO default to 255 ?
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

// make swatches
const Swatches = (

  color,
  {
    columns = null,
    format,
    unknown: formatUnknown,
    swatchSize = 15,
    swatchWidth = swatchSize,
    swatchHeight = swatchSize,
    marginLeft = 0
  } = {}) => {

  const id = `-swatches-${Math.random().toString(16).slice(2)}`;
  const unknown = formatUnknown == null ? undefined : color.unknown();
  const unknowns = unknown == null || unknown === d3.scaleImplicit ? [] : [unknown];
  const domain = color.domain().concat(unknowns);

  function entity(character) {
    return `&#${character.charCodeAt(0).toString()};`;
  }

  let htl ;

  if (columns !== null) return htl.html`<div style="display: flex; align-items: center; margin-left: ${+marginLeft}px; min-height: 33px; font: 10px sans-serif;">
  <style>

    .${id}-item {
      break-inside: avoid;
      display: flex;
      align-items: center;
      padding-bottom: 1px;
    }

    .${id}-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - ${+swatchWidth}px - 0.5em);
    }

    .${id}-swatch {
      width: ${+swatchWidth}px;
      height: ${+swatchHeight}px;
      margin: 0 0.5em 0 0;
    }

      </style>
      <div style=${{width: "100%", columns}}>${domain.map(value => {
        const label = `${format(value)}`;
        return htl.html`<div class=${id}-item>
          <div class=${id}-swatch style=${{background: color(value)}}></div>
          <div class=${id}-label title=${label}>${label}</div>
        </div>`;
      })}
      </div>
    </div>`;

      return htl.html`<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 10px sans-serif;">
      <style>

    .${id} {
      display: inline-flex;
      align-items: center;
      margin-right: 1em;
    }

    .${id}::before {
      content: "";
      width: ${+swatchWidth}px;
      height: ${+swatchHeight}px;
      margin-right: 0.5em;
      background: var(--color);
    }

  </style>
  <div>${domain.map(value => htl.html`<span class="${id}" style="--color: ${color(value)}">${format(value)}</span>`)}</div>`;

}

export const swatches = ({color , ...options }) => {
  return Swatches(color, options);
}


// aggregation method
const aggregate = (aggregationValue , mapValue , ptsWithin , extrapolation ) => {

  let ptValues = ptsWithin.features.map(ptWithin => ptWithin.properties[mapValue]) ;
  let ptValuesAggregated = 0 ; // initialize null ;


  if(aggregationValue == 'Sum' ){

    ptValuesAggregated = ptValues.reduce( (accumulator , value) =>  accumulator + value , 0 ) ;

  }else if( aggregationValue == 'Average' ){

    ptValuesAggregated = ptValues.reduce((accumulator,value) => accumulator + value , 0 ) / ptValues.length ;

  }else if( aggregationValue == 'Count' ){

    ptValuesAggregated = ptValues.length ;

  }else if( aggregationValue == 'Min' ){

    ptValuesAggregated = Math.min( ...ptValues );

  }else if( aggregationValue == 'Max' ){

    ptValuesAggregated = Math.max( ...ptValues ) ;

  }else if( aggregationValue == 'Var' ){ // -> Variance

    let averageVal = ptValues.reduce((accumulator,value) => accumulator + value , 0 ) / ptValues.length ;
    ptValuesAggregated = ptValues.reduce( (accumulator , value) =>  accumulator + Math.pow(value - averageVal , 2 ) , 0 ) ; // alt syntac for math.pow( -> let num = 2 ** 3 <- exponentiation operator
    let variance = ptValuesAggregated / ptValues.length ;

    ptValuesAggregated = variance ; // @TODO it seems not all point have variances ?

  }else if( aggregationValue == 'StdDev' ){ // Standard Deviation

    // @TODO unify with the above

    let averageVal = ptValues.reduce((accumulator,value) => accumulator + value , 0 ) / ptValues.length ;
    ptValuesAggregated = ptValues.reduce( (accumulator , value) =>  accumulator + Math.pow(value - averageVal , 2 ) , 0 ) ; // alt syntac for math.pow( -> let num = 2 ** 3 <- exponentiation operator
    let variance = ptValuesAggregated / ptValues.length ;

    ptValuesAggregated =  Math.sqrt(variance) ; // @TODO it seems not all point have variances ?

  }else{ // let default to Sum here ?

  }

  return ptValuesAggregated ;

}

// estimate base on sherped method, inverse distance weighting interpolation
// https://en.wikipedia.org/wiki/Inverse_distance_weighting
const estimates = (grid , hexGridCenters , influenceZones, extrapolation , densities ) => {

  let pointsToEstimate = [] ;
  let hexGridCentersCollection = turf.featureCollection(hexGridCenters); // @TODO should we modified centers and give each point the updated estimate ?
  let hexGridCentersKnowValueCollection = turf.featureCollection(hexGridCentersCollection.features.filter(item => item.properties.is_known_value == true));
  if(influenceZones.length){
    influenceZones.forEach( (influenceZone, influenceZoneIndex ) => { 
      var ptsWithin = turf.pointsWithinPolygon(hexGridCentersCollection, influenceZone.zone); // these point 
      pointsToEstimate =  pointsToEstimate.concat(ptsWithin.features.filter(item => item.properties.is_known_value == false )) ;
    });
  }

  if(pointsToEstimate.length){
    for (let point of pointsToEstimate) {

      let estimatedValue = 0 ;

      // define circle arround the point // @TODO we can can also define a square peripherique to switch left and right @TODO make the later a config
      let centerCoord = point.geometry.coordinates ;
      var radius = extrapolation ; // @TODO validation so that this is never less than the radius of a square block x2 
      // @important we could make step 4 in case we want only rectangle type forcasting base on influence zone
      let circle = turf.circle(centerCoord, radius, {
        steps: 10, // OEM steps: 10,
        units: 'kilometers' // kilometers | miles
      });

      var neighbourKnowValuePoints = turf.pointsWithinPolygon(hexGridCentersKnowValueCollection, circle); // these point  

      let estimationMetrix = {
        "pointToEstimate" : point ,
        "knownNeighbours" : [] 
      };

      if(neighbourKnowValuePoints && neighbourKnowValuePoints.features.length){ // we found know value nearby
        let sumOfinverseDistances = 0 ; // weights

        neighbourKnowValuePoints.features.forEach(knowNeighbour => {
          var distance = turf.distance(turf.point(point.geometry.coordinates), turf.point(knowNeighbour.geometry.coordinates), {units: 'kilometers'}); // @TODO make unit configurable
          // OEM var inverseDistance = 1/parseFloat(distance); // AKA weight // @TODO do we need to add a "power coeficient" ? DDL has 2.3
          const exponent = 2.3 ; // magic number... found in DDL 7 | alternative snippets Math.pow(base, exponent) or base ** exponent
          var inverseDistance = 1/parseFloat(Math.pow(distance ,exponent )); // AKA weight // @TODO do we need to add a "power coeficient" ? DDL has 2.3
          // inverseDistance = parseFloat(this.roundIt(inverseDistance , 4 )) ; // @TODO make rounding configurable ?? !IMPORTANT note javascript does reprensent large number in exponatial notation

          sumOfinverseDistances += parseFloat(sumOfinverseDistances) + parseFloat(inverseDistance) ;

          estimationMetrix.knownNeighbours.push({
            "knownPoint" : knowNeighbour ,
            "distance" : parseFloat(distance),
            "inverseDistance" : parseFloat(inverseDistance), // AKA weight
          });

        });

        // normalized inverse distances
        if(sumOfinverseDistances > 0 ){
          // let calulate the weight and normalize them
          estimationMetrix.knownNeighbours = estimationMetrix.knownNeighbours.map((aPoint) => {

            let inverseDistanceNormalized = parseFloat(aPoint.inverseDistance) / parseFloat(sumOfinverseDistances) ;

            return {
              "knownPoint" : aPoint.knownPoint ,
              "distance" : aPoint.distance,
              "inverseDistance" : aPoint.inverseDistance,
              "inverseDistanceNormalized" : inverseDistanceNormalized,
              "weightedValue" : parseFloat(inverseDistanceNormalized) * parseFloat(aPoint.knownPoint.properties.square_density) ,
            };


          });

          // the estimated values
          estimatedValue = estimationMetrix.knownNeighbours.reduce((accumulator,item) => accumulator + parseFloat(item.weightedValue) , 0 );
        }
      
      }

      estimatedValue = parseFloat(toFixed2(estimatedValue , 2 )) ;

      // update the density of the estimate
      grid.features[point.properties.area_index].properties.density = estimatedValue; // set the density
    
      densities.push(estimatedValue); // mutate it !!      
    }
  }
  
  return [grid , densities ] ;
}

const mmmestimates = (list , cellSide , grid , hexGridCenters , influenceZones, extrapolation , densities ) => {

  let pointsToEstimate = list ;

  //+++ @TODO away with this ?
  let mmmKnowCenters = [] ;
  let mmmCentersDensities = {};
  grid.features.forEach( (f , fIndex) => {
    if(f.properties.density > 0 ) {
      var center = turf.centerOfMass(f);
      var coord = center.geometry.coordinates

      // console.log('coord >>>>>' , coord );
      mmmKnowCenters.push(coord);
      mmmCentersDensities[coord.join('')] = f.properties.density ; // bidings
    }
  });
  if(mmmKnowCenters.length){
    mmmKnowCenters = turf.points(mmmKnowCenters) ;
    //console.log('mmmCentersDensities >>>>>' , mmmCentersDensities );
  }
  //END+++ away with this ?

  
  if(pointsToEstimate.length){
    for (let point of pointsToEstimate) {
      let estimatedValue = 0 ;

      var center = turf.centerOfMass(grid.features[point]);
      let centerCoord = center.geometry.coordinates ;
      var radius = extrapolation * cellSide ;


      // @important we could make step 4 in case we want only rectangle type forcasting base on influence zone
      let circle = turf.circle(centerCoord, radius, {
        steps: 10, // OEM steps: 10,
        units: 'kilometers' // kilometers | miles
      });

      /* @TODO implement condition...
      if(mmmKnowCenters.features.length){

      }
      */
      
      var neighbourKnowValuePoints = turf.pointsWithinPolygon(mmmKnowCenters, circle); // these point  

      let estimationMetrix = {
        "pointToEstimate" : point ,
        "knownNeighbours" : [] 
      };


      if(neighbourKnowValuePoints && neighbourKnowValuePoints.features.length){ // we found know value nearby
        
        let sumOfinverseDistances = 0 ; // weights
        neighbourKnowValuePoints.features.forEach(knowNeighbour => {
          // OEM var distance = turf.distance(turf.point(point.geometry.coordinates) , turf.point(knowNeighbour.geometry.coordinates), {units: 'kilometers'}); // @TODO make unit configurable
          var distance = turf.distance(turf.point(centerCoord) , turf.point(knowNeighbour.geometry.coordinates), {units: 'kilometers'}); // @TODO make unit configurable
          // OEM var inverseDistance = 1/parseFloat(distance); // AKA weight // @TODO do we need to add a "power coeficient" ? DDL has 2.3
          const exponent = 2.3 ; // magic number... found in DDL 7 | alternative snippets Math.pow(base, exponent) or base ** exponent
          var inverseDistance = 1/parseFloat(Math.pow(distance ,exponent )); // AKA weight // @TODO do we need to add a "power coeficient" ? DDL has 2.3
          // inverseDistance = parseFloat(this.roundIt(inverseDistance , 4 )) ; // @TODO make rounding configurable ?? !IMPORTANT note javascript does reprensent large number in exponatial notation

          sumOfinverseDistances += parseFloat(sumOfinverseDistances) + parseFloat(inverseDistance) ;

          estimationMetrix.knownNeighbours.push({
            "knownPoint" : knowNeighbour ,
            "distance" : parseFloat(distance),
            "inverseDistance" : parseFloat(inverseDistance), // AKA weight
          });

          // console.log('knowNeighbour  >>>>>', knowNeighbour );
        });

        
        // normalized inverse distances
        if(sumOfinverseDistances > 0 ){
          // let calulate the weight and normalize them
          estimationMetrix.knownNeighbours = estimationMetrix.knownNeighbours.map((aPoint) => {

            let inverseDistanceNormalized = parseFloat(aPoint.inverseDistance) / parseFloat(sumOfinverseDistances) ;
            let theDensity = mmmCentersDensities[aPoint.knownPoint.geometry.coordinates.join('')];
            //console.log('aPoint.knownPoint >>>>>>>', theDensity ) ;
            return {
              "knownPoint" : aPoint.knownPoint ,
              "distance" : aPoint.distance,
              "inverseDistance" : aPoint.inverseDistance,
              "inverseDistanceNormalized" : inverseDistanceNormalized,
              "weightedValue" : parseFloat(inverseDistanceNormalized) * parseFloat(theDensity) ,
            };


          });

          // the estimated values
          estimatedValue = estimationMetrix.knownNeighbours.reduce((accumulator,item) => accumulator + parseFloat(item.weightedValue) , 0 );

          // console.log('estimatedValue >>>>>>>', estimatedValue );
        }

      }

      if(estimatedValue){
        estimatedValue = parseFloat(toFixed2(estimatedValue , 2 ));
      }

      // update the density of the estimate
      grid.features[point].properties.density = estimatedValue; // set the density
      densities.push(estimatedValue);
      
    }
  }

  return [grid , densities ] ;

}



// return grid in matrix form
const hexGridToMatrixPointers = (grid) => {
  let gridMatrix = [] ;
  let rows = [] ;

  grid.features.forEach( (f , fIndex) => {
    let rowIndex = rows.length ;
    let colIndex = gridMatrix.length ;
    let pointer = {};

    pointer.rowIndex = rowIndex ;
    pointer.colIndex = colIndex ;
    pointer.gridIndex = fIndex ;

    rows.push(pointer);

    let current = grid.features[fIndex].geometry.coordinates[0][0][0] ;
    let next = grid.features[fIndex+1] ? grid.features[fIndex+1].geometry.coordinates[0][0][0] : null ;
    if(current != next  && next != null ){
      gridMatrix.push(rows);
      rows = [] ; // reset
    }

  });

  return gridMatrix ;
}


const influencedZones = (hexGrid , gridMatrix , extrap) => {

  let indexes = [] ;

  gridMatrix.forEach((row , rowIndex) => {
    row.forEach((col , colIndex) => { // pointer as col

      if(hexGrid.features[col.gridIndex] && hexGrid.features[col.gridIndex].properties.density > 0 ){ // known value
        
        // expand selection latterals
        let theRow = col.rowIndex ;

        let minRow = col.colIndex - extrap ;
        let maxRow = col.colIndex + extrap ;

        // swipe latteral
        for (var i = minRow ; i <= maxRow; i++) {
          const theCol = i;
          if(gridMatrix[theCol] && gridMatrix[theCol][theRow] && hexGrid.features[gridMatrix[theCol][theRow].gridIndex].properties.density < 1 && i != col.colIndex  ){ // within bound
            // :-) hexGrid.features[gridMatrix[theCol][theRow].gridIndex].properties.density = 2 ;
            indexes.push(gridMatrix[theCol][theRow].gridIndex);
          }

        }

        // swipe top
        let rowIndexTop = col.rowIndex ;
        let newMinTop = parseInt(minRow);
        let newMaxTop = parseInt(maxRow);
        for (var y = 1 ; y <= extrap; y++) {
          theRow = rowIndexTop++;
          if(y > 2 && (y % 2) === 0  ){
            newMinTop++;
            newMaxTop--;
          }
          for (var i = newMinTop ; i <= newMaxTop; i++) {
            const theCol = i;
            if(gridMatrix[theCol] && gridMatrix[theCol][theRow] && gridMatrix[theCol][theRow] && hexGrid.features[gridMatrix[theCol][theRow].gridIndex].properties.density < 1 ){ // within bound
              indexes.push(gridMatrix[theCol][theRow].gridIndex);
            }
          }
        }

        // swipe bottom
        let rowIndexBot = col.rowIndex ;
        let newMinBot = parseInt(minRow);
        let newMaxBot = parseInt(maxRow);
        for (var y = 1 ; y <= extrap; y++) {
          theRow = rowIndexBot--;
          if(y > 2 && (y % 2) === 0  ){
            newMinBot++;
            newMaxBot--;
          }
          for (var i = newMinBot ; i <= newMaxBot; i++) {
            const theCol = i;
            if(gridMatrix[theCol] && gridMatrix[theCol][theRow] && gridMatrix[theCol][theRow] && hexGrid.features[gridMatrix[theCol][theRow].gridIndex].properties.density < 1 ){ // within bound
              indexes.push(gridMatrix[theCol][theRow].gridIndex);
            }
          }
        }

      }

    });
  });

  return [...new Set(indexes)] ; // unique values
}


export const yieldMap = async ({aDataMatrix = null , scaleType = "linear" , gridType = null , thePromptsAndOptions = [] , theGeoFilter = [] } = {} ) => {
  
  const {getState , dispatch} = store ;
  let state = getState() ;

  let mapData = {
    matrixId : matriceConfig.id,
    capturedInputs : Inputs.capturedInputs,
    capturedFilters : Inputs.capturedFilters,
    scaleType,
    gridType
  } ;

  handleTogglePleaseWait(true);

  // @TODO map loader progress display...
  let data = await axios.post(
    `${apiBaseUrl()}/api/explorer/maps/compute_yield_map_data`, // @TODO url as axios global config
    mapData,
    {
      headers: {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${state.auth.user.token}`
      }
    }
  ).then( (response) => { // success reponse

    handleTogglePleaseWait(false);
    // console.log('response........' , response );
    store.dispatch(MapDesignActions.setIsMapRefreshDue(false));
    store.dispatch(MapDesignActions.setTotalRecord(response.data.points.features.length));

    
    return response.data ;

  }).catch((error) => {
    console.log(error);
  });

  // console.log('data <<<<<<<<<<>', data ); return false ;


  let steps = getRange(data.maxDensity , data.minDensity , 5);

  // the color gradient bar
  let colorRange = [
    '#0002fd' , // strong blue index -> relative low // @TODO fix the relative associated meanings
    '#00fffc' , // light blue index -> relative mid-low
    '#008300' , // strong green index -> relative mid-low
    '#fefc01' , // yellow index -> [relative high
    '#ff0501'  // red index -> relative high]
  ];


  let scale = d3.scaleLinear(steps, colorRange );

  let width = LEGEND_WIDTH ;
  let isLogScale = false ; // @TODO compute ...

  let matchExpression = ['match', ['get', 'density']];

  data.densities.forEach((uniqueDensity) => {
    let rgbColor =  scale(uniqueDensity);  // default linear
    if(scaleType == 'logarithm'){ // swtich to log color, only the color remain linear only the x-axis unit change , hence giving a diffenrent color to map value

    }

    // OEM matchExpression.push(String(uniqueDensity) ,  hexColor );
    // OEM matchExpression.push(uniqueDensity ,  hexColor );
    matchExpression.push(`${uniqueDensity}` ,  rgbColor ); // parse values to srting to meet mapboxgl constrain only allow 'string' , integer

  });
  matchExpression.push('#ffffff');

  
  // render map layers...

  // Hexgrid layer
  if(!mapboxMap.map.getSource('hexgrid-source')){
    // add hexgrid layer
    mapboxMap.map.addSource('hexgrid-source', {
      'type': 'geojson',
      'data': data.hexGrid,
      'generateId' : true
    });


  }else{ // the source already exist

    mapboxMap.map.getSource('hexgrid-source').setData(data.hexGrid);
  }

  if (!mapboxMap.map.getLayer('grid-layer')) {


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

    store.dispatch(MapDesignActions.setShowGrid(data.meta.IsShowGrid == 'Yes'));
  
  }else{

    mapboxMap.map.setPaintProperty( 'grid-layer', 'fill-color', matchExpression );
  }




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
        'circle-color': 'red', // red | black
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


  //+++ test BBOX

  // Add a new layer to visualize the polygon.
  //+++++++++++ test bbox layer
  // var mmmbboxPoly = turf.bboxPolygon(data.bbox);
  // var mmmbboxPoly = turf.bboxPolygon(data.mmmbox);
  console.log('datammmbox >>>>>>>>>>>>>>>>>>>', data.bboxPoly );
  //var mmmbboxPoly = turf.bboxPolygon(data.mmmbox);
  //console.log('mmmbboxPoly >>>>>>>>>>>>>>>>>>>', data.mmmbox );
  
  
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
        'visibility' : 'none' // visible | none
      },
      'paint': {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.9
      }
    });

  }else{
    mapboxMap.map.getSource('mmm10').setData(data.bboxPoly);
  }


  console.log('datammmpoint<<<<<<<<<<' , data.mmmpoint );
  if(!mapboxMap.map.getSource('mmm11')){

    mapboxMap.map.addSource('mmm11', {
      type : 'geojson',
      data: data.mmmpoint
    });

    mapboxMap.map.addLayer({
      'id': 'mmm11_layer',
      'type': 'circle',
      'source': 'mmm11', // reference the data source
      'layout': {
        'visibility' : 'none' // visible | none
      },
      'paint': {
        'circle-radius': 3, // OEM 4
        'circle-stroke-width': 2,
        'circle-color': 'black', // red | black
        'circle-stroke-color': 'white' // OEM 'white' | yellow
      }
    });

  }else{
    mapboxMap.map.getSource('mmm11').setData(data.mmmpoint);
  }

  

  //+++++++++++ END test bbox layer

  
  // console.log('mmmbboxPoly ><>>>>>', mmmbboxPoly );
  //+++ test BBOX

  
  // fly to view  (the bellow `fitBounds` is handling the flying to location for now... )
  /*OEM :-)
  mapboxMap.map.flyTo({
    center: data.meta.mapCentreCoord ,

    // duration: 12000, // Animate over 12 seconds
    essential: true // This animation is considered essential with //respect to prefers-reduced-motion
    zoom : 3.66 // @TODO caluclate ?
  });
  */
  

  const v2 = new mapboxgl.LngLatBounds( data.meta.mapBoundCoordSW , data.meta.mapBoundCoordNE );
  
  // console.log('mapBoundCoordSW , mapBoundCoordNE>>>> 1' , typeof data.meta.mapBoundCoordSW , typeof data.meta.mapBoundCoordNE );
  console.log('bounds >>>>>> 1' , v2);


  mapboxMap.map.fitBounds( v2 , {
    padding: 50
  });
  
  store.dispatch(MapDesignActions.setMapBoundCoord({boundCoordSW : data.meta.mapBoundCoordSW , boundCoordNE : data.meta.mapBoundCoordNE , }));
  


  // console.log('data.bbox  >>>>', data.bbox );

  /* @TODO
  mapboxMap.map.fitBounds( data.bbox , {
    padding: 20
  });
  */



  /* bound snips :-) 

  const v1 = new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(-73.9876, 40.7661),
    new mapboxgl.LngLat(-73.9397, 40.8002)
  );
  
  const v2 = new mapboxgl.LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);

  const v3 = [[-73.9876, 40.7661], [-73.9397, 40.8002]];

  mapboxMap.map.fitBounds(v3, {
    padding: 20
  });
  */
  

  return { steps , colorRange} ;

}


export const toggleOffCanvasLabelsAndPrompts = (status) => {
  let direction = status == "on" ? true : false ;
  store.dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptLabels(direction));
  store.dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptInputs(direction));
}


// @TODO deprecate this
export const loadPromptsDefaultsDeprecated = () => {

  const {getState , dispatch} = store ;
  let state = getState() ;
  
  let defaultValues = mapboxMap.promptsAndDefaultValues ;

  // set captured values
  mapboxMap.promptsAndCapturedValues = {...defaultValues};

  let groupedFields = [...state.dashboard.promptsAndOptionsGrouped] ;

  for (const [fieldIndex, field] of Object.entries(defaultValues)) {


    //+++ update input option selected

    let {ref} = Inputs.selectoRefs.find(ref => ref.fieldName == field.name );

    let selectedDomItems = [] ; // reset
    if(field.prompt_type == 'select' || field.prompt_type == 'multiselect' ){ // @TODO add image support

      field.values.forEach((selectedOptionId) => {
        let optionPath = `${field.fieldUniqueName}__${selectedOptionId}` ; 
        let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);
        
        // mark selection
        selectedDomItem.classList.add("selected");
        selectedDomItems.push(selectedDomItem);
      });

      // set selection
      ref.setSelectedTargets(selectedDomItems) ;

    }else if(field.prompt_type == 'text'){

      let domItem = document.querySelector(`[id="txt-${field.fieldUniqueName}"]`);
      domItem.value = field.value
    }

    //+++END update input option selected






    //+++ update label selected
    groupedFields = groupedFields.map((group , groupIndex) => {

      return {
        ...group,
        fields: group.fields.map((aField , aFieldIndex) => {
          
          if(aField.name == field.fieldUniqueName ){

            if(["select" , "multiselect"].includes(field.prompt_type)){

              let selectedValues = field.values.map(val => { // translate values into textual content // @TODO precompute textual content ?
                return aField.options.find(option => option.id == val ); // @TODO handle what todo if selected value not found!!
              });

              return {
                ...aField,
                capturedValue: selectedValues // @TODO preformat this into a string that can be displaye onto datatable
              };

            }else if(field.prompt_type == "text"){

              return {
                ...aField,
                value: field.value // @TODO preformat this into a string that can be displaye onto datatable
              };

            }else{ // default (no change)
              return {...aField}
            }
                
          }

          return aField ;

        })
      }

    });
    //+++ update label selected

  }

  dispatch(DashboardActions.setPromptsAndOptionsGrouped(groupedFields));

}


export const inputCapture = (values , pathName) => {
  if(values.length){
    Inputs.capturedInputs[pathName] = values
  }else{
    delete Inputs.capturedInputs[pathName];
  }
}

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

export const filterCapture = (values , pathName , fieldDetail) => {

  const {dispatch} = store ;

  if(values.length){
    Inputs.capturedFilters[pathName] = {
      values,
      filterOperator : getFilterOperator(fieldDetail),
      type: fieldDetail.data_type,
      field : fieldDetail.realName ,
      displayLabel: fieldDetail.display_label
    }
  }else{
    delete Inputs.capturedFilters[pathName];
  }

  // global filters +++
  let filters = [] ;
  for (var key in Inputs.capturedFilters) {
    var filter = Inputs.capturedFilters[key]; 
    filter.path_name = key ;
    filters.push(filter);
  }

  dispatch(MapDesignActions.setFilters(filters));
  // END global filters +++

}

// @TODO filter capture...

// initial loading off default selected values only target field that are not computed, computed field will load on demand
// @TODO rename to presetPromptDefaults
export const loadPromptsDefaults = () => {

  const {getState , dispatch} = store ;
  let state = getState() ;

  state.explorer.prompts.forEach(prompt => {
    if( prompt.options != 'compute'){

      let defaultValues = null ;

      if(prompt.prompt_type == "select" || prompt.prompt_type == 'multiselect' ){
        
        if(prompt.defaultSelected.length){

          let selectedDomItems = [] ; // reset
          defaultValues = [...prompt.defaultSelected];

          // update ui/dom
          let {ref} = Inputs.selectoRefs[prompt.path_name] ;

          defaultValues.forEach((selectedOptionId) => {
            let optionPath = `${prompt.path_name}__${selectedOptionId}` ; 
            let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);

            // mark selection
            selectedDomItem.classList.add("selected");
            selectedDomItems.push(selectedDomItem);
          });

          inputCapture(defaultValues , prompt.path_name);

          // set selection
          ref.setSelectedTargets(selectedDomItems);

        }
      }else if(prompt.prompt_type == "text"){
        if(prompt.value){
          // OEM defaultValues = prompt.value ;
          defaultValues = prompt.value.toString();
          inputCapture(defaultValues , prompt.path_name);

          // update ui/dom
          let domItem = document.querySelector(`[id="txt-${prompt.path_name}"]`);
          domItem.value = defaultValues ;
        }
      }

      // data these reference and do something with it....
      if(defaultValues){
        labelsUpdate(prompt.path_name , defaultValues) ;
      }

    }
  });

}

// 
export const presetPrompts = () => {
  const {getState , dispatch} = store ;
  let state = getState() ;

  if(Inputs.capturedInputs && Object.keys(Inputs.capturedInputs).length > 0 ){
    for (var pathName in Inputs.capturedInputs) {
      
      const prompt = state.explorer.prompts.find( prompt => prompt.path_name == pathName );

      if( prompt.options != 'compute'){

        let selectedValues = null ;

        if(prompt.prompt_type == "select" || prompt.prompt_type == 'multiselect' ){

          if(Inputs.capturedInputs[pathName].length){

            let selectedDomItems = [] ; // reset
            selectedValues = [...Inputs.capturedInputs[pathName]];

            // update ui/dom
            let {ref} = Inputs.selectoRefs[prompt.path_name] ;

            selectedValues.forEach((selectedOptionId) => {
              let optionPath = `${prompt.path_name}__${selectedOptionId}` ; 
              let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);

              // mark selection
              selectedDomItem.classList.add("selected");
              selectedDomItems.push(selectedDomItem);
            });
            inputCapture(selectedValues , prompt.path_name); // @TODO this no longer neccessary here, since with merged already the incomming inputs ?
            // set selection
            ref.setSelectedTargets(selectedDomItems);
          }
        }else if(prompt.prompt_type == "text"){
          if(prompt.value){
            selectedValues = Inputs.capturedInputs[pathName];
            inputCapture(selectedValues , prompt.path_name); // @TODO this no longer neccessary here, since with merged already the incomming inputs ?

            // update ui/dom
            let domItem = document.querySelector(`[id="txt-${prompt.path_name}"]`);
            domItem.value = selectedValues ;
          }
        }

        if(selectedValues){
          labelsUpdate(prompt.path_name , selectedValues) ;
        }
      }
    }
  }

}


export const presetPrompt = (data) => {

  const prompt = data.prompt.detail.row ;
  const pathName = prompt.path_name ;
  let selectedValues = null ;

  if(Inputs.capturedInputs && Inputs.capturedInputs[pathName] && Inputs.capturedInputs[pathName].length){

    if(prompt.prompt_type == "select" || prompt.prompt_type == 'multiselect' ){

      let selectedDomItems = [] ; // reset
      selectedValues = [...Inputs.capturedInputs[pathName]];

      // update ui/dom
      let {ref} = Inputs.selectoRefs[prompt.path_name] ;

      selectedValues.forEach((selectedOptionId) => {
        let optionPath = `${prompt.path_name}__${selectedOptionId}` ; 
        let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);

        // mark selection
        selectedDomItem.classList.add("selected");
        selectedDomItems.push(selectedDomItem);
      });

      // inputCapture(selectedValues , prompt.path_name); // @TODO this no longer neccessary here, since with merged already the incomming inputs ?
      // set selection
      ref.setSelectedTargets(selectedDomItems);

    }else if(prompt.prompt_type == "text"){
      selectedValues = Inputs.capturedInputs[pathName];
      // inputCapture(selectedValues , prompt.path_name); // @TODO this no longer neccessary here, since with merged already the incomming inputs ?
      // update ui/dom
      let domItem = document.querySelector(`[id="txt-${prompt.path_name}"]`);
      domItem.value = selectedValues ;
    }

    if(selectedValues){
      labelsUpdate(prompt.path_name , selectedValues) ;
    }

  }

}


export const labelsUpdate = (pathName , values) => {

  const {getState , dispatch} = store ;
  let state = getState() ;

  let groupedFields = [...state.explorer.groupedPrompts] ;

  groupedFields = groupedFields.map((group , groupIndex) => {
    return {
      ...group,
      fields: group.fields.map((field , fieldIndex) => {
        if(field.path_name == pathName ){

          if(values.constructor === Array){

            const thePrompt = state.explorer.prompts.find( prompt => prompt.path_name == pathName );

            if(thePrompt){

              values = values.map(val => {
                return thePrompt.options.find(option => option.id == val );
              });

              return {
                ...field,
                capturedValue: values // @TODO preformat this into a string that can be displaye onto datatable
              };
            }

          }else{

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
  
  dispatch(ExplorerActions.setGroupedPrompts(groupedFields));

}


export const handleOpenSavedMap = async (mapId) => {

  const {getState , dispatch} = store ;
  let state = getState() ;

  let savedMap = state.dashboard.savedMaps.find(map => map.id == mapId );
  let plotingOption = 'map' ;
  let dataMatrix = state.dashboard.dataMatrices.find(matrix => matrix.id == savedMap.analytical_model_base_id ); // @TODO watchout when the map base it refreshed

  Inputs.capturedInputs = JSON.parse(savedMap.map_prompts_data);
  Inputs.capturedFilters = JSON.parse(savedMap.map_filter_data);
  
  await startCreateNewAnalysis(plotingOption , dataMatrix ) ; // @TODO this call should not include state and dispatch

    // OEM let scaleType = this.props.scaleType ;
    let scaleType = 'linear' ; // @TODO compute scale type from inputs
    const {steps , colorRange} = await yieldMap({scaleType});
    dispatch(MapDesignActions.setLegendData({steps, colorRange}));

    // @TODO populate UI with pre-captured data

    dispatch(MatricesActions.setSelectedMatrice(dataMatrix));
    dispatch(DashboardActions.setSelectedPlotingOption(plotingOption));

    await presetPrompts();

  setTimeout( async () => { // @TODO make this a callback...

  } , 1000);



}


export const toggleFilters = (e , status ) => {

  const {dispatch} = store ;

  dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptInputs(status));
  dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptLabels(status));

  setTimeout(() => { // @TODO fix artifact , default scrolls are showing during animation, we could overflow hidden prior to custom scroll being attachables
    // setup gui stuff
    attachCustomScrolls();

  } , 300 ); // @TODO on offcanvas displayed callback ?

}


export const getSelectionDetails = (pathName , humanize = true ) => {

  const state = store.getState();
  // const prompts = [...state.explorer.prompts] ; // @TODO rather use the non mutated prompts (no filtered applied....) ?

  const prompt = state.explorer.prompts.find( prompt => prompt.path_name == pathName );

  let selectionDetails ;

  if(["select" , "multiselect"].includes(prompt.prompt_type)){


    selectionDetails = Inputs.capturedInputs[pathName].map(val => {
      return prompt.options.find(option => option.id == val ); 
    });
    

    if(humanize){
      selectionDetails = selectionDetails.map(option => option.label).join(', ');
    }

  }else{ // assumed text... return the capture text value
    
    selectionDetails = Inputs.capturedInputs[pathName] ;

  }

  
  return selectionDetails ;

}

export const handleTogglePleaseWait = (status) => {
  store.dispatch(ExplorerActions.setPleaseWait(status));
}