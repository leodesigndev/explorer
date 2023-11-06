import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import { withRouter } from "react-router-dom";

import * as turf from '@turf/turf';
import { connect } from "react-redux";
import { 
 Stack , Button , Nav , Dropdown , OverlayTrigger , Tooltip
} from 'react-bootstrap'; // FontAwesomeIcon

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagnifyingGlassLocation , faShip , faLocationArrow, faHand , faMagnifyingGlassPlus , faHouse , 
  faMagnifyingGlassMinus , faLayerGroup , faWrench , faCaretLeft , faCheck , faDrawPolygon , faRefresh
} from '@fortawesome/free-solid-svg-icons';

import OverlayTriggerShy from "../OverlayTriggerShy";
import { MapDesignActions , ExplorerActions } from "../../redux/actions";
import mapboxMap from "../../configs/mapBox";
import {CustomToggler} from "../CustomToggler" ;
import {yieldMap } from "../Common";
import {MAP_DESIGNER_PATH , MAP_OPEN_PATH } from '../../utilities/constant';
import {createJsPanel} from '../../configs/jsPanelOptions';
import ConfigMapper from '../ConfigMapper';
import { HOME_VIEW_CONFIG } from "../../utilities/constant";
import { store } from "../../redux";


class MapDesignToolsMenu extends Component {

  constructor(props) {
      super(props);
      this.state = {
        showToolDropItems :false
      };
  }


  reRenderMap = async () => {

    let scaleType = this.props.scaleType ;
    
    scaleType = scaleType == 'linear' ? 'logarithm' : 'linear' ;
    
    const {steps , colorRange} = await yieldMap({scaleType});
    this.props.setLegendData({steps, colorRange});
    this.props.setScaleType(scaleType);

  }

  handleOnToolSelect = (eventKey , e ) => {

     
    if(eventKey == "event-tool-measure-distance" ){

      this.handleMeasureDistanceTool(eventKey , e);
      
    }else if(eventKey == "event-set-current-view-as-home" ){

      let data = {};
      data.name = HOME_VIEW_CONFIG ;
      data.data = {
        mapCenter: mapboxMap.map.getCenter(),
        mapZoom: mapboxMap.map.getZoom()
      }
      data.token = this.props.token;

      this.props.saveConfig(data , this.homeViewSaved );
      

    }else if( eventKey == "event-import-layer"){

    }else if( eventKey == "event-save-as-image"){

    }else if( eventKey == "event-print"){

    }else if( eventKey == "event-clear-olrac-gis-map"){

    }else if( eventKey == "envent-map-configuration"){

      createJsPanel(
        "Mapper Configuration",
        ConfigMapper , 
        true,
        {
          optionsOverwrite:{
            panelSize: "50% 67%" ,
            footerToolbar: () => {
              return ReactDOMServer.renderToString(
                <>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_mapper-cancel" > Cancel </Button>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_config_mapper-ok" > ok </Button>
                </>
              );
            }
          }
        }
      );

    }

  }

  homeViewSaved = (data) => {
    
    this.props.loadConfig(HOME_VIEW_CONFIG); // @TODO bind matrixId?/mapId?  // @TODO set state after config save ?
    // this.props.loadConfig({key:HOME_VIEW_CONFIG})
    
    alert("home view saved"); // @TODO global toast for success
  }


  handleOnToolToggle = (nextShow  , meta) => {
    // OEM this.setState({showToolDropItems: !this.props.isMapDesigner ? false : nextShow});
    this.setState({showToolDropItems: this.handleDisable() ? false : nextShow});
  }

  zoom = (direction) => {

    const offSet = 0.3 ;
    const currentZoom = mapboxMap.map.getZoom() ;
    // OEM let nextZoom = direction == 'in' ? this.props.zoom + offSet :  this.props.zoom - offSet ;
    let nextZoom = direction == 'in' ? currentZoom + offSet :  currentZoom - offSet ;
    if(nextZoom > 24 ){
      nextZoom = 24 ;
    }else if(nextZoom < 0 ){
      nextZoom = 0 ;
    }

    mapboxMap.map.setZoom(nextZoom); // mapboxgl zoom

    this.props.setMapZoom(nextZoom);
  }

