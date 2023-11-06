import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome , faFileLines , faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Nav
} from 'react-bootstrap';


import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";


class LayoutContent extends Component {
	

	render() {
    return (
      <div id="layoutSidenav_content" className="ddl-explorer-main-view" > 
        <header className="px-1 content-head" >
          mmm
        </header>

        <main>
          <div className="container-fluid p-0 content-view" >

            <div className="p-2" >
                
              <div className="m-2" style={{background:"red"}} > Header </div>

              <div className="m-2" style={{background:"blue" , height: "calc(100vh - 17rem )" }} > Pages </div>

              <div className="m-2" style={{background:"yellow" }} > Pages </div>

            </div>

          </div>
        </main>


        <footer className="px-1 content-footer" >
          mmm
        </footer>

      </div>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  };

};


const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(LayoutContent)