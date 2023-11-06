import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome , faFileLines , faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Nav
} from 'react-bootstrap';


import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";


class MapDesignInfoPanel extends Component {
  

  render() {
    return (
      <div class="nav" style={{marginTop:"50px" , marginLeft: "0.5rem"}} >
        {console.log('this.props.savedMap<<<', this.props.savedMap )}
        {this.props.savedMap && 

          <>
            Details : <br /> 

            Map name : {this.props.savedMap.name}  <br /> 
            Date created: {this.props.savedMap.created_at}  <br />

          </>
        }


        <br />
        

        <div style={{width:"256px" , minHeight:"380px" , overflow:"hidden"}} >

          { !Boolean(Object.entries(this.props.capturedFilters).length) && Boolean(this.props.plotRecords.length) && 
            <div> No Filter:  {this.props.plotRecords.length} {this.props.plotRecords.length > 2 ? `Records` : `Record` } </div>
          }



          { Boolean(Object.entries(this.props.capturedFilters).length) && Boolean(this.props.plotRecords.length) && 
            <>
              <div> Filtered to:  {this.props.plotRecords.length} {this.props.plotRecords.length > 2 ? `Records` : `Record` } </div>  

              <div>
                { Object.entries(this.props.capturedFilters).map(([ pathName, filter]) => (
                  <div> { filter.field } : {filter.values.join(' , ')} </div>
                ))}
              </div>
                
            </>
          }

        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    savedMap : state.mapdesign.savedMap,
    capturedFilters : state.mapdesign.capturedFilters,
    plotRecords : state.mapdesign.plotRecords
  };

};


const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(MapDesignInfoPanel)