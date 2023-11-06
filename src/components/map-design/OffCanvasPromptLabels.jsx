import $ from "jquery";
import _ from 'lodash';
import axios from 'axios';
import { withRouter } from "react-router-dom";

import React, { Component } from "react";
import { connect } from "react-redux";

import BootstrapTable from 'react-bootstrap-table-next';
// OEM broken! , follow up issue tracker > import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'; // fix import
// import filterFactory, { multiSelectFilter , textFilter , Comparator } from 'react-bootstrap-table2-filter';


import { 
 Offcanvas , Nav , Tab , Stack , Dropdown , Container , Row
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock , faCheck, faExclamation , faEllipsisVertical , faChevronLeft , faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { MapDesignActions , MatricesActions } from "../../redux/actions";
import Inputs from "../../configs/inputs";
import CustomSearch from "./CustomSearch";
import { apiBaseUrl }  from "../../utilities/Helpers" ;
import {labelsUpdate , labelsUpdate2 , inputCapture , yieldMap } from "../Common";
import {MAP_OPEN_PATH} from '../../utilities/constant';


class OffCanvasPromptLabels extends Component {

  constructor(props){
    super(props);

    this.state = {
      refreshOptions: false
    }

  }


  componentDidMount() { 

    if(this.props.selectedSavedMapId){ // opening saved map // @TODO read if from url and set openedSavedMap + plus check if in open map url
      let mapId = this.props.selectedSavedMapId ;
      this.props.loadMap({id:mapId} , this.savedMapLoaded);
    }else{ // creating from step 1
      let dataMatrixID = Inputs.step1Captured['data_set'][0] ; // @TODO make this `Inputs.step1Captured` a state ?
      // OEM this.props.loadGroupedPrompts({dataMatrixID}); // load config
      this.props.loadGroupedPrompts({dataMatrixID}  , this.defaultPrompts ); // load config
    }


    

    
    // OEM this.props.loadGroupedPrompts({dataMatrixID}); // load config
    // this.props.loadGroupedPrompts({dataMatrixID} , this.groupedPromptsLoaded ); // load config

    
    // console.log("component mounted...." + Date.now() ); // DEBUG

  }

  //+++ test call back to load default
  defaultPrompts = (data) => {

    if(data.defaultedFields && data.defaultedFields.length){ // compute defaults value
      
      Inputs.options = {...data.optionVerbose};  // @TODO , esure defaultield are associate to value already captured

      for(var pathName in data.defaultInputed ){

        

        const value = data.defaultInputed[pathName] ;
        const selectedPrompt = data.defaultedFields.find(prompt =>  prompt.path_name == pathName );

        console.log('pathName <<<<<<<<<<', pathName , value  );

        if(pathName == 'filters-status'){
          // labelsUpdate2(pathName , value , response.data.options);
        }

        labelsUpdate2(pathName , value , data.optionVerbose ); // @TODO delete test function `labelsUpdate2` , unify with `labelsUpdate` @TODO important, inforce update state only once after all populated
        // labelsUpdate(pathName , value);
        inputCapture( value , selectedPrompt );


        //...
      }


      console.log('Inputs.step2Captured <<<<', Inputs.step2Captured );

    }

    // use the above to load many options form server and store in a global options array in `id` as key `label` as value
    // input capture the many fields
    // label update the many fields  (see load many options)



    // jump 3 ...

  }

  //+++ END test call back to load default




  groupedPromptsLoaded = (data) => {

    this.loadManyOptions(data);
    
    /*
    if(this.props.selectedSavedMapId){
      this.props.loadMap({id:this.props.selectedSavedMapId} , this.savedMapLoaded);
    }
    */
    
  }

  savedMapLoaded = (data) => {

    this.props.setSavedMap(data.map);

    const dataMatrixID =  data.map.analytical_model_base_id;
    let mapData = data.map.map_data ;
    mapData = JSON.parse(mapData);

    if(mapData.geo_filter && mapData.geo_filter.length){
      this.props.setGeoFilterBox(data.map.geo_filter);
    }
    
    this.props.loadGroupedPrompts({dataMatrixID} , this.groupedPromptsLoaded ); // load config
  }

  loadManyOptions = async (data) => {

    const mapRecord = this.props.savedMap ; // data.map ;
    const mapData = JSON.parse(mapRecord.map_data);
    const promptData = JSON.parse(mapRecord.map_prompts_data); 

    // console.log('promptData <<<>>>', promptData  );


    const postData = {
      mapId : mapRecord.id
    };
    
    // @TODO loading...


    let result = await axios.post( // @TODO make get request...
        `${apiBaseUrl()}/api/explorer/data_matrices/get_many_options`,
        postData,
        {headers: {'Content-Type': 'application/json'}}
      ).then( async (response) => { // success reponse

        Inputs.options = {...response.data.options}; // @TODO merge instead ?
        // OEM Inputs.options = {...new Set({...Inputs.options , ...response.data.options })}; // remove duplicates
        
        // capture each input
        // const promptData = JSON.parse(mapData.map_data.map_prompts_data);

        for(var pathName in promptData ){
          const value = promptData[pathName] ;

          
          const selectedPrompt = response.data.prompts.find(prompt =>  prompt.path_name == pathName );

          // console.log('selectedPrompt <<<<<<', selectedPrompt );

          if(pathName == 'filters-status'){
            // labelsUpdate2(pathName , value , response.data.options);
          }

          labelsUpdate2(pathName , value , response.data.options); // @TODO delete test function `labelsUpdate2` , unify with `labelsUpdate` @TODO important, inforce update state only once after all populated
          // labelsUpdate(pathName , value);
          inputCapture( value , selectedPrompt );

        }

        // console.log('Inputs.step2FiltersCaptured' , Inputs.step2FiltersCaptured );
        
        //...
        
        

      }).catch((error) => {
        console.log(error);
      });

    
  }

  /*
  componentDidUpdate(){
    if(this.state.refreshOptions){

      const row = this.props.selectedField ;

      if(Inputs.step2Captured[row.path_name] && Inputs.step2Captured[row.path_name].length){
        Inputs.step2Captured[row.path_name].forEach((capturedId) => {
          const optionPath = `field_option-${capturedId}` ; 

          let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);
          console.log('selectedDomItem >>>', selectedDomItem );

          setTimeout(() => {
            let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);
            console.log('selectedDomItem >>>', selectedDomItem );
            // refresh here ?
          } , 1000 );

          
        }); 
      }
      // console.log('Inputs.step2Captured<<<' , Inputs.step2Captured[row.path_name] );

    }
    
    console.log("component did update...." + Date.now() ); // DEBUG

  }
  */

  computePrompt = async (row) => {

    if(row.prompt_type == 'select' || row.prompt_type == 'multiselect' ){

      const selectoRef = Inputs.createMapStep2SelectoRef ;

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


      // @TODO UI loading indicator please wait ....

      // compute this prompt options
      if(row.options != 'compute' && row.options.constructor === Array && row.options.length ){
        this.props.setOptions({pathName:row.path_name , options:row.options });

        // call back to set selected value after time out ?
        setTimeout( () => {
          

          const selectoRef = Inputs.createMapStep2SelectoRef ;


          //console.log('selectoRef2 >>>>', selectoRef.selecto.getSelectedTargets() );


          //console.log('Inputs.step2Captured <<>>>>', Inputs.step2Captured );


          

          // alert("do something");  
          
                 
        } ,  500 );

      }else{

        if(this.props.selectedSavedMapId){

          const dataMatrixID = this.props.savedMap.analytical_model_base_id;
          this.props.loadOptions({dataMatrixID, row});

        }else{

          const dataMatrixID = Inputs.step1Captured['data_set'][0] ; // @TODO make this `Inputs.step1Captured` a store state ?
          this.props.loadOptions({dataMatrixID, row});
        }
        
      }


      /* OEM before set time out

      // curate to options
      this.setState({refreshOptions: true});

      // console.log('Inputs.step2Captured[row.path_name] <<>>', Inputs.step2Captured[row.path_name] ); @TODO delete `step2Captured` key when empty [] ?

      if(Inputs.step2Captured[row.path_name] && Inputs.step2Captured[row.path_name].length){

        let selectedDomItems = [] ;

        Inputs.step2Captured[row.path_name].forEach((capturedId) => {

          if(Inputs.optionsRefs[row.path_name] && Inputs.optionsRefs[row.path_name][capturedId]){
            const optionDomItem = Inputs.optionsRefs[row.path_name][capturedId] ;

            optionDomItem.classList.add("selected");
            selectedDomItems.push(optionDomItem);
          }

          /#*
          setTimeout(() => {

            let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);
            console.log('selectedDomItem >>>', selectedDomItem );

          } , 3000 );
          *#/

          
        }); 

        selectoRef.setSelectedTargets(selectedDomItems);
      }
      //console.log('Inputs.step2Captured<<<' , Inputs.step2Captured[row.path_name] );

      */




      setTimeout( async () => {
        
        // alert("ok");
        // @TODO show loaded ?
        

        // curate to options
        this.setState({refreshOptions: true});

        // console.log('Inputs.step2Captured[row.path_name] <<>>', Inputs.step2Captured[row.path_name] ); @TODO delete `step2Captured` key when empty [] ?

        if(Inputs.step2Captured[row.path_name] && Inputs.step2Captured[row.path_name].length){

          let selectedDomItems = [] ;

          Inputs.step2Captured[row.path_name].forEach((capturedId) => {

            if(Inputs.optionsRefs[row.path_name] && Inputs.optionsRefs[row.path_name][capturedId]){
              const optionDomItem = Inputs.optionsRefs[row.path_name][capturedId] ;

              optionDomItem.classList.add("selected");
              selectedDomItems.push(optionDomItem);
            }

            /*
            setTimeout(() => {

              let selectedDomItem = document.querySelector(`[option_path="${optionPath}"]`);
              console.log('selectedDomItem >>>', selectedDomItem );

            } , 3000 );
            */

            
          }); 

          selectoRef.setSelectedTargets(selectedDomItems);
        }
        //console.log('Inputs.step2Captured<<<' , Inputs.step2Captured[row.path_name] );


        // yield the map ?
        if(this.props.selectedSavedMapId && this.props.history.location.pathname.includes(MAP_OPEN_PATH) ){ // 


          let scaleType = this.props.scaleType ;
    
          scaleType = scaleType == 'linear' ? 'logarithm' : 'linear' ;
          
          const {steps , colorRange} = await yieldMap({scaleType});
          this.props.setLegendData({steps, colorRange});
          this.props.setScaleType(scaleType);


        }

           
      } ,  300 );















      


    }else if(row.prompt_type == 'text'){

      // @TODO compute default value
      let theValue = '' ;

      const txtRef = Inputs.createMapStep2TxtRef ;

      if(Inputs.step2Captured[row.path_name] && Inputs.step2Captured[row.path_name].length){
        theValue = Inputs.step2Captured[row.path_name] ; 
      }

      txtRef.value = theValue ; 

    }

  }

  handleNavFieldItemSelect = async (eventKey , e ) => {

    if(eventKey == 'tabs_field_group-setup'){

    }else if(eventKey == 'tabs_field_group-filters'){

    }

    this.props.setTabKeyFields(eventKey);
  }


  render() {

    // const { SearchBar } = Search;

    const columnsBuilder = (groupName) => {

      const columns = [
        {
          dataField: 'name',
          text: 'Field Name',
          hidden: true
        },
        {
          dataField: 'path_name',
          text: 'Path Name',
          hidden: false, // true => no filter applicable
          style : {"display": 'none'} ,
          headerStyle : {"display": 'none'} /*,

          filter: groupName != 'filters' ? false :  multiSelectFilter({
            options: selectFilterOptions ?  {...selectFilterOptions} : {} ,
            getFilter: (filter) => {
              this.qualityFilter = filter;
            }
          }) */
        },
        {
          dataField: 'label',
          text: 'Display Name',
          formatter:(cellContent, row , rowIndex , formatExtraData) => {
            return(
              <div className={ row.locked ? "field_display_locked" : "field_display" }  >
                <Stack direction="horizontal" gap={3}>
                  <div className="d-flex align-self-start">
                    {rowIndex + 1 }.
                  </div>
                  <div>
                    {row.display_label ? row.display_label : row.label }
                    <br />
                    <span style={{fontSize:"20px" , fontWeight: "bold"}}>
                      {(() => {
                        if(row.value){
                          return ( <span className="pr-1"> {row.value } </span> );
                        }else if(row.capturedValue.length){
                          return row.capturedValue.map( option => (
                            <span className="pr-1"> {option.label } </span>
                          ))
                        }else{
                          return (<span> ? </span>) ;
                        }

                      })() }
                    </span>
                  </div>
                  <div className="ms-auto">
                    {row.locked &&
                      <FontAwesomeIcon icon={faLock} style={{color:"#7f7f7fff", fontSize:"23px"}} className="fa-2x" /> 
                    }

                    { (!row.capturedValue.length && row.required ) &&
                      <FontAwesomeIcon icon={faExclamation} style={{color:"red", fontSize:"2rem"}} />
                    }
                  </div>
                </Stack>
              </div>
            )
          }
        }
      ];

      return columns ;

    }

    const rowClasses = (row, rowIndex) => {
      let classes = `selector-prompt-label-${row.path_name}`;
      return classes;
    }

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
      selected: this.props.selectedFieldPathName ,
      classes: 'selector-field-row-selected',
      onSelect: (row, isSelect, rowIndex, e) => {

        //+++
        // console.log('groupedPrompts>>>>' , this.props.groupedPrompts );


        // move to next field by index +++
        {/* OEM
        const currentGroupIndex =  this.props.groupedPrompts.findIndex(group => group.groupName == row.grouped );
        const currentPromptIndex =  this.props.groupedPrompts[currentGroupIndex].fields.findIndex(prompt => prompt.path_name == row.path_name );
        
        const nextPromptIndex = currentPromptIndex + 1 ;
        const nextFieldPathName = this.props.groupedPrompts[currentGroupIndex].fields[nextPromptIndex].path_name ;

        // let el = $(`.selector-prompt-label-${row.path_name}`).eq(0); // @TODO scroll to next element vs scroll to currently selected ?
        // let el = document.querySelector(`.selector-prompt-label-${nextFieldPathName}`).click();
        setTimeout(() => document.querySelector(`.selector-prompt-label-${nextFieldPathName}`).click() , 3000 );
        */}

        // END move to next field by index +++


        // @TODO set tab
        // OEM this.props.setSelectedField([row.path_name]);
        // OEM this.props.setSelectedField([row]);
        this.props.setSelectedField(row);

        this.computePrompt(row);
        
       
      }
    }

    return(

      <Offcanvas
        show={this.props.showOffCanvasAnalysisPromptLabels}
        backdrop={false}
        scroll={true}
        style={{width:"20%" , marginTop:"104px" ,  marginBottom:"56px" , background:"#2B4B6A" }} //  54px main header + 50px second header  
        id="div_off_canvas_prompt_labels"
        className="map-controls ddl-offcanvas"
      >
        <Offcanvas.Header style={{padding : "0.8rem"}}>
          <Stack direction="horizontal" gap={1} style={{width : "100%" }}>
            <div style={{width : "100%" }} >
              <Nav
                fill
                justify
                activeKey={this.props.tabKeyFields} 
                className="ddl-tab-nav-style-strong-blue" //  me-auto sticky-top */}
                style={{width : "100%"}} // marginBottom:"0.8rem" */}
                variant="pills" 
                defaultActiveKey="tabs_field_group-setup" 
                onSelect={this.handleNavFieldItemSelect} 
              >
                { this.props.groupedPrompts.length && 
                  this.props.groupedPrompts.map( (promptGroup , fieldGroupIndex) => (
                    <Nav.Item >
                      <Nav.Link eventKey={`tabs_field_group-${promptGroup.groupName}`} data-group={promptGroup.groupName}  > {promptGroup.groupLabel}  </Nav.Link>
                    </Nav.Item>
                  ))
                }
              </Nav>
            </div>
          </Stack>
        </Offcanvas.Header>


        <Offcanvas.Body className="position-relative selector-off-canvas-prompt-label" style={{ padding : "0.3rem" }}  >
          <div className="mh-100" >
            <Tab.Container id="tabcontainer_fields" activeKey={this.props.tabKeyFields} style={{marginTop:"20px"}} >
              <Tab.Content>
                { this.props.groupedPrompts.length && 
                  this.props.groupedPrompts.map( (groupedPrompt , fieldGroupIndex) => (
                    <Tab.Pane eventKey={`tabs_field_group-${groupedPrompt.groupName}`} className="ddl-datatable-field-labels" >

                      <ToolkitProvider
                        keyField="path_name"
                        data={ groupedPrompt.fields }
                        columns={columnsBuilder(groupedPrompt.groupName)}
                        search
                      >
                        {
                          props => (
                            <>
                              { groupedPrompt.groupName == 'filters' &&
                                <CustomSearch {...props.searchProps} />
                              }


                              <BootstrapTable
                                { ...props.baseProps }
                                //OEM keyField="path_name" 
                                //OEM data={ groupedPrompt.fields }
                                //OEM columns={ columnsBuilder(groupedPrompt.groupName) } 
                                rowEvents={ handleFieldRowEvent } 
                                selectRow={ handleFieldSelectRow }
                                headerClasses="header-class"
                                classes="ddl-datatable-classes"
                                rowClasses={rowClasses }
                                // filter={filterFactory()}
                                
                                ref={r => {
                                  Inputs.datatableGroupRefs[groupedPrompt.groupName] = {
                                    groupName : groupedPrompt.groupName,
                                    ref:r
                                  }
                                }}
                              />

                            </>
                          )
                        }
                      </ToolkitProvider>

                    </Tab.Pane>
                  ))
                }
              </Tab.Content>
            </Tab.Container>

          </div>
        </Offcanvas.Body>

      </Offcanvas> 

    );
  }


}