  handleDisable = () => {
    return ( (!this.props.isMapDesigner) || (this.props.isMapDesignerDatatable) ) && ( (this.props.history.location.pathname != MAP_DESIGNER_PATH) && (!this.props.history.location.pathname.includes(MAP_OPEN_PATH))  ) ? true : false 
  }

  gotoHomeView = () => {

    const {mapCenter , mapZoom } = this.props.homeViewConfig ;
    // mapboxMap.map.setCenter([0,0]);
    // OEM console.log('mmmm <<><<<', this.props.homeViewConfig ) ;
    mapboxMap.map.flyTo({
      zoom: mapZoom ,
      center:[mapCenter.lng, mapCenter.lat],
      duration : 300 ,
      essential : false // This animation is considered not essential with respect to prefers-reduced-motion
    });
  }



  render() {

    return (
      <div className="position-absolute bottom-0 end-0" style={{ zIndex:"9999" }} > {/* background: "red" , */} 
        
        <Stack gap={3} className="justify-content-center" style={{paddingLeft:"5px" , paddingRight : "5px" , paddingBottom:"56px"}} > {/*className="col-md-6 col-lg-6 col-sm-6 mx-auto"*/} 


          {/* <Button variant="primary" className="ddl-button-style-maptool ddl-no-outline" > <FontAwesomeIcon icon={faLocationArrow} size="1x" /></Button> */}

          {/* render map button once lived here... */}


          <OverlayTriggerShy tooltipText="Click to redraw the map" >
            <Button
              disabled={this.handleDisable()}
              className="ddl-button-style-maptool ddl-no-outline position-relative"
              onClick={this.reRenderMap} 
            >
              <FontAwesomeIcon icon={faRefresh} size="1x" />
              <span 
                className="position-absolute top-0 start-0 translate-middle badge rounded-circle bg-danger p-1"
                style={{fontSize:".8rem" , marginTop : "10px" , marginLeft:"5px"}}
              > 
                {this.props.isMapRefreshDue && 
                  <span class="visually-hidden">refresh map</span>
                }
              </span>

            </Button>
          </OverlayTriggerShy>


          <OverlayTriggerShy tooltipText="Zoom in"  >
            <Button 
              disabled={this.handleDisable() }
              className="ddl-button-style-maptool ddl-no-outline" 
              onClick={() => this.zoom('in') } 
            >
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} size="1x" />
            </Button>
          </OverlayTriggerShy>


          <OverlayTriggerShy tooltipText="Zoom out"  >
            <Button 
              disabled={this.handleDisable()}
              className="ddl-button-style-maptool ddl-no-outline" onClick={() => this.zoom('out')} 
            > 
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} size="1x" />
            </Button>
          </OverlayTriggerShy>


          <OverlayTriggerShy tooltipText="Home"  >
            <Button 
              disabled={this.handleDisable()}
              className="ddl-button-style-maptool ddl-no-outline"
              onClick={() => this.gotoHomeView() }
            > 
              <FontAwesomeIcon icon={faHouse} size="1x" />
            </Button>
          </OverlayTriggerShy>



          <OverlayTriggerShy tooltipText="Tools" >
            
            <Dropdown
              //as={CustomToggler}
              //disabled={true}
              show={this.state.showToolDropItems}
              drop="start"
              onSelect={this.handleOnToolSelect}
              onToggle={this.handleOnToolToggle}
              className="ddl-dropdown-nav-strong-blue shadow"
            >
              <Dropdown.Toggle 
                as={CustomToggler}
              >
                <Button
                  disabled={this.handleDisable()} 
                  className="ddl-button-style-maptool ddl-no-outline position-relative" 
                > 
                  <FontAwesomeIcon icon={faWrench} size="1x" style={{ transform: "scaleX(-1)" }} /> 
                  <FontAwesomeIcon className="position-absolute top-0 start-0 translate-middle" icon={faCaretLeft} size="1x" style={{fontSize:".8rem" , marginTop : "10px" , marginLeft:"5px"}} />                 
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

