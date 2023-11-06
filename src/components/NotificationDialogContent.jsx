import React, { useEffect } from "react";

import { 
 Row , Col , Stack
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo , faCircleExclamation , faTriangleExclamation , faSkullCrossbones , faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import { store } from "../redux";


const {getState , dispatch} = store ;

let state = getState() ;


const NotificationDialogContent = (props) => {
	
	useEffect(() => {
		let panel = props.jsPanel ;
    
    panel.footer.querySelector('.selector_btn_notification_dialog-ok').addEventListener('click' , (e) => {
      return panel.close();
    });
	}, []);

	let dialogHeader = {

		information :
			<>
			<Stack direction="horizontal" gap={2}>
	      <div>
	      	<FontAwesomeIcon icon={faCircleInfo} className="fa-3x me-2 text-info" />
  			</div>
	      <div>
	      	Information
	      </div>
	    </Stack>
	    <hr className="text-info" />
	    </> ,
	  warning :
	  	<>
	  	<Stack direction="horizontal" gap={2}>
	      <div>
	      	<FontAwesomeIcon icon={faTriangleExclamation} className="fa-3x me-2 text-warning" />
  			</div>
	      <div>
	      	Warning
	      </div>
	    </Stack>
	    <hr className="text-warning" />
	    </> ,
	  error :
	  	<>
	  	<Stack direction="horizontal" gap={2}>
	      <div>
	      	<FontAwesomeIcon icon={faCircleXmark} className="fa-3x me-2 text-danger"   />
  			</div>
	      <div>
	      	Error
	      </div>
	    </Stack> 
	    <hr className="text-warning" />
	    </>

	}

	return (
		<>

			{dialogHeader[props.type]}
			
			{ typeof props.msg === 'function' ? props.msg() :  props.msg }
			
		</>
	);
}

export default NotificationDialogContent;