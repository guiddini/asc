// Login component
import { useAuth } from "../core/Auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { loginApi } from "../../../apis";
import { useDispatch } from "react-redux";
import { setCurrentUser as setReduxCurrentUser } from "../../../features/userSlice";
import { User } from "../../../types/user";
import { loginSchema } from "../../../validations";
import { Ability, AbilityBuilder } from "@casl/ability";
import ability from "../../../utils/ability";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import {
  BackendError,
  getServerErrorResponseMessage,
} from "../../../utils/server-error";
import { AxiosError } from "axios";
import UserTypeComponent from "../../../pages/landing-page/layout/type-user-component";
import { adminRoles } from "../../../utils/roles";

type loginProps = {
  email: string;
  password: string;
};

export function Login() {
  const { saveAuth, setCurrentUser } = useAuth();
  const dispatch = useDispatch();
  const [showTypeComponent, setShowTypeComponent] = useState(false);
  const handleType = () => setShowTypeComponent(true);
  const handleCloseType = () => setShowTypeComponent(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: loginProps) => await loginApi(data),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const loginFun = async (values: loginProps) => {
    try {
      mutate(values, {
        async onSuccess(data) {
          const userData: {
            user: User;
            token: string;
          } = data.data;
          const permissions = userData?.user?.permissions;
          const { can, rules } = new AbilityBuilder(Ability);
          permissions.forEach((permission) => {
            const [action, entity] = permission.name.split("_");
            can(action, entity);
            ability.update(rules);
          });

          saveAuth(userData?.token);
          setCurrentUser(userData.user);
          dispatch(
            setReduxCurrentUser({
              token: userData?.token,
              user: userData?.user,
            })
          );

          const isAdmin = (userData?.user?.roles || []).some(
            (r: any) => adminRoles.includes(r?.name)
          );
          navigate(isAdmin ? "/statistics" : "/home");
        },
        onError(error: AxiosError<BackendError>) {
          const errorMessage = error.response?.data
            ? getServerErrorResponseMessage(error.response.data)
            : "Une erreur s'est produite";
          toast.error(errorMessage, { duration: 9000 });
        },
      });
    } catch (error) {
      console.error(error);
      saveAuth(undefined);
    }
  };

  return (
    <div id="form-container">
      <h2>Login</h2>
      <p id="form-subtitle">
        Don’t have an account?{" "}
        <Link to="" onClick={handleType} id="highlight-link">
          Sign up now
        </Link>
      </p>

      <form id="auth-form" onSubmit={handleSubmit(loginFun)}>
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

        <div id="form-group">
          <label htmlFor="password">Password</label>
          <div id="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            <button
              type="button"
              id="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span id="error-message">{errors.password.message}</span>
          )}
        </div>

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
              <span>Signing in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>

        <Link to="/auth/forgot-password" id="forgot-password">
          Forgot password?
        </Link>

        <div id="divider">
          <span>OR use the invitation code</span>
        </div>

        <Link to="/auth/invitation" id="invitation-button">
          <span>Invitation code</span>
          <UserPlus />
        </Link>
      </form>
      <UserTypeComponent show={showTypeComponent} onHide={handleCloseType} />
    </div>
  );
}
