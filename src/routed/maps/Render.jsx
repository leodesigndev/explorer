import React from "react";
import { connect } from "react-redux";

import Header from "../../components/explorer/Header";
import SideNavLeft from '../../components/explorer/SideNavLeft' ;
import MaboxRender from '../../components/maps/MapboxRender' ;
import SideNavRight from '../../components/explorer/SideNavRight' ;
import { MapProvider } from "../../components/maps/context/mapContext";

import "../../theme1.css";

class RenderMaps extends React.Component {
	
	render() {
		return (
			<div class="container-fluid cover-container  d-flex flex-column p-0" >
          		<div class="row-fluid flex-fill overflow-hidden">

          			<Header />

          			<div id="layoutSidenav" >
          				<SideNavLeft />
          				<MapProvider>
          					<MaboxRender />
          				</MapProvider>
          				<SideNavRight />
          			</div>

          		</div>
          	</div>
		);
	}

}

export default RenderMaps;