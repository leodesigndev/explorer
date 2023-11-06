import _ from 'lodash';
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";


import { 
 Offcanvas , Stack , Tab , Button , Container , Row , Col , Card , FormControl , Badge , CloseButton , Form
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock , faCheck, faExclamation , faEllipsisVertical , faChevronLeft , faChevronRight } from '@fortawesome/free-solid-svg-icons';

import DelphiEnv from '../DelphiEnv';
import { MapDesignActions } from "../../redux/actions";
import Inputs from "../../configs/inputs";
import Selecto from "react-selecto";
import anime from 'animejs/lib/anime.es.js';

import {labelsUpdate , inputCapture , toggleFilters , yieldMap } from "../Common";
import { MAP_OPEN_PATH } from '../../utilities/constant';


class OffCanvasPromptInputs extends Component {

	constructor(props){
		super(props);

    this.debouncedSearchOptions = _.debounce(this.debounceSearchOptions, 300 );
    this.debouncedTextCaptured = _.debounce(this.debounceTextCaptured, 300 );

	}

	componentDidMount(){

    let mapId = this.props.match.params.map_id ;

    if(mapId && this.props.history.location.pathname.includes(MAP_OPEN_PATH) ){ // open existing map

      setTimeout( async () => {

        // yield the map
        let scaleType = this.props.scaleType ;

        scaleType = scaleType == 'linear' ? 'logarithm' : 'linear' ;
        
        const {steps , colorRange} = await yieldMap({scaleType});
        this.props.setLegendData({steps, colorRange});
        this.props.setScaleType(scaleType);


        this.props.setIsMapSaved(true);

      } ,  300 );
      

    }else{ // new map creation mode

      // OEMs
      // this.props.toggleOffCanvasAnalysisPromptLabels(true);
      // this.props.toggleOffCanvasAnalysisPromptInputs(true);

      this.props.setSavedMap(null);
      this.props.setIsMapSaved(false);

      toggleFilters(null , true) ;

      setTimeout(() => { // @TODO impontant!! make a call back instead for this onOffcanvasLoaded
        let firstPrompt = this.props.groupedPrompts[0].fields[0];
        this.gotoPromt('current' , firstPrompt );
      } , 500 ); // 300
      

    }


  }

  debounceSearchOptions = (e , value ) => {

    const fieldPathName = this.props.selectedField.path_name ;

    this.props.promptOptions.map(option => { // @TODO use foreach for better performance ?

      let optionElement = Inputs.optionsRefs[fieldPathName][option.id];

      // OEM let optionElement = document.querySelector(`[option_path="${optionPath}"]`);

      if(value != ''){

        if(String(option.label).toLowerCase().includes(value.toLowerCase())){
          optionElement.classList.remove('selecto-option-hidden');
        }else{
          optionElement.classList.add('selecto-option-hidden');
        }

      }else{
        optionElement.classList.remove('selecto-option-hidden') ;
      }

      return option ;

    });

    

  }


	onSelect = async e => {

	}

	onSelectStart = async e => {

	}

	onDrag = async e => {
		e.stop();
	}

	onSelectEnd = async e => {

    const selectedPrompt = this.props.selectedField ;
    const pathName = selectedPrompt.path_name ;
    
    let optionVerboses = {}; // @TODO option verbose to be a global
    if(!Inputs.optionVerboses[pathName]){
      Inputs.optionVerboses[pathName] = {};
    }


		e.added.forEach(el => {
      el.classList.add("selected");
    });
    e.removed.forEach(el => {
      el.classList.remove("selected");
    });


    // selected values
    let selectedValues = [] ;
    
    e.currentTarget.selectedTargets.forEach(el => {
    	let val = el.getAttribute("value");
      let label = el.getAttribute("label");

      Inputs.optionVerboses[pathName] = { // verbosities
        val : label ,
        field :  selectedPrompt
      }

    	selectedValues.push(val);
    });
    

    // update labels
    labelsUpdate(pathName , selectedValues); // @TODO use input verboses ?

    // animate selection
    let animateConfig = true ;
    if(animateConfig){
      this.animateSelection(e.added) ;
    }


    // captured value // @TODO make so we can unset
    // Inputs.step2Captured[pathName] = selectedValues ;
    // OEM inputCapture( selectedValues , pathName );
    inputCapture( selectedValues , selectedPrompt ); // @TODO use input verboses ?
    this.props.setIsMapRefreshDue(true);

    if(selectedPrompt.prompt_type != "multiselect" ){
      setTimeout( () => this.gotoPromt('next')  , 300 ); // @TODO ajust time out ?
    }

    

    // :-) let mmm2 = this.selecto.selecto.getSelectedTargets(); // :-)
    // :-) console.log('mmm2<<<<' , mmm2 );


	}

