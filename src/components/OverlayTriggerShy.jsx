import { 
 OverlayTrigger , Tooltip
} from 'react-bootstrap'; // FontAwesomeIcon

function OverlayTriggerShy({ children , tooltipText , placement = "left"}) {
	return(
		<OverlayTrigger
            placement={placement}
            delay={{ show: 1500, hide: 200 }}
            onEnter={(e) => {
              setTimeout( () => { e.classList.remove("show") } , 2000 ) ; // @TODO clear timeout onOut ?
            }}
            
            overlay={ props => (
              <Tooltip {...props}>
                {tooltipText}
              </Tooltip>
            )}
          > 
			{children}
		</OverlayTrigger>
	);
}

export default OverlayTriggerShy ;