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


class LeftNav extends Component {
  

  render() {
    return (
      <div class="nav" style={{marginTop:"50px" , marginLeft: "0.5rem"}} >
        <Nav 
          variant="pills" 
          className="flex-column ddl-tab-nav-style2"
          defaultActiveKey="tabs_main-open"
          onSelect={this.handleNavlandingItemSelect}
          activeKey={this.props.tabKeyLandingPage} // @TODO review this attribute ?
        >

          <Nav.Item className="py-3">
            <Nav.Link eventKey="tabs_main-open" id="nav_item-open" className="ddl-no-outline">
              
              <div className="text-center" >
                <FontAwesomeIcon icon={faFolderOpen} className="fa-3x" /> {/* faFileImport | faSmileBeam | faDatabase */}
                <div className="mt-1"> Saved Maps  </div> {/*Open*/}
              </div>

            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="py-3">
            <Nav.Link eventKey="tabs_main-landing_new" id="mmmid_new" className="ddl-no-outline">
              
              <div className="text-center" >
                <FontAwesomeIcon icon={faFileLines} className="fa-3x" />
                <div className="mt-1"> My Fishing Data </div>
              </div>

            </Nav.Link>
          </Nav.Item>
        </Nav>

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



export default connect(mapStateToProps, mapDispatchToProps)(LeftNav)