import React, { Component } from 'react';

import { connect } from "react-redux";
import { DashboardActions , ExplorerActions } from "../redux/actions";
import { store } from "../redux";

// react bootstrap
import { 
  Form , Button , Container , Row , Col
} from 'react-bootstrap';

import { MAPPER_CONFIG } from "../utilities/constant";


class ConfigMapper extends Component {


	constructor(props) {
		super(props);

		this.state = {
			
			selectedLatLongDisplayOption: "",

			defaultViewMode : 3 ,
			vesselTrackingInterval: 1 ,

			showTitles: false ,
			showFishingActivities: true ,
			trackVessel: true ,
			showTripTracks: true ,
			showLegend: true , 

			vesselMarkerSize : 250 ,
			vesselMarkerFillColour : "#563d7c" 
		}

	}

	componentDidMount(){ // MAPPER_CONFIG

		this.props.loadConfig(MAPPER_CONFIG); // @TODO change inputs state after loading.... @TODO handle in between states for `whileLoading` and `onError`

		let panel = this.props.jsPanel ;
		panel.footer.querySelector('.selector_btn_config_mapper-cancel').addEventListener('click' , (e) => {
			return panel.close();
			// let cl = e.target.closest('span').classList
			// panel.content.innerHTML = '<p></p>' ;
		});

		panel.footer.querySelector('.selector_btn_config_mapper-ok').addEventListener('click' , async (e) => {
			
			await this.submitForm(e);

			// @TODO show toast inside timeout before exit ?

			return panel.close();

		});

	}

	submitForm = async (event) => {
		event.preventDefault();

		let data = {};

		/* OEM
		data.data = {
			selectedLatLongDisplayOption: this.state.selectedLatLongDisplayOption,
			defaultViewMode: this.state.defaultViewMode,
			vesselTrackingInterval: this.state.vesselTrackingInterval,
			showTitles: this.state.showTitles,
			showFishingActivities: this.state.showFishingActivities,
			trackVessel: this.state.trackVessel,
			showTripTracks: this.state.showTripTracks,
			showLegend: this.state.showLegend,
			vesselMarkerSize: this.state.vesselMarkerSize,
			vesselMarkerFillColour: this.state.vesselMarkerFillColour
    };
    */

    data.name = MAPPER_CONFIG ;

    data.data = {
			selectedLatLongDisplayOption: this.props.configs.selectedLatLongDisplayOption,
			defaultViewMode: this.props.configs.defaultViewMode,
			defaultGridType: this.props.configs.defaultGridType,
			vesselTrackingInterval: this.props.configs.vesselTrackingInterval,
			showTitles: this.props.configs.showTitles,
			showFishingActivities: this.props.configs.showFishingActivities,
			trackVessel: this.props.configs.trackVessel,
			showTripTracks: this.props.configs.showTripTracks,
			showLegend: this.props.configs.showLegend,
			vesselMarkerSize: this.props.configs.vesselMarkerSize,
			vesselMarkerFillColour: this.props.configs.vesselMarkerFillColour,
			unitOfMeasurement: this.props.configs.unitOfMeasurement,
			mapLegendColorType: this.props.configs.mapLegendColorType
    };

    
    data.token = this.props.token;
    // OEM this.props.saveMapperConfig(data); // @TODO deprecate

    this.props.saveConfig(data);

	}

	handleCheckChanged = (event) => {

		const { name, value } = event.target;
		this.props.setConfig({ key : MAPPER_CONFIG , name , value: !this.props.configs[name] }); // @TODO do we need defaults ?
	}

	handleInputChange = (event) => {

		//this.validationErrorMessage(event);
		const { name, value } = event.target;
		this.props.setConfig({key : MAPPER_CONFIG , name , value });

	}

