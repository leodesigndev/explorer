import Axios from "axios";
import { BASE_API_URL } from "./constant";

class MapdesignService {

	async getPromptOptions(data) {

		try {
	      const response = await Axios.get(
	      	`${BASE_API_URL}/api/explorer/data_matrices/get_options/${data.dataMatrixID}/${data.row.realName ? data.row.realName : data.row.path_name}/${data.row.path_name}`
	      );
	      
	      return response.data;
	    } catch (error) {
	      console.log(error);
	      throw error;
	    }

	}


	async loadMap(data) {

		try {
	      const response = await Axios.get(
	      	`${BASE_API_URL}/api/explorer/maps/get_saved_map/${data.id}`
	      );
	      
	      return response.data;
	    } catch (error) {
	      console.log(error);
	      throw error;
	    }

	}
}

export default MapdesignService;
