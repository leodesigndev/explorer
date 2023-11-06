import { 
 Row , Col , Button
} from 'react-bootstrap';

import ReactDOMServer from 'react-dom/server';

import { store } from "../redux";
import ConfirmationDialogContent from './ConfirmationDialogContent';

import {createJsPanel} from '../configs/jsPanelOptions';

const {getState , dispatch} = store ;
let state = getState() ;


const ConfirmationDialog = ({title , msg , action , btn }) => {

	let show

	const attributes = {
		msg,
		action
	};

	const defaultOptions = {
		title : "Confirm Action" ,
		msg : ""
	};

	let confirmLabel = 'Confirm' ;
	
	if(btn && btn.confirm && btn.confirm.label ){
		confirmLabel = btn.confirm.label ;
	}

	let showCancelButton = true ;
	if(btn && !btn.cancel ){
		showCancelButton = false ;
	}
	
	return ( 
		<>
			{createJsPanel(
				{title}, 
				ConfirmationDialogContent,
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
			                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 me-4 selector_btn_confirmation_dialog-cancel" style={{display: !showCancelButton ? "none" : ""}} > Cancel </Button>
			                  <Button type="button" size="lg" className="ddl-button-style-light-blue mb-1 selector_btn_confirmation_dialog-confirm" > {confirmLabel} </Button>
			                </>
			              );
			            }
					}

				} 
			)}
		</>
		
	);
}

export default ConfirmationDialog;