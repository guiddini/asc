import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { uploadExhibitionDemandTransferDocument } from "../../../apis/exhibition";
import toast from "react-hot-toast";
interface UploadTransferModalProps {
  show: boolean;
  onHide: () => void;
  demand_id: string;
}

export const UploadTransferModal: React.FC<UploadTransferModalProps> = ({
  show,
  onHide,
  demand_id,
}) => {
  const { register, handleSubmit, reset } = useForm<{
    transfer_document: FileList;
  }>();

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

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Payment Document</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group controlId="transferDocument">
            <Form.Label>Transfer Document</Form.Label>
            <Form.Control type="file" {...register("transfer_document")} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Uploading..." : "Upload"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
