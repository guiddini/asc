import React from "react";
import { Modal, Button, Form, Alert, Card, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { uploadExhibitionDemandTransferDocument } from "../../../apis/exhibition";
import toast from "react-hot-toast";
import {
  Download,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface UploadTransferModalProps {
  show: boolean;
  onHide: () => void;
  demand_id: string;
  price: { dzd: number; euro: number } | null;
}

export const UploadTransferModal: React.FC<UploadTransferModalProps> = ({
  show,
  onHide,
  demand_id,
  price,
}) => {
  const { register, handleSubmit, reset, watch } = useForm<{
    transfer_document: FileList;
  }>();

  const selectedFile = watch("transfer_document");

  const mutation = useMutation(
    (formData: FormData) => uploadExhibitionDemandTransferDocument(formData),
    {
      onSuccess: () => {
        toast.success("Transfer document uploaded successfully");
        reset();
        onHide();
      },
      onError: () => {
        toast.error("Error uploading transfer document");
      },
    }
  );

  const onSubmit = (data: { transfer_document: FileList }) => {
    if (!data.transfer_document.length) return;
    const formData = new FormData();
    formData.append("demand_id", demand_id);
    formData.append("transfer_document", data.transfer_document[0]);
    mutation.mutate(formData);
  };

  const handleDownloadRIB = (currency: "dzd" | "euro") => {
    const ribPath =
      currency === "dzd" ? "/payment/rib-dzd.pdf" : "/payment/rib-euro.pdf";
    const link = document.createElement("a");
    link.href = ribPath;
    link.download = `RIB-${currency.toUpperCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center gap-2">
          <div className="bg-primary bg-opacity-10 p-2 rounded">
            <FileText className="text-primary" size={24} />
          </div>
          <div>
            <h5 className="mb-0">Upload Payment Proof</h5>
            <small className="text-muted fw-normal">
              Bank Transfer Document
            </small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="px-4">
          {/* Payment Amount Card */}
          {price && (
            <Card
              className="border-0 shadow-sm mb-4 bg-gradient"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Card.Body className="text-black">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="opacity-75 d-block mb-1">
                      Total Amount
                    </small>
                    <h3 className="mb-0 fw-bold">
                      {price.dzd.toLocaleString()} DZD
                    </h3>
                  </div>
                  <div className="text-end">
                    <small className="opacity-75 d-block mb-1">
                      Or equivalent
                    </small>
                    <h4 className="mb-0 fw-bold">
                      €{price.euro.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Step 1: Download RIB */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Badge
                bg="primary"
                className="rounded-circle"
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                1
              </Badge>
              <h6 className="mb-0">Download Bank Account Details</h6>
            </div>

            <p className="text-muted small ps-4 mb-3">
              Choose the RIB document matching your payment currency
            </p>

            <div className="ps-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <Card
                    className="border hover-shadow h-100"
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => handleDownloadRIB("dzd")}
                  >
                    <Card.Body className="text-center p-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                        <Download className="text-primary" size={24} />
                      </div>
                      <h6 className="mb-1">Algerian Dinar</h6>
                      <p className="text-muted small mb-0">RIB - DZD Account</p>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card
                    className="border hover-shadow h-100"
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => handleDownloadRIB("euro")}
                  >
                    <Card.Body className="text-center p-4">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                        <Download className="text-success" size={24} />
                      </div>
                      <h6 className="mb-1">EURO</h6>
                      <p className="text-muted small mb-0">
                        RIB - EURO Account
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <div className="border-top my-4"></div>

          {/* Step 2: Upload Document */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Badge
                bg="primary"
                className="rounded-circle"
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                2
              </Badge>
              <h6 className="mb-0">Upload Transfer Receipt</h6>
            </div>

            <div className="ps-4">
              <Form.Group controlId="transferDocument">
                <div
                  className="border-2 border-dashed rounded p-4 text-center position-relative"
                  style={{
                    borderStyle: "dashed",
                    borderColor: selectedFile?.length ? "#198754" : "#dee2e6",
                    backgroundColor: selectedFile?.length
                      ? "#f8fffe"
                      : "#f8f9fa",
                    transition: "all 0.3s",
                  }}
                >
                  {!selectedFile?.length ? (
                    <>
                      <Upload size={40} className="text-muted mb-3" />
                      <h6 className="mb-2">
                        Drop your file here or click to browse
                      </h6>
                      <p className="text-muted small mb-3">
                        Accepted formats: PDF, JPG, PNG (Max 10MB)
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={40} className="text-success mb-3" />
                      <h6 className="mb-2 text-success">File Selected</h6>
                      <p className="text-muted small mb-3">
                        {selectedFile[0]?.name}
                      </p>
                    </>
                  )}
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    {...register("transfer_document", { required: true })}
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Form.Group>
            </div>
          </div>

          {/* Important Notice */}
          <Alert
            variant="light"
            className="border border-warning d-flex align-items-start gap-2 mb-0"
          >
            <AlertCircle
              size={20}
              className="text-warning mt-1 flex-shrink-0"
            />
            <div>
              <strong className="d-block mb-1 text-warning">
                Verification Process
              </strong>
              <small className="text-muted">
                Our finance team will review your transfer document within 24-48
                hours. You'll receive a notification once your payment is
                confirmed.
              </small>
            </div>
          </Alert>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <Button variant="light" onClick={onHide} className="px-4">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isLoading || !selectedFile?.length}
            className="px-4"
          >
            {mutation.isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} className="me-2" />
                Upload Document
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>

      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </Modal>
  );
};
