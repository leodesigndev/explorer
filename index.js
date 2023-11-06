const path = require('path');
const ddlConfigs = require('../../ddl/configSimple.min.json'); // ddlConfigs.ddlclient
const applicableClients = ['afma', 'dfo'];
const clientQuery = new URLSearchParams({client:ddlConfigs.ddlclient}).toString();
const { uploadDir , publicDir } = require('../../api/explorer/helpers/common.js');

exports.initialize = async (server, routes, express, ddlclient) => {
	if (!applicableClients.includes(ddlclient))
		return(false);


	// a sample route with parametre : router.get("/get_options/:matrixId/:promptName", (req, res) => controller.getOptions(req, res));

	// how ddr deal with all the other routes
	// routes.get([ '/ddr/do_auth', '/ddr/do_auth_refresh' , '/ddr/do_auth_revoke' , '/ddr/afma_redirect1', '/ddr/afma_redirect2', '/ddr/afma_redirect3' , '/ddr/do_send_reports' , '/ddr/do_view_report' , '/ddr/search_afma_web_service' , '/ddr/configuration' , '/ddr/do_confirm_configuration'] , (req , res) => {

	// OEM routes.get([ '/explorer' , '/'] , (req , res) => {
	routes.get([ '/explorer' , '/explorer/maps/create_step/:step_number'  ] , (req , res) => {
	  res.sendFile(path.join(__dirname, "ui/index.html"));
	});

	server.use('/explorer', express.static(path.join(__dirname, "ui")));

	server.use(express.static(await publicDir())); //+++ @1 fix path in build

	// server.use(express.static("C:\\Olrac\\DDL8 AFMA\\data\\public")); // fix public patch from executable ++++

	return(true);
}

exports.applicableToClient = (ddlclient) => {
	return(applicableClients.includes(ddlclient));
}

exports.applicableClients = applicableClients;

exports.name = 'OlracExplorer';


exports.ui_config = {
	config_caption: 'Reporting',
	header: true,
	url: clientQuery == 'client=afma' ? '/ddr/configuration' : '/ddr/configuration?'+ clientQuery,
	//only_show_for_clients: ['austral'],
	onlyshowifCLPExists: 'uat' // uat | cefdebug
};

exports.ui = {
	menu_caption: 'Explorer',
	header: false, // must UI have the default DDL header panel (which gives a back button and shows menu_caption)?
	//OEM 2 url: '/ddr?'+ clientQuery, // will be prefixed with 'http://localhost:4205'
	//OEM url: '/ddr',
	//OEM 2 url : clientQuery == 'client=afma' ? '/ddr/configuration' : '/ddr/configuration?'+ clientQuery  , // TODO unify client=afma
	url : clientQuery == 'client=afma' ? '/explorer' : '/explorer?'+ clientQuery  , // TODO unify client=afma
	show_in_tools_menu: false, // DDR has a separate button, doesn't need to be added to the general Tools menu
	is_explorer_module: true
}

