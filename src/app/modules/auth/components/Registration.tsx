import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axios";
import toast from "react-hot-toast";
import { loginApi } from "../../../apis";
import { useAuth } from "..";
import { User } from "../../../types/user";
import { Eye, EyeOff } from "lucide-react";

const registrationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .max(50, "Maximum 50 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .min(8, "Minimum 8 characters")
    .max(50, "Maximum 50 characters")
    .required("Password confirmation is required")
    .oneOf(
      [Yup.ref("password")],
      "Passwords do not match"
    ),
});

type RegisterProps = {
  password?: string;
  password_confirmation?: string;
};

export function Registration() {
  const { token } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [canResetPassword, setCanResetPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function getEmailFromQueryString() {
    const urlParams = new URLSearchParams(search);
    const email = urlParams.get("email");
    return email;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<RegisterProps>({
    resolver: yupResolver(registrationSchema),
  });

  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: RegisterProps) => {
      try {
        await axiosInstance
          .post("/password/reset", {
            password: data.password,
            password_confirmation: data.password_confirmation,
            token: token,
            email: getEmailFromQueryString(),
          })
          .then(async (res) => {
            toast.success("You have successfully created your password");
            navigate("/auth/reset-password-success");
          });
      } catch (error) {
        navigate("/auth/reset-password-success");
      }
    },
  });

  const handleRegister = async (data: RegisterProps) => {
    mutate(data, {
      onError(error) {
        const errorResponse = error as any;
        setError("password", {
          type: "manual",
          message: errorResponse?.response?.data?.message,
        });
      },
    });
  };

  const { mutate: checkToken, isLoading: checking } = useMutation({
    mutationKey: ["check-code"],
    mutationFn: async (data: { email: string; token: string }) => {
      await axiosInstance.post("/password/check", {
        email: data.email,
        token: data.token,
      });
    },
  });

  useEffect(() => {
    if (token) {
      checkToken(
        {
          email: getEmailFromQueryString(),
          token: token,
        },
        {
          onSuccess() {
            setCanResetPassword(true);
          },
          onError() {
            setCanResetPassword(false);
          },
        }
      );
    }
  }, [token]);

  if (checking) {
    return (
      <div id="registration-loading">
        <div id="registration-loader"></div>
      </div>
    );
  }

  if (!canResetPassword) {
    return (
      <div id="registration-expired">
        <h1>Link Expired</h1>
        <p>
          Your password reset link has expired.
          <br />
          Please go to the{" "}
          <Link to="/auth/forgot-password" className="link">
            Forgot Password
          </Link>{" "}
          page to generate a new reset link.
        </p>
        <p>
          If you still experience difficulties, please contact our{" "}
          <a
            href="https://algeriafintech.com/"
            target="_blank"
            className="link"
          >
            support service
          </a>{" "}
          for additional assistance.
        </p>
      </div>
    );
  }

  return (
    <div id="registration-container">
      <h1>Create your new password</h1>
      <p id="registration-subtitle">
        For your security, please create a strong and unique password.
      </p>

      <form id="registration-form" onSubmit={handleSubmit(handleRegister)}>
        <div className="input-group">
          <label htmlFor="password">New password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              className={errors.password ? "error" : ""}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="password_confirmation">
            Confirmer le nouveau mot de passe
          </label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password_confirmation"
              {...register("password_confirmation")}
              className={errors.password_confirmation ? "error" : ""}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <span className="error-message">
              {errors.password_confirmation.message}
            </span>
          )}
        </div>

        <button type="submit" id="save-password-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="button-loader"></span>
              <span>Saving...</span>
            </>
          ) : (
            "Save password"
          )}
        </button>
      </form>

      <p id="support-text">
        If you still encounter issues, don’t hesitate to contact our{" "}
        <Link to="/support" className="link">
          support team
        </Link>{" "}
        for assistance. We’re here to help!
      </p>
    </div>
  );
}
