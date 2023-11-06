import React, { Component } from 'react';
import { connect } from "react-redux";

import _ from 'lodash';

import { THEME_CONFIG } from "../utilities/constant";
import DelphiEnv from './DelphiEnv';

class DDLThemeProvider extends Component {

	componentDidMount(){
		this.setTheme();
	}

	setTheme(){
		document.documentElement.setAttribute('color-scheme', DelphiEnv.isParentEnv() ? `embeded-${this.props.themeConfig.theme}` : this.props.themeConfig.theme ); // 'light' | 'dark' | embeded-[light|dark]
	}

	// HOC
	render() {
		
		{ this.props.themeConfig.theme && document.documentElement.setAttribute('color-scheme', DelphiEnv.isParentEnv() ? `embeded-${this.props.themeConfig.theme}` : this.props.themeConfig.theme ) }

		return(
			<>
				{this.props.children}
			</>
		);
	}

}

const mapStateToProps = (state) => {
  return {
  	// OEM themeConfig : state.explorer.generalConfigs[THEME_CONFIG] // selectedThemeOption
  	themeConfig : !_.isEmpty(state.explorer.configs[THEME_CONFIG]) ? state.explorer.configs[THEME_CONFIG] : state.explorer.generalConfigs[THEME_CONFIG]
  };
};

export default connect(mapStateToProps)(DDLThemeProvider);