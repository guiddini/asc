import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../validation/reset-password-schema";
import { errorMessage } from "../../../../helpers/errorMessage";
import { useMutation } from "react-query";
import { resetUserPasswordApi } from "../../../../apis";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../../types/reducers";

const PrivacySettings = () => {
  // const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  const [showPasswordForm, setPasswordForm] = useState<boolean>(false);
  const { user } = useSelector((state: UserResponse) => state.user);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: {
      current_password: string;
      new_password: string;
      new_password_confirmation: string;
      user_id: string;
    }) => await resetUserPasswordApi(data),
  });

  const handleResetPassword = async (params: {
    password: string;
    new_password: string;
    password_confirmation: string;
  }) => {
    const query: {
      current_password: string;
      new_password: string;
      new_password_confirmation: string;
      user_id: string;
    } = {
      current_password: params.password,
      new_password: params.new_password,
      new_password_confirmation: params.password_confirmation,
      user_id: user.id,
    };
    console.log("query", query);
    mutate(query, {
      onSuccess: () => {
        toast.success("Le mot de passe a été réinitialisé avec succès");
      },
      onError: () => {
        toast.error("Erreur de réinitialisation du mot de passe");
      },
    });
  };

  return (
    <div className="card mb-5 mb-xl-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_signin_method"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">Confidentialité du compte</h3>
        </div>
      </div>

      <div id="kt_account_signin_method" className="collapse show">
        <div className="card-body border-top p-9">
          <div className="d-flex flex-wrap align-items-center mb-10">
            <div
              id="kt_signin_password"
              className={" " + (showPasswordForm && "d-none")}
            >
              <div className="fs-6 fw-bolder mb-1">Mot de passe</div>
              <div className="fw-bold text-gray-600">************</div>
            </div>

            <div
              id="kt_signin_password_edit"
              className={"flex-row-fluid " + (!showPasswordForm && "d-none")}
            >
              <form
                id="kt_signin_change_password"
                className="form"
                onSubmit={handleSubmit(handleResetPassword)}
              >
                <div className="row mb-1">
                  <div className="col-lg-4">
                    <div className="fv-row mb-0">
                      <label
                        htmlFor="currentpassword"
                        className="form-label fs-6 fw-bolder mb-3"
                      >
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg form-control-solid "
                        id="currentpassword"
                        {...register("password")}
                      />
                      {errorMessage(errors, "password")}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="fv-row mb-0">
                      <label
                        htmlFor="newpassword"
                        className="form-label fs-6 fw-bolder mb-3"
                      >
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg form-control-solid "
                        id="newpassword"
                        {...register("new_password")}
                      />
                      {errorMessage(errors, "new_password")}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="fv-row mb-0">
                      <label
                        htmlFor="confirmpassword"
                        className="form-label fs-6 fw-bolder mb-3"
                      >
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg form-control-solid "
                        id="confirmpassword"
                        {...register("password_confirmation")}
                      />
                      {errorMessage(errors, "password_confirmation")}
                    </div>
                  </div>
                </div>

                <div className="form-text mb-5">
                  Le mot de passe doit être composé d'au moins 8 caractères et
                  contenir des symboles.
                </div>

                <div className="d-flex">
                  <button
                    id="kt_password_submit"
                    type="submit"
                    className="btn btn-primary me-2 px-6"
                  >
                    {!isLoading && "Réinitialiser le mot de passe"}
                    {isLoading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        Veuillez patienter....{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPasswordForm(false);
                    }}
                    id="kt_password_cancel"
                    type="button"
                    className="btn btn-color-gray-500 btn-active-light-primary px-6"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>

            <div
              id="kt_signin_password_button"
              className={"ms-auto " + (showPasswordForm && "d-none")}
            >
              <button
                onClick={() => {
                  setPasswordForm(true);
                }}
                className="btn btn-light btn-active-light-primary"
              >
                Réinitialiser le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
