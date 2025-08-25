import React from "react";
import { Download } from "lucide-react";
import { exportToCSV, exportToExcel } from "../utils/export-utils";
import { Button } from "react-bootstrap";

interface Column<T> {
  name: string;
  selector?: (row: T) => string | number;
}

interface ExportMenuProps<T> {
  data: T[];
  columns: Column<T>[];
  filename?: string;
}

const ExportMenu = <T,>({
  data,
  columns,
  filename = "export",
}: ExportMenuProps<T>) => {
  const exportColumns = columns.filter(
    (col): col is Required<Column<T>> => !!col.selector
  );

  return (
    <div
      id="export-menu"
      className="w-100 d-flex flex-row align-items-center gap-3 justify-content-center my-4"
    >
      <Button
        id="export-button"
        onClick={() => exportToCSV(data, exportColumns, filename)}
      >
        <Download size={16} />
        Export as CSV
      </Button>
      <Button
        id="export-button"
        onClick={() => exportToExcel(data, exportColumns, filename)}
      >
        <Download size={16} />
        Export as Excel
      </Button>
    </div>
  );
};

export default ExportMenu;