  handleTextCaptured = (e) => {
    // @TODO implement highlight
    if(e.key === 'Backspace'){ // e.keyCode === 8

    }
    this.debouncedTextCaptured(e , e.target.value , this.props.selectedField );
  }

  debounceTextCaptured = (e , value , fieldDetail ) => { console.log('value >>>>>>>><', value );

    // OEM inputCapture( value , fieldDetail.path_name );
    inputCapture( value , fieldDetail);
    this.props.setIsMapRefreshDue(true);

    /*
    if(value.length && fieldDetail.grouped == 'filters' ){ // @TODO filters at text input level ?
      // OEM filterCapture(enteredValue, fieldPathName , "EQUAL");
      filterCapture(value, fieldPathName , fieldDetail );
    }*/

    // console.log("mm<<" , this.props.selectedField.path_name );
    labelsUpdate(fieldDetail.path_name , value );

  }

  animateSelection = (targets) => {
    anime({
      // OEM targets: 'div',
      targets: targets , //  '.mmm_leo',
      scale: [1, 1.05],
      direction: 'alternate',
      duration: 100,
      easing: 'easeInCubic',
      // OEM loop: true
      loop: 4
    });
  }

  gotoPromt  = (direction , prompt = null ) => {

    // OEM const selectedPrompt = this.props.selectedField ;
    const selectedPrompt = prompt ? prompt : this.props.selectedField ;


    const currentGroupIndex =  this.props.groupedPrompts.findIndex(group => group.groupName == selectedPrompt.grouped );
    const currentPromptIndex =  this.props.groupedPrompts[currentGroupIndex].fields.findIndex(prompt => prompt.path_name == selectedPrompt.path_name );

    // const nextPromptIndex = currentPromptIndex + 1 ;
    // OEM let nextPromptIndex = direction == 'next' ? currentPromptIndex + 1 : currentPromptIndex - 1  ;
    let nextPromptIndex = 0 ;
    if(direction == 'current' ){
      nextPromptIndex = currentPromptIndex ;
    }else if(direction == 'next'){
      nextPromptIndex = currentPromptIndex + 1;
    }else{ // assumed previous
      nextPromptIndex = currentPromptIndex - 1;
    }

    if(this.props.groupedPrompts[currentGroupIndex].fields[nextPromptIndex]){

      const nextFieldPathName = this.props.groupedPrompts[currentGroupIndex].fields[nextPromptIndex].path_name ; 
      document.querySelector(`.selector-prompt-label-${nextFieldPathName}`).click(); 
      this.props.setTabKeyFields('tabs_field_group-'+ this.props.groupedPrompts[currentGroupIndex].fields[nextPromptIndex].grouped);

    }else{

      //OEM  const nextGroupIndex = direction == 'next' ? currentGroupIndex + 1 : currentGroupIndex - 1  ; // alert(nextGroupIndex);
      let nextGroupIndex = 0 ;
      if(direction == 'current' ){
        nextGroupIndex = currentGroupIndex ;
      }else if(direction == 'next'){
        nextGroupIndex = currentGroupIndex + 1;
      }else{ // assumed previous
        nextGroupIndex = currentGroupIndex - 1;
      }

      if(this.props.groupedPrompts[nextGroupIndex]){
        
        if(currentGroupIndex < nextPromptIndex ){
          nextPromptIndex = 0 ;
        }else{
          nextPromptIndex = this.props.groupedPrompts[nextGroupIndex].fields.length - 1 ;
        }

        
        const nextFieldPathName = this.props.groupedPrompts[nextGroupIndex].fields[nextPromptIndex].path_name ;
        document.querySelector(`.selector-prompt-label-${nextFieldPathName}`).click() ;
        this.props.setTabKeyFields('tabs_field_group-'+ this.props.groupedPrompts[nextGroupIndex].fields[nextPromptIndex].grouped);

      }else{
        
        console.log("out of bounds....");

      }
    }

    

    // const nextGroupIndex = direction == 'next' ? currentGroupIndex + 1 : currentGroupIndex - 1  ;

  }


