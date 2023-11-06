import Axios from "axios";
import { BASE_API_URL } from "./constant";

class ExplorerService {

	async saveFavouriteFields(data) {

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


	async getFieldAndOptions(data) {

		try {
	      const response = await Axios.get(
	        // OEM `${BASE_API_URL}/api/explorer/data_matrices/get_field_and_options/${data.name}`
	        `${BASE_API_URL}/api/explorer/data_matrices/get_field_and_options/${data.realName}`
	      );
	      response.data.prompt.detail = data ;
	      return response.data;
	    } catch (error) {
	      throw error;
	    }
	}

	async getPromptOptions(data) {

		try {
	      const response = await Axios.get(
	        // OEM `${BASE_API_URL}/api/explorer/data_matrices/get_field_and_options/${data.name}`
	        // OEM2 :-) `${BASE_API_URL}/api/explorer/data_matrices/get_prompt_options/${data.matrixId}/${data.path_name}`
	        `${BASE_API_URL}/api/explorer/data_matrices/get_prompt_options/${data.matrixId}/${data.row.realName}` // @TODO delete this for the preceding line...
	      );
	      response.data.prompt.detail = data ;
	      return response.data;
	    } catch (error) {
	      throw error;
	    }
	}


	async saveConfig(data) {

		try {

	      const response = await Axios.patch(
	        `${BASE_API_URL}/api/explorer/configurations`,
	         {
	         	name : data.name,
	         	matrixId : data.matrixId ,
	         	configs : data.data
	         },
	        {
	        	headers: { Authorization: `Bearer ${data.token}` },
	        }
	      );
	      
	      
	      return response.data;
	    } catch (error) {
	      throw error;
	    }
	}

	async loadConfig(data) {

		try {
	      const response = await Axios.get(
	        `${BASE_API_URL}/api/explorer/configurations/get/${data.key}/${data.matrixId}`,
	        {
	        	headers: { Authorization: `Bearer ${data.token}` },
	        }
	      );
	      
	      return response.data;
	    } catch (error) {
	      throw error;
	    }
	}

}

export default ExplorerService;
