import { utils, writeFile, WorkBook } from "xlsx";

interface Column<T> {
  name: string;
  selector: (row: T) => string | number;
}

export const exportToCSV = <T>(
  data: T[],
  columns: Column<T>[],
  filename: string
): void => {
  const csvContent = [
    columns.map((col) => col.name).join(","),
    ...data.map((row) => columns.map((col) => col.selector(row)).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = <T>(
  data: T[],
  columns: Column<T>[],
  filename: string
): void => {
  const exportData = data.map((row) =>
    columns.reduce((acc, col) => {
      acc[col.name] = col.selector(row);
      return acc;
    }, {} as { [key: string]: string | number })
  );

  const wb: WorkBook = utils.book_new();
  const ws = utils.json_to_sheet(exportData, {
    header: columns.map((col) => col.name),
  });

  utils.book_append_sheet(wb, ws, "Sheet1");
  writeFile(wb, `${filename}.xlsx`);
};
