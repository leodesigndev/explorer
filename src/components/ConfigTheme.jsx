import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';

// react bootstrap
import { 
  Form , Button , Container , Row , Col
} from 'react-bootstrap';

import { connect } from "react-redux";
import { ExplorerActions } from "../redux/actions";
import { store } from "../redux";

import { THEME_CONFIG } from "../utilities/constant";

class ConfigTheme extends Component {


	constructor(props) {
		super(props);

		this.state = {
			theme : "", // @TODO load from Props when remembered
			selectedOption: ""
		}

	}


	componentDidMount() {

		this.props.loadConfig(THEME_CONFIG);
		
		let panel = this.props.jsPanel ;
    panel.footer.querySelector('.selector_btn_config_theme-cancel').addEventListener('click' , (e) => {
      return panel.close();
    });

    panel.footer.querySelector('.selector_btn_config_theme-save').addEventListener('click' , async (e) => {

      return this.saveTheme(e);

    });


	}


	handleThemeOptionChange = event => {
		
		const { name, value } = event.target;

		console.log('name, value  >>>><>>>', name, value );

		/* OEM
		this.setState({
      theme: event.target.value,
      selectedOption: event.target.value
    });
    */
    this.props.setConfig({ key : THEME_CONFIG , name , value });

	};

	themeSaved = (data) => {
		this.props.jsPanel.close();
	}

	saveTheme = async (event) => { 

		let data = {};
		data.name = THEME_CONFIG ;

		data.data = {
			// OEM selectedThemeOption: this.props.configs.selectedThemeOption,
			theme: this.props.configs.theme
		}
		data.token = this.props.token;

		this.props.saveConfig(data , this.themeSaved );
	}

	render() {

		return(
			<Container>
				<Row className="mb-4">
					<Col>
						<Form>
							<fieldset className="border ddl-fieldset-border rounded-3 p-3" >
								<legend className="float-none w-auto px-3" > <h4> Themes </h4> </legend>


								<Form.Check
			            label="Light"
			            // OEM name="selectedThemeOption"
			            name="theme"
			            type="radio"
			            value="light"
			            className="mb-3 ddl-blue-radio hover ddl-no-outline"
			            checked={this.props.configs.theme === "light" }
		              onChange={this.handleThemeOptionChange}
			          />


			          <Form.Check
			            label="Dark"
			            // OEM name="selectedThemeOption"
			            name="theme"
			            type="radio"
			            value="dark"
			            className="mb-3 ddl-blue-radio hover ddl-no-outline"
			            checked={this.props.configs.theme === 'dark'}
		              onChange={this.handleThemeOptionChange}
			          />

							</fieldset>
						</Form>
					</Col>
				</Row>
			</Container>
		);
	}

}

const mapStateToProps = (state) => {
  return {
  	token: state.auth.user.token,
    configs:  state.explorer.configs[THEME_CONFIG]
  };
};


const mapDispatchToProps = (dispatch) => {
	const state = store.getState();
  return {
    saveConfig: (data , callback = null) => dispatch(ExplorerActions.saveConfig(data , callback)) ,
    loadConfig: (key) => dispatch(ExplorerActions.loadConfig({key, token : state.auth.user.token })),
    setConfig: (data) => dispatch(ExplorerActions.setConfig(data))
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ConfigTheme));