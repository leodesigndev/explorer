import Axios from "axios";
import { BASE_API_URL } from "./constant";

class MatricesService {

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

	async edit(data) {
	    try {
	      const response = await Axios.patch(`${BASE_API_URL}/api/explorer/data_matrices/update`, data.data, {
	        headers: { Authorization: `${data.token}` },
	      });
	      return response.data;
	    } catch (error) {
	      throw error;
	    }
	}


	async loadGroupedPrompts(data) { // @TODO auth tokens
		try {
			const response = await Axios.post(`${BASE_API_URL}/api/explorer/data_matrices/get_grouped_prompts`, data);
			return response.data;

		} catch (error) {
			throw error;
		}
	}

	

}

export default MatricesService;
