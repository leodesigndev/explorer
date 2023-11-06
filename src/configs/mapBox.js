/* :-)
module.exports = global.config = {
	map: null
	// other config variables
}
*/

export default {
	map: null ,
	draw: null,
	dataMatrixFilters : {}, // @TODO make independant , separate from mapBox context
	promptsAndCapturedValues : {} ,
	promptsAndDefaultValues : {} ,
	fields : []
}