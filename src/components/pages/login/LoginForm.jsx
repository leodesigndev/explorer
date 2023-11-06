import React, { Component } from "react";
import { withTranslation, Trans } from 'react-i18next';
import { withRouter } from "react-router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faCheck } from '@fortawesome/free-solid-svg-icons';

import { 
  Toast , Button, Stack , Alert
} from 'react-bootstrap';


import { connect } from "react-redux";
import { AuthActions } from "../../../redux/actions";
import Loader from "../../loader";


class LoginForm extends Component {


	constructor(props) {
	    super(props);
	    this.state = {
	    	showToast : false ,
	    	username: "",
	    	password: "",
	    	errors: {
	       		username: "Enter User Name!",
	    		password: "Enter Password!",
	    	},

	    	showLogoutSuccessNotification : new URLSearchParams(this.props.location.search).get("logout") == 'success' ? true : false
	    };
	   
	}

	inputChange = (event) => {
		const { name, value } = event.target;
		console.log(event.target.value, event.target.name);
		this.setState({ [name]: value });
		this.validationErrorMessage(event);
	};


	validationErrorMessage = (event) => {
		const { name, value } = event.target;
		let errors = this.state.errors;
		switch (name) {
		  case "username":
		    errors.username = value.length < 1 ? "Enter User Name" : "";
		    break;
		  case "password":
		    errors.password = value.length < 1 ? "Enter Password" : "";
		    break;
		  default:
		    break;
		}
		this.setState({ errors });
	};


	submitForm = async (event) => {
		event.preventDefault();
		console.log(this.state.username, this.state.password);
		// this.props.dispatch(AuthTypes.TOGGLE_LOADING);
		this.props.dispatch(
		  AuthActions.login({
		    username: this.state.username,
		    password: this.state.password,
		  })
		);
	};

	render() {
		const { username, password } = this.state;
		return(

			<div 
				className="d-flex align-items-center justify-content-center"
			>
				<Stack direction="horizontal" gap={3}>

		      <div className="col-12" >

		      	
						{ this.state.showLogoutSuccessNotification &&
							
							<div className="col-12 pb-1" >

								<Alert
									variant="success"
									onClose={()=> this.setState({showLogoutSuccessNotification : false})}
									dismissible
								>
									<p> Successfully logged out! </p>
								</Alert>
							</div>
						}
						

		      	<form 
							className="col-12"
						>
			        <div className="mb-4 col-12">
			          <label htmlFor="username" for="dataMatrixName" className="form-label"> <Trans i18nKey="loginPage.username">Username</Trans> </label> 
			          <input 
			          	value={username}
			          	name="username"
			          	onChange={(e) => this.inputChange(e)}
			          	type="text" 
			          	className="form-control ddl-text-input-strong-blue ddl-no-outline"
			          	id="username"  
			          	autocomplete="off"
			          	required 
			          />
			          { ((username.length < 4) && false )  ? 
			          	(<div className="text-error text-xs py-1 font-medium" > {" "} enter a valid username {" "} </div>) 
			          	: 
			          	null 
			        	}
			        </div>


			        <div className="mb-4 col-12">
			          <label for="dataMatrixName" class="form-label"> <Trans i18nKey="loginPage.password">Password</Trans> </label>
			          <input 
			          	name="password"
			            value={password}
			            onChange={(e) => this.inputChange(e)}
			          	type="password" 
			          	className="form-control ddl-text-input-strong-blue" 
			          	id="password"
			          	required
			          	autocomplete="off" 
			          />

			          {/* OEM 
			          {password.length < 8 && password.length >= 1 ? (
			            <div className="text-error text-xs py-1 font-medium">
			              {" "}
			              the password should be more than 8 charecters{" "}
			            </div>
			          ) : null}
			        	*/}

			        </div>


			      	{/*+++ the tailwind version */}
			        {!this.props.isLoading ? (
			          <div className="d-flex mt-6 justify-content-end">
			            <Button
			              type="submit"
			              size="lg"
			              onClick={this.submitForm}
			              className="ddl-button-style-light-blue"
			              // className={`w-full cursor-pointer justify-center items-center bg-primary hover:bg-indigo-700 transition-all py-2 px-4 rounded border focus:outline-none`}
			            >
			              <div className=" text-sm text-white"><Trans i18nKey="common.login">Login</Trans></div>
			            </Button>
			          </div>
			        ) : (
			          <div className="d-flex mt-6 justify-content-end">
			            <Button
			              className={`w-100 ddl-button-style-light-blue`}
			            >
			              <div className="justify-self-center">
			                <Loader color="#ffffff" />
			              </div>
			            </Button>
			          </div>
			        )}



			        {this.props.error.length > 0 && !this.props.isLoading ? (
			          <p className="text-error text-sm text-center py-1 font-medium">
			            {this.props.error}
			          </p>
			        ) : null}


			      	{/*+++ end the tailwind version */}

			      	{/*
			        <div className="mb-4 col-8">
			          <Button 
			          	type="submit" 
			          	onClick={this.submitForm}
			          	variant="primary" 
			          	className="nav-button" 
			          	size="lg" 
			          	style={{background:"#486079" , borderColor:"#486079" }} 
			        	> 
			        		Login 
			        	</Button>
			        </div>
			        */}

			        <Toast style={{background:'green'}} onClose={() => this.setState({showToast : false})} show={this.state.showToast} delay={1500} autohide>
			          <Toast.Body>
			            <FontAwesomeIcon icon={faCheck} className="mr-2 fa-1x" /> 
			            Logged In ! {/* @TODO use toast to authenticate */}
			          </Toast.Body>
			        </Toast>

			      </form>


		      </div>

					<div> 

						<div className="mb-3 col-12">
		        	<div 
		        		className="rounded-circle col-2 p-5 d-flex align-items-center justify-content-center" 
		        		style={{background:"#4b5f83" , height:"2rem" , width:"2rem"}}
		        	>
		          	<FontAwesomeIcon icon={faUser} className="fa-3x" />
		          </div>
		        </div>

					</div>
		    </Stack>
				
			</div>
		);


	}


}

const mapToState = (state) => {
  return {
    error: state.auth.errorMessage, // @TODO backend translations for errors etc...
    isLoading: state.auth.isLoading,
    isLoggedIn: state.auth.isLoggedIn
  };
};

export default withTranslation()(connect(mapToState)(withRouter(LoginForm)));