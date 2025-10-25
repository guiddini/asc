import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axios";
import backendErrorHandler from "../../../utils/backend-error-handler";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorResponse } from "../../../types/responses";
import { MailOpen } from "lucide-react";

type ForgotPasswordProps = {
  email?: string;
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .min(5, "Minimum 5 characters")
    .max(50, "Maximum 50 characters")
    .required("Email is required"),
});

export function ForgotPassword() {
  const localStorageKey = "passwordResetTimestamp";

  // Function to get the timestamp from local storage
  const getLastSuccessTimestamp = () => {
    const storedTimestamp = localStorage.getItem(localStorageKey);
    return storedTimestamp ? parseInt(storedTimestamp) : null;
  };

  // Function to set the current timestamp in local storage
  const setLastSuccessTimestamp = () => {
    const currentTimestamp = Date.now();
    localStorage.setItem(localStorageKey, currentTimestamp.toString());
  };

  const { mutate, isLoading, error, isSuccess } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: ForgotPasswordProps) => {
      await axiosInstance.post("/password/email", {
        email: data.email,
      });
    },
  });

  const handleResetPassword = async (data: ForgotPasswordProps) => {
    mutate(
      {
        email: data.email,
      },
      {
        onError(error) {
          backendErrorHandler(setError, error);
          setLastSuccessTimestamp();
          toast.error("Unable to send the reset link");
        },
        onSuccess(data) {
          setLastSuccessTimestamp();
          toast.success(
            "A password reset email has been sent to your email address"
          );
        },
      }
    );
  };

  const {
    setError,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordProps>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const backendError = error as errorResponse;

  return (
    <div id="form-container">
      <h2>Forgot Password</h2>
      <p id="form-subtitle">
        Remember your password?{" "}
        <Link to="/auth/login" id="highlight-link">
          Sign in
        </Link>
      </p>
      <form id="auth-form" onSubmit={handleSubmit(handleResetPassword)}>
        <div id="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <span id="error-message">{errors.email.message}</span>
          )}
        </div>
        <button type="submit" id="forgot-password-submit-button">
          <span>Send reset link</span>
          <MailOpen />
        </button>
      </form>
      <p id="forgot-password-notice">
        If you still have issues, feel free to contact our{" "}
        <a href="mailto:support@eventili.com">support team</a> for assistance.
        We’re here to help!
      </p>
    </div>
  );
}
