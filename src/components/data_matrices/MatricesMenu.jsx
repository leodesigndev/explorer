import { Link } from "react-router-dom";
import {connect} from "react-redux" ;

import { 
  Button
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus
} from '@fortawesome/free-solid-svg-icons';


const MatricesMenu = (props , {children}) => {

  return(
    <>
      <div>
        <Link to="/explorer/data_matrices/create">
          <Button
          className="ddl-button-style-light-blue ddl-no-outline" 
          // onClick={this.handleNewMap}
          > 
            <FontAwesomeIcon
              icon={faPlus} // faLocationDot
              className="me-2" 
            />
            Add Fishing Data ... 
          </Button>
        </Link>
      </div>


      {/*tmp button to remove +++ */}
      <div>
        {/* <Link to="/explorer/maps/create_step/1"> */}
        {/* <Link to="/maps/create_step/1"> */}
        <Link to="/explorer/maps/create_step/1">
          <Button
          className="ddl-button-style-light-blue ddl-no-outline" 
          // onClick={this.handleNewMap}
          > 
            <FontAwesomeIcon
              icon={faPlus} // faLocationDot
              className="me-2" 
            />
            New Map ... 
          </Button>
        </Link>
      </div>
      {/*tmp END  button to remove +++ */}





    {/* temporary user button +++ */}
        <div>
          <Link to="/explorer/data_matrices/create">
            <Button
            className="ddl-button-style-light-blue ddl-no-outline"
            > 
              <FontAwesomeIcon
                icon={faPlus} // faLocationDot
                className="me-2" 
              />
              {props.user.name}
            </Button>
          </Link>
        </div>
        {/* temporary user button +++ */}

    </>
  );
}


const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };

};


const mapDispatchToProps = (dispatch) => {
  return {
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(MatricesMenu)