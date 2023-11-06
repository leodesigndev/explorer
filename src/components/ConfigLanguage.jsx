import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';

import { connect } from "react-redux";
import { DashboardActions , ExplorerActions } from "../redux/actions";
import { LANGUAGE_CONFIG } from "../utilities/constant";

// react bootstrap
import { 
  Form , Button , Container , Row , Col
} from 'react-bootstrap';

import { store } from "../redux";


class ConfigLanguage extends Component {


	constructor(props) {
		super(props);

		this.state = {
			language : "", // @TODO load from Props when remembered
			selectedOption: ""
		}

	}

	componentDidMount() {

		this.props.loadConfig(LANGUAGE_CONFIG);

		let panel = this.props.jsPanel ;
    panel.footer.querySelector('.selector_btn_config_language-cancel').addEventListener('click' , (e) => {
      return panel.close();
    });

    panel.footer.querySelector('.selector_btn_config_language-save').addEventListener('click' , async (e) => {

      return this.saveLanguageConfig(e);

    });


	}

	handleLanguageOptionChange = event => {
		
		const { name, value } = event.target;

		/* OEM :-)
		this.setState({
      language: event.target.value,
      selectedOption: event.target.value
    });
    */

		this.props.setConfig({ key : LANGUAGE_CONFIG , name , value });


	};

	languageSaved = (data) => {

		// event.preventDefault();

		// const { t, i18n } = useTranslation();
		// return false ;

		const {i18n } = this.props;
		i18n.changeLanguage('fr');

		this.props.jsPanel.close();
		
	}
	
	saveLanguageConfig = async (event) => {

		let data = {};

		data.name = LANGUAGE_CONFIG ;
		data.data = {
			selectedLanguageOption: this.props.configs.selectedLanguageOption,
		}
		data.token = this.props.token;

		this.props.saveConfig(data , this.languageSaved );
	}

	cancelAction = (event) => {
		this.props.jsPanel.close();
	}

	// testing function
	MyComponent() {
	  return (
	    <Trans i18nKey="description.part1">
	      To get started, edit <code>src/App.js</code> and save to reload.
	    </Trans>
	  );
	}

	render() {

		const { t } = this.props;
		const { language } = this.state;

		return(
			<Container>
				<Row className="mb-4">
					<Col>
						<Form>
							<fieldset className="border ddl-fieldset-border rounded-3 p-3" >
								<legend className="float-none w-auto px-3" > <h4> Languages </h4> </legend>


								<div>{/* OEM t('description.part2') */}</div>
								<div>
									{/* OEM this.MyComponent()*/}
								</div>

								<Form.Check
			            label="English"
			            name="selectedLanguageOption"
			            type="radio"
			            value="en"
			            className="mb-3 ddl-blue-radio hover ddl-no-outline"
			            checked={this.props.configs.selectedLanguageOption === "en" }
		              onChange={this.handleLanguageOptionChange}
			          />


			          <Form.Check
			            label="Portuguese"
			            name="selectedLanguageOption"
			            type="radio"
			            value="pt"
			            className="mb-3 ddl-blue-radio hover ddl-no-outline"
			            checked={this.props.configs.selectedLanguageOption === "pt" }
		              onChange={this.handleLanguageOptionChange}
			          />



			          <Form.Check
			            label="French"
			            name="selectedLanguageOption"
			            type="radio"
			            value="fr"
			            className="mb-3 ddl-blue-radio hover ddl-no-outline"
			            checked={this.props.configs.selectedLanguageOption === "fr" }
		              onChange={this.handleLanguageOptionChange}
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
  	configs:  state.explorer.configs[LANGUAGE_CONFIG] ,
  };
};

const mapDispatchToProps = (dispatch) => {

	const state = store.getState();
  return {
    setSelectedPlotingOption: (plotOption) => dispatch(DashboardActions.setSelectedPlotingOption(plotOption)) ,
    saveConfig: (data , callback = null ) => dispatch(ExplorerActions.saveConfig(data , callback)) ,
    loadConfig: (key) => dispatch(ExplorerActions.loadConfig({key, token : state.auth.user.token })),
    setConfig: (data) => dispatch(ExplorerActions.setConfig(data))
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ConfigLanguage));