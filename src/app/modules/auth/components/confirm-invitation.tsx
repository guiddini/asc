import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, User, User2, UsersRound } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { handleGestStatus } from "../../../apis";
import { useAuth } from "../core/Auth";

const schema = yup.object({
  type: yup
    .string()
    .oneOf(["confirm", "delegate"])
    .required("Please select an option"),
  email: yup.string().when("type", {
    is: (type) => type === "confirm",
    then: (schema) =>
      schema
        .email("Please enter a valid email address")
        .required("Email is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  fname: yup.string().when("type", {
    is: (type) => type === "delegate",
    then: (schema) => schema.required("First name is required for delegation"),
    otherwise: (schema) => schema.notRequired(),
  }),
  lname: yup.string().when("type", {
    is: (type) => type === "delegate",
    then: (schema) => schema.required("Last name is required for delegation"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type schemaType = yup.InferType<typeof schema>;

const ConfirmInvitation = () => {
  const { mutate: assignInvitationToGuest, isLoading: assigningInvitation } =
    useMutation({
      mutationKey: ["assign-guest-invit"],
      mutationFn: async (data: any) => {
        return await handleGestStatus(data);
      },
    });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: undefined,
      email: "",
    },
  });

  const { code } = useParams();

  const selectedOption = watch("type");

  const onSubmit = (data: schemaType) => {
    const req = {
      code: code,
      is_delegated: data?.type === "delegate" ? 1 : 0,

      // For delegated invitations
      delegated_fname: data?.type === "delegate" ? data?.fname : null,
      delegated_lname: data?.type === "delegate" ? data?.lname : null,
      delegated_email: data?.type === "delegate" ? data?.email : null,

      email: data?.type === "confirm" ? data?.email : null,
    };

    assignInvitationToGuest(req, {
      onSuccess() {},
      onError(error, variables, context) {
        console.error("Error assigning invitation:", error);
      },
    });
  };

  return (
    <div className="confirm-container">
      <nav className="confirm-nav">
        <Link to="/" className="nav-link">
          ← Home
        </Link>
        <button onClick={handleLogout} className="nav-link">
          Log out →
        </button>
      </nav>
      <main className="confirm-content">
        <span className="welcome-text">WELCOME TO EVENTILI</span>
        <h1>
          Please confirm your attendance or designate
          <br />
          a representative for your entity
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="confirm-form">
          <div className="options-container">
            <label
              className={`option-card ${
                selectedOption === "confirm" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                value="confirm"
                {...register("type")}
                className="option-radio"
              />
              <div className="option-icon">
                {selectedOption === "confirm" ? (
                  <Check size={24} />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div className="option-content">
                <h3>Confirm My Presence</h3>
                <p>I confirm my attendance at the event</p>
              </div>
            </label>
            <label
              className={`option-card ${
                selectedOption === "delegate" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                value="delegate"
                {...register("type")}
                className="option-radio"
              />
              <div className="option-icon">
                {selectedOption === "delegate" ? (
                  <Check size={24} />
                ) : (
                  <UsersRound size={24} />
                )}
              </div>
              <div className="option-content">
                <h3>Delegate My Participation</h3>
                <p>I delegate my spot to another person</p>
              </div>
            </label>
          </div>
          {errors.type && (
            <span className="error-message">{errors.type.message}</span>
          )}
          {selectedOption === "delegate" && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
          <button type="submit" className="submit-button">
            Confirm Invitation
          </button>
        </form>
      </main>
    </div>
  );
};

export default ConfirmInvitation;
