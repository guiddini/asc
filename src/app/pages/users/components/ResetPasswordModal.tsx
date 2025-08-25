import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "react-query";
import { adminResetUserPasswordApi } from "../../../apis"; // Assume this API function exists
import toast from "react-hot-toast";
import { KTIcon } from "../../../../_metronic/helpers";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .required("Le mot de passe est requis"),
  password_confirmation: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Les mots de passe doivent correspondre"
    )
    .required("La confirmation du mot de passe est requise"),
});

const ResetPasswordModal = ({ isOpen, setIsOpen, userId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: {
      user_id: string;
      password: string;
      confirmation_password: string;
    }) => adminResetUserPasswordApi(data),
    onSuccess: () => {
      toast.success("Le mot de passe a été réinitialisé avec succès");
      closeModal();
    },
    onError: (error) => {
      toast.error("Erreur lors de la réinitialisation du mot de passe");
      console.error("Reset password error:", error);
    },
  });

  const onSubmit = (data) => {
    resetPasswordMutation.mutate({
      ...data,
      user_id: userId,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_reset_password"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-650px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Réinitialiser le mot de passe</h2>
          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                {...register("password")}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                {...register("password_confirmation")}
                isInvalid={!!errors.password_confirmation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password_confirmation?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="light" onClick={closeModal} className="me-2">
                Annuler
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={resetPasswordMutation.isLoading}
              >
                {resetPasswordMutation.isLoading
                  ? "Réinitialisation..."
                  : "Réinitialiser"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
