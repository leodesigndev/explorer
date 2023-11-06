import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import { Link } from "react-router-dom";
import axios from 'axios';
import {connect} from "react-redux" ;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Navbar , Stack
} from 'react-bootstrap';


import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";

import backButtonImg from '../../assets/images/arrow_back_48.png';
import olracLogoImg from '../../assets/images/olrac_logo.png';


class Header extends Component {
	
	componentDidMount(){
		document.documentElement.setAttribute('color-scheme' , 'light' ); // @TODO move to theme provider
	}


	render() {
		return (
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
			                onClick={() => this.handleGoBackToDashboard()}
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

			      <div className="ms-auto" style={{marginRight:"62px" }}> 
			      	<Stack direction="horizontal" gap={2}  >

			      		<div>
			      			<Link to="/explorer/data_matrices">
				      			<Button
										className="ddl-button-style-light-blue ddl-no-outline"
										> 
											<FontAwesomeIcon
											  icon={faPlus} // faLocationDot
											  className="me-2" 
											/>
											List
										</Button>
									</Link>
			      		</div>


			      		<div>
			      			<Link to="/explorer/data_matrices/create">
				      			<Button
										className="ddl-button-style-light-blue ddl-no-outline"
										> 
											<FontAwesomeIcon
											  icon={faPlus} // faLocationDot
											  className="me-2" 
											/>
											Add Fishing Data ... 
										</Button>
									</Link>
			      		</div>








			      		

			      		


			      	</Stack>
			      </div>
			    </nav>

				



			</div>
		);
	}
}

const mapStateToProps = (state) => {
  return {
  	user: state.auth.user
  };

};


const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(Header)