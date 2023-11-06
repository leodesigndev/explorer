import axios from 'axios';
import React, { Component } from "react";
//import { Link, useHistory } from "react-router-dom";
// import { Link } from "react-router-dom";
import { Link , withRouter } from "react-router-dom";
import ReactDOMServer from 'react-dom/server';

import { connect } from "react-redux";

import { 
  Button
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus , faFloppyDisk , faEdit , faLocationDot , faTrashCan , faArrowRight
} from '@fortawesome/free-solid-svg-icons';

import SaveAs from './SaveAs';
import {createJsPanel} from '../../configs/jsPanelOptions';

import {toggleFilters} from "../Common";

import {apiBaseUrl }  from "../../utilities/Helpers" ;
import ConfirmationDialog from '../ConfirmationDialog';
import NotificationDialog from '../NotificationDialog';
import UserMenu from '../users/Menu';



class MapsMenuStep1 extends Component {

  constructor(props){
    super(props);

    this.continueCreateNewMap = this.continueCreateNewMap.bind(this);
  }


  createCustomJsPannel = (title , comp , modal , attributes ) => {
    createJsPanel(title, comp, modal , attributes , this.props.panels ) ;
  }


  continueCreateNewMap = (e) => {

    console.log('this.props >>>', this.props );

    //const history = useHistory();

    // poke tube to set store with global selection (site global selection ) ....
    //history.push("/explorer/maps/create_step/2");

    this.props.history.push("/explorer/maps/create_step/2")

  }

  openSavedMap = (e) => {

    if(!this.props.selectedSavedMapId){


      NotificationDialog({
        title : 'Dynamic Data Logger',
        type : 'error',
        // msg , a string or a function returning jsx
        msg : () => {
          return(
            <>
              <div> Please select a map first.  </div>
            </>
          )
        }
      });

      // alert("Please select a map first");
    }else{
      this.props.history.push(`/explorer/maps/open/${this.props.selectedSavedMapId}`)
    }

  }


  handleSoftDelete = (e) => {

    const id = this.props.selectedSavedMapId ;
    if(!id){

      NotificationDialog({
        title : 'Dynamic Data Logger',
        type : 'error',
        // msg , a string or a function returning jsx
        msg : () => {
          return(
            <>
              <div> Please select a map first.  </div>
            </>
          )
        }
      });

      // alert("Please select a map first");
    }else{


      return ConfirmationDialog({
        title : 'Confirm Delete',
        //type : 'information',
        // msg , a string or a function returning jsx
        msg : () => {
          return(
            <>
              <div> Confirmation required  </div>
            </>
          )
        },
        action: (confirmed) => {
          if(confirmed){
            // const id = e.target.getAttribute("data-id");
            this.doHide(id);
          }

        }

      });

      /*
      axios.delete(
        `${apiBaseUrl()}/api/explorer/maps/soft_delete`, {id} ,
        {
          headers: {
            "Content-Type": 'application/json'
          }
        }
      ).then( (response) => { // success reponse
        if(!response.data.error){
          // this.props.loadMatrices();
        }

      }).catch((error) => {
        console.log(error);
      });
      */

    }

  }


  doSoftDelete = (id) => {

    axios.delete( `${apiBaseUrl()}/api/explorer/maps/soft_delete` , {
        headers: {
          "Content-Type": 'application/json'
        },
        data: {
          id
        }
      }).then( (response) => {

        console.log(response); 

      }).catch((error) => {
        console.log(error);
      });

  }


  


  mmm = (e) => {

    toggleFilters(e, false); // @TODO toogle var
  }



  render() {
    return(
      <>

        <div>
          <Button
          className="ddl-button-style-light-blue ddl-no-outline" 
          onClick={this.continueCreateNewMap}
          > 
            <FontAwesomeIcon
              icon={faArrowRight} // faLocationDot
              className="me-2" 
            />
            Continue ... 
          </Button>
        </div>



        {/* @TODO cleanup divider */}

        <div style={{display:"inline-block" , lineHeight:"1.5" , fontSize:"1rem" , borderLeft:"1px solid #5686B6 " , width:"10px" , marginLeft:"10px "}}>
          <div style={{display:"inline-block" , lineHeight:"1.5" , fontSize:"1rem" , borderLeft:"1px solid #0E2338 " }}> &nbsp; </div>
        </div>


        <UserMenu />

      </>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    selectedSavedMapId: state.mapdesign.selectedSavedMapId,
    //panels: state.dashboard.panels,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    //toggleOffCanvasAnalysisPromptLabels : (data) => dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptLabels(data)),
    //toggleOffCanvasAnalysisPromptInputs : (data) => dispatch(ExplorerActions.toggleOffCanvasAnalysisPromptInputs(data)),
    //setTabKeyLandingPage : (data) => dispatch(ExplorerActions.setTabKeyLandingPage(data)),
    //loadDataMatrices: () => dispatch(MatricesActions.loadDataMatrices())
  };
};



export default connect(mapStateToProps , mapDispatchToProps )(withRouter(MapsMenuStep1));