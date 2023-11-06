import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Navbar , Stack
} from 'react-bootstrap';

import DelphiEnv from '../../DelphiEnv';
import backButtonImg from '../../../assets/images/arrow_back_48.png';
import olracLogoImg from '../../../assets/images/olrac_logo.png';

const DDLMenuBar = ({children}) => {

  const handleGoBackToDashboard = () => {
    return ('goBackToDashboard' in window.ddl) ? window.ddl.goBackToDashboard(1) : false ;
  }


  return(
    <div>
      <nav 
            className={`sb-topnav navbar navbar-expand navbar-dark main-nav-bar ${ DelphiEnv.isParentEnv() ? 'ddl-header' : '' }`}
          >
          <Navbar.Brand href="#" className="ps-3 navbar-brand" >
            { DelphiEnv.isParentEnv() ?

                <>
                  <img
                    alt="Back"
                    src={backButtonImg}
                    className="back-button-img"
                    onClick={() => handleGoBackToDashboard()}
                  />

                  {' '}
                  <span className="page-title"> Explorer </span>
                </>
                :

                <img
                  alt="Back"
                  src={olracLogoImg}
                  className="back-button-img"
                  style={{height: "48px"}}
                />
            }
          </Navbar.Brand>

          {children}
          
        </nav>
      </div>

  );
}

export default DDLMenuBar;