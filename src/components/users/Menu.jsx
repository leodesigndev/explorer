import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import { Link , withRouter } from "react-router-dom";
import axios from 'axios';

import { withTranslation, Trans } from 'react-i18next';

import { 
 Navbar , Stack , Button , Dropdown , Nav
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck , faUser , faChartColumn , faCog , faCaretDown , faTableColumns , faFloppyDisk , 
  faCircleQuestion , faComments , faArrowRightFromBracket , faDatabase , faFileLines , faLocationDot , faPlus , faChevronLeft , faChevronRight , faFishFins , faArrowLeftLong , faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

// import { toggleOffCanvasLabelsAndPrompts } from "../Actionnables";

import DelphiEnv from '../DelphiEnv';
// import Toolbar from '../map-design/ToolBar';
import {CustomToggler} from "../CustomToggler" ;
import {createJsPanel} from '../../configs/jsPanelOptions';

import {connect} from "react-redux" ;
import { ExplorerActions , MatricesActions , AuthActions , MapDesignActions  } from "../../redux/actions";
import { store } from "../../redux";

import ConfigFavouriteFields from '../ConfigFavouriteFields';
import ConfigFiltering from '../ConfigFiltering';
import ConfigTheme from '../ConfigTheme';
import ConfigLanguage from '../ConfigLanguage';



import {apiBaseUrl }  from "../../utilities/Helpers" ;
import { BASE_API_URL } from "../../redux/services/constant";



class Menu extends Component {


  async isMatricesGenerated(userToken){

    try {
      
      const response = await axios.get(
        `${BASE_API_URL}/api/explorer/data_matrices/get_matrice_count`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      return  !response.data.error && parseInt(response.data.matrixCount) > 0  ;
      
    } catch (error) {
      throw error;
    }

  }


  handleGoBackToDashboard(){
    return ('goBackToDashboard' in window.ddl) ? window.ddl.goBackToDashboard(1) : false ;
  }

  beforeStartNewMap = () => {

    this.props.setTabKeyLandingPage(`tabs_main-landing_new`);
    this.props.loadDataMatrices();
  }

  handleOnConfigSelect = (eventKey, e) => {

    if(eventKey == "event-language" ){

      createJsPanel(
        "Config Language",
        ConfigLanguage , 
        true,
        {
          optionsOverwrite:{
            panelSize: "30% 40%",
            footerToolbar: () => {
              return ReactDOMServer.renderToString(
                <>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_language-cancel" > Cancel </Button>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_config_language-save" > Save </Button>
                </>
              );
            }
          }
        }
      );

    }else if( eventKey == "event-theme"){

      createJsPanel(
        "Config Theme",
        ConfigTheme , 
        true,
        {
          optionsOverwrite:{
            panelSize: "30% 40%",
            footerToolbar: () => {
              return ReactDOMServer.renderToString(
                <>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_theme-cancel" > Cancel </Button>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_config_theme-save" > Save </Button>
                </>
              );
            }
          }
        }
      );

    }else if(eventKey == "event-favourite-fields"){
      
      createJsPanel(
        "Fields Config",
        ConfigFavouriteFields , 
        true,
        {
          optionsOverwrite:{
            panelSize: "40% 70%",
            footerToolbar: () => {
              return ReactDOMServer.renderToString(
                <>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_favourite_fields-cancel" > Cancel </Button>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_config_favourite_fields-ok" > ok </Button>
                </>
              );
            }
          }
        }
      );

    }else if(eventKey == "event-filtering"){

      createJsPanel(
        "Filtering Config",
        ConfigFiltering , 
        true,
        {
          optionsOverwrite:{
            panelSize: "45% 50%" ,
            footerToolbar: () => {
              return ReactDOMServer.renderToString(
                <>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue me-4 mb-1 selector_btn_config_filtering-cancel" > Cancel </Button>
                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_config_filtering-ok" > ok </Button>
                </>
              );
            }
          }
        }
      );

    }

  }

  handleOnConfigToggle = (nextShow, meta) => {

  }


  //=======================================

  handleOnUserMenuSelect = (eventKey, e) => {

    if(eventKey == "event-dashboard" ){

      //toggleOffCanvasLabelsAndPrompts('off');
      this.props.setTabKeyLandingPage(`tabs_main-landing-welcome`);
      this.props.loadDataMatrices();

    }else if(eventKey == "event-my-data-matrices"){

      //toggleOffCanvasLabelsAndPrompts('off');
      this.props.setTabKeyLandingPage(`tabs_main-landing_new`);
      this.props.loadDataMatrices();

    }else if(eventKey == "event-add-data-matrices"){

      //toggleOffCanvasLabelsAndPrompts('off');
      this.props.setTabKeyLandingPage(`tabs_main-landing_new`);
      this.props.loadDataMatrices();

    }else if( eventKey == "event-my-saved"){

      //toggleOffCanvasLabelsAndPrompts('off');
      this.props.setTabKeyLandingPage(`tabs_main-open`);
      this.props.loadDataMatrices();

    }else if(eventKey == "event-my-account"){

      this.props.setTabKeyLandingPage(`tabs_main-account`);

    }else if(eventKey == "event-help"){

      console.log('Help...'); // @TODO help stepper ? contextual help  ? general help page (link to user manual)

    }else if(eventKey == "event-logout"){
      this.props.logout();
      //OEM this.props.history.push("/explorer/login?logout=success");
      return window.location.href = "/explorer/login?logout=success";
      
      
    }else if(eventKey == "event-back-to-dashboard"){
      this.handleGoBackToDashboard();
    }

  }

  handleOnUserMenuToggle = (nextShow, meta) => {

  }


  createCustomJsPannel = (title , comp , modal , attributes ) => {
    if(attributes.selectedDataMatrix){
      this.props.setSelectedMatrice(attributes.selectedDataMatrix);
    }

    createJsPanel(title, comp, modal , attributes ) ;
  }


  logout = () => {
    this.props.logout();
  }

  render() {
    return (
      <nav 
        className={`sb-topnav navbar navbar-expand navbar-dark main-nav-bar ${ DelphiEnv.isParentEnv() ? 'ddl-header' : '' }`} 
        // className="sb-topnav navbar navbar-expand navbar-dark main-nav-bar " style={{ DelphiEnv.isParentEnv() ? `"borderBottom":"1px solid #33597d"` : 'mm'  }} 
      >
       
        
        <div className="ms-auto" > {/* style={{marginRight:"62px" }} */}

          <Stack direction="horizontal" gap={2}  >

            {/* <Toolbar show={this.props.isMapDesigner} /> */}

          

            <Dropdown
              drop="down"
              align="end"
              onSelect={this.handleOnConfigSelect}
              onToggle={this.handleOnConfigToggle}
              className="ddl-dropdown-nav-strong-blue shadow ddl-no-outline"
            >
              <Dropdown.Toggle as={CustomToggler}>
                <Button  className="ddl-button-style-light-blue ddl-no-outline"> 
                  <FontAwesomeIcon icon={faCog} className="me-2" /> 
                  {/* Config <span style={{fontSeize:"2px"}} > &#x25bc; </span> :-(  */} {/* @TODO fix font seize*/}
                  <Trans i18nKey="explorer.header.config">Config</Trans> <FontAwesomeIcon className="ms-2" icon={faCaretDown} size="1x" style={{fontSize:".8rem"}} />
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
                {/* OEM
                <Dropdown.Item 
                  disabled={ !this.props.isMapDesigner ? true : false }
                  eventKey="event-favourite-fields" 
                >
                  Favourite Fields...
                </Dropdown.Item>
                */}

                <Dropdown.Item
                  // disabled={ !this.props.isMapDesigner ? true : false } 
                  eventKey="event-filtering" 
                >
                  Filtering...
                </Dropdown.Item>

                {/*OEM
                <Dropdown.Item 
                  eventKey="event-theme" 
                >
                  Theme...
                </Dropdown.Item>

                <Dropdown.Item 
                  eventKey="event-language" 
                >
                  Language...
                </Dropdown.Item>
                */}


              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              drop="down"
              align="end"
              onSelect={this.handleOnUserMenuSelect}
              onToggle={this.handleOnUserMenuToggle}
              className="ddl-dropdown-nav-strong-blue shadow ddl-no-outline"
            >
              <Dropdown.Toggle as={CustomToggler}>
                <Button variant="link" className="ddl-no-outline ddl-user-link" > 
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  {this.props.user.name} <FontAwesomeIcon className="ms-2" icon={faCaretDown} size="1x" style={{fontSize:".8rem"}} />
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

                {/* OEM
                <Dropdown.Item 
                  eventKey="event-dashboard" 
                >
                  <FontAwesomeIcon icon={faTableColumns} className="me-2" /> Dashboard
                </Dropdown.Item>
                */}


                <Link
                  to="/explorer/data_matrices"
                  className="dropdown-item"
                  aria-selected="false"
                  role="button"
                  tabindex="0"
                >
                  <FontAwesomeIcon icon={faFileLines} className="me-2" /> My Fishing Data
                </Link>


                {/*
                <Dropdown.Item 
                  eventKey="event-my-saved" 
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="me-2 fa-regular" /> Saved Maps
                </Dropdown.Item>
                */}


                <Link
                  to="/explorer/maps"
                  className="dropdown-item"
                  aria-selected="false"
                  role="button"
                  tabindex="0"
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="me-2 fa-regular" /> Saved Maps
                </Link>


                <Dropdown.Divider />


                {/*OEM
                <Dropdown.Item 
                  eventKey="event-add-data-matrices" 
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Fishing Datas ...
                </Dropdown.Item>
                */}

                <Link
                  to="/explorer/data_matrices/create"
                  className="dropdown-item"
                  aria-selected="false"
                  role="button"
                  tabindex="0"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Fishing Datas ...
                </Link>




                


                <Dropdown.Divider />


                <Dropdown.Item 
                  eventKey="event-my-account" 
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" /> Account
                </Dropdown.Item>

                <Dropdown.Item 
                  eventKey="event-help" 
                >
                  <FontAwesomeIcon icon={faCircleQuestion} className="me-2" /> Help
                </Dropdown.Item>

                <Dropdown.Divider />

                { !DelphiEnv.isParentEnv() ?
                    <Dropdown.Item 
                      eventKey="event-logout" 
                    >
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2" /> Logout
                    </Dropdown.Item>
                  :
                    <Dropdown.Item 
                      eventKey="event-back-to-dashboard" 
                    >
                      <FontAwesomeIcon icon={faArrowLeftLong} className="me-2" /> close explorer window
                    </Dropdown.Item>
                }

                




              </Dropdown.Menu>
            </Dropdown>

          </Stack>


        </div>


      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isMapDesigner: state.explorer.isMapDesigner,
  };
};

const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
    setTabKeyLandingPage : (data) => dispatch(ExplorerActions.setTabKeyLandingPage(data)),
    loadDataMatrices: () => dispatch(MatricesActions.loadDataMatrices()) ,
    logout: (data) => dispatch(AuthActions.logout(state.auth.user.token)),

    setLastMapResetTime: (data) => dispatch(MapDesignActions.setLastMapResetTime(data)), // @TODO testing to delete
    setUser: (data) => dispatch(AuthActions.setUser(data)),
  };
};
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(withRouter(Menu)));

