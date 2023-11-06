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
import DelphiEnv from '../DelphiEnv';


class MatrixUploadForm extends Component {


	constructor(props){
		super(props);

		this.state = {
		  showToast : false ,

      // used ony when embeded
      dataFile : '' , 
      configFile : '' ,
      dataMatrixName : ''
      // END used ony when embeded


		}
	}


  componentDidMount(){


    document.addEventListener("onGotIpcOpenFileDialog", async e => {

      const {fileName , inputName } = e.detail ;

      this.setState({ [inputName]:fileName });

    });


  }


	uploadMatrix = async (e) => {

    if(DelphiEnv.isParentEnv()){
      
      let formData = {
        dataFile : this.state.dataFile ,
        configFile : this.state.configFile ,
        dataMatrixName : this.state.dataMatrixName
      };
      this.props.setPleaseWait(true);

      axios.post(`${BASE_API_URL}/api/explorer/data_matrices/upload_embeded`, formData, {
        headers: {
          "Authorization": `Bearer ${this.props.user.token}`
        },
      })
      .then((res) => {

        this.props.setPleaseWait(false);
        this.setState({showToast : true});
        this.props.loadDataMatrices();

      })
      .catch((err) => {
        this.props.setPleaseWait(false);
        console.log(err);
      });


    }else{
      
      const form = document.querySelector("form#uploadForm");
      const formData = new FormData(form);

      this.props.setPleaseWait(true);

      axios.post(`${BASE_API_URL}/api/explorer/data_matrices/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${this.props.user.token}`
        },
      })
      .then((res) => {

        this.props.setPleaseWait(false);
        // console.log(res);

        this.setState({showToast : true});
        this.props.loadDataMatrices();

      })
      .catch((err) => {
        this.props.setPleaseWait(false);
        console.log(err);
      });

    }

  }


  toastOnClose(){

    this.setState({showToast : false});
    this.props.setTabKeyLandingPage(`tabs_main-landing-welcome`);
  }

	render() {

		return(

			<div>

                <p> <h3> Upload data files </h3>  </p>


                <form ref='uploadForm' 
                  id='uploadForm' 
                  action={`${apiBaseUrl()}/api/explorer/data_matrices/upload`} 
                  method='post' 
                  encType="multipart/form-data"
                  // onSubmit = { this.mmmhandleSubmit }
                >
                  { DelphiEnv.isParentEnv() ?

                    <>
                      <div>
                        
                        <Button
                          onClick={() => DelphiEnv.filePickerDialog('dataFile') }
                          size="lg"
                          className="ddl-button-style-strong-blue me-3 mb-1"
                        >
                          File upoload ...
                        </Button>

                        {this.state.dataFile}

                      </div>
                      

                      <div>
                        <Button
                          onClick={() => DelphiEnv.filePickerDialog('configFile') }
                          size="lg"
                          className="ddl-button-style-strong-blue me-3 mb-1"
                        >
                          File upoload configuration ...
                        </Button>

                        {this.state.configFile}
                      </div>

                    </>

                  :
                    <>
                    <div className="mb-4 col-8">
                      <label for="formFile" class="form-label"> Data File </label>
                      <div class="input-group custom-file-button mb-3">

                        <label class="input-group-text nav-button" for="inputGroupFile" style={{background:"#486079" , borderColor:"#486079" , color:"white" }}> 
                          <FontAwesomeIcon icon={faFolderOpen} style={{color:"white", fontSize:"23px"}} className="fa-1x me-1" />  Browse File... 
                        </label>
                        <input type="file" className="form-control ddl-text-input-strong-blue" id="inputGroupFile" name="dataFile" autocomplete="off" />
                      </div>

                    </div>

                    <div className="mb-4 col-8">
                      <label for="formFile" class="form-label"> Configuration File  </label>
                      <div class="input-group custom-file-button mb-3">

                        <label class="input-group-text nav-button" for="inputGroupFileConfig" style={{background:"#486079" , borderColor:"#486079" , color:"white" }}> 
                          <FontAwesomeIcon icon={faFolderOpen} style={{color:"white", fontSize:"23px"}} className="fa-1x me-1" />  Browse File... 
                        </label>
                        <input type="file" className="form-control ddl-text-input-strong-blue" id="inputGroupFileConfig" name="dataFileConfig" autocomplete="off" />
                      </div>

                    </div>
                    </>

                  }


                  <div className="mb-4 col-8">
                    <label for="dataMatrixName" class="form-label"> Label </label>
                    <input type="text" className="form-control ddl-text-input-strong-blue" name="dataMatrixName" autocomplete="off" onChange={(e) => this.setState({dataMatrixName : e.target.value }) } />
                  </div>



                  <div className="mb-4 col-8">
                    <label for="dataMatrixDescription" class="form-label"> Description </label>
                    <textArea className="form-control ddl-text-input-strong-blue"  name="dataMatrixDescription" rows="4" ></textArea>
                  </div>



                  <div className="mb-4 col-8">
                    {/* OEM <input type='submit' value='Upload!' /> onClick={this.uploadMatrix} */}
                    <Button type="button" onClick={this.uploadMatrix} variant="primary" className="nav-button" size="lg" style={{background:"#486079" , borderColor:"#486079" }} > Upload </Button>
                  </div>

                  
                  
                  <Toast style={{background:'green'}} onClose={() => this.toastOnClose() } show={this.state.showToast} delay={1500} autohide>
                    <Toast.Body>
                      <FontAwesomeIcon icon={faCheck} className="mr-2 fa-1x" /> 
                      Saved !
                    </Toast.Body>
                  </Toast>
              		
                </form>



              </div>

		);
	}

}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user ,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setTabKeyLandingPage : (data) => dispatch(ExplorerActions.setTabKeyLandingPage(data)),
    loadDataMatrices: () => dispatch(DashboardActions.loadDataMatrices()) ,
    setPleaseWait: (data) => dispatch(ExplorerActions.setPleaseWait(data)) ,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MatrixUploadForm);
