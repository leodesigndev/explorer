import React from "react";
import { connect } from "react-redux";

import Layout from "../../components/layout/Layout";
import DDLMenuBar from "../../components/layout/partials/DDLMenuBar";
import DDLMenuItems from "../../components/layout/partials/DDLMenuItems";
import DDLBodyContainer from "../../components/layout/partials/DDLBodyContainer";
import DDLBodyContent from "../../components/layout/partials/DDLBodyContent";
import DDLSideNavLeft from "../../components/layout/partials/DDLSideNavLeft";
import DDLSideNavRight from "../../components/layout/partials/DDLSideNavRight";
import CreateMapStep1PromptLabels from "../../components/maps/CreateMapStep1PromptLabels";
import CreateMapStep1PromptInputs from '../../components/maps/CreateMapStep1PromptInputs' ;
import { MapProvider } from "../../components/maps/context/mapContext";

import MapsMenu from "../../components/maps/MapsMenu";
import OffCanvasPromptLabels from "../../components/map-design/OffCanvasPromptLabels";
import OffCanvasPromptInputs from "../../components/map-design/OffCanvasPromptInputs";


import SavedMapIndex from '../../components/maps/SavedMapIndex' ;

import MapDesignToolsMenu from "../../components/map-design/MapDesignToolsMenu";


class CreateMapStep1 extends React.Component {
	
	render() {

		return (
			<Layout>
	  			<DDLMenuBar>
	  				<DDLMenuItems>
	  					<MapsMenu />
	  				</DDLMenuItems>
	  			</DDLMenuBar>
	  			<DDLBodyContainer>
	  				<DDLSideNavLeft>
	  					<CreateMapStep1PromptLabels />
	  				</DDLSideNavLeft>
	  				
	  				<DDLBodyContent>
	  					<MapProvider>
	  						<CreateMapStep1PromptInputs  />
	  					</MapProvider>
	  				</DDLBodyContent>

	  				<DDLSideNavRight>
	  					<MapDesignToolsMenu />
	  				</DDLSideNavRight>
	  			</DDLBodyContainer>
          	</Layout>
		);
	}

}

export default CreateMapStep1;