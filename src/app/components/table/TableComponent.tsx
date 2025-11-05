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
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    []
  );

  useEffect(() => setFilteredData(data), [data]);

  useEffect(() => {
    const defaults = columns
      .map((col) => (typeof col?.name === "string" ? col?.name : ""))
      .filter(
        (name) =>
          name &&
          name.toLowerCase() !== "actions" &&
          !name.toLowerCase().includes("status")
      );
    setSelectedExportColumns(defaults);
  }, [columns]);

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

  const exportableColumns = columns?.filter((col) => {
    const name = typeof col?.name === "string" ? col?.name : "";
    return !!name && selectedExportColumns?.includes(name);
  });

  const csvHeaders =
    exportableColumns?.map((col) => ({
      label: typeof col?.name === "string" ? col?.name : "",
      key: typeof col?.name === "string" ? col?.name : "",
    })) || [];

  const exportData = filteredData.map((row) => {
    const obj: Record<string, any> = {};
    exportableColumns.forEach((col) => {
      if (typeof col?.selector === "function")
        obj[col?.name as string] = col?.selector(row);
      else if (typeof col?.selector === "string")
        obj[col?.name as string] = getNestedValue(row, col?.selector);
      else obj[col?.name as string] = "";
    });
    return obj;
  });

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${placeholder || "export"}.xlsx`);
    setIsExportModalOpen(false);
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
              <button
                type="button"
                className="btn btn-light-primary me-3"
                onClick={() => setIsExportModalOpen(true)}
              >
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
      <KTCardBody className="py-4" scroll>
        <div className="w-100 h-100">
          <DataTable
            columns={columns}
            data={filteredData}
            fixedHeader
            responsive
            customStyles={{
              table: {
                style: {
                  width: "max-content",
                  minWidth: "100%",
                  overflow: "visible",
                  minHeight: "60vh",
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
                  wordWrap: "break-word",
                  wordBreak: "break-word",
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
                  color: "#252F4A",
                  fontFamily: 'Inter, Helvetica, "sans-serif"',
                  overflow: "visible",
                },
              },
              cells: {
                style: { whiteSpace: "normal", wordWrap: "break-word" },
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

      {isExportModalOpen && (
        <Modal
          show={isExportModalOpen}
          onHide={() => setIsExportModalOpen(false)}
          size="lg"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Export Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-4 text-muted">
              Select the columns you want to include in your export. Uncheck any
              columns you don't need.
            </p>
            <div className="d-flex flex-wrap gap-4">
              {columns
                .map((col) => (typeof col?.name === "string" ? col?.name : ""))
                .filter((name) => !!name)
                .map((name) => {
                  const checked = selectedExportColumns.includes(name);
                  return (
                    <Form.Check
                      key={name}
                      type="checkbox"
                      id={`export-${name}`}
                      label={name}
                      checked={checked}
                      onChange={() =>
                        setSelectedExportColumns((prev) =>
                          prev.includes(name)
                            ? prev.filter((n) => n !== name)
                            : [...prev, name]
                        )
                      }
                      className="me-4"
                    />
                  );
                })}
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button
              variant="light"
              onClick={() => {
                const defaults = columns
                  .map((col) =>
                    typeof col?.name === "string" ? col?.name : ""
                  )
                  .filter(
                    (name) =>
                      name &&
                      name.toLowerCase() !== "actions" &&
                      !name.toLowerCase().includes("status")
                  );
                setSelectedExportColumns(defaults);
              }}
            >
              Reset defaults
            </Button>
            <div className="d-flex gap-3">
              <CSVLink
                headers={csvHeaders}
                data={exportData}
                filename={`${placeholder || "export"}.csv`}
                uFEFF={true}
                className="btn btn-light-primary"
                onClick={() => setIsExportModalOpen(false)}
              >
                Export as CSV
              </CSVLink>
              <Button variant="primary" onClick={handleExcelExport}>
                Export as Excel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </KTCard>
  );
};
