import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { assignInvitationSchemaType, InvitSchema } from "../../../validations";
import { useMutation } from "react-query";
import { checkGuestCodeApi } from "../../../apis";
import { MailOpen } from "lucide-react";
import toast from "react-hot-toast";

const InivitationAuth = () => {
  const { mutate, isLoading, isSuccess, data } = useMutation({
    mutationKey: ["check-guest-code"],
    mutationFn: async (code: any) => {
      return await checkGuestCodeApi(code);
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
  } = useForm({
    resolver: yupResolver(InvitSchema),
    defaultValues: {
      invitation_code: "",
      general_conditions: false,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: assignInvitationSchemaType) => {
    mutate(
      { code: data?.invitation_code },
      {
        onSuccess() {
          navigate(`/auth/invitation/${data?.invitation_code}`);
        },
        onError(error) {
          const errorResponse = error as any;
          const errorMessage =
            errorResponse?.response?.data?.message || "Code invalide";

          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div id="form-container">
      <h2>Se connecter</h2>
      <p id="form-subtitle">
        Vous n'avez pas de compte ?{" "}
        <Link to="/auth/signup" id="highlight-link">
          Inscrivez-vous maintenant
        </Link>
      </p>

      <form id="auth-form" onSubmit={handleSubmit(onSubmit)}>
        {}
        <div id="form-group">
          <label htmlFor="email">Code d’invitation</label>
          <input
            id="invitation_code"
            placeholder="Entrez votre Code d’invitation"
            {...register("invitation_code")}
          />
          {errors.invitation_code && (
            <span id="error-message">{errors.invitation_code.message}</span>
          )}
        </div>

        <div id="signup-terms-group">
          <input
            type="checkbox"
            id="signup-terms"
            {...register("general_conditions")}
          />
          <label htmlFor="signup-general_conditions">
            J'ai lu et j'accepte les{" "}
            <Link
              to="/privacy-policy"
              target="_blank"
              id="signup-highlight-link"
            >
              Conditions générales
            </Link>
          </label>
        </div>
        {errors.general_conditions && (
          <span id="signup-error-message">
            {errors.general_conditions.message}
          </span>
        )}

        <button type="submit" id="submit-button">
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                columnGap: "8px",
              }}
            >
              <span id="loader"></span>
              <span>Vérification...</span>
            </div>
          ) : (
            "Confirmer"
          )}
        </button>

        <div id="divider">
          <span>OU Continuez avec l'Email</span>
        </div>

        <Link to="/auth/invitation" id="invitation-button">
          <span>Se connecter avec l'Email</span>
          <MailOpen />
        </Link>
      </form>
    </div>
  );
};

export { InivitationAuth };
