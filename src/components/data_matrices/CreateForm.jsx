import React, { Component, lazy  } from "react";

import { connect } from "react-redux";
import { 
 Nav , Tab , Stack , Button , Toast
} from 'react-bootstrap';

import { ExplorerActions } from "../../redux/actions";
import DelphiEnv from '../DelphiEnv';

const MatrixUploadForm = lazy(() => import("./MatrixUploadForm"));
const MatrixUploadFormURL = lazy(() => import("./MatrixUploadFormURL"));
const MatrixUploadFormDDL = lazy(() => import("./MatrixUploadFormDDL"));


class DataSource extends Component {
  

  handleNavImportTypeItemSelect = (eventKey , e) => {
    this.props.setTabKeyImportType(eventKey);
  }


  render() {
    return (
      <>
        <header className="px-1 content-head" >
          <h3> Add Fishing Data </h3>
        </header>

        <main>
          <div className="container-fluid p-0 content-view" >

            <div className="p-2" >
                
              <div className="m-2"> 
                Add Fishing Data 
              </div>

              <div className="m-2" > {/* ms-0 */}


                {/*Tabs upload options tabs */}
                <div className="row-fluid col-md-6">
                  <Nav 
                    fill
                    justify
                    variant="pills" 
                    activeKey={this.props.tabKeyImportType}
                    className="me-auto ddl-tab-nav-style-no-background"
                    style={{marginBottom:"0.8rem"}}
                    defaultActiveKey= {this.props.tabKeyImportType} // OEM "tabs_datatable-recent"
                    onSelect={this.handleNavImportTypeItemSelect}
                  >
                    <Nav.Item >
                      <Nav.Link eventKey="tabs_import-type-browse" >

                        Browse this computer

                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item >
                      <Nav.Link eventKey="tabs_import-type-weburl" >

                        From URL

                      </Nav.Link>
                    </Nav.Item>

                    { DelphiEnv.isParentEnv()  &&

                      <Nav.Item >
                        <Nav.Link eventKey="tabs_import-type-ddldatabase">
                          
                          DDL database

                        </Nav.Link>
                      </Nav.Item>

                    }

                  </Nav>

                </div>

                {/*END Tabs upload options tabs */}


                {/* Tabs upload options tabs content */}
                <div>
                  <Tab.Container id="tabcontainer_import_type" activeKey={this.props.tabKeyImportType} style={{width: "100%"}}>
                    <Tab.Content animation style={{width: "100%"}}>
                      
                      <Tab.Pane style={{width: "100%"}} eventKey="tabs_import-type-browse" >
                        <MatrixUploadForm />
                      </Tab.Pane>

                      <Tab.Pane style={{width: "100%"}} eventKey="tabs_import-type-weburl" >
                        <MatrixUploadFormURL />
                      </Tab.Pane>

                      { DelphiEnv.isParentEnv() &&

                      <Tab.Pane style={{width: "100%"}} eventKey="tabs_import-type-ddldatabase" >
                        <MatrixUploadFormDDL />
                      </Tab.Pane>

                      }
         

                    </Tab.Content>
                  </Tab.Container>

                </div>
                {/* END Tabs upload options tabs content */}

              </div>

            </div>

          </div>
        </main>


        <footer className="px-1 content-footer" >
          Create Footer
        </footer>

      </>
    );
  }

  
}



const mapStateToProps = (state) => {
  return {
    tabKeyImportType: state.explorer.tabKeyImportType
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setTabKeyImportType : (data) => dispatch(ExplorerActions.setTabKeyImportType(data))
  };
};



export default connect(mapStateToProps , mapDispatchToProps )(DataSource);
