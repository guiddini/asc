import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { updateSponsor } from "../../../apis/sponsor";
import type { Sponsor } from "../../../types/sponsor";

interface Props {
  show: boolean;
  sponsor: Sponsor | null;
  onClose: () => void;
}

const EditSponsorModal: React.FC<Props> = ({ show, sponsor, onClose }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [type, setType] = useState<"sponsor" | "partner">("sponsor");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (sponsor) {
      setName(sponsor.name || "");
      setWebsite(sponsor.website || "");
      setType(sponsor.type);
      setLogoFile(null);
    }
  }, [sponsor]);

  const mutation = useMutation(
    async () => {
      if (!sponsor) return;
      const form = new FormData();
      form.append("name", name);
      form.append("type", type);
      if (website) form.append("website", website);
      if (logoFile) form.append("logo", logoFile);
      return await updateSponsor(sponsor.id, form as any);
    },
    {
      onSuccess: () => {
        toast.success("Sponsor updated successfully");
        queryClient.invalidateQueries("sponsors");
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update sponsor");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    mutation.mutate();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit {type === "partner" ? "Partner" : "Sponsor"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select value={type} onChange={(e) => setType(e.target.value as any)}>
                  <option value="sponsor">Sponsor</option>
                  <option value="partner">Partner</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Logo (upload to replace)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.currentTarget.files?.[0] ?? null;
                    setLogoFile(file);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={mutation.isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={mutation.isLoading}>
          {mutation.isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSponsorModal;