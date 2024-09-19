/*eslint-disable*/
import React from "react";
import {
  useTable,
  useFilters,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import classNames from "classnames";
// A great library for fuzzy filtering/sorting items
import { matchSorter } from "match-sorter";
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";
// reactstrap components
import { FormGroup, Input, Row, Col, Button } from "reactstrap";

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return 
      /*
      (

    <FormGroup>
      <Input
        type="email"
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    </FormGroup>
    
  )
    */
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component
function Table({ columns, data }) {
  const [numberOfRows, setNumberOfRows] = React.useState(10);
  const [pageSelect, handlePageSelect] = React.useState(0);
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    visibleColumns,
    nextPage,
    pageOptions,
    pageCount,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageSize: 10, pageIndex: 0 },
    },
    useFilters, // useFilters!
    useSortBy,
    usePagination
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 10);
  let pageSelectData = Array.apply(
    null,
    Array(pageOptions.length)
  ).map(function () {});
  let numberOfRowsData = [5, 10, 20, 25, 50, 100];
  return (
    <>
      <div className="ReactTable -striped -highlight">
        <div className="pagination-top">
          <div className="-pagination">
            <div className="-previous">
              <button
                type="button"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="-btn"
              >
                Previous
              </button>
            </div>
            <div className="-center flex-nowrap">
              <Select
                className="react-select info mx-5 w-100"
                classNamePrefix="react-select"
                name="singleSelect"
                value={pageSelect}
                onChange={(value) => {
                  gotoPage(value.value);
                  handlePageSelect(value);
                }}
                options={pageSelectData.map((prop, key) => {
                  return {
                    value: key,
                    label: "Page " + (key + 1),
                  };
                })}
                placeholder="Select page"
              />
              <Select
                className="react-select info mx-5 w-100"
                classNamePrefix="react-select"
                name="singleSelect"
                value={numberOfRows}
                onChange={(value) => {
                  console.log(value);
                  setPageSize(value.value);
                  setNumberOfRows(value);
                }}
                options={numberOfRowsData.map((prop) => {
                  return {
                    value: prop,
                    label: prop + " rows",
                  };
                })}
                placeholder="Select #rows"
              />
            </div>
            <div className="-next">
              <button
                type="button"
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <br />
        <table {...getTableProps()} className="rt-table">
          <thead className="rt-thead -header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr">
                {headerGroup.headers.map((column, key) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={classNames("rt-th rt-resizable-header", {
                      "-cursor-pointer": headerGroup.headers.length - 1 !== key,
                      "-sort-asc": column.isSorted && !column.isSortedDesc,
                      "-sort-desc": column.isSorted && column.isSortedDesc,
                    })}
                  >
                    <div className="rt-resizable-header-content">
                      {column.render("Header")}
                    </div>
                    {/* Render the columns filter UI */}
                    <div>
                      {headerGroup.headers.length - 1 === key
                        ? null
                        : column.canFilter
                        ? column.render("Filter")
                        : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="rt-tbody">
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={classNames(
                    "rt-tr",
                    { " -odd": i % 2 === 0 },
                    { " -even": i % 2 === 1 }
                  )}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="rt-td">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                  {/*
                  <td>
                    <div className="actions-right">

                      <Button
                        onClick={() => {
                          let obj = data[i];
                          console.log("Clickded row :: ", obj);
                          //let obj = data.find((o) => o.id === i);
                          alert("edit action :: " + obj.id);

                        }}
                        color="warning"
                        size="sm"
                        className={classNames("btn-icon btn-link like", {
                          "btn-neutral": i < 5
                        })}>
                        <i className="tim-icons icon-pencil" />
                     </Button>{" "}

                     <Button
                      onClick={() => {
                        var newdata = data;
                        newdata.find((o, i) => {
                          if (o.id === i) {
                            // here you should add some custom code so you can delete the data
                            // from this component and from your server as well
                            data.splice(i, 1);
                            console.log(data);
                            return true;
                          }
                          return false;
                        });
                        console.log('remove data ')
                      }}
                      color="danger"
                      size="sm"
                      className={classNames("btn-icon btn-link like", {
                      "btn-neutral": i < 5
                      })}>
                      <i className="tim-icons icon-simple-remove" />
                    </Button>{" "}
                  </div>
                </td>
                */}
              </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination-bottom"></div>
      </div>
    </>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

export default Table;
