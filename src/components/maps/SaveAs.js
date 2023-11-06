import axios from 'axios';
import React, { Component } from 'react';

import { connect } from "react-redux";


// react bootstrap
import { 
  Form ,  Button, Toast
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import mapboxMap from "../../configs/mapBox";

import { DashboardActions , MapDesignActions , ExplorerActions } from "../../redux/actions";
import Inputs from "../../configs/inputs";
import { apiBaseUrl }  from "../../utilities/Helpers" ;

export class SaveAs extends Component{


  constructor(props){
    super(props);
    this.state = {

      selectedPlotingOption: '',
      file_title : '' ,
      showToast : false 
    }   

  }


  componentDidMount(){

    let panel = this.props.jsPanel ;

    // this.props.selectedSavedMapId ;
    console.log('mmm <<<', panel.footer.querySelector('.sselector_btn_save_as-cancel'));

    panel.footer.querySelector('.selector_btn_save_as-cancel').addEventListener('click' , (e) => {
      return panel.close();
      // let cl = e.target.closest('span').classList
      // panel.content.innerHTML = '<p></p>' ;
    });


    panel.footer.querySelector('.selector_btn_save_as-save_as_new').addEventListener('click' , (e) => {
      
      this.handleDoSaveMap();

      return panel.close();
    }); 


    const btnSaveReplaceExisting = panel.footer.querySelector('.selector_btn_save_as-save_replace_existing') ;
    if(btnSaveReplaceExisting){

      panel.footer.querySelector('.selector_btn_save_as-save_replace_existing').addEventListener('click' , (e) => {
      
        this.handleDoSaveMapOverwrite();
        return panel.close();
      });

    }
    
  }

  
  handleFileTitleChange = async event => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]: val});
  }


  handleDoSaveMapOverwrite = async () => {
    // @TODO set overwrite param

    this.handleDoSaveMap(true);
  }
  
  handleDoSaveMap = async (isOverwrite = false ) => {

    if(mapboxMap.map){

      const dataMatrixId = Inputs.step1Captured['data_set'][0] ;
      var imgData = mapboxMap.map.getCanvas().toDataURL('image/png');

      let mapData = {} ;
      mapData.imgData = imgData ;
      mapData.fileTitle =  this.state.file_title;
      mapData.rootView =  dataMatrixId ;

      mapData.step1Data = Inputs.step1Captured ;
      mapData.step2CapturedInputs = Inputs.step2Captured ;
      mapData.step2CapturedFilters = Inputs.step2FiltersCaptured ;

      mapData.isOverwrite = isOverwrite ;
      mapData.mapId = this.props.savedMap ? this.props.savedMap.id : 0 ;

      
      mapData.geoFilterBox = this.props.geoFilterBox ;

      this.props.setPleaseWait(true);


      let result = await axios.post(
        `${apiBaseUrl()}/api/explorer/maps/save`, // @TODO url as axios global config
        mapData,
        {headers: {'Content-Type': 'application/json'}}
      ).then( async (response) => { // success reponse

        if(response.data.map){

          this.props.setIsMapSaved(true);


          // jump 2
          this.props.setPleaseWait(false);
          this.props.setFlashToast({show:true});

          //alert("saved successfuly...");
          // set map informations

          this.props.setSavedMap(response.data.map);

        }else{
          alert("Error: there was an issue saving the map");
        }


        
        
        // OEM await this.props.loadSavedMaps();
        // OEM this.props.setPleaseWait(false);

        // this.setState({showToast : true}); // @TODO fix toast

        // setTimeout(() => this.props.jsPanel.close() , 2000 ); // allow the toast to yield // @TODO via callback ?

        this.props.jsPanel.close(); // unmout component


      }).catch((error) => {
        console.log(error);
      });


    }

    return true ;

  }

  toastOnClose(){
    this.setState({showToast : false});
  }

  render(){

    return(
      <>

        <Form>

          <Form.Group controlId="file_title" className="col-6">
            <Form.Label> New Title </Form.Label> 
            <Form.Control 
              type="text" 
              placeholder="" 
              name="file_title" 
              className="ddl_text_input_theme form-control ddl-text-input-strong-blue" 
              value={this.state.file_title} 
              onChange={this.handleFileTitleChange} 
              autocomplete="off"
            />
            <Form.Text className="text-muted" >
              eg: my awesome map name
            </Form.Text>
          </Form.Group>

          <br />


          <Toast style={{background:'green'}} onClose={() => this.toastOnClose() } show={this.state.showToast} delay={1500} autohide>
            <Toast.Body>
              <FontAwesomeIcon icon={faCheck} className="mr-2 fa-1x" /> 
              Saved !
            </Toast.Body>
          </Toast>


        </Form>
       
      </>
    )
  }

}


const mapStateToProps = (state) => {
  return {
    selectedSavedMapId: state.mapdesign.selectedSavedMapId ,
    selectedDataMatrix: state.matrices.selectedDataMatrix ,
    geoFilterBox: state.mapdesign.geoFilterBox ,
    savedMap : state.mapdesign.savedMap
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedPlotingOption: (plotOption) => dispatch(DashboardActions.setSelectedPlotingOption(plotOption)),
    loadSavedMaps: async (data) => dispatch(DashboardActions.loadSavedMaps(data)) ,
    setPleaseWait: (data) => dispatch(ExplorerActions.setPleaseWait(data)),
    setSavedMap: (data) => dispatch(MapDesignActions.setSavedMap(data)),
    setFlashToast: (data) => dispatch(ExplorerActions.setFlashToast(data)),
    setIsMapSaved: (data) => dispatch(MapDesignActions.setIsMapSaved(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveAs);
