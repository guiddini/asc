import React, { ReactNode, useState, useEffect } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import {
  KTCard,
  KTCardBody,
  KTIcon,
  toAbsoluteUrl,
} from "../../../_metronic/helpers";
import { Spinner } from "react-bootstrap";

const getNestedValue = (obj: any, path: string) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

export const TableComponent = ({
  data,
  columns,
  placeholder,
  onAddClick,
  customPlaceholder,
  customHeader,
  tableClassName,
  isLoading,
  cardClassName,
  showCreate = true,
  showExport = false,
  showSearch = true,
  customStyles,
  customFullHeader,
  pagination,
  searchKeys = [],
}: {
  data: any[];
  columns: TableColumn<any>[];
  placeholder?: string;
  customPlaceholder?: string;
  tableClassName?: string;
  cardClassName?: string;
  onAddClick?: () => void;
  customHeader?: ReactNode;
  isLoading?: boolean;
  showExport?: boolean;
  showCreate?: boolean;
  showSearch?: boolean;
  pagination?: boolean;
  customStyles?: TableStyles;
  customFullHeader?: ReactNode;
  searchKeys?: string[];
}) => {
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => setFilteredData(data), [data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") return setFilteredData(data);
    const lowercaseQuery = query.toLowerCase();
    const filtered = data.filter((item) =>
      searchKeys.length === 0
        ? columns.some((column) => {
            const value = getNestedValue(
              item,
              column.selector?.toString?.() || ""
            );
            return (
              value && value.toString().toLowerCase().includes(lowercaseQuery)
            );
          })
        : searchKeys.some((key) => {
            const value = getNestedValue(item, key);
            return (
              value && value.toString().toLowerCase().includes(lowercaseQuery)
            );
          })
    );
    setFilteredData(filtered);
  };

  return (
    <KTCard className={cardClassName}>
      {customFullHeader ? (
        <div className="card-header border-0 pt-6">{customFullHeader}</div>
      ) : (
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            {showSearch && (
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon
                  iconName="magnifier"
                  className="fs-1 position-absolute ms-6"
                />
                <input
                  type="text"
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="card-toolbar">
            {customHeader}
            {showExport && (
              <button type="button" className="btn btn-light-primary me-3">
                <KTIcon iconName="exit-up" className="fs-2" />
                Export
              </button>
            )}
            {showCreate && (
              <button
                type="button"
                className="btn btn-custom-purple-dark text-white"
                onClick={onAddClick}
              >
                <KTIcon iconName="plus" className="fs-2 text-white" />
                {customPlaceholder ? customPlaceholder : `Add ${placeholder}`}
              </button>
            )}
          </div>
        </div>
      )}
      <KTCardBody className="py-4">
        <div className="w-100" style={{ overflow: "visible" }}>
          <DataTable
            columns={columns}
            data={filteredData}
            fixedHeader
            fixedHeaderScrollHeight="75vh"
            responsive
            customStyles={{
              table: {
                style: {
                  width: "max-content",
                  minWidth: "100%",
                  overflow: "visible",
                },
              },
              headRow: {
                style: {
                  minHeight: "56px",
                  height: "auto",
                  overflow: "visible",
                },
              },
              headCells: {
                style: {
                  whiteSpace: "normal",
                  wordWrap: "break-word", // ADDED
                  wordBreak: "break-word", // ADDED
                  lineHeight: "1.4",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#9da1b7",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  textTransform: "uppercase",
                  backgroundColor: "#fff",
                  borderTop: 0,
                },
              },
              rows: {
                style: {
                  backgroundColor: "#fff",
                  borderColor: "#9da1b",
                  borderStyle: "solid",
                  borderWidth: 0,
                  color: "#252F4A",
                  fontFamily: 'Inter, Helvetica, "sans-serif"',
                  overflow: "visible",
                },
              },
              cells: {
                style: {
                  whiteSpace: "normal", // ADDED: Wrap cell content too
                  wordWrap: "break-word", // ADDED
                },
              },
              ...customStyles,
            }}
            className={tableClassName}
            progressPending={isLoading}
            progressComponent={
              <div
                style={{ height: "80vh" }}
                className="w-100 d-flex justify-content-center align-items-center bg-white"
              >
                <Spinner animation="border" color="#000" />
              </div>
            }
            noDataComponent={
              <div className="card" style={{ minHeight: "70vh" }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <span className="fs-3">No Data Available</span>
                  <img
                    src={toAbsoluteUrl(
                      "/media/illustrations/sigma-1/21-dark.png"
                    )}
                    className="h-250px w-250px"
                    alt="No data available"
                  />
                </div>
              </div>
            }
            pagination={pagination}
          />
        </div>
      </KTCardBody>
    </KTCard>
  );
};
