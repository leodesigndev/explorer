import Layout from "../../components/layout/Layout";
import DDLMenuBar from "../../components/layout/partials/DDLMenuBar";
import DDLMenuItems from "../../components/layout/partials/DDLMenuItems";
import DDLBodyContainer from "../../components/layout/partials/DDLBodyContainer";
import DDLBodyContent from "../../components/layout/partials/DDLBodyContent";
//OEM import DDLSideNavLeft from "../../components/layout/partials/DDLSideNavLeft";
import DDLSideNavLeftAllowFooter from "../../components/layout/partials/DDLSideNavLeftAllowFooter";
import MapDesignInfoPanel from "../../components/map-design/MapDesignInfoPanel";
import MapDesignLegendPanel from "../../components/map-design/MapDesignLegendPanel";

import DDLSideNavRight from "../../components/layout/partials/DDLSideNavRight";
import LeftNav from "../../components/layout/LeftNav";
import MapRenderContainer from '../../components/maps/MapRenderContainer' ;
import { MapProvider } from "../../components/maps/context/mapContext";

import MapsMenu from "../../components/maps/MapsMenu";
import OffCanvasPromptLabels from "../../components/map-design/OffCanvasPromptLabels";
import OffCanvasPromptInputs from "../../components/map-design/OffCanvasPromptInputs";

import MapDesignToolsMenu from "../../components/map-design/MapDesignToolsMenu";


const OpenMap = (props) => {

  return(
  	<Layout>
			<DDLMenuBar>
				<DDLMenuItems>
					<MapsMenu />
				</DDLMenuItems>
			</DDLMenuBar>
			<DDLBodyContainer>

				{/*
				<DDLSideNavLeft>
					<LeftNav />
				</DDLSideNavLeft>
				*/}


				<DDLSideNavLeftAllowFooter>
					<div class="sb-sidenav-menu" >
	          <MapDesignInfoPanel />
	        </div>
	        <div class="sb-sidenav-footer" style={{minHeight:"30%"}} >
	          <MapDesignLegendPanel />
	        </div>
				</DDLSideNavLeftAllowFooter>
				
				<DDLBodyContent>
					<MapProvider>
						<MapRenderContainer />
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

export default OpenMap ;