  handleTxtFilterOptionKeyUp = (e) => {
    if(e.key === 'Backspace'){ // e.keyCode === 8
      
    }

    this.debouncedSearchOptions(e , e.target.value);

  }  




	render() {
		return(
			<Offcanvas 
		        show={this.props.showOffCanvasAnalysisPromptInputs}
		        backdrop={false} 
		        scroll={true}
		        style={Object.assign( { marginLeft:"20%", marginTop:"104px" , marginBottom:"56px" , zIndex: "999"} , !DelphiEnv.isParentEnv() ? {borderRadius:"0 18px 18px 0px"} : {} )}
		        id="div_off_canvas_prompt_inputs"
		        className="ddlfrost_background"
		    >
		    	<Offcanvas.Header className="position-relative">


          <div className="w-100" >
            

            <Button 
              onClick={e => this.gotoPromt('previous' )} 
              // OEM className="ddl-button-style-strong-blue me-2"
              className="ddl-button-style-light-blue me-2 mb-2 ddl-no-outline"
              //field_path_name={input.path_name}
            >
              {/* <FontAwesomeIcon style={{ color:"white"}} icon={faCheck} className="fa-1x" /> */}
              <FontAwesomeIcon icon={faChevronLeft} className="me-2 fa-1x" />
              Prev
            </Button>

            
            <Button 
              onClick={e => this.gotoPromt('next' )} 
              className="ddl-button-style-light-blue mb-2 ddl-no-outline"
              //field_path_name={input.path_name}
            >
              {/* <FontAwesomeIcon style={{ color:"white"}} icon={faCheck} className="fa-1x" /> */}
              {/* OEM Capture */}
              Next 
              <FontAwesomeIcon icon={faChevronRight} className="ms-2 fa-1x" />
            </Button>


          </div>

		    	</Offcanvas.Header>

		    	<Offcanvas.Body className="selector-off-canvas-prompt-inputs" style={{paddingTop:"0"}} >
		    		<div className="mh-100" style={ ["select" , "multiselect"].includes(this.props.selectedField.prompt_type) ? {} : {display:"none"} } >
		    			
              {/* the house of the search for options */}
              <div className="mb-2">
                <FormControl
                  //id={`txt_filter_option-${input.path_name}`} // @TODO ref as in ref function
                  ref={`txt_filter_option-mmm`}
                  onKeyUp={e => this.handleTxtFilterOptionKeyUp(e)}
                  // OEM onClick={e => this.handleTxtFilterOptionClick(e)}
                  // rel={input.path_name}
                  as="textarea"
                  rows={1} 
                  spellcheck="false"
                  autocomplete="off"
                  className="ddl-text selector_filter_option ddl-no-outline"
                  style={{resize: "none" , whiteSpace: "nowrap" , texOverflow: "ellipsis", overflow: "hidden" , width:"100%" ,background:"#284664" , borderColor:"#03999c" , color:"white" , height : "3.1rem" , maxHeight : "3.1rem" , fontSize: "1.5rem"}}
                  // @TODO on enter key
                />
              </div>
              {/* END the house of the search for options */}


              <Selecto
                ref={ r => {
                  Inputs.createMapStep2SelectoRef = r
                }}
                dragContainer={`.elements-mmm`}
                selectableTargets={[".selecto-area .selecto-option"]}
                hitRate={100}
                selectByClick={true}
                selectFromInside={false}
                preventDragFromInside={true}
                clickBySelectEnd={false}
                continueSelect={true}
                ratio={0}
                onSelect={this.onSelect}
                onSelectEnd={this.onSelectEnd}
                //onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onSelectStart={this.onSelectStart}
              >
              </Selecto>

              <Container fluid style={{ padding: "0" , margin: "0" }} >
              	<Row
                  style={{width:"100%" , padding: "0" ,  margin: "0" }}
                  className={`elements-mmm selecto-area`}
                >
                	{Boolean(this.props.promptOptions.length) &&
                		this.props.promptOptions.map( (option , fieldGroupIndex) => (
                			<div
                        ref={r => {
                          if(!Inputs.optionsRefs[this.props.selectedField.path_name]){
                            Inputs.optionsRefs[this.props.selectedField.path_name] = {}
                          };

                          Inputs.optionsRefs[this.props.selectedField.path_name][option.id] = r
                        }}
                        value={option.id}
                        label={option.label}
                        option_path={`field_option-${option.id}`}
                        className={`selecto-option option-stretched ${ option.is_hiden ? 'selecto-option-hidden' : '' }`}
                        style={{transform: "scale(1)" , marginLeft:"0" }}
                      >
                        <span className="option-checked-mark" > <FontAwesomeIcon icon={faCheck} className="mr-1 fa-1x" /> </span>
                        <span> {option.label} </span>
                      </div>
                		))
                	}
                </Row>
              </Container>
		    		</div>

            <div className="mh-100" style={ ["text"].includes(this.props.selectedField.prompt_type) ? {} : {display:"none"} } >
              <>
                <FormControl
                  ref={ r => {
                    Inputs.createMapStep2TxtRef = r
                  }}
                  id="txt-mmm"
                  //option_path={`${input.name}`}
                  onKeyUp={e => this.handleTextCaptured(e)}
                  autocomplete="off"
                  type="text"
                  className="ddl-text"
                  style={{background:"#284664" , borderColor:"#5f6972" , color:"white" }}
                />
              </>
            </div>

		    	</Offcanvas.Body>
		    </Offcanvas>

		);
	}

}