                {/* OEM 
                <Dropdown.Item 
                  // eventKey="event-set-current-view-as-home" 
                  eventKey="event-tool-measure-distance" 
                >
                  <FontAwesomeIcon icon={faDrawPolygon}  className="me-2" /> measure distance
                </Dropdown.Item>



                <Dropdown.Divider /> */}

                <Dropdown.Item 
                  eventKey="event-set-current-view-as-home" 
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Set Current View As Home
                </Dropdown.Item>

                <Dropdown.Divider />

                {/* OEM
                <Dropdown.Item 
                  eventKey="event-import-layer" 
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Import Layer ...
                </Dropdown.Item>
                */}


                <Dropdown.Item 
                  eventKey="event-save-as-image" 
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Save As image
                </Dropdown.Item>



                {/* OEM 
                <Dropdown.Item 
                  eventKey="event-print"
                  className="position-relative" 
                  onMouseEnter={this.handleShowDropPrint} 
                  onMouseLeave={this.handleHideDropPrint}
                >
                  <FontAwesomeIcon className="position-absolute top-50 start-0 translate-middle" icon={faCaretLeft} size="1x" style={{fontSize:".8rem" , marginLeft: "7px"}} />


                  <Dropdown
                    drop="start"
                    show={this.state.showDropPrint}
                    onSelect={this.handleOnToolSelect}
                    onToggle={this.handleOnToolToggle}
                    className="ddl-dropdown-nav-strong-blue"
                    style={{background:"transparent"}}
                    //onMouseEnter={this.handleShowDropPrint} 
                    //onMouseLeave={this.handleHideDropPrint}
                  >
                    <Dropdown.Toggle as={CustomToggler} style={{background:"transparent"}} >

                      <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Print
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
                        eventKey="event1" 
                      >
                        <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Print Configuration
                      </Dropdown.Item>

                      <Dropdown.Divider />

                      <Dropdown.Item 
                        eventKey="event11" 
                      >
                        <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Print Preview
                      </Dropdown.Item>
                      
                    </Dropdown.Menu>
                  </Dropdown>




                </Dropdown.Item>

                */}



                {/* OEM 
                <Dropdown.Item 
                  eventKey="event-clear-olrac-gis-map" 
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Clear OlracGIS Maps
                </Dropdown.Item>
                */}


                <Dropdown.Divider />

                <Dropdown.Item 
                  eventKey="envent-map-configuration" 
                >
                  <FontAwesomeIcon icon={faCheck}  className="me-2 fa-blank" /> Map Configuration ...
                </Dropdown.Item>
                
              </Dropdown.Menu>
            </Dropdown>

          </OverlayTriggerShy>


        </Stack>
      </div>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.user.token,
    zoom: state.mapdesign.mapZoom,
    scaleType : state.mapdesign.scaleType,
    isMapDesignerDatatable : state.explorer.isMapDesignerDatatable, // @TODO deprecate this ?
    isMapDesigner: state.explorer.isMapDesigner,
    isMapRefreshDue: state.mapdesign.isMapRefreshDue ,
    homeViewConfig:  state.explorer.configs[HOME_VIEW_CONFIG]
  };
};

const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
    setMapZoom: (data) => dispatch(MapDesignActions.setMapZoom(data)) ,
    setLegendData : (data) => dispatch(MapDesignActions.setLegendData(data)),
    setScaleType : (data) => dispatch(MapDesignActions.setScaleType(data)),
    saveConfig: (data , callback = null) => dispatch(ExplorerActions.saveConfig(data , callback)),
    loadConfig: (key) => dispatch(ExplorerActions.loadConfig({key, token : state.auth.user.token })),
    setConfig: (data) => dispatch(ExplorerActions.setConfig(data)) 
  };
};

export default connect(mapStateToProps , mapDispatchToProps )(withRouter(MapDesignToolsMenu));
