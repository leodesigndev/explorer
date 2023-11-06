import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import {connect} from "react-redux" ;
import InfiniteScroll from "react-infinite-scroll-component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome , faFileLines , faFolderOpen , faCheck
} from '@fortawesome/free-solid-svg-icons';

import { 
 Button , Nav ,  Container , Row
} from 'react-bootstrap';


import Selecto from "react-selecto";
import anime from 'animejs/lib/anime.es.js';

import DelphiEnv from '../DelphiEnv';
import { store } from "../../redux";
import SavedMapTile from "./SavedMapTile" ;
import { BASE_API_URL } from "../../redux/services/constant";
import { MapDesignActions } from "../../redux/actions";


class SavedMapIndex extends Component {


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
              	Saved Maps 
              </div>



            	

            	{/*+++ selecto stuffs */}
            	<Selecto
                ref={ r => {
                  this.selecto = r
                }}
                dragContainer={`.elements-mmm`}
                selectableTargets={[".selecto-area .selecto-option"]}
                hitRate={100}
                selectByClick={true}
                selectFromInside={false}
                preventDragFromInside={true}
                clickBySelectEnd={false}
                continueSelect={false}
                ratio={0}
                onSelect={this.onSelect}
                onSelectEnd={this.onSelectEnd}
                //onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onSelectStart={this.onSelectStart}
              >
              </Selecto>
              {/*OEM
              <Container style={{background:"green"}} fluid style={{ padding: "0" , margin: "0" }} >
              	<Row
                  style={{width:"100%" , padding: "0" ,  margin: "0" }}
                  className={`elements-mmm selecto-area`}
                >
                {Boolean(this.state.options.length) &&
                	this.state.options.map( (option , fieldGroupIndex) => (
                		<div
                      value={option.id}
                      option_path={`field_option-${option.id}`}
                      className={`selecto-option option-stretched ${ option.is_hiden ? 'selecto-option-hidden' : '' }`}
                      style={{transform: "scale(1)" , marginLeft:"0" }}
                    >
                      <span className="option-checked-mark" > <FontAwesomeIcon icon={faCheck} className="mr-1 fa-1x" /> </span>
                      <span> {option.name} </span>
                    </div>
                	))
                }
              	</Row>
              </Container>
            	*/}
            	{/*+++ END selecto stuffs */}











            	<Container style={{background:"green"}} fluid style={{ padding: "0" , margin: "0" }} >

            		<Row
			                  style={{width:"100%" , padding: "0" ,  margin: "0" }}
			                  className={`elements-mmm selecto-area`}
			                >











              <div className="m-2 ms-0" >

              	{ this.state.data && this.state.data.length ?

              		<div className="m-2" style={{ height: "calc(100vh - 17rem )" , overflow: "auto" }} >

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


				            	{Boolean(this.state.data.length) &&
			                	this.state.data.map( (aMap , aMapIndex) => (
			                		
			                		<SavedMapTile 
					                  map={aMap}
					                />

			                	))
			                }



				            	


			                {/* OEM
				            	{Boolean(this.state.options.length) &&
			                	this.state.options.map( (option , fieldGroupIndex) => (
			                		<div
			                      value={option.id}
			                      option_path={`field_option-${option.id}`}
			                      className={`selecto-option option-stretched ${ option.is_hiden ? 'selecto-option-hidden' : '' }`}
			                      style={{transform: "scale(1)" , marginLeft:"0" }}
			                    >
			                      <span className="option-checked-mark" > <FontAwesomeIcon icon={faCheck} className="mr-1 fa-1x" /> </span>
			                      <span> {option.name} </span>
			                    </div>
			                	))
			                }
			              	*/}
















			              	{/*OEM
				              {this.state.data.map((matrix, matrixIndex ) => (
				                <SavedMapTile 
				                  matrix={matrix} 
				                  setSelectedMatrice={this.props.setSelectedMatrice}
				                  // OEM 2 setSelectedMatrice={matrix} 
				                  // OEM startCreateNewAnalysis = {startCreateNewAnalysis }
				                  startCreateNewAnalysis = { this.doStartCreateNewAnalysis }
				                  loadMatrices = {this.loadMatrices}
				                />
				              ))}

				            	*/}

				            </InfiniteScroll>


              		</div>

              		:

              		<div> No Saved Map yet </div>
              	}

              </div>
















              </Row>
			              </Container>










              {/* <div className="m-2" > Pages </div> */}

            </div>

          </div>
        </main>


        <footer className="px-1 content-footer" >
          
          

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



export default connect(mapStateToProps, mapDispatchToProps)(SavedMapIndex)