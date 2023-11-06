import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { multiSelectFilter , textFilter , Comparator } from 'react-bootstrap-table2-filter';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome , faFileLines , faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import { 
 Offcanvas , Nav , Tab , Stack , Dropdown
} from 'react-bootstrap';

import DelphiEnv from '../DelphiEnv';
import { MapDesignActions } from "../../redux/actions";
import Inputs from "../../configs/inputs";
import { apiBaseUrl }  from "../../utilities/Helpers" ;


class CreateMapStep1PromptLabels extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // initialLoad : false
    }

    // this.qualityFilter = null ;
  }

  componentDidMount() { 

    let fieldName = this.props.step1Prompts[0].name ; // first field name
    setTimeout(() => {
      document.querySelector(`.step1_selector-prompt-label-${fieldName}`).click(); 
    } , 300 );


    // activate first field
    // console.log('this.props.step1Prompts<<<<' , this.props.step1Prompts[0].name);
    
    
    // jump1 ...



    setTimeout(() => {
      
      /*
      if(typeof this.props.qualifyFilterStep1Prompts === 'function'){
        this.props.qualifyFilterStep1Prompts(["map_creation_method"]);
      }
      */

      /*
      if(typeof this.qualityFilter === 'function'){
        this.qualityFilter(["map_creation_method"]);  
      }
      */

      /*
      this.qualityFilter({
        map_creation_method : "map_creation_method"
      });
      */
      /*
      this.qualityFilter = {
        
        map_creation_method : {
          id: 1,
          name: "map_creation_method",
          label: "Map Creation Method",
          prompt_type: 'select',
          options: [
            {
              id : 1,
              value : "historical_data",
              label : "Historical Data"
            },
            {
              id : 2,
              value : "ai_model",
              label : "AI Model"
            }
          ],
        }
        

        //map_creation_method : "map_creation_method"
      };
      // alert("done");
      */


    } , 3000 );
  }


  getOption = async (row) => {

    if(row.prompt_type == 'select' || row.prompt_type == 'multiselect' ){

      const selectoRef = Inputs.createMapStep1SelectoRef ;

      // clear out selecto container 
      selectoRef.setSelectedTargets([]);
      const container = selectoRef.selecto.dragContainer[0];
      for (var i = 0; i < container.childNodes.length; i++) { // @TODO instead of using optionsRefs use this to compute selection ?
        let element = container.childNodes[i] ;
        if(element.classList.contains('selected')){
          element.classList.remove("selected");
        }
      }

      // some re-configuration
      if(row.prompt_type == 'multiselect'){
        selectoRef.selecto.options.continueSelect = true ;
      }else{
        selectoRef.selecto.options.continueSelect = false ; // console.log(selectoRef.props.continueSelect);
      }


      if(row.options != 'compute' && row.options.constructor === Array && row.options.length ){
        this.props.setCreateMapStep1PromptOptions(row.options);
      }else{

        try {

          if(row.name == 'data_set'){

            const response = await axios.get(
              `${apiBaseUrl()}/api/explorer/data_matrices/get_matrices`
            );

            let options = [] ;
            response.data.matrices.map((matrix) => {
              options.push({
                id: matrix.id ,
                value: matrix.name ,
                label: matrix.name 
              });
            });

            this.props.setCreateMapStep1PromptOptions(options);
          
          }else if(row.name == 'ai_model'){

            // @TODO toggle `selecto no selectable` ? or `escape item on selectEnd ?`

            let options = [
              {
                empty: true,
                msg: "No AI Option yet..."  // @TODO query server for AI Models
              }
            ];
            
            this.props.setCreateMapStep1PromptOptions(options);

          }


        } catch (error) {
          throw error;
        }

      }


      // set option values
      if(Inputs.step1Captured[row.name] && Inputs.step1Captured[row.name].length){

        let selectedDomItems = [] ;
        Inputs.step1Captured[row.name].forEach((capturedId) => {
          if(Inputs.step1OptionsRefs[row.name] && Inputs.step1OptionsRefs[row.name][capturedId]){
            const optionDomItem = Inputs.step1OptionsRefs[row.name][capturedId] ;

            optionDomItem.classList.add("selected");
            selectedDomItems.push(optionDomItem);
          }
        });

        selectoRef.setSelectedTargets(selectedDomItems);

      }



    }else if(row.prompt_type == 'text'){

    }

  }

  computePrompt = async (row) => {  
    this.getOption(row);
  }
 

  render() {

    /* OEM
    if(!this.state.initialLoad){
      if(typeof this.props.qualifyFilterStep1Prompts === 'function'){
        this.props.qualifyFilterStep1Prompts(["map_creation_method"]);
        this.setState({initialLoad : true});
      }
    }
    */

    let step1PromptsFiltered = this.props.step1Prompts.reduce((acc , prompt) => {
      acc[prompt.name] = prompt.name ;
      return acc ;
    } , {} );
  

    // let step1PromptsFiltered = this.props.step1Prompts.map((prompt) => ( {[prompt.name]: prompt.name } ));

    
    const columns = [
      {
        dataField: 'name',
        text: 'Field Name',
        hidden: false , // true => no filter applicable
        style : {"display": 'none'} ,
        headerStyle : {"display": 'none'} ,
        filter: multiSelectFilter({
          options: step1PromptsFiltered ?  {...step1PromptsFiltered} : {} ,
          // defaultValue: [{"map_creation_method": "map_creation_method"} ], // ["map_creation_method"], 
          getFilter: (filter) => {
            filter(["map_creation_method"]);
            
            // OEM this.qualityFilter = filter;
            this.props.setQualifyFilterStep1Prompts(filter); // @TODO deprecate this ?
          }
        })
      },
      {
        dataField: 'label',
        text: 'Display Name',
        formatter:(cellContent, row , rowIndex , formatExtraData) => {
          return (
            <div className={ row.locked ? "field_display_locked" : "field_display" }  >
              <Stack direction="horizontal" gap={3}>
                <div className="d-flex align-self-start">
                  {rowIndex + 1 }.
                </div>

                <div>
                  {row.label}
                </div>

              </Stack>
            </div>
          );
        }
      }

    ];


    const handleFieldRowEvent = {
      onClick: (e, row, rowIndex) => {

      },
      onMouseEnter: (e, row, rowIndex) => {
        // console.log(`enter on row with index: ${rowIndex}`);
      },
      onDoubleClick: (e, row, rowIndex) => {

      }
    }
    
    const handleFieldSelectRow = {

      mode: 'radio',
      clickToSelect: true ,
      hideSelectColumn: true,
      selected: this.props.createMapStep1SelectedPromptPathName ,
      classes: 'selector-field-row-selected',
      onSelect: (row, isSelect, rowIndex, e) => {

        if(isSelect){

        }else{

        }
        

        this.props.setCreateMapStep1SelectedPrompt(row);
        //this.props.setCreateMapStep1SelectedPrompt(row);
        this.computePrompt(row);
      }
    }

    const rowClasses = (row, rowIndex) => {
      let classes = `step1_selector-prompt-label-${row.name}`;
      return classes;
    }


    /*
    setTimeout(() => {
      this.qualityFilter = {
        map_creation_method : "map_creation_method"
      };
      
    } , 10000 );
    */

    return (
      <>
        
        <div className="ddl-datatable-field-labels">
          <BootstrapTable
            keyField="name" 
            data={ this.props.step1Prompts} 
            columns={ columns }
            rowEvents={ handleFieldRowEvent } 
            selectRow={ handleFieldSelectRow }
            headerClasses="header-class"
            classes="ddl-datatable-classes"
            rowClasses={rowClasses }
            filter={filterFactory()}
            ref={r => {
              Inputs.datatableStep1Ref = r ;
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    step1Prompts : state.mapdesign.step1Prompts ,
    createMapStep1SelectedPrompt : state.mapdesign.createMapStep1SelectedPrompt,
    createMapStep1SelectedPromptPathName : state.mapdesign.createMapStep1SelectedPromptPathName,
    qualifyFilterStep1Prompts : state.mapdesign.qualifyFilterStep1Prompts ,
  };

};


const mapDispatchToProps = (dispatch) => {
  return {
    setCreateMapStep1SelectedPrompt : (data) => dispatch(MapDesignActions.setCreateMapStep1SelectedPrompt(data)),
    setCreateMapStep1PromptOptions : (data) => dispatch(MapDesignActions.setCreateMapStep1PromptOptions(data)),
    setQualifyFilterStep1Prompts : (data) => dispatch(MapDesignActions.setQualifyFilterStep1Prompts(data))
    
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(CreateMapStep1PromptLabels)