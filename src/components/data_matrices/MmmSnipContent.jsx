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
                middle...
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
