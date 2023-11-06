import React, { useEffect } from "react";
import axios from 'axios';

import {
  Toast , Button , ToastContainer
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen , faCheck , faXmark} from '@fortawesome/free-solid-svg-icons';

import "../../theme1.css";
import DDLThemeProvider from '../DDLThemeProvider' ;
import {renderJsPanlesInsidePortal } from '../../configs/jsPanelOptions';
import { connect } from "react-redux";
import DelphiEnv from '../DelphiEnv';
import { BASE_API_URL } from "../../redux/services/constant";
import { AuthActions , ExplorerActions } from "../../redux/actions";
import PleaseWaitModal from '../PleaseWaitModal';


const Layout = ({children , panels , flashToast , setFlashToast }) => {

  const jsPanels = Object.keys(panels);

  useEffect(() => {
    
    document.addEventListener("onGotCurrentUser", async e => {
      const username = e.detail.username ;

      let result = await axios.post(
        `${BASE_API_URL}/api/explorer/users/registration`, // @TODO url as axios global config
        {username}, // uniquely adentify users only with the user name in this instance
        {
          headers: {
            "Content-Type": 'application/json'
          }
        }
      ).then( async (response) => {

        if(!response.data.error){
          this.props.setUser(response.data);

          // @TODO auto lauch generation of matrices ? 
        }

      }).catch((error) => {
        console.log(error);
      });


    });

    if(DelphiEnv.isParentEnv()){
      window.ddl.getCurrentUser('onGetCurrentUser');
    }  

  },[]);

  
  
  return(
    <DDLThemeProvider>
      <div class="container-fluid cover-container  d-flex flex-column p-0" >
        <div class="row-fluid flex-fill overflow-hidden"> {/*position-relative*/}
          
          {children}
          {jsPanels.length > 0 && renderJsPanlesInsidePortal(panels)}
          

          {/* @TODO make a stand alone <FlashNotification /> component , type and msg configuraiton for layouts */}
          <ToastContainer
            className="p-3"
            position={`middle-center`} 
            style={{ zIndex: 1 }}
          >
            <Toast 
              style={{background:'green'}} 
              onClose={() => setFlashToast({show:false})} 
              show={flashToast.show}
              delay={1500} 
              autohide 
              animation={true}
            >
              <Toast.Body >
                <FontAwesomeIcon icon={faCheck} className="me-2 fa-1x" /> 
                Saved !

                <FontAwesomeIcon 
                  icon={faXmark} 
                  className="ms-2 fa-2x align-self-end" // float-right , justify-content-end , align-items-end , align-self-end , ml-auto ,  text-right
                  style={{cursor:"pointer"}} 
                  onClick={() => alert("Closing Toast... ")}
                />  
                

              </Toast.Body>
            </Toast>

            </ToastContainer>

          <PleaseWaitModal />

          {/* Toast */}


        </div>
      </div>
    </DDLThemeProvider>

  );
}

const mapStateToProps = (state) => {
  return {
    flashToast: state.explorer.flashToast,
    panels: state.dashboard.panels
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => dispatch(AuthActions.setUser(data)),
    setFlashToast: (data) => dispatch(ExplorerActions.setFlashToast(data))
  };
};

export default connect(mapStateToProps , mapDispatchToProps )(Layout);