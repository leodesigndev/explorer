import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Container, Row
} from 'react-bootstrap';

import Selecto from "react-selecto";
import anime from 'animejs/lib/anime.es.js';


import DelphiEnv from '../DelphiEnv';
import { MapDesignActions } from "../../redux/actions";
import SavedMapTile from "./SavedMapTile" ;
import Inputs from "../../configs/inputs";
import {step1LabelsUpdate , step1InputCapture } from "../Common"; // @TODO unify



class CreateMapStep1PromptInputs extends Component {


	constructor(props){
	 super(props);
	}

	async componentDidMount(){
		
	}

	onSelectEnd = async e => {

    // let fieldPathName = e.currentTarget.dragContainer[0].getAttribute('field_path_name');

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
    	selectedValues.push(val);
    });


    // apply filter
    // this.qualityFilter(["map_creation_method"]);
    // console.log('createMapStep1PromptOptions<<<' , this.props.createMapStep1PromptOptions.find((option) => option.id = selectedValues[0]) );
    const theOption = this.props.createMapStep1PromptOptions.find((option) => option.id == selectedValues[0]) ;
    
    if(theOption.value == "historical_data"){
      this.props.qualifyFilterStep1Prompts(["map_creation_method" , "data_set"]);
    }else if(theOption.value == "ai_model"){
      this.props.qualifyFilterStep1Prompts(["map_creation_method" , "ai_model"]);
    }
    



    const selectedPrompt = this.props.createMapStep1SelectedPrompt ;
    const pathName = selectedPrompt.name ;


    // update labels
    step1LabelsUpdate(pathName , selectedValues);

    // animate selection
    let animateConfig = true ;
    if(animateConfig){
      this.animateSelection(e.added) ;
    }


    step1InputCapture( selectedValues , selectedPrompt );

    if(selectedPrompt.prompt_type != "multiselect" ){
      setTimeout( () => this.gotoPromt('next')  , 300 ); // @TODO ajust time out ?
    }


    /* OEM
    // captured value // @TODO make so we can unset
    Inputs.step1Captured[this.props.createMapStep1SelectedPrompt[0]] = selectedValues ;


    console.log('Inputs.step1Captured<<' , Inputs.step1Captured );
    */



    /*
    let mmm2 = Inputs.createMapStep1SelectoRef.selecto.getSelectedTargets(); // :-)
    console.log('mmm2<<<<' , mmm2 ); // return dom node collection
    */


    // -> Inputs.step1Captured ;
    // -> this.props.createMapStep1SelectedPrompt ;
    //-> alert(this.props.createMapStep1SelectedPrompt[0])

    // input capture
    
    


    /*
    let animateConfig = true ;
    if(animateConfig){
      this.animateSelection(e.added) ;
    }
    */


  }

  gotoPromt  = (direction ) => {

    const selectedPrompt = this.props.createMapStep1SelectedPrompt ;
    // OEM const rows = this.props.step1Prompts ;
    const rows = Inputs.datatableStep1Ref.table.getData();
    
    

    const currentPromptIndex = rows.findIndex(prompt => prompt.name == selectedPrompt.name );
    let nextPromptIndex = direction == 'next' ? currentPromptIndex + 1 : currentPromptIndex - 1  ;
    
    if(rows[nextPromptIndex]){
      const nextFieldName = rows[nextPromptIndex].name ;
      document.querySelector(`.step1_selector-prompt-label-${nextFieldName}`).click();
    }else{
      
      console.log("out of bounds....");
    }

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

	render() {
    return (
      <>
        <header className="px-1 content-head" >
          <h3> Maps </h3>
        </header>

        <main>
          <div className="container-fluid p-0 content-view-strong-bleue" >

            <div className="p-2" >
              
              <div className="m-2 ms-0" >

              	


              	{/* insure we have options */}

	            	<Selecto
                  ref={ r => {
                    Inputs.createMapStep1SelectoRef = r
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
                  //onSelect={this.onSelect}
                  onSelectEnd={this.onSelectEnd}
                  //onDragStart={this.onDragStart}
                  onDrag={this.onDrag}
                  //onSelectStart={this.onSelectStart}
                >
                </Selecto>

                <Container fluid style={{ padding: "0" , margin: "0" }} >
                  <Row
                    style={{width:"100%" , padding: "0" ,  margin: "0" }}
                    className={`elements-mmm selecto-area`}
                  >
                    
                    {Boolean(this.props.createMapStep1PromptOptions.length) && this.props.createMapStep1PromptOptions[0]['empty'] &&
                      <div>
                        {this.props.createMapStep1PromptOptions[0]['msg']}
                      </div>
                    }


                    {Boolean(this.props.createMapStep1PromptOptions.length) && !this.props.createMapStep1PromptOptions[0]['empty'] && 
                      this.props.createMapStep1PromptOptions.map( (option , fieldGroupIndex) => (
                        <div
                          ref={r => {
                            if(!Inputs.step1OptionsRefs[this.props.createMapStep1SelectedPrompt.name]){
                              Inputs.step1OptionsRefs[this.props.createMapStep1SelectedPrompt.name] = {}
                            };

                            Inputs.step1OptionsRefs[this.props.createMapStep1SelectedPrompt.name][option.id] = r
                          }}
                          value={option.id}
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

                {/* END insure we have options */}


              </div>

              {/* <div className="m-2" > Pages </div> */}

            </div>

          </div>
        </main>


        <footer className="px-1 content-footer" >
          &nbsp;
        </footer>

      </>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    step1Prompts : state.mapdesign.step1Prompts ,
  	createMapStep1SelectedPrompt : state.mapdesign.createMapStep1SelectedPrompt,
  	createMapStep1PromptOptions : state.mapdesign.createMapStep1PromptOptions,
    qualifyFilterStep1Prompts : state.mapdesign.qualifyFilterStep1Prompts ,
  };

};


const mapDispatchToProps = (dispatch) => {
  return {

  };
};



export default connect(mapStateToProps, mapDispatchToProps)(CreateMapStep1PromptInputs)