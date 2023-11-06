import React from "react";
import { connect } from "react-redux";

import Layout from "../../components/layout/Layout";
import DDLMenuBar from "../../components/layout/partials/DDLMenuBar";
import DDLMenuItems from "../../components/layout/partials/DDLMenuItems";
import DDLBodyContainer from "../../components/layout/partials/DDLBodyContainer";
import DDLBodyContent from "../../components/layout/partials/DDLBodyContent";
import DDLSideNavLeft from "../../components/layout/partials/DDLSideNavLeft";
import DDLSideNavRight from "../../components/layout/partials/DDLSideNavRight";
import LeftNav from "../../components/layout/LeftNav";
import MapRenderContainer from '../../components/maps/MapRenderContainer' ;
import { MapProvider } from "../../components/maps/context/mapContext";

import MapsMenu from "../../components/maps/MapsMenu";
import OffCanvasPromptLabels from "../../components/map-design/OffCanvasPromptLabels";
import OffCanvasPromptInputs from "../../components/map-design/OffCanvasPromptInputs";


import SavedMapIndex from '../../components/maps/SavedMapIndex' ;

import MapDesignToolsMenu from "../../components/map-design/MapDesignToolsMenu";


class CreateMapWizard extends React.Component {
	
	render() {

		const Wizard = (step) => {

			switch(step) {
			  case 1:
			    //return <CreateMapStep1  />;
			    break;
			  case 2:
			    // return <CreateMapStep2  />;
			    break;
			  default:
			    // handle default
			}
		}

		const step = this.props.match.params.step ;

		// <MapRenderContainer  />

		return (
			<Layout>
	  			<DDLMenuBar>
	  				<DDLMenuItems>
	  					<MapsMenu />
	  				</DDLMenuItems>
	  			</DDLMenuBar>
	  			<DDLBodyContainer>
	  				<DDLSideNavLeft>
	  					<LeftNav />
	  				</DDLSideNavLeft>
	  				
	  				<DDLBodyContent>
	  					<MapProvider>
	  						<Wizard step={this.props.match.params.step} />
	  					</MapProvider>
	  				</DDLBodyContent>

	  				<DDLSideNavRight>
	  					<MapDesignToolsMenu />
	  				</DDLSideNavRight>
	  			</DDLBodyContainer>

	  			<OffCanvasPromptLabels />
	  			<OffCanvasPromptInputs />
	  			
	  			
          	</Layout>
		);
	}

}

export default CreateMapWizard;