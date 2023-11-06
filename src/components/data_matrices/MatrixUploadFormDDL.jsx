import axios from 'axios';
import React, { Component } from "react";

import {
  Toast , Button , Modal, Card , ProgressBar
} from 'react-bootstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen , faCheck } from '@fortawesome/free-solid-svg-icons';

import { connect } from "react-redux";
import { ExplorerActions , DashboardActions } from "../../redux/actions";
import { BASE_API_URL } from "../../redux/services/constant";
import { apiBaseUrl }  from "../../utilities/Helpers" ;


class MatrixUploadFormDDL extends Component {


	constructor(props){
		super(props);

		this.state = {
		  showToast : false ,

      // -------------refresh-loader------------
      refreshDataLoading: false,
      refreshModal:false,
      emptyView: true,
      cancelView: false,
      cardViewList: [], //UI list
      noOfGeneratedViews: 0,
      //-----------------end region-------------

      // -------------views-list----------------
      viewNameList: [],
      //------------------end region------------

		}
	}



  /**
   * Fetches a list of views' from API to be generated based on the client
   * @returns {Promise<unknown>} A promise to fetch the list of views
   */
  getViewsList(){
    const message = "Fetching client views for generation...."
    return new Promise((resolve, reject) => {
      axios.post(
        `${apiBaseUrl()}/api/explorer/data_matrices/get_view_list`, // @TODO url as axios global config
        {accessToken: message}, // @TODO get token from user param
        {headers: {'Content-Type': 'application/json', "Authorization": `Bearer ${this.props.user.token}`} }
      ).then((response) => {
        resolve('Success')
        this.handleViewNameListUpdate(response.data.viewNameList); //update viewNameList content

      }).catch((error) => {
        console.log("Error Report: " + error);
        reject('Failed')
      });
    })
  }

  handleShowRefreshModal = () =>{
    this.setState({refreshModal: true});
  }

  handleCardViewListEmpty = () =>{
    this.setState({noOfGeneratedViews: 0});
    this.setState({cardViewList: []});
  }


  handleShowRefreshDataLoading = () =>{
    this.setState({refreshDataLoading: true});
  }

  handleCloseRefreshDataLoading = () =>{
    this.setState({refreshDataLoading: false});
  }

  handleCloseRefreshModal = () =>{
    this.setState({refreshModal: false});
  }

  handleEmptyView = () =>{
    this.setState({emptyView: false});
  }

  handleCancelView = (stateValue) =>{
    this.setState({cancelView: stateValue});
  }

  handleViewNameListUpdate = (viewNameList) =>{
    this.setState({viewNameList: viewNameList});
  }

  handleNoOfGeneratedViews = () =>{
    let curNumOfViews = this.state.noOfGeneratedViews;
    curNumOfViews = curNumOfViews + 1;
    this.setState({noOfGeneratedViews: curNumOfViews});
  }

  updateStateUI(){
    this.props.addToDataMatrices(this.state.cardViewList); //change state
    this.props.setTabKeyLandingPage(`tabs_main-landing-welcome`); //show on dashboard
    this.props.loadDataMatrices(); //reload the data matrices
  }

  /**
   * The calling method for updating the views
   * @returns {Promise<void>} A promise to generate the views
   */

  updateViews = async () => {
    this.handleCardViewListEmpty();

    await this.getViewsList();
    this.handleShowRefreshModal();
    this.handleShowRefreshDataLoading();
    const viewListSize = this.state.viewNameList.length;

    await this.getViewsRecursive(0, viewListSize).then((message)=>{
      console.log('Success: ' + message);
      this.updateStateUI();
      this.handleCancelView(false);
    });

    //update ui state
    this.handleCloseRefreshDataLoading();
    this.handleCloseRefreshModal();
  }

