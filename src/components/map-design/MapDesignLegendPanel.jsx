import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome , faFileLines , faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , OverlayTrigger , Tooltip
} from 'react-bootstrap';


import DelphiEnv from '../DelphiEnv';
import Legend from "./Legend";


class MapDesignLegendPanel extends Component {
  

  render() {
    return (
      <div>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={ props => (
            <Tooltip id="map-legend-tooltip" {...props}>
              Click Legend to change between Logarithm and Linear Scale
            </Tooltip>
          )}
        >
          <span className="p-2">
            {this.props.aggregationValue} {this.props.mapValue} (kg/hour) [{this.props.scaleType}] {/*Log Scale*/}
          </span>
        </OverlayTrigger>

        <Legend className="map-legend" />



        <div class="d-flex justify-content-between" style={{fontSize:"12px"}} >
          <div>
            {this.props.steps[0]}
          </div>
          <div>
            {this.props.steps[this.props.steps.length - 1]}
          </div>
         </div>

        

        {/*+++ @TODO deprecate this  */}
        <div id="map-legend"></div>
        <div class="value-info"></div>
        <div id="value-info-mmm"></div>
        {/*+++ END @TODO deprecate this  */}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    steps : state.mapdesign.steps
  };

};


const mapDispatchToProps = (dispatch) => {
  return {
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(MapDesignLegendPanel)