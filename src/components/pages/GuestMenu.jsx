import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withTranslation, Trans } from 'react-i18next';

import { 
 Navbar , Stack , Button , Dropdown , Form
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus , faLock , faClipboardQuestion , faCaretDown , faLanguage , faCheck , faMoon , faSun } from '@fortawesome/free-solid-svg-icons';

import {CustomToggler} from "../../components/CustomToggler" ;

import backButtonImg from '../../assets/images/arrow_back_48.png';
import olracLogoImg from '../../assets/images/olrac_logo.png';

import {connect} from "react-redux" ;
import { ExplorerActions , MatricesActions } from "../../redux/actions";
import { LANGUAGE_CONFIG , THEME_CONFIG } from "../../utilities/constant";

import DelphiEnv from '../../components/DelphiEnv';

class GuestMenu extends Component {

  constructor(props){
    super(props);

    this.state = {
    }

    this.languages = [
      {
        name : "English",
        code : "en"
      },
      {
        name : "Português", // Portuguese
        code : "pt"
      },
      {
        name : "Français", // French
        code : "fr"
      }
    ];



    /*
    const {i18n } = props;
    i18n.changeLanguage('fr');
    console.log('done2...');
    */

  }

  handleOnGeneralConfigLanguageMenuSelect = (eventKey, e) => {

    const {i18n } = this.props;

    this.props.setGeneralConfig({ key : LANGUAGE_CONFIG , name : 'selectedLanguage' , value: eventKey });
    i18n.changeLanguage(eventKey);
    // i18n.changeLanguage('fr'); // debugin

  }

  handleThemeSwitchChanged = (event) => {
    const { name, value } = event.target;
    this.changeTheme(name , value);
  }

  changeTheme(name , isDarkMode){

    this.props.setGeneralConfigs({
      key : THEME_CONFIG,
      value : {
        [name] : (this.props.themeConfig[name] == 'false') || this.props.themeConfig[name] == false ? true : false  ,
        theme : (this.props.themeConfig[name] == 'false') || this.props.themeConfig[name] == false ? 'dark' : 'light' // we are switching off the lights
      }
    });

    //this.props.setGeneralConfigs({ key : THEME_CONFIG , name , value: !this.props.themeConfig[name] });

    //this.props.setGeneralConfig({ key : THEME_CONFIG , name , value: !this.props.themeConfig[name] });
    // this.props.setGeneralConfig({ key : THEME_CONFIG , name : 'theme' , value: isDarkMode == 'true' ? 'dark' : 'light' });
  }


  render() {
    const { t } = this.props;

    return (
      <>
        <div>
          <Link to="/explorer/login">
            <Button name="btn_goto_login"  className="nav-button ddl-button-style-light-blue" > 
              <FontAwesomeIcon icon={faLock} className="me-2" /> <Trans i18nKey="common.login">Login</Trans>
            </Button>
          </Link>

        </div>


        <div>
          <Link to="/about">
            <Button name="btn_goto_about"  className="nav-button ddl-button-style-light-blue ddl-no-outline" > 
              <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" /> <Trans i18nKey="common.about">About</Trans> 
            </Button>
          </Link>

        </div>

        <Dropdown
          drop="down"
          align="end"
          onSelect={this.handleOnGeneralConfigLanguageMenuSelect}
          // onToggle={this.handleOnUserMenuToggle}
          className="ddl-dropdown-nav-strong-blue shadow ddl-no-outline"
        >
          <Dropdown.Toggle as={CustomToggler}>
            <Button variant="link" className="ddl-no-outline ddl-user-link" > 
              <FontAwesomeIcon icon={faLanguage} className="me-2" />
              <Trans i18nKey="common.language">Language</Trans> ({this.props.languageConfig.selectedLanguage})  <FontAwesomeIcon className="ms-2" icon={faCaretDown} size="1x" style={{fontSize:".8rem"}} />
            </Button>
          </Dropdown.Toggle>

          <Dropdown.Menu
            popperConfig={{
              modifiers : [
                // see popper modifiers configurations
                {
                  name: 'offset',
                  options: {
                    offset: [0, 10],
                  },
                }
              ]
            }}
            renderOnMount={false}
          >
            { this.languages.map(language => (
              <Dropdown.Item 
                key={`general_language_option_${language.code}`}
                eventKey={language.code} 
              >
                <FontAwesomeIcon icon={faCheck} className={`me-2 ${this.props.languageConfig.selectedLanguage == language.code ? '' : 'fa-blank' }`} /> {language.name}
              </Dropdown.Item>

            ))}

          </Dropdown.Menu>
        </Dropdown>

        <div>
          <Form.Check type="switch" className="ms-3 ddl-blue-switch" >
            <Form.Check.Input
              name="isDarkTheme"
              checked={this.props.themeConfig.isDarkTheme}
              onChange={this.handleThemeSwitchChanged}
              value={this.props.themeConfig.isDarkTheme}
              title={this.props.themeConfig.isDarkTheme ? `${t('common.dark')}` : `${t('common.light')}` }
              id="flexSwitchCheckIsDarkTheme"
              style={{cursor:"pointer" , fontSize:"1.3rem" }}
            />
            <Form.Check.Label 
              style={{lineHeight:"1.2rem" , marginTop:".3rem"}} 
            >
              <FontAwesomeIcon className="ms-2" icon={this.props.themeConfig.isDarkTheme ? faMoon : faSun } style={{fontSize:"1.3rem" }} />

            </Form.Check.Label>

          </Form.Check>  

        </div>


      </>
    );

  }



}

const mapStateToProps = (state) => {
  return {
    languageConfig : state.explorer.generalConfigs[LANGUAGE_CONFIG] ,
    themeConfig : state.explorer.generalConfigs[THEME_CONFIG] , // thi one ?
    isMapDesigner: state.explorer.isMapDesigner
    // theme: state.explorer.theme // or this one ? // @TODO deprecate this
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTabKeyLandingPage : (data) => dispatch(ExplorerActions.setTabKeyLandingPage(data)),
    setGeneralConfig: (data) => dispatch(ExplorerActions.setGeneralConfig(data)) ,
    setGeneralConfigs: (data) => dispatch(ExplorerActions.setGeneralConfigs(data))
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(GuestMenu));