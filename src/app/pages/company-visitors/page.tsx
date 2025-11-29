import React, { useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useTable, ColumnInstance, Row } from "react-table";
import { getMyCompanyVisitorsApi } from "../../apis/qr-code";
import { getCompanyExhibitionDemand } from "../../apis/exhibition";
import QRCode from "react-qr-code";
import { KTCardBody, KTIcon } from "../../../_metronic/helpers";
import {
  CompanyVisitorsResponse,
  QrScanReceivedItem,
} from "../../types/qr-code";

const CompanyVisitorsPage = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Fetch exhibition demand
  const { data: demandData, isLoading: isDemandLoading } = useQuery({
    queryFn: getCompanyExhibitionDemand,
    queryKey: ["company-exhibition-demand"],
    retry: 1,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const demand = demandData?.data?.demand;

  // Fetch visitor logs
  const { data: visitorsData, isLoading: isVisitorsLoading } = useQuery(
    ["company-visitors", id, currentPage],
    () => getMyCompanyVisitorsApi({ page: currentPage, per_page: perPage })
  );

  const visitorsResponse = visitorsData as CompanyVisitorsResponse | undefined;
  const visitors = visitorsResponse?.visitors.data || [];
  const totalVisitors = visitorsResponse?.visitors.total || 0;
  const totalPages = Math.ceil(totalVisitors / perPage);

  // Download QR Code as PNG
  const downloadQRCode = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `qr-code-startup-${id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Print QR Code
  const printQRCode = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Startup ${id}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
              padding: 40px;
            }
            h2 {
              margin-bottom: 20px;
              color: #333;
            }
            p {
              margin-top: 20px;
              color: #666;
            }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Startup QR Code</h2>
            ${svgData}
            <p>Scan to visit startup page</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row: QrScanReceivedItem) =>
          row.scanner?.fname + " " + row.scanner?.lname,
        id: "name",
      },
      {
        Header: "Email",
        accessor: (row: QrScanReceivedItem) => row.scanner?.email || "N/A",
        id: "email",
      },
      {
        Header: "Scanned At",
        accessor: (row: QrScanReceivedItem) => {
          const date = new Date(row.scanned_at);
          return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        },
        id: "scanned_at",
      },
      {
        Header: "Actions",
        Cell: ({ row }: { row: Row<QrScanReceivedItem> }) => (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => viewProfile(row.original.scanner_id)}
          >
            <i className="bi bi-eye me-1"></i>
            View Profile
          </button>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => visitors, [visitors]);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const viewProfile = (visitorId: string) => {
    window.location.href = `/visitor/${visitorId}`;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isDemandLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (demand?.status !== "paid") {
    return (
      <div className="container-fluid">
        <div
          className="alert alert-danger d-flex align-items-center border-0 shadow-sm"
          role="alert"
        >
          <div className="d-flex align-items-center">
            <div className="symbol symbol-50px me-4">
              <span className="symbol-label bg-danger">
                <KTIcon iconName="notification" className="fs-2 text-white" />
              </span>
            </div>
            <div className="d-flex flex-column">
              <h5 className="mb-1">Exhibition Demand Not Accepted</h5>
              <span className="text-muted fs-7">
                Your exhibition demand has not been accepted. Until it is
                approved, you cannot access the visitor logs or related
                features. Please contact support for further assistance.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-1">Visitor Management</h1>
              <p className="text-muted mb-0">
                Track and manage your exhibition visitors
              </p>
            </div>
            <div className="badge bg-light-primary text-primary fs-6 px-4 py-3">
              <i className="bi bi-people-fill me-2"></i>
              {totalVisitors} Total Visitors
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Card */}
      <div className="row mb-5">
        <div className="col-lg-4 col-md-6 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center p-6">
              <h4 className="fw-bold mb-4">Your QR Code</h4>
              <div
                ref={qrCodeRef}
                className="d-inline-block p-4 bg-white rounded shadow-sm mb-4"
                style={{ border: "2px solid #f1f1f4" }}
              >
                <QRCode value={`/startup/${id}`} size={200} />
              </div>
              <p className="text-muted mb-4">Scan to visit your startup page</p>

              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-primary" onClick={downloadQRCode}>
                  <i className="bi bi-download me-2"></i>
                  Download
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={printQRCode}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitors Table Card */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-4">
              <h3 className="card-title fw-bold mb-0">
                <i className="bi bi-person-check me-2"></i>
                Visitor Logs
              </h3>
            </div>
            <KTCardBody className="py-4">
              {isVisitorsLoading ? (
                <div className="d-flex justify-content-center py-10">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table
                      id="kt_table_visitors"
                      className="table table-hover align-middle table-row-dashed fs-6 gy-3"
                      {...getTableProps()}
                    >
                      <thead className="bg-light">
                        <tr className="text-start text-gray-700 fw-bold fs-7 text-uppercase gs-0">
                          {headers.map(
                            (column: ColumnInstance<QrScanReceivedItem>) => (
                              <th key={column.id} className="py-3 px-4">
                                {column.render("Header")}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody
                        className="text-gray-600 fw-semibold"
                        {...getTableBodyProps()}
                      >
                        {rows.length > 0 ? (
                          rows.map((row: Row<QrScanReceivedItem>, i) => {
                            prepareRow(row);
                            return (
                              <tr key={`row-${i}`} className="border-bottom">
                                {row.cells.map((cell) => (
                                  <td
                                    key={cell.column.id}
                                    className="py-3 px-4"
                                  >
                                    {cell.render("Cell")}
                                  </td>
                                ))}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-10">
                              <div className="d-flex flex-column align-items-center text-center">
                                <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                                <h5 className="text-muted">No visitors yet</h5>
                                <p className="text-muted fs-7 mb-0">
                                  Share your QR code to start receiving visitors
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 gap-3">
                      <div className="text-muted fs-7">
                        Showing {(currentPage - 1) * perPage + 1} to{" "}
                        {Math.min(currentPage * perPage, totalVisitors)} of{" "}
                        {totalVisitors} entries
                      </div>
                      <nav>
                        <ul className="pagination mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </button>
                          </li>

                          {[...Array(totalPages)].map((_, idx) => {
                            const pageNum = idx + 1;
                            if (
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              (pageNum >= currentPage - 1 &&
                                pageNum <= currentPage + 1)
                            ) {
                              return (
                                <li
                                  key={pageNum}
                                  className={`page-item ${
                                    currentPage === pageNum ? "active" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNum)}
                                  >
                                    {pageNum}
                                  </button>
                                </li>
                              );
                            } else if (
                              pageNum === currentPage - 2 ||
                              pageNum === currentPage + 2
                            ) {
                              return (
                                <li
                                  key={pageNum}
                                  className="page-item disabled"
                                >
                                  <span className="page-link">...</span>
                                </li>
                              );
                            }
                            return null;
                          })}

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </KTCardBody>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyVisitorsPage;
