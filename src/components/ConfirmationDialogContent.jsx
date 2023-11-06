import React, { useEffect } from "react";

import { 
 Row , Col , Stack
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo , faCircleExclamation , faTriangleExclamation , faSkullCrossbones , faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import { store } from "../redux";


const {getState , dispatch} = store ;

let state = getState() ;


const ConfirmationDialogContent = (props) => {
	
	useEffect(() => {
		let panel = props.jsPanel ;
    
    panel.footer.querySelector('.selector_btn_confirmation_dialog-cancel').addEventListener('click' , (e) => {
    	
    	props.action(false);

      return panel.close();
    });

    panel.footer.querySelector('.selector_btn_confirmation_dialog-confirm').addEventListener('click' , (e) => {
    	
    	props.action(true);

      return panel.close();
    });

	}, []);

	

	return (
		<>
			{ typeof props.msg === 'function' ? props.msg() :  props.msg }
			
		</>
	);
}

export default ConfirmationDialogContent;