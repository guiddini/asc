import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { updateCompanyApi } from "../apis/company";
import { InputGroup } from "./input-group";

// Validation schema
const validationSchema = Yup.object().shape({
  phone_1: Yup.string().trim().required("Phone number is required"),
  revenue_2024: Yup.number()
    .typeError("Revenue must be a number")
    .required("Revenue for 2024 is required"),
  revenue_2025: Yup.number()
    .typeError("Revenue must be a number")
    .required("Revenue for 2025 is required"),
  total_funds_raised: Yup.number()
    .typeError("Total funds raised must be a number")
    .required("Total funds raised is required"),
});

interface RevenueUpdateModalProps {
  show: boolean;
  onHide: () => void;
  companyId: string;
  onSuccess?: () => void;
  companyPhone?: string;
}

const RevenueUpdateModal: React.FC<RevenueUpdateModalProps> = ({
  show,
  onHide,
  companyId,
  onSuccess,
  companyPhone,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      phone_1: companyPhone ?? "",
      revenue_2024: 0,
      revenue_2025: 0,
      total_funds_raised: 0,
    },
  });

  const updateCompanyMutation = useMutation(
    (data: FormData) => updateCompanyApi(data),
    {
      onSuccess: () => {
        toast.success("Company information updated successfully");
        reset();
        if (onSuccess) onSuccess();
        onHide();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Failed to update company information"
        );
        setIsSubmitting(false);
      },
    }
  );

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    const formdata = new FormData();
    formdata.append("phone_1", data.phone_1 ?? "");
    formdata.append("revenue_2024", data.revenue_2024.toString());
    formdata.append("revenue_2025", data.revenue_2025.toString());
    formdata.append("total_funds_raised", data.total_funds_raised.toString());
    formdata.append("company_id", companyId);

    updateCompanyMutation.mutate(formdata);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Update Company Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          <strong>Important:</strong> We've updated our system and need
          additional financial information about your company. This information
          is crucial for the African Startup Conference.
        </Alert>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Phone number</Form.Label>
            <InputGroup
              type="tel"
              placeholder="Enter phone number"
              {...register("phone_1")}
              isInvalid={!!errors.phone_1}
            />
            {errors.phone_1 && (
              <Form.Control.Feedback type="invalid">
                {errors.phone_1.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Revenue 2024 ($)</Form.Label>
            <InputGroup
              type="number"
              placeholder="Enter revenue for 2024"
              suffix="$"
              {...register("revenue_2024")}
              isInvalid={!!errors.revenue_2024}
            />
            {errors.revenue_2024 && (
              <Form.Control.Feedback type="invalid">
                {errors.revenue_2024.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Revenue 2025 ($)</Form.Label>
            <InputGroup
              type="number"
              placeholder="Enter revenue for 2025"
              suffix="$"
              {...register("revenue_2025")}
              isInvalid={!!errors.revenue_2025}
            />
            {errors.revenue_2025 && (
              <Form.Control.Feedback type="invalid">
                {errors.revenue_2025.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Funds Raised ($)</Form.Label>
            <InputGroup
              type="number"
              placeholder="Enter total funds raised"
              suffix="$"
              {...register("total_funds_raised")}
              isInvalid={!!errors.total_funds_raised}
            />
            {errors.total_funds_raised && (
              <Form.Control.Feedback type="invalid">
                {errors.total_funds_raised.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Information"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RevenueUpdateModal;
