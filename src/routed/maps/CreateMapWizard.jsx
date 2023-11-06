import Layout from "../../components/layout/Layout";
import DDLMenuBar from "../../components/layout/partials/DDLMenuBar";
import DDLMenuItems from "../../components/layout/partials/DDLMenuItems";
import DDLBodyContainer from "../../components/layout/partials/DDLBodyContainer";
import DDLBodyContent from "../../components/layout/partials/DDLBodyContent";
import DDLSideNavLeft from "../../components/layout/partials/DDLSideNavLeft";
import DDLSideNavLeftAllowFooter from "../../components/layout/partials/DDLSideNavLeftAllowFooter";
import DDLSideNavRight from "../../components/layout/partials/DDLSideNavRight";
// OEM import LeftNav from "../../components/layout/LeftNav";
import MapDesignInfoPanel from "../../components/map-design/MapDesignInfoPanel";
import MapDesignLegendPanel from "../../components/map-design/MapDesignLegendPanel";

import MapRenderContainer from '../../components/maps/MapRenderContainer' ;
import { MapProvider } from "../../components/maps/context/mapContext";

import MapsMenu from "../../components/maps/MapsMenu";
import MapsMenuStep1 from "../../components/maps/MapsMenuStep1";
import OffCanvasPromptLabels from "../../components/map-design/OffCanvasPromptLabels";
import OffCanvasPromptInputs from "../../components/map-design/OffCanvasPromptInputs";

import MapDesignToolsMenu from "../../components/map-design/MapDesignToolsMenu";

import CreateMapStep1PromptLabels from "../../components/maps/CreateMapStep1PromptLabels";
import CreateMapStep1PromptInputs from '../../components/maps/CreateMapStep1PromptInputs' ;


const CreateMapWizard = (props) => {

	const step = parseInt(props.match.params.step_number);

	const CreateMapLayoutStep1 = () => {
		return(
			<Layout>
	  			<DDLMenuBar>
	  				<DDLMenuItems>
	  					<MapsMenuStep1 />
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

	const CreateMapLayoutStep2 = () => {
		return (
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

    switch(step) {
      case 1:
        return CreateMapLayoutStep1();
        break;
      case 2:
        return CreateMapLayoutStep2();
        break;
      default:
        return <div>Error!</div>
    }

}

export default CreateMapWizard ;