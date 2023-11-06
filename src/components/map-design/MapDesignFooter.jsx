import $ from "jquery";
import mapboxgl from 'mapbox-gl';
import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';

import { connect } from "react-redux";
import { MapDesignActions } from "../../redux/actions";

import {
 Nav , Button , Stack , Dropdown
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize , faEdit , faFileArrowUp , faCheck , faCaretUp , faCaretLeft} from '@fortawesome/free-solid-svg-icons';
import {CustomToggler} from "../CustomToggler" ;

import {yieldMap } from "../Common";
import mapboxMap from "../../configs/mapBox";

import {createJsPanel} from '../../configs/jsPanelOptions';
import ConfigColumns from '../ConfigColumns';


class MapDesignFooter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDropGridType : false
    };
  }


  handleOnExportSelect = async (eventKey , e ) => {

    if(eventKey == 'export-geojson' ){

      let scaleType = 'logarithm' ;
      const {steps , colorRange} = await yieldMap({scaleType});
      this.props.setLegendData({steps, colorRange});
      this.props.setScaleType(scaleType);

    }else if(eventKey == 'export-jpeg' ){

      /* setting a scale state
      let scaleType = 'linear' ;
      const {steps , colorRange} = await yieldMap({scaleType});
      this.props.setLegendData({steps, colorRange});
      this.props.setScaleType(scaleType);
      */

      // remove stuffs
      // click pring

      // +++ print and config stuffs
      //document.getElementById("mapbox-gl-export-page-size").selectedIndex = "[297,210]";
      //document.getElementById("mapbox-gl-export-page-orientaiton").selectedIndex = "landscape";
      //document.getElementById("mapbox-gl-export-dpi-type").selectedIndex = "300";
      // document.getElementById("mapbox-gl-export-format-type").selectedIndex = "png"; // snip $('#select').val('defaultValue'); // $('#select').change();
      // +++END print and config stuffs

      $('#mapbox-gl-export-format-type').val('jpg');
      $('#mapbox-gl-export-format-type').change();

      let printButton = document.querySelector('.generate-button') ;
       if(printButton){
        printButton.click();
      }

    }else if(eventKey == 'export-png' ){

      $('#mapbox-gl-export-format-type').val('png').change();
      document.querySelector('.generate-button').click();

    }else if(eventKey == 'export-pdf' ){

      $('#mapbox-gl-export-format-type').val('pdf').change();
      document.querySelector('.generate-button').click();

    }else if(eventKey == 'export-svg' ){

      $('#mapbox-gl-export-format-type').val('svg').change();
      document.querySelector('.generate-button').click();

      setTimeout(() => alert('te') , 500 );

    }else if(eventKey == 'export-csv' ){

      const link = document.getElementById('btn_export_csv');
      if(link){
        link.click();
      }
    }




  }

  handleOnExportToggle = (nextShow , meta) => {

  }

  handleOnTweakViewSelect = async (eventKey , e ) => {

    if(eventKey == 'tweak-view-log-scale' ){

      let scaleType = 'logarithm' ;
      const {steps , colorRange} = await yieldMap({scaleType , fit:false });
      this.props.setLegendData({steps, colorRange});
      this.props.setScaleType(scaleType);

    }else if(eventKey == 'tweak-view-linear-scale' ){

      let scaleType = 'linear' ;
      const {steps , colorRange} = await yieldMap({scaleType , fit:false });
      this.props.setLegendData({steps, colorRange});
      this.props.setScaleType(scaleType);

    }else if(eventKey == 'tweak-view-toggle-show-data-point' ){

      if(this.props.showDataPoints){
        mapboxMap.map.setLayoutProperty('records-layer', 'visibility', 'none');
      }else{
        mapboxMap.map.setLayoutProperty('records-layer', 'visibility', 'visible');
      }

      this.props.setShowDataPoints(!this.props.showDataPoints);

    }else if(eventKey == 'tweak-view-toggle-show-grid' ){

      if(this.props.showGrid){
        //mapboxMap.map.setLayoutProperty('grid-layer', 'visibility', 'none');
        mapboxMap.map.setPaintProperty('grid-layer', 'fill-outline-color', 'transparent' );
      }else{
        // mapboxMap.map.setLayoutProperty('grid-layer', 'visibility', 'visible');
        mapboxMap.map.setPaintProperty('grid-layer', 'fill-outline-color', 'black' );
      }

      this.props.setShowGrid(!this.props.showGrid);

    }else if(eventKey == 'tweak-view-add-geofilter' ){

      this.props.setIsDrawingGeoFilter(true);
      
      //mapboxMap.draw.changeMode('drag_circle');
      mapboxMap.draw.changeMode('draw_rectangle');

    }else if( eventKey == 'tweak-view-do-square-grid'){

      const {steps , colorRange} = await yieldMap({gridType : "square" });
      this.props.setLegendData({steps, colorRange});

    }else if( eventKey == 'tweak-view-do-hexagone-grid'){

      const {steps , colorRange} = await yieldMap({gridType : "hexagone" });
      this.props.setLegendData({steps, colorRange});
    }

  }

  handleOnTweakViewToggle = (nextShow , meta) => {
    // whatch for Drop Toggles ?
  }

  handleToggleDataVisual = (eventKey , event) => {

    if(eventKey == 'tabs_toggle_map-designer'){

      this.props.toggleMapView(`tabs_toggle_map-designer`);

    }else if(eventKey == 'tabs_toggle_map-datatable'){

      
      /* OEM
      window.jQuery('.matrix-data-table-view-wrapper').mCustomScrollbar({
       theme: "light",
       axis:"yx",
       // OEM setHeight: 200, // @TODO calculate and make responsive ? <---
       setHeight:false,
       // theme:"dark",
       // live: "on" , // <---
       //liveSelector : "matrix-data-table-view-wrapper" , // <---
       scrollEasing : "linear",
       scrollInertia : 0,
       autoDraggerLength : false
      });
      */


      this.props.toggleMapView(`tabs_toggle_map-datatable`);
    }

  }


  handleTweakViewDatatable = (eventKey , event) => {

    createJsPanel(
      "Configure Columns",
      ConfigColumns ,
      true,
      {
        optionsOverwrite:{
          panelSize: "40% 70%",
          footerToolbar: () => {
            return ReactDOMServer.renderToString(
              <>
                <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_columns-clear" > Clear </Button>
                <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_columns-select_all" > Select All </Button>
                <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_columns-cancel" > Cancel </Button>
                <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_config_columns-ok" > ok </Button>
              </>
            );
          }
        }
      }
    );
  }

  handleZoomToMap = (e) => {

    const {mapBoundCoordSW , mapBoundCoordNE } = this.props.mapData ;
    if(mapBoundCoordSW && mapBoundCoordNE){
      const v3Bounds = [mapBoundCoordSW, mapBoundCoordNE];
      mapboxMap.map.fitBounds( v3Bounds , {
        padding: 50
      });
    }

  }

  handleShowDropGridType = (eventKey , e ) => {
    this.setState({showDropGridType: true });
  }

  handleHideDropGridType = (eventKey , e ) => {
    this.setState({showDropGridType: false });
  }

  render() {
    return (
      <Stack direction="horizontal" gap={3} > {/* style={{marginTop : "0.7rem" , marginRight:"0" }} */}

        {/*@TODO make the bellow 2 tabs controls instead*/}
        <div className="col-md-3">

          <div className="">


            <Nav
              fill
              justify
              variant="pills"
              activeKey={this.props.tabKeyToggleMapView}
              className="me-auto ddl-tab-nav-style-strong-blue ddl-nav-line-top"
              defaultActiveKey={this.props.tabKeyToggleMapView}
              onSelect={this.handleToggleDataVisual}
            >
              <Nav.Item >
                <Nav.Link
                  eventKey="tabs_toggle_map-datatable"
                  style={{padding:"5px 0 5px 0"}}
                >

                  Table

                </Nav.Link>
              </Nav.Item>
              <Nav.Item >
                <Nav.Link
                  eventKey="tabs_toggle_map-designer"
                  style={{padding:"5px 0 5px 0"}}
                >

                  Map

                </Nav.Link>
              </Nav.Item>


            </Nav>

          </div>

        </div>



        <div className="ms-auto">
          <Button variant="primary"
            onClick={this.handleZoomToMap}
            className="ddl-button-style-light-blue ddl-no-outline"
          >
            <FontAwesomeIcon icon={faMaximize} className="me-2" /> Zoom to Map
          </Button>
        </div>


        { this.props.isMapDesignerDatatable &&

          <div>
            <Button
              variant="primary"
              className="ddl-button-style-light-blue ddl-no-outline"
              onClick={this.handleTweakViewDatatable}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2" /> Tweak View
            </Button>
          </div>

        }


        <div>

          <Dropdown
            drop="up"
            align="end"
            onSelect={this.handleOnTweakViewSelect}
            onToggle={this.handleOnTweakViewToggle}
            className="ddl-dropdown-nav-strong-blue shadow"
          >
            <Dropdown.Toggle as={CustomToggler} >
              <Button variant="primary" className="ddl-button-style-light-blue ddl-no-outline">
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Tweak View
                <FontAwesomeIcon className="ms-2" icon={faCaretUp} size="1x" style={{fontSize:".8rem"}} />
              </Button>
            </Dropdown.Toggle>

            <Dropdown.Menu
              popperConfig={{
                modifiers : [
                  // see popper modifiers configurations
                  {
                    name: 'offset',
                    options: {
                      offset: [10, 0],
                    },
                  }
                ]
              }}
              renderOnMount={false}
            >
              <Dropdown.Item
                eventKey="tweak-view-toggle-show-data-point"
              >
                <FontAwesomeIcon icon={faCheck} className={`me-2 ${this.props.showDataPoints ? '' : 'fa-blank' }`} />  Show Data Points
              </Dropdown.Item>


              <Dropdown.Item
                eventKey="tweak-view-toggle-grid-type"
              >
                <FontAwesomeIcon icon={faCheck} className={`me-2 ${this.props.showGrid ? '' : 'fa-blank' }`} /> Show Grid
              </Dropdown.Item>


              <Dropdown.Item
                eventKey="event-print"
                className="position-relative"
                onMouseEnter={this.handleShowDropGridType}
                onMouseLeave={this.handleHideDropGridType}
              >
                <FontAwesomeIcon className="position-absolute top-50 start-0 translate-middle" icon={faCaretLeft} size="1x" style={{fontSize:".8rem" , marginLeft: "7px"}} />


                <Dropdown
                  drop="start"
                  show={this.state.showDropGridType}
                  onSelect={this.handleOnTweakViewSelect}
                  onToggle={this.handleOnTweakViewToggle}
                  className="ddl-dropdown-nav-strong-blue"
                  style={{background:"transparent"}}
                  //onMouseEnter={this.handleShowDropPrint}
                  //onMouseLeave={this.handleHideDropPrint}
                >
                  <Dropdown.Toggle as={CustomToggler} style={{background:"transparent"}} >

                    <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Grid Type
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    popperConfig={{
                      modifiers : [
                        // see popper modifiers configurations
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 13],
                          },
                        }
                      ]
                    }}
                    renderOnMount={false}
                  >
                    <Dropdown.Item
                      eventKey="tweak-view-do-square-grid"
                    >
                      <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Square grid
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                      eventKey="tweak-view-do-hexagone-grid"
                    >
                      <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Hexagone grid
                    </Dropdown.Item>

                  </Dropdown.Menu>
                </Dropdown>








              </Dropdown.Item>



              <Dropdown.Item
                eventKey="tweak-view-toggle-keep-base-map"
              >
                <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Keep Base Map
              </Dropdown.Item>


              <Dropdown.Divider />

              {/* @TODO make `scaleType` values enum or constants */}

              <Dropdown.Item
                eventKey="tweak-view-linear-scale"
              >
                <FontAwesomeIcon icon={faCheck} className={`me-2 ${this.props.scaleType == 'linear' ? '' : 'fa-blank' }`} />  Linear Scale

              </Dropdown.Item>


              <Dropdown.Item
                eventKey="tweak-view-log-scale"
              >
                <FontAwesomeIcon icon={faCheck} className={`me-2 ${this.props.scaleType == 'logarithm' ? '' : 'fa-blank' }`} /> Log Scale
              </Dropdown.Item>


              <Dropdown.Divider />

              <Dropdown.Item
                eventKey="tweak-view-add-geofilter"
              >
                <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Geofilter
              </Dropdown.Item>


              <Dropdown.Item
                eventKey="event2"
              >
                <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Clear Geofilter
              </Dropdown.Item>


            </Dropdown.Menu>
          </Dropdown>


        </div>

        <div >

          <Dropdown
            drop="up"
            align="end"
            onSelect={this.handleOnExportSelect}
            onToggle={this.handleOnExportToggle}
            className="ddl-dropdown-nav-strong-blue shadow"
          >
            <Dropdown.Toggle as={CustomToggler} >
              <Button
                variant="primary"
                className="ddl-button-style-light-blue ddl-no-outline"
              >
                <FontAwesomeIcon icon={faFileArrowUp} className="me-2" /> Export
                <FontAwesomeIcon className="ms-2" icon={faCaretUp} size="1x" style={{fontSize:".8rem"}} />
              </Button>

            </Dropdown.Toggle>

            <Dropdown.Menu
              popperConfig={{
                modifiers : [
                  // see popper modifiers configurations
                  {
                    name: 'offset',
                    options: {
                      offset: [10, 0],
                    },
                  }
                ]
              }}
              renderOnMount={false}
            >

              {this.props.isMapDesigner && !this.props.isMapDesignerDatatable &&

                <Dropdown.Item
                  eventKey="export-geojson"
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Save As GeoJson
                </Dropdown.Item>

              }

              {this.props.isMapDesigner && !this.props.isMapDesignerDatatable &&
                <Dropdown.Divider />
              }


              {this.props.isMapDesigner && !this.props.isMapDesignerDatatable &&
                <Dropdown.Item
                  eventKey="export-jpeg"
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Save As jpg
                </Dropdown.Item>
              }


              {this.props.isMapDesigner && !this.props.isMapDesignerDatatable &&

                <Dropdown.Item
                  eventKey="export-png"
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Save As png
                </Dropdown.Item>

              }


              {this.props.isMapDesigner && !this.props.isMapDesignerDatatable &&

                <Dropdown.Item
                  eventKey="export-svg"
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Save As svg
                </Dropdown.Item>

              }



              {this.props.isMapDesigner && !this.props.isMapDesignerDatatable &&

                <Dropdown.Item
                  eventKey="export-pdf"
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Save As pdf
                </Dropdown.Item>
              }



              { this.props.isMapDesignerDatatable &&

                <Dropdown.Item
                  eventKey="export-csv"
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Save As csv
                </Dropdown.Item>
              }

            </Dropdown.Menu>
          </Dropdown>

        </div>
      </Stack>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    scaleType : state.mapdesign.scaleType,
    showDataPoints: state.mapdesign.showDataPoints 
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setLegendData : (data) => dispatch(MapDesignActions.setLegendData(data)),
    setScaleType : (data) => dispatch(MapDesignActions.setScaleType(data)),
    setShowDataPoints : (data) => dispatch(MapDesignActions.setShowDataPoints(data)),
    setIsDrawingGeoFilter : (data) => dispatch(MapDesignActions.setIsDrawingGeoFilter(data)),
    toggleMapView : (data) => dispatch(MapDesignActions.toggleMapView(data))
    
  };
};


export default connect(mapStateToProps , mapDispatchToProps )(MapDesignFooter);
