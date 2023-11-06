import { 
 Row , Col , Button
} from 'react-bootstrap';

import ReactDOMServer from 'react-dom/server';

import { store } from "../redux";
import NotificationDialogContent from './NotificationDialogContent';

import {createJsPanel} from '../configs/jsPanelOptions';

const {getState , dispatch} = store ;
let state = getState() ;


const NotificationDialog = ({title , type , msg }) => {

	const attributes = {
		type,
		msg
	};

	const defaultOptions = {
		title : "Dynamic Data Logger" ,
		type : "info" ,
		msg : ""
	}

	type  = type ? type : defaultOptions.type ;

	return ( 
		<>
			{createJsPanel(
				{title ,type}, 
				NotificationDialogContent,
				true ,
				{
					...attributes,
					optionsOverwrite : {
						panelSize: "30% 40%" ,
						headerControls: {
			                minimize: 'remove', // disable | remove
			                smallify: 'remove',
			                maximize: 'remove'
			            },
			            footerToolbar: () => {
			              return ReactDOMServer.renderToString(
			                <>
			                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_notification_dialog-ok" > Ok </Button>
			                </>
			              );
			            }
					}

				} 
			)}
		</>
		
	);
}

export default NotificationDialog;