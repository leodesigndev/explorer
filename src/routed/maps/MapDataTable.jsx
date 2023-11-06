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

import MapsMenu from "../../components/maps/MapsMenu";

// import Header from "../../components/explorer/Header";
// import SideNavLeft from '../../components/explorer/SideNavLeft' ;


import MapDataTableContainer from '../../components/maps/MapDataTableContainer' ;

import MapDesignToolsMenu from "../../components/map-design/MapDesignToolsMenu";


class MapDataTable extends React.Component {
	
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
	  					<LeftNav />
	  				</DDLSideNavLeft>
	  				
	  				<DDLBodyContent>
	  					<MapDataTableContainer />
	  				</DDLBodyContent>

	  				<DDLSideNavRight>
	  					<MapDesignToolsMenu />
	  				</DDLSideNavRight>
	  			</DDLBodyContainer>
	  			
          	</Layout>
		);
	}

}

export default MapDataTable;