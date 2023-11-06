import React, { Component } from 'react';

import { connect } from "react-redux";
import { DashboardActions , ExplorerActions , MatricesActions } from "../redux/actions";
import { store } from "../redux";
import matriceConfig from "../configs/matrice";

// react bootstrap
import { 
  Form , Button , Container , Row , Col , Stack
} from 'react-bootstrap';

import { FAVOURITE_FIELDS_CONFIG } from "../utilities/constant";

class ConfigFavouriteFields extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedOptions: {},
			baseOptions: {
				"TRIPID" : true
			}
		}

	}

	componentDidMount(){

		this.props.loadConfig(FAVOURITE_FIELDS_CONFIG , this.props.selectedDataMatrix.id);

		let panel = this.props.jsPanel ;
		panel.footer.querySelector('.selector_btn_config_favourite_fields-cancel').addEventListener('click' , (e) => {
			return panel.close();
			// let cl = e.target.closest('span').classList
			// panel.content.innerHTML = '<p></p>' ;
		});

		panel.footer.querySelector('.selector_btn_config_favourite_fields-ok').addEventListener('click' , async (e) => {

			//handle
			await this.submitForm(e);
		});


		// let favouriteFields = {}; // saved modified
		let favouriteFields = JSON.parse(this.props.selectedDataMatrix.favourite_filters);

		// console.log('favouriteFields >>>' , favouriteFields );



		//+++
		// we want to computer the groupes here
		// from all fields
		// this.props.favouriteFieldsGrouped.forEach();

		//END+++
		let grouped = {} ;
		let groupedLatitude = {} ;
		let groupedLongitude = {} ;

		if(matriceConfig.fields.length){
			matriceConfig.fields.forEach(field => {

				// all field are favourite by default
				// favouriteFields[field.name] = true ;
				// except if i have an explicit list of favourites ?
				//... ?


				// we donot wan to repeat the replicating of lonlat from the holder explorer
				// grouped[field.root_table] = field ;

				if(field.is_latitude){ // latitude filtering

					groupedLatitude[field.root_table] = groupedLatitude[field.root_table] ?? [];
					groupedLatitude[field.root_table].push(field) ;

				}else if (field.is_longitude){ // longitude filtering
					groupedLongitude[field.root_table] = groupedLongitude[field.root_table] ?? [];
					groupedLongitude[field.root_table].push(field);
				}else{ // general filtering
					grouped[field.root_table] = grouped[field.root_table] ?? [];
					grouped[field.root_table].push(field); 
				}
				
			});
		}

		let groupedCollection = [];
		let groupedLatitudeCollection = [] ;
		let groupedLongitudeCollection = [] ;

		for (var name in grouped) {
			groupedCollection.push({ name, fields : grouped[name] });
		}

		for (var name in groupedLatitude) {
			groupedLatitudeCollection.push({ name, fields : groupedLatitude[name] });
		}

		for (var name in groupedLongitude) {
			groupedLongitudeCollection.push({ name, fields : groupedLongitude[name] });
		}


		this.props.setFavouriteFieldsGrouped({
			grouped : groupedCollection , 
			groupedLatitude : groupedLatitudeCollection, 
			groupedLongitude : groupedLongitudeCollection
		});

		
		// OEM this.setState({ selectedOptions :  favouriteFields  });
		this.setState({ selectedOptions :  favouriteFields ? favouriteFields : {}  });
		
		

		// +++ attach custom scroll
		/* @TODO fix the custom scroll in relation to the general scrolls
		['selector_general-filtering' , 'selector_latitude-filtering' , 'selector_longitude-filtering' ].map(target => {

	    window.jQuery(`.${target}`).mCustomScrollbar({ 
	      theme: "light",
	      // OEM axis:"yx",
	      axis:"y",
	      setHeight:100,
	      // theme:"dark",
	      scrollEasing : "linear",
	      scrollInertia : 0,
	      autoDraggerLength : false
	    });

	  });
	  */
		//END+++ attach custom scroll











	}


	submitForm = async (event) => {

		event.preventDefault();

		let data = {};

		data.name = FAVOURITE_FIELDS_CONFIG ;
		data.matrixId = this.props.selectedDataMatrix.id ;

		let fieldsAndValue = {} ;
		this.props.favouriteFieldsGroupedGeneralFiltering.forEach(group => {
			group.fields.forEach(field => fieldsAndValue[field.path_name] = this.props.configs[field.path_name] ) ; // @TODO urse path_name instead ? 
		});
		this.props.favouriteFieldsGroupedLatitudeFiltering.forEach(group => {
			group.fields.forEach(field => fieldsAndValue[field.path_name] = this.props.configs[field.path_name] ) ;
		});  
		this.props.favouriteFieldsGroupedLongitudeFiltering.forEach(group => {
			group.fields.forEach(field => fieldsAndValue[field.path_name] = this.props.configs[field.path_name] ) ;
		});

		data.data = {
			...fieldsAndValue
		};
		data.token = this.props.token;

		this.props.saveConfig(data , this.FavouriteFieldsSaved);
		
		//***  fieldsAndValue[column.name] = this.props.configs[column.name]

		/* OEM :-)
		let data = {};

		data.data = {
			selectedOptions : this.state.selectedOptions ,
			id : this.props.selectedDataMatrix.id
			//baseOptions : this.state.baseOptions // @TODO we need this ?
		}

		console.log('data >>>>>' , data.data.selectedOptions );

		// data.token = this.props.token; // @TODO add user token
		this.props.saveConfigFavouriteFields(data);
		// this.clearForm(event);

		*/

	}

	FavouriteFieldsSaved = (data) => {

		//+++
		let {selectOptions , defaultOptions } = Object.keys(this.props.configs).reduce((acc , pathName) => {

      if(!acc['selectOptions'])
        acc['selectOptions'] = {} ;

      acc['selectOptions'][pathName] = pathName ;

      if(!acc['defaultOptions'])
        acc['defaultOptions'] = [] ;

      if(this.props.configs[pathName])
        acc['defaultOptions'].push(pathName);
      
      return acc ;

    } , {} );

		// OEM this.props.setMmmOptions([ 'tblTRIP_ID' , 'tblTRIP_TripDurationHours' ]);
		this.props.setMmmOptions(defaultOptions);

		// apply filter
		// then allow close bellow

		//END+++


		this.props.jsPanel.close();
		
	}

	handleCheckChanged = (event) => {

		const { name, value } = event.target;
		this.props.setConfig({ key : FAVOURITE_FIELDS_CONFIG , name , value: !this.props.configs[name] }); // @TODO do we need defaults ?
	}

	render() {
		return(
			<Container>

				<Row>
	        <Col>

	        	<fieldset className="border ddl-fieldset-border rounded-3 p-3 selector_general-filtering" style={{minHeight:"430px"}} >
							<legend className="float-none w-auto px-3" > General filtering </legend>
								{this.props.favouriteFieldsGroupedGeneralFiltering.map((group) => (
									<div className="ps-2"> 
										<div className="mb-3"> {group.name} </div>
										<div>

											{group.fields.map((field) => (
												<div key={`checkbox_${field.path_name}`} className="mb-3">
													<Form.Check type="checkbox" >
														<Form.Check.Input
															name={field.path_name}
															checked={this.props.configs[field.path_name]}
															onChange={this.handleCheckChanged}
															value={this.props.configs[field.path_name]}
															disabled={this.state.baseOptions[field.path_name]} // @TODO review
															type="checkbox" 
															className="ddl-blue-check hover ddl-no-outline" 
															style={{fontSize:"1.2rem"}} 
														/>
														<Form.Check.Label 
															style={{lineHeight:"1.2rem" , marginTop:".3rem" }} 
														>
															{field.display_label}
														</Form.Check.Label>

													</Form.Check>
												</div>
											))}

										</div>

									</div>
								))}
						</fieldset>
	        </Col>
	        
	        <Col>

	        	<Stack gap={3}>
				      <div>
				      	<fieldset className="border ddl-fieldset-border rounded-3 p-3 selector_latitude-filtering" style={{minHeight:"190px"}} >
									<legend className="float-none w-auto px-3" > Latitude </legend>

									
									{this.props.favouriteFieldsGroupedLatitudeFiltering.map((group) => (
										<div> 
											<div className="mb-3"> {group.name} </div>
											<div>

												{group.fields.map((field) => (
													<div key={`checkbox_${field.path_name}`} className="mb-3">
														<Form.Check type="checkbox" >
															<Form.Check.Input
																name={field.path_name}
																checked={this.props.configs[field.path_name]}
																onChange={this.handleCheckChanged}
																value={this.props.configs[field.path_name]}
																disabled={this.state.baseOptions[field.path_name]} // @TODO review
																type="checkbox" 
																className="ddl-blue-check ddl-no-outline" 
																style={{fontSize:"1.2rem"}} 
															/>
															<Form.Check.Label 
																style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
															>
																{field.display_label}
															</Form.Check.Label>

														</Form.Check>
													</div>
												))}

											</div>

										</div>
									))}

								</fieldset>

				      </div>

				      <div>
				      	<fieldset className="border ddl-fieldset-border rounded-3 p-3 selector_longitude-filtering" style={{minHeight:"190px"}} >
									<legend className="float-none w-auto px-3" > Longitude </legend>

									
									{this.props.favouriteFieldsGroupedLongitudeFiltering.map((group) => (
										<div> 
											<div className="mb-3"> {group.name} </div>
											<div>

												{group.fields.map((field) => (
													<div key={`checkbox`} className="mb-3">
														<Form.Check type="checkbox" >
															<Form.Check.Input
																name={field.path_name}
																checked={this.props.configs[field.path_name]}
																onChange={this.handleCheckChanged}
																value={this.props.configs[field.path_name]}
																disabled={this.state.baseOptions[field.path_name]} 
																type="checkbox" 
																className="ddl-blue-check ddl-no-outline" 
																style={{fontSize:"1.2rem"}} 
															/>
															<Form.Check.Label 
																style={{lineHeight:"1.2rem" , marginTop:".3rem" }} 
															>
																{field.display_label}
															</Form.Check.Label>

														</Form.Check>
													</div>
												))}

											</div>

										</div>
									))}

								</fieldset>

				      </div>
				    </Stack>
	        </Col>
	      </Row>
		      
			</Container>
		);
	}

}

