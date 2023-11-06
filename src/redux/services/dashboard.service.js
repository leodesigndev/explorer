import Axios from "axios";
import { BASE_API_URL } from "./constant";

class DashboardService {

	async read(data) {

		try {
	      const response = await Axios.get(
	        `${BASE_API_URL}/api/explorer/maps/get_saved_maps`
	      );
	      console.log(response);
	      return response.data;
	    } catch (error) {
	      console.log(error);
	      throw error;
	    }

	}


	async loadDataMatrices(data) {
		try {
	      const response = await Axios.get(
	        `${BASE_API_URL}/api/explorer/data_matrices/get_matrices`
	      );
	      return response.data;
	    } catch (error) {
	      throw error;
	    }

	}


	async loadSavedMaps(data) {// @TODO account for `recent` params , @TODO include favourites
		try {
	      const response = await Axios.get(
	        `${BASE_API_URL}/api/explorer/maps/get_saved_maps`
	      );
	      return response.data;
	    } catch (error) {
	      throw error;
	    }

	}

}

export default DashboardService;
