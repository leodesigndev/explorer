import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;
import InfiniteScroll from "react-infinite-scroll-component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome , faFileLines , faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Nav , Tab
} from 'react-bootstrap';


import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";
import SavedMapTile from "./SavedMapTile" ;
import MaboxRender from '../../components/maps/MapboxRender' ;
import MapDesignFooter from '../map-design/MapDesignFooter';
import MapDesignHeader from '../map-design/MapDesignHeader';
import RecordsTable from '../map-design/RecordsTable';


class MapRenderContainer extends Component {


	constructor(props){
	    super(props);

	    this.state = {
	      offset: 0,
	      data : [],
	      pageCount : 0 ,
	      totalCount : 0 ,

	      hasMore : true
	    }

	}

	async componentDidMount(){
		await this.loadSavedMaps();
	}

	async loadSavedMaps(){

		this.setState({
	        data : [
	        	{
	        		id: 1 ,
	        		name: "name1"
	        	},
	        	{
	        		id: 2 ,
	        		name: "name2"
	        	}
	        ]
	    });
	}

	fetchMoreData = async () => {
    
  }

	render() {
    return (
      <>
        <header className="px-1 content-head" >
          {/* <h3> Maps (s) </h3> */}
          <MapDesignHeader />
        </header>

        <main>
          <div className="container-fluid p-0 content-view" >

            <div className="p-2" >
                
              <div className="m-2"> 
              	Saved Maps 
              </div>

              {/* OEM
              <div className="m-2 ms-0" >

              	<MaboxRender />

              </div>
            	*/}

            	<div className="m-2 ms-0" >
            		<Tab.Container 
		              id="tabcontainer_landing_page" 
		              activeKey={this.props.tabKeyToggleMapView}
		            >
		            	<Tab.Content animation>
		            		<Tab.Pane eventKey="tabs_toggle_map-datatable" className="p-3" >
		            			<div >
		                    { this.props.tabKeyToggleMapView == 'tabs_toggle_map-datatable' && 
		                      <RecordsTable />
		                    }
		                  </div>
		            		</Tab.Pane>

		            		<Tab.Pane eventKey="tabs_toggle_map-designer" className="p-0" style={{padding: "0"}} onEnter={()=> window.dispatchEvent(new Event('resize'))} > {/* Help mediate the issue with map resizing ... */}
		            			<MaboxRender />
		            		</Tab.Pane>
		            		
		            	</Tab.Content>
		            </Tab.Container>
            	</div>


            </div>

          </div>
        </main>


        <footer className="px-1 content-footer" >
          <div class="container-fluid" style={{marginTop : "0.7rem"}} >
          	<MapDesignFooter />
          </div>
        </footer>

      </>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  	tabKeyToggleMapView: state.mapdesign.tabKeyToggleMapView ,  //main content tab
  };

};


const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(MapRenderContainer)