import React, { Component } from "react";
import { connect } from "react-redux";

import {toFixed2}  from "../../utilities/Helpers" ;

import { 
 Stack
} from 'react-bootstrap';


class MapDesignHeader extends Component {
  render() {
    return (
      <div class="container-fluid" style={{marginTop : "0.7rem"}} >
        
        { this.props.isMapDesignerDatatable &&
          <Stack direction="horizontal" gap={5} >
            <div style={{fontSize:"0.8rem"}}>
              Results OK :
            </div>

            <div style={{fontSize:"0.8rem"}}>
            {this.props.recordsResult && this.props.recordsResult.data.length &&
              <span> {this.props.recordsResult.data.length} </span>
            } rows returned
            </div>
          </Stack>
        }

        { !this.props.isMapDesignerDatatable &&

          <Stack direction="horizontal" gap={5} >

            <div style={{fontSize:"0.8rem"}}>
              <div id="div_measure_distance_tool"> </div>
            </div>

            <div className="ms-auto" style={{fontSize:"0.8rem"}}>
              <Stack gap={0} >
                <div className="text-center"> 

                  <Stack direction="horizontal" gap={0} >
                    <div className=""  style={{height: "6px" , width:"20px" , background:"#0281bf" , border: "1px solid black "}} ></div>
                    <div className=""  style={{height: "6px" , width:"15px" , background:"white"}} >  </div>
                    <div className=""  style={{height: "6px" , width:"20px" , background:"#0281bf" , border: "1px solid black "}} ></div>
                    <div className=""  style={{height: "6px" , width:"15px" , background:"white"}} >  </div>
                    <div className=""  style={{height: "6px" , width:"20px" , background:"#0281bf" , border: "1px solid black "}} ></div>
                  </Stack>

                </div>

                <div className="text-center"> {this.props.zoom && toFixed2(this.props.zoom , 2) } NM </div> {/*TODO compute real zoom altiture ... */}
              </Stack>
            </div>

            <div style={{fontSize:"0.8rem"}}>
              <Stack gap={0} >
                
                <div className="text-end"> Long: {this.props.long && <span>{toFixed2(this.props.long , 2 )} | x: {toFixed2(this.props.x , 2 )} </span> } </div>
                <div className="text-end"> Lat: {this.props.lat && <span>{toFixed2(this.props.lat , 2 )} | y: {toFixed2(this.props.y , 2 )} </span> } </div>
                
              </Stack>
            </div>
          </Stack>

        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    zoom: state.mapdesign.mapZoom ,  //main content tab
    long: state.mapdesign.mapLong,
    lat: state.mapdesign.mapLat,
    x: state.mapdesign.x,
    y: state.mapdesign.y,
    isMapDesignerDatatable: state.explorer.isMapDesignerDatatable,
    recordsResult: state.dashboard.recordsResult
  };
};


export default connect(mapStateToProps)(MapDesignHeader);
