import React, {FC, useEffect} from "react";
import { withRouter } from "react-router-dom";

import _ from 'lodash';

import Axios from "axios";
import { BASE_API_URL } from "../../redux/services/constant";

//import { compose } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import { MapDesignActions , ExplorerActions } from "../../redux/actions";
import { COLUMNS_CONFIG } from "../../utilities/constant";

//3 TanStack Libraries!!!
import {
  ColumnDef,
  // ColumnResizeMode, // -> .ts
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  //SortingState,  // -> .ts
  useReactTable,
} from '@tanstack/react-table';

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { useVirtual } from 'react-virtual' ;

import { DndProvider, useDrag, useDrop } from 'react-dnd' ;
import { HTML5Backend } from 'react-dnd-html5-backend' ;

import matriceConfig from "../../configs/matrice";
import $ from "jquery";

const fetchSize = 25 ;


async function fetchData(start , size , sorting ){ // @TODO fetch via saga ?
  // console.log('sorting >>>>>>>' , sorting[0] ) ;
  
  const response = await Axios.get(
    `${BASE_API_URL}/api/explorer/data_matrices/get_records?start=${start}&size=${size}&sorting=${JSON.stringify(sorting)}&id=${matriceConfig.id}` // @TODO delete this for the preceding line...
  );

  return {
    data: response.data.data ,
    meta: response.data.meta,

    fetchedData : response.data.fetchedData
  }
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}){
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}

