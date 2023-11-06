import React, { useContext , useEffect } from "react";
import { mapContext } from "./context/mapContext";
import { useSelector } from "react-redux";

import {
  Button , CloseButton
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { store } from "../../redux";
import Inputs from "../../configs/inputs";
// OEM import {getSelectionDetails } from "./Actionnables"
import {getOptionInfo} from "../Common";
import {toFixed2 }  from "../../utilities/Helpers" ;



export default function PopupContent({ feature }) {



  useEffect(() => {


    window.jQuery(`.mmmselector_targeting`).mCustomScrollbar({
      theme: "light",
      axis:"yx",
      //setHeight: 'auto',
      //setWidth: 200,
      setHeight: 200,
      // theme:"dark",
      scrollEasing : "linear",
      scrollInertia : 0,
      autoDraggerLength : false
    });
    

  }, []);


  const { click } = useContext(mapContext);

  const dataTableColumns = useSelector((state) => state.matrices.dataTableColumns);

  let columns = dataTableColumns.map((column) => {
    return {
      accessorKey : column.name ,
      //:-( disableSortBy : column.name == 'ID' ? true : false , // @TODO config of ID column
      //:-) header: column.display_name ,
      // :-? defaultCanFilter: false
      header: () => <span> {column.display_name} </span> ,
      // size: 200
      size: 200
      // size: 200
      // cell: info => info.getValue()
      // cell: info => info.getValue()
    }
  });

  const records = JSON.parse(feature.properties.records);

  let r = [] ;
  if(records && records.length){
    r = records.map(rec => rec.properties.data);
  }
  console.log('records>><>>>' , r );

  // OEM const [data, setData] = React.useState(() => [...records]);
  const [data, setData] = React.useState(() => [...r]);
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // console.log('dataTableColumns>><>>>' , columns );


  const mapValue = getOptionInfo('setup-map_value' , true );

  const closePopup = (e) => {

    if(Inputs.mapboxPopupRef){
      //OEM :-)  Inputs.mapboxPopupRef.remove(); // @TODO  cleanup, or rather click on the button close....
    }
    document.getElementsByClassName("mapboxgl-popup-close-button")[0].click();
  }

  return (

    <div>

      <div className="d-flex justify-content-between p-2" style={{background:"#1b334cff" , borderTopLeftRadius: "9px" , borderTopRightRadius: "9px" }}  >

        <div> Contained Data Points </div>

        {/*
        <Button
          className="ddl-button-style-maptool ddl-no-outline"
          onClick={mmm31}
        >
          <FontAwesomeIcon icon={faXmark} />

        </Button> */}

        <CloseButton style={{color:"red"}} className="ddl-no-outline" variant="white" aria-label="Hide" onClick={ (e) => closePopup(e)} />

      </div>


      <div className="m-2">

        <div className="d-flex mb-2" > { mapValue ? mapValue : '' }  = {feature.properties.density ? toFixed2(feature.properties.density , 2 ) : '' }  kg/hour </div>
        <div className="d-flex mb-2" > RESULTS OK:  {data.length} {data.length > 2 ? `rows` : `row` } returned </div>



        {/* OEM <div className="mb-2 mmmselector_targeting" style={{maxHeight:"200px" , maxWidth:"100%" }} > */} {/* overflowX : "auto" */}
        <div className="mb-4 mmmselector_targeting" style={{height:"200px" , width:"100%", marginRight: "50%" }} >

          <table style={{border: "1px solid white", textAlign: "right"}}>
            <thead style={{border: "1px solid white", background:"#243f59"}}>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{border: "1px solid white"}}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody >
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{border: "1px solid white", height: "0.5px"}}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <th key={header.id} style={{border: "1px solid white"}}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>

        </div>


        <div className="d-flex mb-2 justify-content-end" >


          <Button
            className="ddl-button-style-light-blue ddl-no-outline me-3"
            // onClick={ (e) => toggleFilters(e , true) }
          >
            {/* <FontAwesomeIcon icon={faPencil} className="me-2" /> */} Config ...
          </Button>


          <Button
            className="ddl-button-style-light-blue ddl-no-outline me-3"
            // onClick={ (e) => toggleFilters(e , true) }
          >
            {/* <FontAwesomeIcon icon={faPencil} className="me-2" /> */} Save As CSV ...
          </Button>



          <Button
            className="ddl-button-style-light-blue ddl-no-outline"
            onClick={ (e) => closePopup(e)}
          >
            {/* <FontAwesomeIcon icon={faPencil} className="me-2" /> */} Close
          </Button>



        </div>

      </div>

    </div>
  );
}
