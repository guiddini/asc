import { useEffect } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { PasswordMeterComponent } from "../../../../_metronic/assets/ts/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessage, isError } from "../../../helpers/errorMessage";
import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axios";
import backendErrorHandler from "../../../utils/backend-error-handler";
import toast from "react-hot-toast";
import { errorResponse } from "../../../types/responses";
import { loginApi } from "../../../apis";
import { useAuth } from "..";
import { User } from "../../../types/user";

const registrationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Minimum de 8 caractères")
    .max(50, "Maximum de 50 caractères")
    .required("Le mot de passe est requis"),

  password_confirmation: Yup.string()
    .min(8, "Minimum de 8 caractères")
    .max(50, "Maximum de 50 caractères")
    .required("La confirmation du mot de passe est requise")
    .oneOf(
      [Yup.ref("password")],
      "Le mot de passe et la confirmation ne correspondent pas"
    ),
});

type registerProps = {
  password?: string;
  password_confirmation?: string;
};

const ResetPassword = () => {
  const { token } = useParams();
  const { search } = useLocation();
  const { saveAuth, setCurrentUser } = useAuth();

  function getEmailFromQueryString() {
    const urlParams = new URLSearchParams(search);
    const email = urlParams.get("email");
    return email;
  }

  const {
    setError,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<registerProps>({
    resolver: yupResolver(registrationSchema),
  });

  useEffect(() => {
    PasswordMeterComponent.bootstrap();
  }, []);

  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: registerProps) => {
      try {
        await axiosInstance
          .post("/password/reset", {
            password: data.password,
            password_confirmation: data.password_confirmation,
            token: token,
            email: getEmailFromQueryString(),
          })
          .then(async () => {
            await loginApi({
              password: data.password,
              email: getEmailFromQueryString(),
            }).then((res) => {
              const userData: {
                user: User;
                token: string;
              } = res.data;
              saveAuth(userData?.token);
              setCurrentUser(userData.user);
            });
          });
      } catch (error) {}
    },
  });

  const handleRegister = async (data: registerProps) => {
    mutate(data, {
      onError(error) {
        backendErrorHandler(setError, error);
      },
      onSuccess() {
        toast.success("Vous avez créé avec succès votre mot de passe");
      },
    });
  };

  const backendError = error as errorResponse;

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework p-8"
      noValidate
      id="kt_login_signup_form"
      onSubmit={handleSubmit(handleRegister)}
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        {/* begin::Title */}
        <h1 className="text-gray-900 fw-bolder mb-3">
          Réinitialiser le mot de passe
        </h1>
        {/* end::Title */}

        <div className="text-gray-500 fw-semibold fs-6">
          Définir un nouveau mot de passe pour votre compte
        </div>
      </div>
      {/* end::Heading */}

      {/* begin::Login options */}
      {backendError && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">
            {backendError?.response?.data?.message}
          </div>
        </div>
      )}

      {/* {formik.status && (
      )} */}

      {/* begin::Form group Password */}
      <div className="fv-row mb-8" data-kt-password-meter="true">
        <div className="mb-1">
          <label className="form-label fw-bolder text-gray-900 fs-6">
            Mot de passe
          </label>
          <div className="position-relative mb-3">
            <input
              type="password"
              placeholder="Mot de passe"
              autoComplete="off"
              {...register("password")}
              className={clsx(
                "form-control bg-transparent",
                {
                  "is-invalid": isError(errors, "password"),
                },
                {
                  "is-valid": !isError(errors, "password"),
                }
              )}
            />
            {errorMessage(errors, "password")}
          </div>
          {/* begin::Meter */}
          <div
            className="d-flex align-items-center mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className="text-muted">
          Utilisez 8 caractères ou plus avec une combinaison de lettres,
          chiffres et symboles.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className="fv-row mb-5">
        <label className="form-label fw-bolder text-gray-900 fs-6">
          Confirmez le mot de passe
        </label>
        <input
          type="password"
          placeholder="Confirmation du mot de passe"
          autoComplete="off"
          {...register("password_confirmation")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": isError(errors, "password_confirmation"),
            },
            {
              "is-valid": !isError(errors, "password_confirmation"),
            }
          )}
        />
        {errorMessage(errors, "password_confirmation")}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="text-center w-100 d-flex flex-row align-items-center justify-content-between pt-8">
        <Link to="/auth/login" className="btn btn-lg btn-light-primary w-auto">
          Annuler
        </Link>

        <button
          type="submit"
          id="kt_sign_up_submit"
          className="btn btn-lg btn-success w-auto"
          disabled={isLoading}
        >
          {!isLoading && <span className="indicator-label">Soumettre</span>}
          {isLoading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Veuillez patienter...{" "}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Form group */}
    </form>
  );
};

export default ResetPassword;