function DoRecordsTable({columnsConfig}) {

  const rerender = React.useReducer(() => ({}), {})[1];

  const [rowSelection, setRowSelection] = React.useState({});
  // OEM :-) const [columnVisibility, setColumnVisibility] = React.useState({}) ;

  const [columnVisibility, setColumnVisibility] = React.useState({
    "select": false
    // "ID": false
  });

  const dispatch = useDispatch();
  const dataTableColumns = useSelector((state) => state.matrices.dataTableColumns);
  const user = useSelector((state) => state.auth.user);
  const dataMatrix = useSelector((state) => state.matrices.selectedDataMatrix);



  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef(null);
  const [sorting, setSorting] = React.useState([]);

  let eachColumn = dataTableColumns.map((column) => {
    return {
      accessorKey : column.name ,
      // OEM :-) accessorKey : column.path_name , // @TODO fix accessor key <-- this one only allow for hiding toggle column
      //:-( disableSortBy : column.name == 'ID' ? true : false , // @TODO config of ID column
      //:-) header: column.display_name ,
      // :-? defaultCanFilter: false
      // OEM header: () => <span> {column.display_name} </span> ,
      header: () => <span> {column.display_label} </span> ,
      // size: 200
      size: 200,
      isVisible: false ,
      // size: 200
      // cell: info => info.getValue()
      // cell: info => info.getValue()
      // Cell: ({value, column, row}) => { return( <div onClick={ () =>  handleWithRow(row.original) }>{value}</div> ) }
    }
  });

  // add selection columns
  const checkBoxColumn = {
    accessorKey: 'id', // @TODO review here
    id: 'select',
    header: ' ' ,
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    )

  }

  eachColumn = [
    checkBoxColumn ,
    ...eachColumn
  ];






  /* OEM @TODO , should we use memo ? for performance ?
  const columns = React.useMemo(
    () => eachColumn ,
    []
  );
  */

  //+++ @TODO move this outside the function ....
  const reorderColumn = (draggedColumnId , targetColumnId , columnOrder ) => {
    columnOrder.splice(
      columnOrder.indexOf(targetColumnId),
      0,
      columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0]
    );
    return [...columnOrder]
  }

  const DraggableColumnHeader = ({ header, table }) => {

    const { getState, setColumnOrder } = table ;
    const { columnOrder } = getState() ;
    const { column } = header ;


    const [, dropRef] = useDrop({
      accept: 'column',
      drop: (draggedColumn) => {
        const newColumnOrder = reorderColumn(
          draggedColumn.id,
          column.id,
          columnOrder
        );
        setColumnOrder(newColumnOrder);
      },
    });


    const [{ isDragging }, dragRef, previewRef] = useDrag({
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      item: () => column,
      type: 'column',
    })

    return (
      <th
        ref={dropRef}
        colSpan={header.colSpan}
        style={{ opacity: isDragging ? 0.5 : 1 , width: header.getSize() }}
      >
        <div ref={previewRef}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          <button ref={dragRef}>🟰</button>
        </div>
      </th>
    );


  }
  //END+++ @TODO move this outside the function ....



  const [columns] = React.useState(() => [
    ...eachColumn,
  ]);


  //+++ for column drag
  const [columnOrder, setColumnOrder] = React.useState(
    columns.map(column => column.id) //must start out with populated columnOrder so we can splice
  )

  const resetOrder = () =>
    setColumnOrder(columns.map(column => column.id))
  //END+++ for column drag




  const [columnResizeMode, setColumnResizeMode] = React.useState('onChange');


  //react-query has an useInfiniteQuery hook just for this situation!
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery(
    ['table-data', sorting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
    async ({ pageParam = 0 }) => {
      const start = pageParam * fetchSize ;
      const {data , meta , fetchedData} = await fetchData(start, fetchSize, sorting) ; // api call
      return fetchedData;
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );


  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0 ;
  const totalFetched = flatData.length ;



  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    // window.jQuery(`.selector_full_records_table`).mCustomScrollbar({
    //   theme: "light",
    //   axis:"yx",
    //   //setHeight: 'auto',
    //   //setWidth: 200,
    //   //setHeight: 200,
    //   // theme:"dark",
    //   scrollEasing : "linear",
    //   scrollInertia : 0,
    //   autoDraggerLength : false
    // });

    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached]);

  React.useEffect(() => {
    //Applies changes to decimal places
    $( "#records_table td" ).each( function(){
      var value = $(this).text();

      if(!isNaN((value)) && value.toString().indexOf('.') !== -1){
        value = Number(value).toFixed(2);
        $(this).text( value );
      }
    });
  });

  React.useEffect(() => {

    dispatch(ExplorerActions.loadConfig({key:COLUMNS_CONFIG , token: user.token }));
    // setColumnVisibility(mmm);
  }, []);

  React.useEffect(() => {
    if( !_.isEmpty(columnsConfig) ){ // apply column configuration (hidden/visible columns)

      console.log('mmmm>>>>' , {
        "select" : false ,
        ...columnsConfig
      });

      setColumnVisibility({
        "select" : false ,
        ...columnsConfig
      });
    }
  }, [columnsConfig]);



  const table = useReactTable({
    defaultColumn: {
      // OEM header: null // or ''
      // width: 200,
      // size: "auto"
    },
    data: flatData,
    columns,
    columnResizeMode,
    state: {
      sorting,

      columnOrder,
      rowSelection,
      columnVisibility
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,

    onColumnOrderChange: setColumnOrder,


    // row selection
    enableRowSelection: true, //enable row selection for all rows
    enableMultiRowSelection : false ,
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection, // resetRowSelection
    onColumnVisibilityChange: setColumnVisibility ,

    /*
    initialState:{
      // v7 hiddenColumns : columns.filter(col => col.show === false).map(col => col.accessor)
      columnVisibility : {
         "ID" : false
      }
    }*/
    /*
    initialState:{
      // v7 hiddenColumns : columns.filter(col => col.show === false).map(col => col.accessor)
      columnVisibility : {
         "ID" : false
      }

    }
    */

    /*
    stateReducer: (newState, action) => { console.log('actionid>>>>>>' , action.id );
      if (action.type === "toggleSelected") { console.log('actionid>>>>>>' , action.id );
        /#* OEM
        newState.selectedRowIds = {
          [action.id]: true
        } *#/
      }

      return newState;
    }
    */

    /*
    stateReducer: (newState, action, prevState) => {
       console.log('action >>>', action);
    }
    */


  });

  //console.log('table.getAllLeafColumns() >>><>>>' , table.getAllLeafColumns() );
  // OEM dispatch(MapDesignActions.setMmm(table)) ; // this is the table dispatch... @TODO make function

  const { rows } = table.getRowModel();

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer ;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0 ;

  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0 ;


  if (isLoading) {
    return <>Loading...</>
  }



  return (
    <div className="ddl-react-table">
      <div
        className="container selector_full_records_table"
        onScroll={e => fetchMoreOnBottomReached(e.target)}
        ref={tableContainerRef}
        style={{background: "#2d4a67", height: "600px", borderColor: "#2d4a67"}}
      >
        <table id="records_table" style={{border: "0.5px solid white", color: "white", textAlign: "right"}}>


          <thead style={{background:"#264360", textAlign: "center"}}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize()}}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}

                      <div
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${
                            header.column.getIsResizing() ? 'isResizing' : ''
                          }`,
                          style: {
                            transform:
                              columnResizeMode === 'onEnd' &&
                              header.column.getIsResizing()
                                ? `translateX(${
                                    table.getState().columnSizingInfo.deltaOffset
                                  }px)`
                                : '',
                          }
                        }}
                      />
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>



          {/* OEM2 :-) with DnD columns reorder
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <DraggableColumnHeader
                  key={header.id}
                  header={header}
                  table={table}
                />
              ))}
            </tr>
          ))}
          </thead>
          */}


          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td class="rounded" style={{ height: `${paddingTop}px`, background: "#294663" }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] ;

              // @TODO row.id  , computed dynamic if field name from config ?

              return (
                <tr
                  key={row.id}
                  /*
                  onClick={(e) => {
                    setRowSelection(row.id);
                    row.toggleSelected();
                  }} */
                  onClick={(e) => {  console.log('rowSelection >>>>>>>>>' , row.index , rowSelection );
                    row.toggleSelected(); // row.index
                  }}
                  style={{
                    backgroundColor : row.getIsSelected() ?  "#00a1a1ff" : ""
                  }}


                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} style={{background: "#2b4b6a"}}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* test toggle visibility */}
      {/* OEM  :-)
      <div>
        <pre>{JSON.stringify(table.getState().columnVisibility, null, 2)}</pre>
      </div>
      <div className="px-1 border-b border-black">
        <label>
          <input
            {...{
              type: 'checkbox',
              checked: table.getIsAllColumnsVisible(),
              onChange: table.getToggleAllColumnsVisibilityHandler(),
            }}
          />{' '}
          Toggle All
        </label>
      </div>

      <div style={{background: '#ccc'}} >
      {table.getAllLeafColumns().map(column => {
        return (
          <div key={column.id} className="px-1">
            <label>
              <input
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler(),
                }}
              />{' '}
              {column.id}
            </label>
          </div>
        )
      })}
      </div>


      <div>
        Fetched {flatData.length} of {totalDBRowCount} Rows.
      </div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>

      <button onClick={() => resetOrder()} className="border p-1">
        Reset Order
      </button>
      */}

      {/*
      <pre>{JSON.stringify(table.getState().columnOrder, null, 2)}</pre> */}

    </div>
  );

}

const queryClient = new QueryClient() ;

const RecordsTable = (props) => (
  <QueryClientProvider client={queryClient}>
    <DndProvider backend={HTML5Backend}>
      <DoRecordsTable columnsConfig={props.columnsConfig} />
    </DndProvider>
  </QueryClientProvider>
);



const mapStateToProps = (state) => {
  return {
    // isAuthenticated: isAuthenticated(state),
    theme: state.explorer.theme,
    columnsConfig:  state.explorer.configs[COLUMNS_CONFIG]
  };
};
//export default RecordsTable ;
// export default compose(withRouter, connect(mapStateToProps))(RecordsTable);
export default connect(mapStateToProps)(RecordsTable);
