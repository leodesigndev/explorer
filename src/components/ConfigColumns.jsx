import React, { Component } from 'react';

import { connect } from "react-redux";
import { DashboardActions , ExplorerActions , MatricesActions } from "../redux/actions";
import { store } from "../redux";

import matriceConfig from "../configs/matrice";

// react bootstrap
import {
  Form , Button , Container , Row , Col , Stack
} from 'react-bootstrap';
import RecordsTable from "./map-design/RecordsTable";

import { COLUMNS_CONFIG } from "../utilities/constant";

class ConfigColumns extends Component {

	constructor(props) {
		super(props);

		this.state = {
      selectedColumns: false,
			baseOptions: {
				"TRIPID" : true
			}
		}

	}

	componentDidMount(){

		this.props.loadConfig(COLUMNS_CONFIG , this.props.selectedDataMatrix.id );

		let panel = this.props.jsPanel ;
		panel.footer.querySelector('.selector_btn_config_columns-cancel').addEventListener('click' , (e) => {
			return panel.close();
			// let cl = e.target.closest('span').classList
			// panel.content.innerHTML = '<p></p>' ;
		});

		panel.footer.querySelector('.selector_btn_config_columns-ok').addEventListener('click' , async (e) => {
			return this.submitForm(e);
		});

    panel.footer.querySelector('.selector_btn_config_columns-clear').addEventListener('click' , async (e) => {

      //handle
      if(this.state.selectedColumns)
        this.handleSelectedColumns();

    });

    panel.footer.querySelector('.selector_btn_config_columns-select_all').addEventListener('click' , async (e) => {

      //handle
      if(!this.state.selectedColumns)
        this.handleSelectedColumns();

    });

		if(matriceConfig.fields.length){
			/*
			matriceConfig.fields.forEach(field => {

				fields.push(field);

			}); */
			this.props.setDataTableColumns(matriceConfig.fields);
		}

	}


	submitForm = async (event) => {

		event.preventDefault();

		let data = {};

		data.name = COLUMNS_CONFIG ;
		data.matrixId = this.props.selectedDataMatrix.id ;

		/*
		data.data = {
			id : this.props.selectedDataMatrix.id
			//baseOptions : this.state.baseOptions // @TODO we need this ?
		} */
		let fieldsAndValue = {} ;
		this.props.dataTableColumns.forEach(column => fieldsAndValue[column.name] = this.props.configs[column.name] ); // @TODO path_name ? 

		data.data = {
			...fieldsAndValue
		};

		data.token = this.props.token;

		
		// data.token = this.props.token; // @TODO add user token
		// OEM this.props.saveConfigFavouriteFields(data);
		// this.clearForm(event);

		// this.props.saveConfig(data);

		this.props.saveConfig(data , this.columnsSaved );
	}


	columnsSaved = (data) => {

		this.props.jsPanel.close();
		
	}



	handleCheckChanged = (event) => {

		const { name, value } = event.target;
		this.props.setConfig({ key : COLUMNS_CONFIG , name , value: !this.props.configs[name] }); // @TODO do we need defaults ?
	}

	/*
	handleCheckFilterOptionChange = (e) => {
		const { name, value } = e.target;

		// this.setState({ [name]: value });
		// this.setState({ filterOption: !this.state.filterOption });
	}
	*/

  handleSelectedColumns = () =>{
    this.setState({selectedColumns: !this.state.selectedColumns});
  }

  selectedRecord = (e, index) =>{
    let isChecked = e.target.checked;
    console.log("This is target " + isChecked);
    const column = this.props.dataTableColumns[index];

    if(isChecked)
      console.log("The column state " + column.hidden);
    else
      console.log("The column state " + column.hidden);

    isChecked ? column.hidden = true : column.hidden = false;
    return isChecked;
  }

	render() {
		return(
			<Container>
				<Row>
					<Col>
						<fieldset className="border ddl-fieldset-border rounded-3 p-3 selector_general-filtering" style={{minHeight:"430px"}} >
							<legend className="float-none w-auto px-3" > Show / Hide Columns  </legend> {/* @TODO implement selecto with drag accross ? and draggable each ?  */}
							{this.props.dataTableColumns.map((field , fieldIndex) => (

								<div key={`checkbox-${fieldIndex}`} className="mb-3">
									<Form.Check type="checkbox" >
										<Form.Check.Input
											name={field.name}
											checked={this.props.configs[field.name]}
											onChange={this.handleCheckChanged}
											value={this.props.configs[field.name]}
                      // disabled={this.state.baseOptions[field.name]} // @TODO ? based on baseOptions
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
    configs:  state.explorer.configs[COLUMNS_CONFIG] ,

    selectedDataMatrix: state.matrices.selectedDataMatrix,
    dataTableColumns : state.explorer.dataTableColumns
  };
};


const mapDispatchToProps = (dispatch) => {
	const state = store.getState();
  return {
    setDataTableColumns: (data) => dispatch(ExplorerActions.setDataTableColumns(data)),
    saveConfigFavouriteFields : (data) => dispatch(MatricesActions.saveConfigFavouriteFields(data)),

    // OEM saveConfig: (data) => dispatch(ExplorerActions.saveConfig(data)) ,
    saveConfig: (data , callback = null ) => dispatch(ExplorerActions.saveConfig(data , callback)) ,
    loadConfig: (key , matrixId) => dispatch(ExplorerActions.loadConfig({key, token : state.auth.user.token , matrixId})),
    setConfig: (data) => dispatch(ExplorerActions.setConfig(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigColumns);