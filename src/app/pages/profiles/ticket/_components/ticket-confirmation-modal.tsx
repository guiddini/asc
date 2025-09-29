import { Info, Loader, Ticket } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { buyTicketApi, checkUserEmailExists } from "../../../../apis";
import { debounce } from "lodash"; // Import lodash debounce
import { useMutation } from "react-query";
import toast from "react-hot-toast";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .required("L'email est obligatoire.")
    .email("Entrez une adresse email valide."),
  password: Yup.string().when("hasAccount", {
    is: false,
    then: (schema) =>
      schema
        .required(
          "Le mot de passe est obligatoire pour un nouveau utilisateur."
        )
        .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    otherwise: (schema) => schema.notRequired(),
  }),
  quantity: Yup.number()
    .required("La quantité est obligatoire.")
    .min(1, "La quantité doit être au moins 1.")
    .typeError("La quantité doit être un nombre."),

  hasAccount: Yup.boolean().required(),
});

interface TicketData {
  category: string;
  title: string;
  slug: string;
  price: number;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: TicketData;
}

interface FormValues {
  email: string;
  password?: string;
  quantity: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  ticketData,
}) => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false); // Added state for loading indicator
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      quantity: 1,
      email: "",
      hasAccount: true,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: FormData) => buyTicketApi(data),
    mutationKey: ["buy-ticket", ticketData.slug],
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const quantity = watch("quantity");
  const email = watch("email");
  const hasAccount = watch("hasAccount");
  const price = ticketData.price;
  const subtotal = price * quantity;

  const debouncedCheckEmail = useCallback(
    debounce(async (email: string) => {
      setIsCheckingEmail(true); // Set loading indicator to true
      try {
        const res = await checkUserEmailExists(email);

        const exists = res.data === 1 ? true : false;
        setValue("hasAccount", exists);
        trigger("password");
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setIsCheckingEmail(false); // Set loading indicator to false after the request completes
      }
    }, 300),
    []
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex for email validation

  useEffect(() => {
    if (email && emailRegex.test(email)) {
      debouncedCheckEmail(email);
    }
  }, [email, debouncedCheckEmail]);

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? quantity + 1 : quantity - 1;
    setValue("quantity", Math.max(1, newQuantity));
  };

  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    const formdata = new FormData();
    formdata.append("email", values?.email);
    if (!hasAccount) formdata.append("password", values?.password);
    formdata.append("quantity", String(quantity));
    formdata.append("ticket_slug", ticketData?.slug);

    mutate(formdata, {
      onSuccess(data) {
        if (ticketData?.slug === "free") {
          navigate("/profiles/asc/tickets/success");
        } else {
          const satimLink = data?.data;
          toast.success("Redirection vers le paiement...");
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

  const handleOnClose = () => {
    onClose();
    reset();
    setValue("hasAccount", false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleOnClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div id="modal-overlay">
      <div id="modal-content" ref={modalRef}>
        <div id="modal-header">
          <h2>Confirmez votre ticket</h2>
          <button id="close-button" onClick={handleOnClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div id="modal-ticket-form-group">
            <label htmlFor="email">
              Email<span id="required">*</span>
            </label>
            <div id="email-input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="Entrez votre Email"
                {...register("email")}
              />
              {isCheckingEmail && <Loader id="email-loader" size={20} />}
            </div>
            {errors.email && (
              <span id="error-message">{errors.email.message}</span>
            )}
          </div>

          {!isCheckingEmail && email && (
            <div id={hasAccount ? "account-notice" : "account-notice-warning"}>
              <Info size={26} />
              <span>
                {hasAccount ? (
                  <>
                    Votre email est associé à un compte existant.
                    <br />
                    Une fois la commande confirmée, votre ticket sera ajouté à
                    ce compte.
                  </>
                ) : (
                  <>
                    Votre email n'est pas encore enregistré.
                    <br />
                    Nous créerons un nouveau compte pour vous et y assignerons
                    le ticket une fois la commande confirmée.
                  </>
                )}
              </span>
            </div>
          )}

          {!hasAccount && (
            <div id="modal-ticket-form-group">
              <label htmlFor="email">
                Mot de passe<span id="required">*</span>
              </label>
              <div id="email-input-wrapper">
                <input
                  type="password"
                  id="email"
                  placeholder="Entrez votre Mot de passe"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <span id="error-message">{errors.password.message}</span>
              )}
            </div>
          )}

          <div id="ticket-selection">
            <div id="ticket-info">
              <div id="ticket-icon">
                <Ticket stroke="#50D7A0" fill="#fff" width="36" height="36" />
              </div>
              <div id="ticket-details">
                <span id="ticket-type">{ticketData.category}</span>
                <span id="ticket-price">{ticketData.price} DA</span>
              </div>
            </div>

            <div id="quantity-controls">
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
                disabled={price === 0}
                type="button"
                onClick={() => handleQuantityChange(true)}
                id="quantity-increase"
              >
                +
              </button>
            </div>
          </div>

          <div id="price-summary">
            <div id="subtotal-row">
              <span>Sous-total</span>
              <span>{subtotal} DA</span>
            </div>
            <div id="total-row">
              <span>Total</span>
              <span>{subtotal} DA</span>
            </div>
          </div>

          <button type="submit" id="proceed-button">
            {price > 0 ? (
              <>
                <p>Procéder au paiement</p>
                <img
                  id="payment-icon"
                  src="/media/eventili/dahabia.png"
                  alt=""
                />
              </>
            ) : (
              <p>Confirmer</p>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