const mapStateToProps = (state) => {
  return {
  	token: state.auth.user.token,
    configs:  state.explorer.configs[FAVOURITE_FIELDS_CONFIG] ,

    promptsGrouped: state.dashboard.promptsGrouped,
    selectedDataMatrix: state.matrices.selectedDataMatrix,
    favouriteFieldsGroupedGeneralFiltering : state.explorer.favouriteFieldsGroupedGeneralFiltering,
    favouriteFieldsGroupedLatitudeFiltering : state.explorer.favouriteFieldsGroupedLatitudeFiltering,
    favouriteFieldsGroupedLongitudeFiltering : state.explorer.favouriteFieldsGroupedLongitudeFiltering
    
  };
};


const mapDispatchToProps = (dispatch) => {
	const state = store.getState();
  return {
    setFavouriteFieldsGrouped: (data) => dispatch(ExplorerActions.setFavouriteFieldsGrouped(data)),
    saveConfigFavouriteFields : (data) => dispatch(MatricesActions.saveConfigFavouriteFields(data)), // @TODO deprecate this

    saveConfig: (data , callback = null) => dispatch(ExplorerActions.saveConfig(data , callback)) ,
    loadConfig: (key , matrixId) => dispatch(ExplorerActions.loadConfig({key, token : state.auth.user.token , matrixId })),
    setConfig: (data) => dispatch(ExplorerActions.setConfig(data)),

    setMmmOptions: (data) => dispatch(ExplorerActions.setMmmOptions(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigFavouriteFields);