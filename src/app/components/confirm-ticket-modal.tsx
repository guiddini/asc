import { AlertTriangle, X, Ticket } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { buyTicketApi } from "../apis";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";
import { tickets } from "../utils/tickets";

interface ConfirmTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  quantity: Yup.number()
    .min(1, "La quantité doit être d'au moins 1")
    .required("La quantité est obligatoire"),
  slug: Yup.string().required("Le choix du ticket est obligatoire"),
});

type schemaType = Yup.InferType<typeof validationSchema>;

export default function ConfirmTicketModal({
  isOpen,
  onClose,
}: ConfirmTicketModalProps) {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 1,
      slug: "free",
    },
    resolver: yupResolver(validationSchema),
  });

  const { quantity, slug } = watch();

  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? quantity + 1 : quantity - 1;
    setValue("quantity", Math.max(1, newQuantity));
  };

  const { mutate } = useMutation({
    mutationFn: (data: FormData) => buyTicketApi(data),
    mutationKey: ["buy-ticket"],
  });

  const onSubmit = async (values: schemaType) => {
    const formdata = new FormData();
    formdata.append("email", user?.email);
    formdata.append("quantity", String(values?.quantity));
    formdata.append("ticket_slug", values?.slug);

    mutate(formdata, {
      onSuccess(data) {
        if (values?.slug === "free") {
          navigate("/profiles/afes/tickets/success");
        } else {
          const satimLink = data?.data;
          window.location.href = satimLink;
        }
      },
      onError(error) {
        console.error("Error buying ticket:", error);
        toast.error(
          "Une erreur est survenue lors de l'achat du ticket. Veuillez réessayer."
        );
      },
    });
  };

  useEffect(() => {
    setValue("quantity", 1);
  }, [slug, setValue]);

  return (
    <div id="confirm-ticket-modal-overlay">
      <div id="confirm-ticket-modal-container">
        <div id="confirm-ticket-modal-header">
          <h2>Confirmer votre ticket</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div id="confirm-ticket-modal-warning">
          <AlertTriangle size={20} />
          <span>Un ticket est requis pour accéder à cet événement</span>
          <button onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div id="confirm-ticket-modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <div id="modal-ticket-form-group">
              <label>
                Sélectionner un ticket <span id="required">*</span>
              </label>
              <div id="confirm-ticket-modal-select-wrapper">
                <Controller
                  key={watch("slug")}
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <select {...field} defaultValue={slug}>
                      {tickets?.map((ticket) => (
                        <option key={ticket.slug} value={ticket.slug}>
                          {ticket.category} - {ticket.title}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.slug && <span>{errors.slug.message}</span>}
              </div>
            </div> */}

            <div id="ticket-selection">
              <div id="ticket-info">
                <div id="ticket-icon">
                  <Ticket stroke="#50D7A0" fill="#fff" width="36" height="36" />
                </div>
                <div id="ticket-details" style={{ textAlign: "left" }}>
                  <span>
                    {tickets?.find((ticket) => ticket.slug === slug)?.category}
                  </span>
                  <span>
                    {tickets?.find((ticket) => ticket.slug === slug)?.price} DA
                  </span>
                </div>
              </div>

              {/* <div id="quantity-controls">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(false)}
                  id="quantity-decrease"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span id="quantity">{quantity}</span>
                <button
                  type="button"
                  disabled={slug === "free"}
                  onClick={() => slug !== "free" && handleQuantityChange(true)}
                  id="quantity-decrease"
                >
                  +
                </button>
              </div> */}
            </div>

            <div id="confirm-ticket-modal-price-summary">
              <div id="confirm-ticket-modal-subtotal">
                <span>Sous-total</span>
                <span>
                  {tickets?.find((ticket) => ticket.slug === slug)?.price *
                    quantity}{" "}
                  DA
                </span>
              </div>
              <div id="confirm-ticket-modal-total">
                <span>Total</span>
                <span>
                  {tickets?.find((ticket) => ticket.slug === slug)?.price *
                    quantity}{" "}
                  DA
                </span>
              </div>
            </div>

            <div id="confirm-ticket-modal-actions">
              <Link
                to="/profiles/afes"
                type="button"
                id="confirm-ticket-modal-event-profile-btn"
              >
                Profil de l'événement
              </Link>
              <button type="submit" id="confirm-ticket-modal-proceed-btn">
                {slug === "free" ? (
                  <>Réserver</>
                ) : (
                  <>
                    Procéder
                    <img
                      src="/media/eventili/dahabia.png"
                      alt="CIB"
                      width={24}
                      height={24}
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
