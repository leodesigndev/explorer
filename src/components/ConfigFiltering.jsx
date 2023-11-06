import React, { Component } from 'react';

import { connect } from "react-redux";
import { ExplorerActions } from "../redux/actions";
import { store } from "../redux";

// react bootstrap
import { 
  Form , Button , Container , Row , Col
} from 'react-bootstrap';

import { FILTERING_CONFIG } from "../utilities/constant";

class ConfigFiltering extends Component {


	constructor(props) {
		super(props);

		this.state = {
			language : "", // @TODO load from Props when remembered
			selectedOption: ""
		}

	}

	componentDidMount(){

		this.props.loadConfig(FILTERING_CONFIG);

		let panel = this.props.jsPanel ;
		panel.footer.querySelector('.selector_btn_config_filtering-cancel').addEventListener('click' , (e) => {
			return panel.close();
			// let cl = e.target.closest('span').classList
			// panel.content.innerHTML = '<p></p>' ;
		});

		panel.footer.querySelector('.selector_btn_config_filtering-ok').addEventListener('click' , async(e) => {
			await this.submitForm(e);
			return panel.close();
		});

	}

	handleCheckChanged = (event) => {
		const { name, value } = event.target;
		this.props.setConfig({ key : FILTERING_CONFIG , name , value: !this.props.configs[name] }); // @TODO do we need defaults ?

	}

	handleInputChange = (event) => {
		const { name, value } = event.target;
		this.props.setConfig({key : FILTERING_CONFIG , name , value });
	}


	submitForm = async (event) => {

		event.preventDefault();

		let data = {};

		data.name = FILTERING_CONFIG ;
		data.data = {
			doThisOption: this.props.configs.doThisOption,
			numbStdDeviations: this.props.configs.numbStdDeviations,
			numbDroppedPoints: this.props.configs.numbDroppedPoints,
			autoRefreshMapOnFilterOption: this.props.configs.autoRefreshMapOnFilterOption,
			minNumbRecords: this.props.configs.minNumbRecords,
		}
		data.token = this.props.token;

		this.props.saveConfig(data);
	}

	render() {
		return(
			<Container>

				<Row>
	        <Col>

	        	<fieldset className="border ddl-fieldset-border rounded-3 p-3" style={{minHeight:"230px"}} >
							<legend className="float-none w-auto px-3" > Automatically filter out outliers </legend>

							

							<div className="mb-3">
								<Form.Check type="checkbox" >
									<Form.Check.Input
										checked={this.props.configs.doThisOption}
			            	onChange={this.handleCheckChanged}
			            	value={this.props.configs.doThisOption}
			            	name="doThisOption"
			            	type="checkbox" 
			            	className="ddl-blue-check hover ddl-no-outline" 
			            	style={{fontSize:"1.2rem"}}
									/>
									<Form.Check.Label 
										style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
									>
										Do this
									</Form.Check.Label>

								</Form.Check>
							</div>


							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
				        <Form.Label>Number of standard deviations</Form.Label>
				        <Form.Control 
				        	name="numbStdDeviations"
				        	value={this.props.configs.numbStdDeviations}
				        	onChange={this.handleInputChange}
				        	style={{width:"100px"}}
				        	type="number"
				        	min="3"
				        	max="100" 
				        	placeholder="3" 
				        	className="ddl-text-input-strong-blue hover ddl-no-outline" 
				        />
				      </Form.Group>


				      <div className="mb-3">
								<Form.Check type="checkbox" >
									<Form.Check.Input
										checked={this.props.configs.numbDroppedPoints}
			            	onChange={this.handleCheckChanged}
			            	value={this.props.configs.numbDroppedPoints}
			            	name="numbDroppedPoints"
			            	type="checkbox" 
			            	className="ddl-blue-check hover ddl-no-outline" 
			            	style={{fontSize:"1.2rem"}}
									/>
									<Form.Check.Label 
										style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
									>
										Report number of dropped points
									</Form.Check.Label>

								</Form.Check>
							</div>


		                        
						</fieldset>
	        </Col>
	        
	        <Col>

	        	<fieldset className="border ddl-fieldset-border rounded-3 p-3" style={{minHeight:"230px"}} >
							<legend className="float-none w-auto px-3" > Map Drawing </legend>

							<div className="mb-3">
								<Form.Check type="checkbox" >
									<Form.Check.Input
										checked={this.props.configs.autoRefreshMapOnFilterOption}
			            	onChange={this.handleCheckChanged}
			            	value={this.props.configs.autoRefreshMapOnFilterOption}
			            	name="autoRefreshMapOnFilterOption"
			            	type="checkbox"
			            	className="ddl-blue-check hover ddl-no-outline" 
			            	style={{fontSize:"1.2rem"}}
									/>
									<Form.Check.Label 
										style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
									>
										Auto refresh Map when filtered
									</Form.Check.Label>

								</Form.Check>
							</div>


							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
				        <Form.Label>Minimum Number of records needed to draw </Form.Label>
				        <Form.Control 
				        	name="minNumbRecords"
				        	value={this.props.configs.minNumbRecords}
				        	onChange={this.handleInputChange}
				        	style={{width:"100px"}}
				        	type="number"
				        	min="3" 
                	max="100" 
				        	placeholder="3" 
				        	className="ddl-text-input-strong-blue hover ddl-no-outline"  
				        />
				      </Form.Group>
        
						</fieldset>

	        </Col>
	      </Row>
		      
			</Container>
		);
	}

}

const mapStateToProps = (state) => {
  return {
    token: state.auth.user.token,
    configs:  state.explorer.configs[FILTERING_CONFIG]
  };
};


const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
    saveConfig: (data) => dispatch(ExplorerActions.saveConfig(data)) ,
    loadConfig: (key) => dispatch(ExplorerActions.loadConfig({key, token : state.auth.user.token })),
    setConfig: (data) => dispatch(ExplorerActions.setConfig(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigFiltering);
