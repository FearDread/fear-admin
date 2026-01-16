import React, { useState, useMemo } from "react";
import {
  useTable,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table";
import { matchSorter } from "match-sorter";
import Select from "react-select";

import "./ReactTable.css";
// Define a default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  /*
  return (
    <div className="form-group">
      <input
        type="text"
        className="form-control"
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    </div>
  );
  */
};

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
};

fuzzyTextFilterFn.autoRemove = (val) => !val;

const filterGreaterThan = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
};

filterGreaterThan.autoRemove = (val) => typeof val !== "number";

const Table = ({ columns, data }) => {
  const [numberOfRows, setNumberOfRows] = useState({
    value: 10,
    label: "10 rows",
  });
  const [pageSelect, setPageSelect] = useState({ value: 0, label: "Page 1" });

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
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

  const defaultColumn = useMemo(
    () => ({
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
    nextPage,
    pageOptions,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageSize: 10, pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const pageSelectData = useMemo(
    () =>
      pageOptions.map((_, index) => ({
        value: index,
        label: `Page ${index + 1}`,
      })),
    [pageOptions]
  );

  const numberOfRowsData = useMemo(
    () =>
      [5, 10, 20, 25, 50, 100].map((num) => ({
        value: num,
        label: `${num} rows`,
      })),
    []
  );

  const handlePageChange = (value) => {
    gotoPage(value.value);
    setPageSelect(value);
  };

  const handleRowsChange = (value) => {
    setPageSize(value.value);
    setNumberOfRows(value);
  };

  return (
    <div className="card media-object">
      <div className="ReactTable -striped -highlight">
        <div className="justify-content-between align-items-center card-header">
          <div className="pagination-top">
            <div className="-pagination">
              <div className="-previous">
                <button
                  type="button"
                  onClick={previousPage}
                  disabled={!canPreviousPage}
                  className="btn btn-dark"
                >
                  Previous
                </button>
              </div>
              <div className="-center flex-nowrap">
                <Select
                  className="react-select info mx-5 w-100"
                  classNamePrefix="react-select"
                  name="pageSelect"
                  value={pageSelect}
                  onChange={handlePageChange}
                  options={pageSelectData}
                  placeholder="Select page"
                />
                <Select
                  className="react-select info mx-5 w-100"
                  classNamePrefix="react-select"
                  name="rowsSelect"
                  value={numberOfRows}
                  onChange={handleRowsChange}
                  options={numberOfRowsData}
                  placeholder="Select #rows"
                />
              </div>
              <div className="-next">
                <button
                  type="button"
                  onClick={nextPage}
                  disabled={!canNextPage}
                  className="btn btn-primary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <table {...getTableProps()} className="rt-table">
            <thead className="rt-thead -header">
              {headerGroups.map((headerGroup) => {
                const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                return (
                  <tr
                    key={headerGroupKey}
                    {...headerGroupProps}
                    className="rt-tr"
                  >
                    {headerGroup.headers.map((column, colIdx) => {
                      const isLastColumn = colIdx === headerGroup.headers.length - 1;
                      const { key: columnKey, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());
                      return (
                        <th
                          key={columnKey}
                          {...columnProps}
                          className={`rt-th rt-resizable-header ${
                            !isLastColumn ? "-cursor-pointer" : ""
                          } ${column.isSorted && !column.isSortedDesc ? "-sort-asc" : ""} ${
                            column.isSorted && column.isSortedDesc ? "-sort-desc" : ""
                          }`}
                        >
                          <div className="rt-resizable-header-content">
                            {column.render("Header")}
                          </div>
                          <div>
                            {!isLastColumn && column.canFilter
                              ? column.render("Filter")
                              : null}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()} className="rt-tbody">
              {page.map((row) => {
                prepareRow(row);
                const { key: rowKey, ...rowProps } = row.getRowProps();
                const rowIdx = parseInt(rowKey.split('.')[1] || 0);
                return (
                  <tr
                    key={rowKey}
                    {...rowProps}
                    className={`rt-tr ${rowIdx % 2 === 0 ? "-odd" : "-even"}`}
                  >
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } = cell.getCellProps();
                      return (
                        <td key={cellKey} {...cellProps} className="rt-td">
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination-bottom"></div>
    </div>
  );
};

export default Table;