	render() {

		return(
			<Container>

				<Row className="mb-4">
	        <Col>

	        	<fieldset className="border ddl-fieldset-border rounded-3 p-3" >
							<legend className="float-none w-auto px-3" > General Settings </legend>

							
							<Row className="mb-3">
								<Col>

									<Form.Group className="mb-3 col-8" controlId="configDefaultViewMode">
						        <Form.Label> Default View Mode </Form.Label>
						        <Form.Select
						        	name="defaultViewMode" 
						        	// OEM value={this.state.defaultViewMode}
						        	value={this.props.configs.defaultViewMode}
						        	onChange={this.handleInputChange}
						        	aria-label="Default View Mode" 
						        	className="ddl-select-input-strong-blue ddl-no-outline" 
						        	 
						        >
								      <option value="1"> gisSelect</option>
								      <option value="2">gisDrag</option>
								      <option value="3">gisZoom</option>
								    </Form.Select>
						      </Form.Group>
								</Col>


								<Col>

									<Form.Group className="mb-3 col-8" controlId="configDefaultGridType">
						        <Form.Label> Default Grid Type </Form.Label>
						        <Form.Select
						        	name="defaultGridType" 
						        	// OEM value={this.state.defaultViewMode}
						        	value={this.props.configs.defaultGridType}
						        	onChange={this.handleInputChange}
						        	aria-label="Default View Mode" 
						        	className="ddl-select-input-strong-blue ddl-no-outline" 
						        	 
						        >
								      <option value="square"> Square </option>
								      <option value="hexagone"> Hexagone </option>
								    </Form.Select>
						      </Form.Group>
								</Col>



								<Col>
									<Form.Group className="mb-3" controlId="configVesselTrackingInterval">
						        <Form.Label> Vessel Tracking Interval <small> (in Second) </small> </Form.Label>
						        <Form.Control 
						        	value={this.props.configs.vesselTrackingInterval}
						        	name="vesselTrackingInterval"
						        	onChange={this.handleInputChange} 
						        	type="number"
						        	min="1" 
                			max="12"  
						        	style={{width:"100px"}}
						        	placeholder="1" 
						        	className="ddl-text-input-strong-blue hover ddl-no-outline"  
						        />
						      </Form.Group>
								</Col>
							</Row>


							<Row className="mb-3">
								<Col>

									<Form.Group className="mb-3 col-8" controlId="configUnitOfMeasurement">
						        <Form.Label> Unit Of Measurement </Form.Label>
						        <Form.Select
						        	name="unitOfMeasurement" 
						        	// OEM value={this.state.unitOfMeasurement}
						        	value={this.props.configs.unitOfMeasurement}
						        	onChange={this.handleInputChange}
						        	aria-label="Default View Mode" 
						        	className="ddl-select-input-strong-blue ddl-no-outline" 
						        	 
						        >
								      <option value="nauticalmiles">Nauticalmiles</option>
								      <option value="miles">Miles</option>
								      <option value="kilometers">Kilometers</option>
								    </Form.Select>
						      </Form.Group>
								</Col>


								<Col>

									<Form.Group className="mb-3 col-10" controlId="configMapLegendColorType">
						        <Form.Label> Map Legend Color Type </Form.Label>
						        <Form.Select
						        	name="mapLegendColorType" 
						        	value={this.props.configs.mapLegendColorType}
						        	onChange={this.handleInputChange}
						        	aria-label="Map Color Type" 
						        	className="ddl-select-input-strong-blue ddl-no-outline" 
						        	 
						        >
								      <option value="1"> 4 Color ranges (blue, green, yellow, red) </option>
								      <option value="2"> Monocrhome red </option>
								    </Form.Select>
						      </Form.Group>
								</Col>



								<Col>
									<Form.Group className="mb-3" controlId="configVesselTrackingInterval">
						       	{/* place keeper */}
						      </Form.Group>
								</Col>
							</Row>


							<Row>
								<Col>


									<Form.Check className="col-3" type="checkbox" inline >
										<Form.Check.Input
											name="showTitles"
											checked={this.props.configs.showTitles}
				            	onChange={this.handleCheckChanged}
				            	value={this.props.configs.showTitles}
				            	type="checkbox" 
				            	className="ddl-blue-check hover ddl-no-outline" 
				            	style={{fontSize:"1.2rem"}}
										/>
										<Form.Check.Label 
											style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
										>
											Show Titles
										</Form.Check.Label>

									</Form.Check>


									<Form.Check className="col-4" type="checkbox" inline >
										<Form.Check.Input
											name="showFishingActivities"
											checked={this.props.configs.showFishingActivities}
				            	onChange={this.handleCheckChanged}
				            	value={this.props.configs.showFishingActivities}
				            	type="checkbox" 
				            	className="ddl-blue-check hover ddl-no-outline" 
				            	style={{fontSize:"1.2rem"}}
										/>
										<Form.Check.Label 
											style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
										>
											Show Fishing Activities
										</Form.Check.Label>

									</Form.Check>


									<Form.Check className="col-3" type="checkbox" inline >
										<Form.Check.Input
											name="trackVessel"
											checked={this.props.configs.trackVessel}
				            	onChange={this.handleCheckChanged}
				            	value={this.props.configs.trackVessel}
				            	type="checkbox" 
				            	className="ddl-blue-check hover ddl-no-outline" 
				            	style={{fontSize:"1.2rem"}}
										/>
										<Form.Check.Label 
											style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
										>
											Track Vessel
										</Form.Check.Label>

									</Form.Check>



									<Form.Check className="col-3" type="checkbox" inline >
										<Form.Check.Input
											name="showTripTracks"
											checked={this.props.configs.showTripTracks }
				            	onChange={this.handleCheckChanged}
				            	value={this.props.configs.showTripTracks}
				            	type="checkbox" 
				            	className="ddl-blue-check hover ddl-no-outline" 
				            	style={{fontSize:"1.2rem"}}
										/>
										<Form.Check.Label 
											style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
										>
											Show Trip Tracks
										</Form.Check.Label>

									</Form.Check>




									<Form.Check className="col-3" type="checkbox" inline >
										<Form.Check.Input
											name="showLegend"
											checked={this.props.configs.showLegend}
				            	onChange={this.handleCheckChanged}
				            	value={this.props.configs.showLegend}
				            	type="checkbox" 
				            	className="ddl-blue-check hover ddl-no-outline" 
				            	style={{fontSize:"1.2rem"}}
										/>
										<Form.Check.Label 
											style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
										>
											Show Legend
										</Form.Check.Label>

									</Form.Check>

								</Col>

							</Row>

						</fieldset>
	        </Col>
	      </Row>


	      <Row className="mb-4">
	        <Col>

	        	<fieldset className="border ddl-fieldset-border rounded-3 p-3" >
							<legend className="float-none w-auto px-3" > Vessel Marker </legend>

							<Row>
								<Col>
									<Form.Group className="mb-3" controlId="configVesselMarkerSize">
						        <Form.Label> Size </Form.Label>
						        <Form.Control 
						        	name="vesselMarkerSize"
						        	value={this.props.configs.vesselMarkerSize}
						        	onChange={this.handleInputChange}
						        	style={{width:"100px"}}
						        	min="10" 
                			max="500"
						        	type="number" 
						        	placeholder="250" 
						        	className="ddl-text-input-strong-blue hover ddl-no-outline"  
						        />
						      </Form.Group>
								</Col>

								<Col>
									<Form.Group className="mb-3" controlId="ConfigVesselMarkerFillColour">
						        <Form.Label> Fill Colour </Form.Label>
						        <Form.Control
						        	name="vesselMarkerFillColour"
						        	value={this.props.configs.vesselMarkerFillColour}
						        	onChange={this.handleInputChange}
							        type="color"
							        id="exampleColorInput"
							        defaultValue="#563d7c"
							        title="Choose your color"
							        className="ddl-color-input ddl-no-outline"
							      />
							      {/*
						        <Form.Control type="number" placeholder="3" className="ddl-text-input-strong-blue ddl-no-outline w-50"  /> */}
						      </Form.Group>
								</Col>
							</Row>
						                
						</fieldset>
	        </Col>
	      </Row>


	      <Row className="mb-4">
	        <Col>

	        	<fieldset className="border ddl-fieldset-border rounded-3 p-3" >
							<legend className="float-none w-auto px-3" > Latitude / Longitude Display Options </legend>
							{/* alt snip &deg; */}
							<Form.Check
		            inline
		            value="1"
		            checked={this.props.configs.selectedLatLongDisplayOption === "1" }
		            onChange={this.handleInputChange}
		            label="DDD&#176;MM.MM&#39;"
		            name="selectedLatLongDisplayOption"
		            type="radio"
		            className="me-4 ddl-blue-radio hover ddl-no-outline"
		            //id={`inline-${type}-1`}
		          />

		          <Form.Check
		            inline
		            value="2"
		            checked={this.props.configs.selectedLatLongDisplayOption === "2" }
		            onChange={this.handleInputChange}
		            label="DDD&#176;MM&#39;SS &#34;" 
		            name="selectedLatLongDisplayOption"
		            type="radio"
		            className="me-4 ddl-blue-radio hover ddl-no-outline"
		            //id={`inline-${type}-2`}
		          />

		        	{/* custom variant */}
		          <Form.Check inline >
		            <Form.Check.Input 
		            	value="3"
		            	checked={this.props.configs.selectedLatLongDisplayOption === "3" }
		            	onChange={this.handleInputChange}
		          		type="radio" 
		          		className="ddl-blue-radio hover ddl-no-outline" 
		          		name="selectedLatLongDisplayOption" 
		          	/> {/* isValid */}
		            <Form.Check.Label> DDD.DDDDDD&#176; </Form.Check.Label>
		            {/*
		            <Form.Control.Feedback type="valid">
		              validation
		            </Form.Control.Feedback> */}
		          </Form.Check>
               
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
  	// mapperConfigs : state.explorer.mapperConfigs, // @TODO deprecate
  	configs:  state.explorer.configs[MAPPER_CONFIG] ,
  };
};


const mapDispatchToProps = (dispatch) => {
	const state = store.getState();
  return {
    // saveMapperConfig: (data) => dispatch(ExplorerActions.saveMapperConfig(data)) , // @TODO deprecate
    saveConfig: (data) => dispatch(ExplorerActions.saveConfig(data)) ,
    // loadMapperConfig: () => dispatch(ExplorerActions.loadMapperConfig(state.auth.user.token)) , // @TODO deprecate
    loadConfig: (key) => dispatch(ExplorerActions.loadConfig({key, token : state.auth.user.token })),
    // setMapperConfig: (data) => dispatch(ExplorerActions.setMapperConfig(data)), // @TODO deprecate
    setConfig: (data) => dispatch(ExplorerActions.setConfig(data))
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigMapper);