const mapStateToProps = (state) => {
  return {
  	selectedField: state.matrices.selectedField ,
    selectedFieldPathName: state.matrices.selectedFieldPathName ,
    groupedPrompts : state.matrices.groupedPrompts,
  	showOffCanvasAnalysisPromptInputs: state.explorer.showOffCanvasAnalysisPromptInputs ,
  	promptOptions : state.mapdesign.promptOptions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  	toggleOffCanvasAnalysisPromptLabels : (data) => dispatch(MapDesignActions.toggleOffCanvasAnalysisPromptLabels(data)),
    toggleOffCanvasAnalysisPromptInputs : (data) => dispatch(MapDesignActions.toggleOffCanvasAnalysisPromptInputs(data)),
    setTabKeyFields : (data) => dispatch(MapDesignActions.setTabKeyFields(data)) ,
    setLegendData : (data) => dispatch(MapDesignActions.setLegendData(data)),
    setScaleType : (data) => dispatch(MapDesignActions.setScaleType(data)),
    setIsMapRefreshDue : (data) => dispatch(MapDesignActions.setIsMapRefreshDue(data)),
    setIsMapSaved : (data) => dispatch(MapDesignActions.setIsMapSaved(data)),
    setSavedMap: (data) => dispatch(MapDesignActions.setSavedMap(data))
  };
};

export default connect(mapStateToProps , mapDispatchToProps )(withRouter(OffCanvasPromptInputs) );
