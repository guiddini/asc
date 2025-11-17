import React, { useMemo, useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { useMutation } from "react-query";
import { uploadPitchDeck } from "../../../apis/pitch-deck";
import toast from "react-hot-toast";

type Props = {
  show: boolean;
  onHide: () => void;
  onUploaded?: () => void;
};

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const allowedExtensions = [".pdf", ".ppt", ".pptx"];

const PitchDeckUploadModal: React.FC<Props> = ({
  show,
  onHide,
  onUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>("");

  // wrap mutation to accept file + title
  const { mutateAsync, isLoading } = useMutation(
    async (payload: { file: File; title?: string }) => {
      const opts = payload.title ? { title: payload.title } : undefined;
      return uploadPitchDeck(payload.file, opts);
    }
  );

  const isValid = useMemo(() => {
    if (!file) return false;
    const name = file.name.toLowerCase();
    const extOk = allowedExtensions.some((ext) => name.endsWith(ext));
    const typeOk = allowedMimeTypes.includes(file.type) || extOk;
    return extOk && typeOk;
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const name = f.name.toLowerCase();
      const extOk = allowedExtensions.some((ext) => name.endsWith(ext));
      const typeOk = allowedMimeTypes.includes(f.type) || extOk;
      if (!extOk || !typeOk) {
        setError("Only PDF or PPT/PPTX files are allowed.");
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const name = droppedFile.name.toLowerCase();
      const extOk = allowedExtensions.some((ext) => name.endsWith(ext));
      const typeOk = allowedMimeTypes.includes(droppedFile.type) || extOk;

      if (!extOk || !typeOk) {
        setError("Only PDF or PPT/PPTX files are allowed.");
        toast.error("Only PDF or PPT/PPTX files are allowed.");
        return;
      }

      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !isValid) {
      setError("Only PDF or PPT/PPTX files are allowed.");
      return;
    }

    setError(null);
    try {
      await mutateAsync({ file, title: title?.trim() || undefined });
      toast.success("Pitch deck uploaded successfully!");
      if (onUploaded) onUploaded();
      onHide();
      setFile(null);
      setTitle("");
    } catch (e: any) {
      const errorMsg =
        e?.message || "Failed to upload pitch deck. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFile(null);
      setError(null);
      setTitle("");
      onHide();
    }
  };

  return (
    <>
      <style>{`
        .upload-modal .modal-content {
          border: none;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        
        .upload-modal .modal-header {
          border-bottom: 1px solid #e9ecef;
          padding: 1.25rem 1.5rem;
        }
        
        .upload-modal .modal-title {
          font-weight: 600;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .upload-modal .modal-body {
          padding: 1.5rem;
        }
        
        .upload-modal .modal-footer {
          border-top: 1px solid #e9ecef;
          padding: 1rem 1.5rem;
          background-color: #f8f9fa;
        }
        
        .dropzone {
          border: 2px dashed #dee2e6;
          border-radius: 10px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          background-color: #f8f9fa;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .dropzone:hover,
        .dropzone.dragging {
          border-color: #0d6efd;
          background-color: #f0f5ff;
        }
        
        .dropzone-icon {
          font-size: 3rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }
        
        .dropzone:hover .dropzone-icon,
        .dropzone.dragging .dropzone-icon {
          color: #0d6efd;
        }
        
        .dropzone-title {
          font-size: 1rem;
          font-weight: 500;
          color: #212529;
          margin-bottom: 0.375rem;
        }
        
        .dropzone-subtitle {
          font-size: 0.875rem;
          color: #6c757d;
        }
        
        .file-preview-card {
          border: 1px solid #dee2e6;
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1rem;
          background-color: white;
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        
        .file-icon {
          width: 40px;
          height: 40px;
          background-color: #e7f3ff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: #0d6efd;
          flex-shrink: 0;
        }
        
        .file-details {
          flex: 1;
          min-width: 0;
        }
        
        .file-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #212529;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .file-size {
          font-size: 0.75rem;
          color: #6c757d;
        }
        
        .btn-remove {
          padding: 0.375rem 0.5rem;
          border-radius: 6px;
        }
        
        .upload-btn {
          border-radius: 8px;
          padding: 0.5rem 1.25rem;
          font-weight: 500;
        }
      `}</style>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop={isLoading ? "static" : true}
        className="upload-modal"
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>
            <i className="bi bi-cloud-upload"></i>
            Upload Pitch Deck
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Removed company/permission gating */}
          {error && (
            <Alert
              variant="danger"
              className="py-2 mb-3"
              dismissible
              onClose={() => setError(null)}
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {/* Title input */}
          <div className="mb-3">
            <label htmlFor="pitchTitle" className="form-label fw-semibold">
              Title
            </label>
            <input
              id="pitchTitle"
              type="text"
              className="form-control"
              placeholder="e.g. Series A Pitch, Q1 2025 Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
            <div className="form-text">Optional, but recommended for clarity.</div>
          </div>

          <div
            className={`dropzone ${isDragging ? "dragging" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <div className="dropzone-icon">
              <i className="bi bi-file-earmark-arrow-up"></i>
            </div>
            <div className="dropzone-title">
              Drop your file here or click to browse
            </div>
            <div className="dropzone-subtitle">
              Supported formats: PDF, PPT, PPTX
            </div>
          </div>

          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileChange}
            disabled={isLoading}
          />

          {file && (
            <div className="file-preview-card">
              <div className="file-icon">
                <i className="bi bi-file-earmark-check-fill"></i>
              </div>
              <div className="file-details">
                <div className="file-name" title={file.name}>
                  {file.name}
                </div>
                <div className="file-size">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              {!isLoading && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="btn-remove"
                  onClick={() => setFile(null)}
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!file || !isValid || isLoading}
            className="upload-btn"
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              <>
                <i className="bi bi-upload me-2"></i>
                Upload
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PitchDeckUploadModal;
