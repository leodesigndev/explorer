import React, { Component } from "react";
import * as d3 from "d3";

import { 
 Overlay 
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome , faFileLines , faFolderOpen } from '@fortawesome/free-solid-svg-icons';

import { connect } from "react-redux";
import { MapDesignActions } from "../../redux/actions";
import {yieldMap , legend} from "../Common";
import {LEGEND_WIDTH } from "../../utilities/constant";


class Legend extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLegend: false , // @TODO track with timestamp ?
      offsetTooltip : 0 ,
      valueTooltip : 0 ,
      backgroundTooltip : 'black'
    }

    this.legendRef = React.createRef();
  }


  toggleScale = async (e) => {

    let scaleType = this.props.scaleType ;

    console.log('scaleType1 >>>>', scaleType );

    scaleType = scaleType == 'linear' ? 'logarithm' : 'linear' ;

    console.log('scaleType >>>>', scaleType );

    // set a global state for scale type 
    //...

    const {steps , colorRange} = await yieldMap({scaleType});
    this.props.setLegendData({steps, colorRange});
    this.props.setScaleType(scaleType);

    // putting everything on the log scale

  }

  entering = (e) => {
    console.log('entered....');
  }

  mapLegend(steps , colorRange){ 

    let width = LEGEND_WIDTH ; // @TODO read from config ?

    const scaleLinearOnColor = d3.scaleLinear(steps, colorRange );
    const scaleLinearOnUnit = d3.scaleLinear([steps[0] , steps[steps.length - 1] ], [0 , width] ) ;

    let colorScale = d3.scaleLinear(steps, colorRange );
    const [svg , svgGradientBar ] = legend({
      color : scaleLinearOnColor,
      width ,
      title : "",
      ticks: 3 ,
      height : 60
    });

    svgGradientBar.on("mousemove" , (e) => {

      console.log("mouse moe on svg >>>");

      /*
      let mmm = this.props.valueTooltip ; // the cpue value
      console.log('mmm >>>>>>>>' , mmm );
      */

      var pos = d3.pointer(e, svgGradientBar.node()); // alt :-) d3.pointer(e, svgGradientBar)
      var xPos = pos[0];

      this.props.setShowLegendToolTip({show:true , trigger : 'legend' });

      // OEM this.setState({offsetTooltip : xPos });
      this.props.setOffsetTooltip(xPos);

      let inverVal = scaleLinearOnUnit.invert(xPos);

      // OEM this.setState({valueTooltip : inverVal });
      this.props.setValueTooltip(inverVal) ;

      // OEM this.setState({backgroundTooltip :scaleLinearOnColor(inverVal) });
      this.props.setBackgroundTooltip(scaleLinearOnColor(inverVal)) ;


    }).on("mouseout" , (e) => {

      this.props.setShowLegendToolTip({show:false , trigger : 'legend' });
      console.log('out...');

    });
    console.log('mmmleo <<<<<', document.getElementById("map-legend") ) ;
    document.getElementById("map-legend").innerHTML = "";
    document.getElementById("map-legend").appendChild(svg) ;

  }



  render() {

    if( (this.props.steps.length && this.props.colorRange.length) && !this.state.isLegend  ) { // @TODO use timestamp to track legend rederend instead ?
      this.setState({isLegend : true });
      this.mapLegend(this.props.steps , this.props.colorRange ); // add node and event binding
    }

    // @TODO create proper event handle for this ?
    if(this.props.valueTooltip && this.props.showLegendToolTipTrigger == 'grid' ){
      // @TODO check if 
      console.log('this.props.valueTooltip >>>>' , this.props.valueTooltip );
    }


    return (
      <>
        <div className={this.props.className} ref={this.legendRef} id="map-legend" onClick={this.toggleScale} ></div>

          <Overlay
            target={this.legendRef.current}
            show={this.props.showLegendToolTip}
            placement="top-start"
            onEntering={this.entering}
            popperConfig={{
              modifiers : [
                {
                  name: 'offset',
                  options: {
                    offset: [ this.props.offsetTooltip , 10],
                  },
                }
              ]
            }}  
          >
            {(props) => (
              
              <div
                {...props}
                style={{
                  position: 'absolute',
                  padding: '0',
                  margin: '0',
                  color: 'white',
                  borderRadius: 3,
                  zIndex: 1040, // to be in from of `layoutSidenav_nav`
                  ...props.style,
                }}
              >
                <button
                  type="button" 
                  class="btn btn-dark position-relative shadow-sm"
                  style={{color:'white' ,padding:"5" , margin:"0" , backgroundColor: this.props.backgroundTooltip , border:"3px solid #000000" , textShadow: "0px 1px 0px #000000" }}
                >
                  {this.props.valueTooltip}
                  {/* OEM <svg width="1em" height="1em" viewBox="0 0 16 16" class="position-absolute top-100 start-0 translate-start mt-0 bi bi-caret-down-fill" fill="#212529" xmlns="http://www.w3.org/2000/svg"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>*/}
                  <svg 
                    width="1em" 
                    height="1.5em" 
                    viewBox="0 0 10 16" 
                    className="position-absolute top-100 start-0 translate-start mt-0 bi bi-caret-down-fill" 
                    fill="#000000" // {this.props.backgroundTooltip} | // #212529
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      // style={{"fill:none;stroke:#000000;stroke-width:1.03331px;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1"}}
                      style={{stroke: "#000000" , "stroke-width" : "3px" , "stroke-linecap" : "round" , "stroke-linejoin" : "round" , strokeOpacity : "0.5" }}
                      d="M 0.51665503,0.52217616 V 15.483448 L 9.4833901,0.51665498 Z"
                    />
                  </svg>
                </button>
              </div>

            )}
          </Overlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showLegendToolTip : state.mapdesign.showLegendToolTip,
    showLegendToolTipTrigger : state.mapdesign.showLegendToolTipTrigger,
    valueTooltip : state.mapdesign.valueTooltip ,
    offsetTooltip : state.mapdesign.offsetTooltip ,
    steps : state.mapdesign.steps,
    colorRange : state.mapdesign.colorRange,
    backgroundTooltip : state.mapdesign.backgroundTooltip,
    scaleType: state.mapdesign.scaleType
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setShowLegendToolTip : (data) => dispatch(MapDesignActions.setShowLegendToolTip(data)),
    setValueTooltip : (data) => dispatch(MapDesignActions.setValueTooltip(data)),
    setOffsetTooltip : (data) => dispatch(MapDesignActions.setOffsetTooltip(data)),
    setBackgroundTooltip : (data) => dispatch(MapDesignActions.setBackgroundTooltip(data)),
    setLegendData : (data) => dispatch(MapDesignActions.setLegendData(data)),
    setScaleType : (data) => dispatch(MapDesignActions.setScaleType(data))
  };
};


export default connect(mapStateToProps , mapDispatchToProps )(Legend);
