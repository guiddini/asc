import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Loader,
  Ticket,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { checkUserEmailExists } from "../../apis";
import { Button } from "react-bootstrap";
import { TicketsPrivilege } from "../../components";
import { useQuery, useMutation } from "react-query";
import {
  getSharedTicketByIdApi,
  takeSharedTicketApi,
} from "../../apis/ticket-sharing";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("L'email est obligatoire")
    .email("Veuillez entrer une adresse email valide"),
  password: Yup.string().when("hasAccount", {
    is: false,
    then: (schema) =>
      schema
        .required("Le mot de passe est obligatoire")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    otherwise: (schema) => schema.notRequired(),
  }),
  password_confirmation: Yup.string().when("hasAccount", {
    is: false,
    then: (schema) =>
      schema
        .required("La confirmation du mot de passe est obligatoire")
        .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas"),
    otherwise: (schema) => schema.notRequired(),
  }),
  hasAccount: Yup.boolean().required(),
});

const SharedTicketsPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryFn: () => getSharedTicketByIdApi(id),
    queryKey: ["shared-ticket", id],
    enabled: !!id,
  });
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      hasAccount: true,
    },
  });

  const email = watch("email");
  const hasAccount = watch("hasAccount");

  const debouncedCheckEmail = useCallback(
    debounce(async (email: string) => {
      setIsCheckingEmail(true);
      try {
        const res = await checkUserEmailExists(email);
        const exists = res.data === 1;
        setValue("hasAccount", exists);
        trigger("password");
        trigger("password_confirmation");
      } catch (error) {
        console.error("Error checking email:", error);
        toast.error("Erreur lors de la vérification de l'email");
      } finally {
        setIsCheckingEmail(false);
      }
    }, 300),
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      debouncedCheckEmail(email);
    }
  }, [email, debouncedCheckEmail]);

  const takeMutation = useMutation(takeSharedTicketApi, {
    onSuccess: () => {
      toast.success("Ticket successfully claimed!");
      navigate("/shared-ticket-success");
    },
    onError: (error) => {
      toast.error("Failed to claim ticket. Please try again.");
      console.error("Error claiming ticket:", error);
    },
  });

  const onSubmit = (formData: any) => {
    if (!id) return;

    const data = new FormData();
    data.append("ticket_sharing_link_id", id);
    data.append("email", formData.email);
    if (!formData.hasAccount) {
      data.append("password", formData.password);
      data.append("password_confirmation", formData.password_confirmation);
    }

    takeMutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div id="error-page">
        <div id="error-content">
          <AlertTriangle id="error-icon" size={64} />
          <h1 id="error-title">Oops! Something went wrong</h1>
          <p id="error-message">
            Erreur de chargement des données de tickets partagés. Veuillez
            réessayer plus tard.
          </p>
          <a href="/" id="error-home-link">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  const { ticketType, link } = data?.data || {};

  if (!link || link.status !== "Active") {
    return (
      <div id="error-page">
        <div id="error-content">
          <AlertTriangle id="error-icon" size={64} />
          <h1 id="error-title">Oops! Quelque chose s'est mal passé</h1>
          <p id="error-message">Ce lien a été désactivé par le propriétaire.</p>
          <a href="/" id="error-home-link">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (link.remaining_tickets_count === 0) {
    return (
      <div id="no-remaining-tickets-page">
        <div id="no-tickets-content">
          <div id="no-tickets-container">
            <div id="warning-icon">
              <span id="warning-icon-text">!</span>
            </div>
            <h1 id="no-tickets-title">
              Vous êtes invité, mais il n'y a plus de Tickets disponibles sur
              cette invitation
            </h1>
            <Link to="/profiles/asc/tickets" id="reserve-ticket-button">
              Réserver un ticket
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="shared-ticket-page">
      <div id="shared-ticket-content">
        <div id="shared-ticket-container">
          <span id="shared-ticket-label">
            RÉCLAMEZ VOTRE TICKET ET REJOIGNEZ L'ÉVÉNEMENT !
          </span>

          <h1 id="shared-ticket-title">
            Vous êtes invité, Réclamez votre Ticket maintenant !
          </h1>

          <p id="shared-ticket-description">
            Bienvenue ! Utilisez votre lien d'invitation personnalisé pour
            réclamer votre Ticket et commencer. Suivez les étapes simples
            ci-dessous pour rejoindre l'événement et découvrir toutes ses
            fonctionnalités.
          </p>

          <div id="shared-ticket-card">
            <div id="shared-ticket-info">
              <div id="shared-ticket-icon">
                <Ticket stroke="#50D7A0" fill="#fff" width="36" height="36" />
              </div>
              <div id="shared-ticket-details">
                <span id="shared-ticket-type">{ticketType.name}</span>
                <span id="shared-ticket-price">{ticketType.price} DA</span>
              </div>
            </div>
            <button
              id="shared-ticket-privileges"
              onClick={() => setSelectedTicket(ticketType.slug)}
            >
              <span>Afficher Les Privilèges</span>
              <ChevronRight />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} id="shared-ticket-form">
            <div id="shared-ticket-form-group">
              <label htmlFor="email">Email</label>
              <div id="shared-ticket-input-wrapper">
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="example@example.com"
                />
                {isCheckingEmail && (
                  <Loader id="shared-ticket-email-loader" size={20} />
                )}
              </div>
              {errors.email && (
                <span id="shared-ticket-error">{errors.email.message}</span>
              )}
            </div>

            {!isCheckingEmail && email && (
              <div
                id={hasAccount ? "account-notice" : "account-notice-warning"}
              >
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
              <>
                <div id="shared-ticket-form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <div id="shared-ticket-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password")}
                      placeholder="Entrez votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      id="shared-ticket-password-toggle"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span id="shared-ticket-error">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div id="shared-ticket-form-group">
                  <label htmlFor="password_confirmation">
                    Confirmer le mot de passe
                  </label>
                  <div id="shared-ticket-input-wrapper">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      id="password_confirmation"
                      {...register("password_confirmation")}
                      placeholder="Confirmez votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      id="shared-ticket-password-toggle"
                    >
                      {showPasswordConfirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <span id="shared-ticket-error">
                      {errors.password_confirmation.message}
                    </span>
                  )}
                </div>
              </>
            )}

            <Button type="submit" disabled={takeMutation.isLoading}>
              {takeMutation.isLoading ? "Processing..." : "Continuer"}
            </Button>
          </form>
        </div>
      </div>
      <TicketsPrivilege
        isOpen={selectedTicket !== null}
        setIsOpen={setSelectedTicket}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default SharedTicketsPage;