const mapStateToProps = (state) => {
  return {
    showOffCanvasAnalysisPromptLabels: state.explorer.showOffCanvasAnalysisPromptLabels ,
    selectedSavedMapId : state.mapdesign.selectedSavedMapId,
    savedMap : state.mapdesign.savedMap,
    selectedField: state.matrices.selectedField ,
    selectedFieldPathName: state.matrices.selectedFieldPathName ,
    tabKeyFields: state.mapdesign.tabKeyFields ,
    groupedPrompts : state.matrices.groupedPrompts
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setTabKeyFields : (data) => dispatch(MapDesignActions.setTabKeyFields(data)) ,
    setSelectedField : (data) => dispatch(MatricesActions.setSelectedField(data)),
    setOptions : (data) => dispatch(MapDesignActions.setOptions(data)),
    loadOptions : (data) => dispatch(MapDesignActions.loadOptions(data)),
    loadGroupedPrompts : (data , callback) => dispatch(MatricesActions.loadGroupedPrompts(data , callback)),
    loadMap : (data , callback) => dispatch(MapDesignActions.loadMap(data , callback)),

    setLegendData : (data) => dispatch(MapDesignActions.setLegendData(data)),
    setScaleType : (data) => dispatch(MapDesignActions.setScaleType(data)),
    setGeoFilterBox : (data) => dispatch(MapDesignActions.setGeoFilterBox(data)),
    setSavedMap: (data) => dispatch(MapDesignActions.setSavedMap(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OffCanvasPromptLabels));              