  /**
   * Method initiates the view_generation process
   * for all the views recursively. i.e. one view at a time.
   * This also allows the user ability to cancel the
   * process at anytime.
   * @param pos The start position of the array
   * @param size The size of the views' list
   * @returns {Promise<void>} A promise for the generation of one
   * view at a time.
   */
  getViewsRecursive = async (pos, size) =>{
    if(pos === size) //stopping condition 1
      return;

    if(this.state.cancelView) //stopping condition 2
      return;

    const curView = this.state.viewNameList[pos];
    await this.getViewFromServer(curView).then((message)=>{
      console.log('Success: ' + message);
      this.handleNoOfGeneratedViews(); //update the number of views generated
    })

    await this.getViewsRecursive(pos + 1, size);
  }


  /**
   * This function attempts to fetch a view from DSP as
   * prompted by the calling function getViews()
   * @param curView The name of a view
   * @returns {Promise<unknown>} A promise that fetches
   * the view info from server.
   */
  getViewFromServer = (curView) =>{
    return new Promise((resolve, reject) => {
      axios.post(
        `${apiBaseUrl()}/api/explorer/data_matrices/get_view`, // @TODO url as axios global config
        {accessToken: curView}, // @TODO get token from user param
        {headers: {'Content-Type': 'application/json', "Authorization": `Bearer ${this.props.user.token}`} }
      ).then((response) => { // success response
        resolve('Success')
        this.handleEmptyView();

        const cardViewObj = response.data.cardView;
        this.state.cardViewList.push(cardViewObj);
      }).catch((error) => {
        console.log("Error Report: " + error);
        reject('Failed')
      });
    })
  }

	loadViews = (e) => {

    this.updateViews();
    return true ;

	}

  toastOnClose(){

    this.setState({showToast : false});
    this.props.setTabKeyLandingPage(`tabs_main-landing-welcome`);
  }

  progressPercent = () => {
    return (this.state.noOfGeneratedViews * 100 ) / this.state.viewNameList.length ;
  }

	render() {

		return(

			<div>

                <p> <h3> Elog database </h3>  </p>


                <form ref='uploadForm'
                  id='uploadForm'
                  action={`${apiBaseUrl()}/api/explorer/data_matrices/upload`}
                  method='post'
                  encType="multipart/form-data"
                  // onSubmit = { this.mmmhandleSubmit }
                >

                  <div className="mb-4 col-6">
                    <label for="dataMatrixName" class="form-label"> DB path: </label>

                    <label > ddldatabase </label>

                    <input
                      disabled
                      type="text"
                      className="form-control ddl-text-input-strong-blue"
                      name="dataMatrixName"
                      autocomplete="off"
                      value="ddldatabase"
                    />
                  </div>


                  <div className="mb-4 col-8">
                    {/* OEM <input type='submit' value='Upload!' /> onClick={this.uploadMatrix} */}
                    <Button
                      type="button"
                      onClick={this.loadViews}
                      variant="primary"
                      className="nav-button"
                      size="lg"
                      style={{background:"#486079" , borderColor:"#486079" }}
                    >
                      Load Data
                    </Button>
                  </div>


                  {/*+++ new progress modal */}
                  <Modal
                    show={this.state.refreshModal}
                    //show={true}
                    onHide={this.handleCloseRefreshModal}
                    //size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="modal_props rounded"
                    dialogClassName="modal-25w"
                    //backdropClassName="mmmbackdrop"
                    backdrop="static"
                  >
                    <Modal.Body className="modal_props2 rounded">

                      <h4>Refreshing Data</h4>
                      {this.state.cancelView ? <p>Stopping view processing....please wait</p> : <p>{this.state.noOfGeneratedViews} of {this.state.viewNameList.length} views generated...</p>}
                      <ProgressBar variant="success" animated now={this.progressPercent()} className="ddl-progress" />

                    </Modal.Body>
                    <Modal.Footer className="modal_props2" style={{border:"0"}}>
                      <Button className="ddl-button-style-light-blue ddl-no-outline" onClick={() => this.handleCancelView(true)} > Cancel </Button>
                    </Modal.Footer>
                  </Modal>
                  {/*+++ new progress modal */}


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
    addToDataMatrices: (data) => dispatch(DashboardActions.addToDataMatrices(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MatrixUploadFormDDL);
