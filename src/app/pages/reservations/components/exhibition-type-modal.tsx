import { useEffect, useState } from "react";
import { Modal, Button, Alert, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import {
  createExhibitionDemandApi,
  updateExhibitionDemandApi,
} from "../../../apis/exhibition";

interface ExhibitionTypeModalProps {
  show: boolean;
  onHide: () => void;
  mode: "create" | "update";
  demandId?: string;
  currentExhibitionType?: string;
}

interface ExhibitionFormData {
  exhibition_type: string;
  demand_id?: string;
}

const ExhibitionTypeModal = ({
  show,
  onHide,
  mode,
  demandId,
  currentExhibitionType,
}: ExhibitionTypeModalProps) => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ExhibitionFormData>({
    defaultValues: {
      exhibition_type: currentExhibitionType || "",
      demand_id: demandId,
    },
  });

  const selectedType = watch("exhibition_type");

  useEffect(() => {
    if (show) {
      setSuccess(false);
      reset({
        exhibition_type: currentExhibitionType || "",
        demand_id: demandId,
      });
    }
  }, [show, currentExhibitionType, demandId, reset]);

  const createMutation = useMutation((formData: FormData) =>
    createExhibitionDemandApi(formData)
  );
  const updateMutation = useMutation((formData: FormData) =>
    updateExhibitionDemandApi(formData)
  );

  const isLoading = createMutation.isLoading || updateMutation.isLoading;
  const error =
    (createMutation.error as any)?.response?.data?.message ||
    (updateMutation.error as any)?.response?.data?.message ||
    null;

  const handleFormSubmit = (data: ExhibitionFormData) => {
    const formData = new FormData();
    formData.append("exhibition_type", data.exhibition_type);
    if (mode === "update" && demandId) {
      formData.append("demand_id", demandId);
      updateMutation.mutate(formData, {
        onSuccess() {
          toast.success("Mise à jour réussie");
          setSuccess(true);
        },
        onError() {
          toast.error("Erreur lors de la mise à jour");
        },
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess() {
          toast.success("Demande envoyée avec succès");
          setSuccess(true);
        },
        onError() {
          toast.error("Erreur lors de l'envoi");
        },
      });
    }
  };

  const handleCardClick = (type: string) => {
    setValue("exhibition_type", type);
  };

  if (success) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <h5 className="fw-bold mb-3">
            Your request has been sent and is being reviewed.
          </h5>
          <p className="text-muted mb-4">
            Once accepted, you'll receive an email confirmation. You can revisit
            this page later to proceed with the payment.
          </p>
          <Button variant="primary" onClick={onHide}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "create"
            ? "Choose Your Exhibition Type"
            : "Update Exhibition Type"}
        </Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="row g-4">
            {/* Connect Desk */}
            <div className="col-md-4">
              <Card
                className={`h-100 border-3 transition-all ${
                  selectedType === "connect_desk"
                    ? "border-primary shadow-lg bg-primary bg-opacity-10"
                    : "border-light"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform:
                    selectedType === "connect_desk"
                      ? "translateY(-4px)"
                      : "none",
                }}
                onClick={() => handleCardClick("connect_desk")}
              >
                <Card.Body className="position-relative">
                  {selectedType === "connect_desk" && (
                    <div
                      className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-3">
                    <h4 className="fw-bold mb-0">Connect Desk</h4>
                  </div>
                  <p className="text-muted small mb-3">
                    Your gateway to meaningful connections at Africa's premier
                    startup event.
                  </p>
                  <ul className="small mb-4">
                    <li>Two exhibitor badges</li>
                    <li>Three days of exhibition at the main lobby</li>
                    <li>
                      Access to trainings with internationally renowned partners
                    </li>
                    <li>
                      Participating in the pitch competition with a cash prize
                      of up to $10,000
                    </li>
                    <li>
                      Access to the deal room to meet investors and partners
                    </li>
                  </ul>
                  <h5 className="fw-bold text-primary mb-1">29.900 DZD</h5>
                  <div className="text-muted small">≈ 199 $</div>
                  <input
                    type="radio"
                    value="connect_desk"
                    {...register("exhibition_type", {
                      required: "Please select an exhibition type",
                    })}
                    style={{ display: "none" }}
                  />
                </Card.Body>
              </Card>
            </div>

            {/* Scale Up Booth */}
            <div className="col-md-4">
              <Card
                className={`h-100 border-3 transition-all ${
                  selectedType === "scale_up_booth"
                    ? "border-primary shadow-lg bg-primary bg-opacity-10"
                    : "border-light"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform:
                    selectedType === "scale_up_booth"
                      ? "translateY(-4px)"
                      : "none",
                }}
                onClick={() => handleCardClick("scale_up_booth")}
              >
                <Card.Body className="position-relative">
                  {selectedType === "scale_up_booth" && (
                    <div
                      className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-3">
                    <h4 className="fw-bold mb-0">Scale Up Booth</h4>
                  </div>
                  <p className="text-muted small mb-3">
                    An elevated exhibition experience offering greater
                    visibility, stronger connections, and exclusive networking
                    opportunities with key ecosystem players.
                  </p>
                  <ul className="small mb-4">
                    <li>Four exhibitor badges</li>
                    <li>One access pass to the Gala Dinner</li>
                    <li>
                      Three days of exhibition in a prime area of the main lobby
                    </li>
                    <li>
                      Access to advanced trainings with internationally renowned
                      partners
                    </li>
                    <li>
                      Exclusive networking session with investors and ecosystem
                      leaders
                    </li>
                    <li>
                      Participating in the pitch competition with a cash prize
                      of up to $10,000
                    </li>
                    <li>
                      Priority access to the deal room to meet investors and
                      partners
                    </li>
                  </ul>
                  <h5 className="fw-bold text-primary mb-1">99.999 DZD</h5>
                  <div className="text-muted small">≈ 399 $</div>
                  <input
                    type="radio"
                    value="scale_up_booth"
                    {...register("exhibition_type", {
                      required: "Please select an exhibition type",
                    })}
                    style={{ display: "none" }}
                  />
                </Card.Body>
              </Card>
            </div>

            {/* Premium Exhibition Space */}
            <div className="col-md-4">
              <Card
                className={`h-100 border-3 transition-all ${
                  selectedType === "premium_exhibition_space"
                    ? "border-primary shadow-lg bg-primary bg-opacity-10"
                    : "border-light"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform:
                    selectedType === "premium_exhibition_space"
                      ? "translateY(-4px)"
                      : "none",
                }}
                onClick={() => handleCardClick("premium_exhibition_space")}
              >
                <Card.Body className="position-relative">
                  {selectedType === "premium_exhibition_space" && (
                    <div
                      className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-3">
                    <h4 className="fw-bold mb-0">Premium Exhibition Space</h4>
                  </div>
                  <p className="text-muted small mb-3">
                    Make a bold statement with your own customizable 15m²
                    showcase.
                  </p>
                  <ul className="small mb-4">
                    <li>Five exhibitor badges</li>
                    <li>Access passes to the Champions-Gov Summit</li>
                    <li>Access to VIP lounge</li>
                    <li>Three access passes to the Gala Dinner</li>
                    <li>
                      Build your own stand according to your brand on your 15m²
                      space
                    </li>
                    <li>
                      Three days of exhibition at a strategic position in the
                      main lobby
                    </li>
                    <li>
                      Priority access to the deal room to meet investors and
                      partners
                    </li>
                  </ul>
                  <h5 className="fw-bold text-primary mb-1">299.900 DZD</h5>
                  <div className="text-muted small">≈ 1,999 $</div>
                  <input
                    type="radio"
                    value="premium_exhibition_space"
                    {...register("exhibition_type", {
                      required: "Please select an exhibition type",
                    })}
                    style={{ display: "none" }}
                  />
                </Card.Body>
              </Card>
            </div>
          </div>

          {errors.exhibition_type && (
            <div className="text-danger mt-3">
              {errors.exhibition_type.message}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading
              ? mode === "update"
                ? "Updating..."
                : "Submitting..."
              : mode === "update"
              ? "Update Selection"
              : "Confirm Selection"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ExhibitionTypeModal;
