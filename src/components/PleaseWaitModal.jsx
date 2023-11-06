import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';

import {Modal , ProgressBar , CloseButton } from 'react-bootstrap';

import { connect } from "react-redux";
import { ExplorerActions } from "../redux/actions";
import { store } from "../redux";

import {handleTogglePleaseWait} from "./Common" ;

class PleaseWaitModal extends Component {


	constructor(props) {
		super(props);
	}

	handleClosePleaseWait(e){
    handleTogglePleaseWait(false);
  }

	render() {

		return(
			<Modal
        backdrop={`static`} // true
        keyboard={false}
        show={this.props.pleaseWait} // this.props.pleaseWait
        size="sm"
        className="modal_props rounded"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={this.handleClosePleaseWait}
      >
        <Modal.Body>
          <CloseButton style={{color:"red"}} className="ddl-no-outline float-end" variant="white" aria-label="Hide" onClick={ (e) => this.handleClosePleaseWait(e)} /> 

          <h4> Please wait ... </h4>
          
          <ProgressBar animated now={100} />

        </Modal.Body>
      </Modal>
		);
	}

}

const mapStateToProps = (state) => {
  return {
  	pleaseWait : state.explorer.pleaseWait
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PleaseWaitModal));