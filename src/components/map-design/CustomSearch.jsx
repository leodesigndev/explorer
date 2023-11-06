import React from "react";

import _ from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';





const CustomSearch = (props) => {

  let input;

  const debounceSearch = (props , input) => {
    props.onSearch(input.value);
  }

  const debouncedSearch = _.debounce(debounceSearch, 300 ) ;


  const handleClick = () => {
    props.onSearch(input.value); // make the search delete button work
  }


  const handleKeyUp = () => {
    debouncedSearch(props , input );
  }

  const handleSearchboxClick = () => {
    debouncedSearch(props , input );
  }

  return (
    <div className="row-fluid mb-2">
      <div className="col-md-12">
        <div 
          className="input-group mb-3 rounded  overflow-hidden border2" 
          // style={{background:"#284664" , borderColor:"#2f547c" , color:"white" }} // e6e6e6ff | 5f6972
        >
          <span 
            onClick={ handleClick } // temp...
            className="input-group-text border-0 pe-1"  // OEM bg-white 
            style={{background:"#284664" , borderColor:"#03999c" , color:"white" }} //  @TODO ? border: "1px solid #1c2a3f"

            id="basic-addon1"
            // style={{background:"#284664" , borderColor:"#2f547c" , color:"white" }}
          >
            <FontAwesomeIcon icon={faSearch} style={{color:"#7f7f7fff", fontSize:"23px"}} className="fa-2x" /> 
          </span>
          <input 
            ref={ r => input = r }
            onKeyUp={ input  => { handleKeyUp() }  }
            type="search" 
            onClick={handleSearchboxClick}
            className="ddl-text form-control hide-focus border-0 placeholder-italics ddl-no-outline" 
            style={{background:"#284664" , borderColor:"#03999c" , color:"white" }}
            placeholder="Search filter... "
            // style={{background:"#284664" , borderColor:"#2f547c" , color:"white" }}
            aria-describedby="basic-addon1" 
          />
        </div>
      </div>
    </div>
  );
}

export default CustomSearch;