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
 Button , Nav
} from 'react-bootstrap';


import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";
// import SavedMapTile from "../SavedMapTile" ;


class DataMatrixIndex extends Component {


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
          <h3> My Fishing Data </h3>
        </header>

        <main>
          <div className="container-fluid p-0 content-view" >

            <div className="p-2" >
                
              <div className="m-2"> 
              	My Fishing Data 
              </div>



              <div className="m-2 ms-0" >

              	{ this.state.data && this.state.data.length ?

              		<div className="m-2" style={{ height: "calc(100vh - 17rem )" , overflow: "auto"  }} >

              			<InfiniteScroll
			              className="mb-3 w-100"
			              dataLength={this.state.data.length}
			              next={this.fetchMoreData}
			              hasMore={this.state.hasMore}
			              loader={<h4>Loading...</h4>}
			              endMessage={
			                <p style={{ textAlign: 'center' }}>
			                  <b> &nbsp; </b>
			                </p>
			              }
			              scrollableTarget="scrollableDiv"


			              // below props only if you need pull down functionality
			              refreshFunction={this.fetchMoreData}
			              pullDownToRefresh
			              pullDownToRefreshThreshold={50}
			              pullDownToRefreshContent={
			                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
			              }
			              releaseToRefreshContent={
			                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
			              }

			            >
			              {this.state.data.map((matrix, matrixIndex ) => (
			              	<></>
			              ))}
			            </InfiniteScroll>


              		</div>

              		:

              		<div> No Saved Map yet </div>
              	}

              </div>

              {/* <div className="m-2" > Pages </div> */}

            </div>

          </div>
        </main>


        <footer className="px-1 content-footer" >
          mmm (2)
        </footer>

      </>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
  };

};


const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  return {
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(DataMatrixIndex)