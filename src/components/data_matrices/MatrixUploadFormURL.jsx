import axios from 'axios';
import React, { Component } from "react";

import { 
  Toast , Button
} from 'react-bootstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen , faCheck } from '@fortawesome/free-solid-svg-icons';

import { connect } from "react-redux";
import { ExplorerActions , DashboardActions } from "../../redux/actions";
import { BASE_API_URL } from "../../redux/services/constant";
import { apiBaseUrl }  from "../../utilities/Helpers" ;


class MatrixUploadFormURL extends Component {


	constructor(props){
		super(props);

		this.state = {
		  showToast : false 
		}
	}


	uploadMatrix = (e) => {

    alert('load data from API');
    return false

	}

  toastOnClose(){

    this.setState({showToast : false});
    this.props.setTabKeyLandingPage(`tabs_main-landing-welcome`);
  }

	render() {

		return(

			<div>

                <p> <h3> API Endpoint </h3>  </p>


                <form ref='uploadForm' 
                  id='uploadForm' 
                  action={`${apiBaseUrl()}/api/explorer/data_matrices/upload`}
                  method='post' 
                  encType="multipart/form-data"
                  // onSubmit = { this.mmmhandleSubmit }
                >


                  <div className="mb-4 col-8">
                    <label for="dataMatrixName" class="form-label"> url </label>
                    <input type="text" className="form-control ddl-text-input-strong-blue ddl-no-outline" name="dataMatrixURL" autocomplete="off" />

                    <div className="text-muted small"> eg: https://www.service.ddm.com </div>
                  </div>


                  <div className="mb-4 col-8">
                    {/* OEM <input type='submit' value='Upload!' /> onClick={this.uploadMatrix} */}
                    <Button 
                      type="button" 
                      onClick={this.uploadMatrix} 
                      variant="primary" className="nav-button" 
                      size="lg" style={{background:"#486079" , borderColor:"#486079" }} 
                    >
                      Load Data...
                    </Button>
                  </div>

                  
                  
                  <Toast style={{background:'green'}} onClose={() => this.toastOnClose() } show={this.state.showToast} delay={1500} autohide>
                    <Toast.Body>
                      <FontAwesomeIcon icon={faCheck} className="mr-2 fa-1x" /> 
                      Loaded !
                    </Toast.Body>
                  </Toast>
              		
                </form>



              </div>

		);
	}

}

const mapStateToProps = (state) => {
  return {
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setTabKeyLandingPage : (data) => dispatch(ExplorerActions.setTabKeyLandingPage(data)),
    loadDataMatrices: () => dispatch(DashboardActions.loadDataMatrices()) ,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MatrixUploadFormURL);
