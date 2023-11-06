import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;
import InfiniteScroll from "react-infinite-scroll-component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Nav , Stack
} from 'react-bootstrap';


import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";
// import { apiBaseUrl }  from "../../utilities/Helpers" ;

class SavedMapTile extends Component {
	
	render() {
    

    const map = this.props.map ;

    return (

      <div
        value={map.id}
        option_path={`field_option-${map.id}`}
        className={`selecto-option option-stretched ${ map.is_hiden ? 'selecto-option-hidden' : '' }`}
        style={{transform: "scale(1)" , marginLeft:"0" }}
      >
        <span className="option-checked-mark" > <FontAwesomeIcon icon={faCheck} className="mr-1 fa-1x" /> </span>
        
        <span> <img src={`/map_thumbs/file_${map.file_title}.png`} className="rounded mx-auto d-block" alt="..." width="180px" /> </span>
        <span> {map.name} </span>
      </div>

    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  };

};


const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
  };

};


export default connect(mapStateToProps, mapDispatchToProps)(SavedMapTile)