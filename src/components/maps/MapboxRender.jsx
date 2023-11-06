import React, { useContext, useEffect, useRef, useState } from "react";
import { MapboxExportControl, Size, PageOrientation, Format, DPI} from "@watergis/mapbox-gl-export";
import '@watergis/mapbox-gl-export/css/styles.css';
import { useSelector } from "react-redux";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css' ;
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';

import * as d3 from "d3";

import mapboxMap from "../../configs/mapBox";
import { mapContext } from "./context/mapContext";
import Popup from "./Popup";
import PopupContent from "./PopupContent";
import { ACCESS_TOKEN_MAPBOX , MAPBOX_DEFAULT_CENTER , MAPBOX_DEFAULT_ZOOM , LEGEND_WIDTH  } from "../../utilities/constant";
import { store } from "../../redux";
import { MapDesignActions  } from "../../redux/actions";
import {yieldMap } from "../Common";


const {getState , dispatch} = store ;
// OEM let state = getState() ; this state never get updated!
const MapboxRender = ({resetTime}) => {

	const [content, setContent] = useState([]);
  const [popupLngLat, setPopupLngLat] = useState(null);
  const { setMap, map } = useContext(mapContext);
  const mapContainer = useRef(null);
  const selectedSavedMapId = useSelector((state) => state.mapdesign.selectedSavedMapId);

	
	function onPopupClose() {
    setContent([]);
    setPopupLngLat(null);
  }


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
  

  const classocide = (el) => {
    var prefix = "ddl-custom-cursor";
    var classes = el.className.split(" ").filter(function(c) {
      return c.lastIndexOf(prefix, 0) !== 0;
    });
    el.className = classes.join(" ").trim();
    return el ;
  }

	
	const initializeMap = ({ setMap, mapContainer }) => {

    //+++ selected map
    // const selectedSavedMapId = useSelector((state) => state.mapdesign.selectedSavedMapId);

    // console.log('selectedSavedMapId>>>', selectedSavedMapId);
    //+++


    mapboxMap.map = new mapboxgl.Map({
      // OEM container: 'mapbox-map', // container id
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: MAPBOX_DEFAULT_CENTER ,
      zoom: MAPBOX_DEFAULT_ZOOM ,
      // bearing : 70 , // AKA heading -> facing direction
      preserveDrawingBuffer: true, // useful for exporting... ?
      pitch: 0,
      "paint": {
        "fill-color": "#00ffff"
      }
    });

    mapboxMap.draw = new MapboxDraw({
      userProperties: true,
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle: DrawRectangle,
      },
      displayControlsDefault: false 
    });
    // bind it
    mapboxMap.map.addControl(mapboxMap.draw) ;

    // handle drawings
    mapboxMap.map.on('draw.create', async (e) => {

      // @TODO merge geometry ?
      
      const data = mapboxMap.draw.getAll();

      if (data.features.length > 0) {

        // @TODO get scale state
        const {steps , colorRange} = await yieldMap({geoFilter: data });
        dispatch(MapDesignActions.setLegendData({steps, colorRange}));
        dispatch(MapDesignActions.setGeoFilterBox(data));
      }

    });

    mapboxMap.map.on('draw.update', (e) => {
      
    });

    mapboxMap.map.on('draw.delete', (e) => {
      
    });






    mapboxMap.map.addControl(new MapboxExportControl({
      accessToken: ACCESS_TOKEN_MAPBOX
    }), 'top-right');

    mapboxMap.map.on("load", () => {
      setMap(mapboxMap.map);
    });


    mapboxMap.map.on('load', () => {
      mapboxMap.map.resize();
      mapboxMap.map.setPaintProperty('water', 'fill-color', '#9ab2cb');
      mapboxMap.map.setPaintProperty('water', 'fill-opacity', 1);
    });



    mapboxMap.map.doubleClickZoom.disable(); // snip map.doubleClickZoom.isEnabled() -> false // // disable double click zoom
    mapboxMap.map.setRenderWorldCopies(true);

    mapboxMap.map.on('wheel', (e) => { //@TODO mobile support on pinch
      dispatch(MapDesignActions.setMapZoom(mapboxMap.map.getZoom()));
    });


    mapboxMap.map.on('mousemove', (e) => {

      let x =  e.point.x;
      let y =  e.point.y;

      let longLat = e.lngLat.wrap();

      dispatch(MapDesignActions.setMapLong(longLat.lng));
      dispatch(MapDesignActions.setMapLat(longLat.lat));
      dispatch(MapDesignActions.setMapXY({x , y }));

    });

    
    // handle show grid tooltips
    mapboxMap.map.on('mousemove' , 'grid-layer', (e) => {

      //+++ change cursor
      // mapboxMap.map.getCanvas().style.cursor = 'pointer';
      classocide(mapboxMap.map.getCanvas()).classList.add("ddl-custom-cursor-select");
      //+++ END change cursor


      let density = e.features[0].properties.density ;

      if(density > 0){
        dispatch(MapDesignActions.setShowLegendToolTip({show:true , trigger : 'grid' }));
        dispatch(MapDesignActions.setValueTooltip(e.features[0].properties.density));
        dispatch(MapDesignActions.setOffsetTooltip(scaleLinearOnUnit()(density)));
        dispatch(MapDesignActions.setBackgroundTooltip(scaleLinearOnColor()(density))); // asking the color trough the unit rather ?
      }else{
        dispatch(MapDesignActions.setShowLegendToolTip({show:false , trigger : 'grid' }));
      }

      /*
      // @TODO deprecate this bellow...
      if(e.features[0].properties.density){
        document.getElementById("value-info-mmm").innerHTML = e.features[0].properties.density ;
      }
      */

    }).on('mouseout' , 'grid-layer', (e) => {

      //+++ change cursor
      // OEM mapboxMap.map.getCanvas().style.cursor = '';
      classocide(mapboxMap.map.getCanvas()).classList.remove("ddl-custom-cursor-select");
      //+++ END change cursor

      dispatch(MapDesignActions.setShowLegendToolTip({show:false , trigger : 'grid' }));

    });



    // event bindings
    mapboxMap.map.on('dblclick' , 'grid-layer', (e) => {

      // alert('here');
      console.log('e >>>>>>>>>>>>>>>>>>', e.features[0].properties.density );
      console.log('efeatures>>>>>>>>>>>' , e.features[0] ); 


      const labels = [
        <PopupContent
          key={e.features[0].id}
          // label={e.features[0].properties.density}
          feature={e.features[0]}
        />
      ];


      setContent(labels);
      setPopupLngLat(e.lngLat);


    });


    /*
    mapboxMap.map.on('zoomend', () => {
      // @TODO use for handle notification after feetbond ?
    });
    */




    /*
    // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
    mapboxMap.map.on('mouseenter', (e) => { console.log("entered>>> in");
      // mapboxMap.map.getCanvas().style.cursor = 'pointer';
      classocide(mapboxMap.map.getCanvas()).classList.add("ddl-custom-cursor-select");
    });
     
    // Change it back to a pointer when it leaves.
    mapboxMap.map.on('mouseleave', (e) => { console.log("entered>>> out");
      //mapboxMap.map.getCanvas().style.cursor = '';
      // classocide(mapboxMap.map.getCanvas()).classList.add("ddl-custom-cursor-select");
      mapboxMap.map.getCanvas().style.cursor = 'pointer';
    });

    mapboxMap.map.on('mousemove', (e) => {
      // console.log('mmmm>>>' , JSON.stringify(e.point));
    });
    */


 

  };


	mapboxgl.accessToken = ACCESS_TOKEN_MAPBOX ;


  useEffect(() => {

    if (!map) initializeMap({ setMap, mapContainer });

  }, [map, setMap]);


	

	return (

		<>
      {popupLngLat && (
        <Popup lngLat={popupLngLat} onClose={onPopupClose} popupClassesExtras="map-popup" >
          {content}
        </Popup>
      )}
      <div id="mapbox-map" className="mapbox-map" ref={(el) => (mapContainer.current = el)} />

    </>

	);


}

export default MapboxRender;