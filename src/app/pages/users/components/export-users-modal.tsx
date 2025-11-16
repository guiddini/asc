import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { exportUsersCsv, downloadUsersCsv } from "../../../apis/kyc";

type ExportUsersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ExportUsersModal = ({ isOpen, onClose }: ExportUsersModalProps) => {
  const [onlyKyc, setOnlyKyc] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const baseName = onlyKyc ? "users_kyc_only" : "users_all";
      await downloadUsersCsv(onlyKyc, `${baseName}.csv`);
      onClose();
    } catch (e) {
      console.error("Export CSV failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const baseName = onlyKyc ? "users_kyc_only" : "users_all";
      // Fetch CSV from backend and convert to XLSX via workbook read+write
      const csvBlob = await exportUsersCsv(onlyKyc);
      const csvText = await csvBlob.text();
      const csvWorkbook = XLSX.read(csvText, { type: "string" });
      const wbArray = XLSX.write(csvWorkbook, { type: "array", bookType: "xlsx" });
      const xlsxBlob = new Blob([wbArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(xlsxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (e) {
      console.error("Export Excel failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Export Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-4 text-muted">
          Choose your options and export the users list. Enable filtering by KYC presence if needed.
        </p>
        <Form>
          <Form.Group>
            <Form.Check
              type="checkbox"
              id="onlyKyc"
              label="Only users who have KYC"
              checked={onlyKyc}
              onChange={(e) => setOnlyKyc(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="light" onClick={onClose} disabled={isExporting}>
          Cancel
        </Button>
        <div className="d-flex gap-3">
          <Button variant="light-primary" onClick={handleExportCsv} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export as CSV"}
          </Button>
          <Button variant="primary" onClick={handleExportExcel} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export as Excel"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportUsersModal;