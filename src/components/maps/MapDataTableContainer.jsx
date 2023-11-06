import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;
import InfiniteScroll from "react-infinite-scroll-component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome , faFileLines , faFolderOpen , faCheck , faMaximize , faTableList , faMapLocationDot , faEdit
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Nav ,  Container , Row , Stack
} from 'react-bootstrap';


import Selecto from "react-selecto";
import anime from 'animejs/lib/anime.es.js';

import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";
import SavedMapTile from "./SavedMapTile" ;
import { BASE_API_URL } from "../../redux/services/constant";
import { MapDesignActions } from "../../redux/actions";
import RecordsTable from "../map-design/RecordsTable";


class MapDataTableContainer extends Component {


	constructor(props){
	    super(props);

	    this.state = {
	    	mapId: 0 ,
	      offset: 0,
	      data : [],
	      pageCount : 0 ,
	      totalCount : 0 ,

	      hasMore : true,

	      options: [
	      	{
	      		id: 1,
	      		name: "option1"
	      	},
	      	{
	      		id: 2,
	      		name: "option2"
	      	}
	      ]
	    }


	    this.selecto = null ;

	}

	async componentDidMount(){
		await this.loadSavedMaps();
	}

	async loadSavedMaps(){

		try{

      const response = await axios.get(
        `${BASE_API_URL}/api/explorer/maps/get_filtered_maps`,
        {
          params : {
            size : this.props.perPage ,
            offset : this.state.offset
          }
        }
      );

      let dataAggr = this.state.data.concat(response.data.maps) ;
      
      this.setState({
        data : dataAggr ,
        totalCount : parseInt(response.data.meta.totalCount) ,
        pageCount : Math.ceil(parseInt(response.data.meta.totalCount) / parseInt(response.data.meta.limit)),
        hasMore : dataAggr.length < parseInt(response.data.meta.totalCount) ? true : false
      });


    }catch(error){

      throw error;

    }


		/* OEM
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
	
		*/
	}


	fetchMoreData = async () => {
    let offset = Math.ceil( this.state.offset + this.props.perPage);
    this.setState({ offset: offset }, async () => {
      await this.loadSavedMaps();
    });
  }

	




  onSelect = async e => {

	}

	onSelectStart = async e => {

	}

	onDrag = async e => {
		e.stop();
	}


	onSelectEnd = async e => {

		e.added.forEach(el => {
      el.classList.add("selected");
    });
    e.removed.forEach(el => {
      el.classList.remove("selected");
    });


    // selected values
    let selectedValues = [] ;
    e.currentTarget.selectedTargets.forEach(el => {
    	let val = el.getAttribute("value");
    	selectedValues.push(val);
    });
    
    this.props.setSelectedSavedMapId(selectedValues[0]);
    
    // const selectedPrompt = this.props.selectedField ;
    // const pathName = selectedPrompt.path_name ;

    // update labels
    //labelsUpdate(pathName , selectedValues);

    // animate selection
    let animateConfig = true ;
    if(animateConfig){
      this.animateSelection(e.added) ;
    }


    // captured value // @TODO make so we can unset
    // Inputs.step2Captured[pathName] = selectedValues ;
    // OEM inputCapture( selectedValues , pathName );
    /* OEM
    inputCapture( selectedValues , selectedPrompt );

    if(selectedPrompt.prompt_type != "multiselect" ){
      setTimeout( () => this.gotoPromt('next')  , 300 ); // @TODO ajust time out ?
    }
    */

    

    // :-) let mmm2 = this.selecto.selecto.getSelectedTargets(); // :-)
    // :-) console.log('mmm2<<<<' , mmm2 );


	}


	animateSelection = (targets) => {
    anime({
      // OEM targets: 'div',
      targets: targets , //  '.mmm_leo',
      scale: [1, 1.05],
      direction: 'alternate',
      duration: 100,
      easing: 'easeInCubic',
      // OEM loop: true
      loop: 4
    });
  }



  handleToggleDataVisual = (eventKey , event) => {

    if(eventKey == 'tabs_main-map_designer'){

      // this.props.setTabKeyLandingPage(`tabs_main-map_designer`); // @DEGUG , @TODO uncomment

    }else if(eventKey == 'tabs_toggle_map-datatable'){

    	

      //+++ test
      /* OEM :-)
      this.props.setMmm({
        "select": true,
        "ID": true
      });

      setTimeout(() => this.props.setMmm({
        "select": false,
        "ID": false
      }) , 15000 );
      */
      //+++END  test


      window.jQuery('.matrix-data-table-view-wrapper').mCustomScrollbar({
       theme: "light",
       axis:"yx",
       // OEM setHeight: 200, // @TODO calculate and make responsive ? <---
       setHeight:false,
       // theme:"dark",
       // live: "on" , // <---
       //liveSelector : "matrix-data-table-view-wrapper" , // <---
       scrollEasing : "linear",
       scrollInertia : 0,
       autoDraggerLength : false
      });



      this.props.toggleMapView(`tabs_toggle_map-datatable`);
    }

  }

	render() {
    return (
      <>
        <header className="px-1 content-head" >
          <h3> Maps </h3>
        </header>

        <main>
          <div className="container-fluid p-0 content-view" >

            <div className="p-2" >
                
              <div className="m-2" > 
              	Map Datatable
              </div>


              <RecordsTable />

            </div>

          </div>
        </main>


        <footer className="px-1 content-footer" >
          <div class="container-fluid" style={{marginTop : "0.7rem"}} >
          	<Stack direction="horizontal" gap={3} >
          		
          		<div className="col-md-3">

          			<Nav
		              fill
		              justify
		              variant="pills"
		              activeKey={this.props.tabKeyLandingPage}
		              //activeKey="tabs_toggle_map-datatable"
		              className="me-auto ddl-tab-nav-style-strong-blue ddl-nav-line-top"
		              defaultActiveKey={this.props.tabKeyLandingPage}
		              //defaultActiveKey="tabs_toggle_map-datatable"
		              onSelect={this.handleToggleDataVisual}
		            >
		              <Nav.Item >
		                <Nav.Link
		                  eventKey="tabs_toggle_map-datatable"
		                  style={{padding:"5px 0 5px 0"}}
		                >

		                  Table

		                </Nav.Link>
		              </Nav.Item>
		              <Nav.Item >
		                <Nav.Link
		                  eventKey="tabs_main-map_designer"
		                  style={{padding:"5px 0 5px 0"}}
		                >

		                  Map

		                </Nav.Link>
		              </Nav.Item>


		            </Nav>

          		</div>


          		<div className="ms-auto">
          			
          			<Button variant="primary"
			            // onClick={this.handleZoomToMap}
			            className="ddl-button-style-light-blue ddl-no-outline me-3"
			          >
			            <FontAwesomeIcon icon={faTableList} className="me-2" /> Tweek view
			          </Button>

          		</div>


          		<div>
		            <Button
		              variant="primary"
		              className="ddl-button-style-light-blue ddl-no-outline"
		              // onClick={this.handleTweakViewDatatable}
		            >
		              <FontAwesomeIcon icon={faEdit} className="me-2" /> Export
		            </Button>
		          </div>





          	</Stack>
          </div>
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
  
  return {
  	setSelectedSavedMapId: async (data) => dispatch(MapDesignActions.setSelectedSavedMapId(data))
  };

};



export default connect(mapStateToProps, mapDispatchToProps)(MapDataTableContainer)