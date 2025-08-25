import { useAuth } from "../core/Auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as yup from "yup";
import { loginApi, regiterApi } from "../../../apis";
import { User } from "../../../types/user";
import { Ability, AbilityBuilder } from "@casl/ability";
import ability from "../../../utils/ability";
import { setCurrentUser as setReduxCurrentUser } from "../../../features/userSlice";
import {
  BackendError,
  getServerErrorResponseMessage,
} from "../../../utils/server-error";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type SignupProps = {
  fname: string;
  lname: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
};

const signupSchema = yup.object({
  fname: yup
    .string()
    .required("Le prénom est requis.")
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères."),
  lname: yup
    .string()
    .required("Le nom est requis.")
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom ne doit pas dépasser 50 caractères."),
  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide.")
    .required("L'adresse email est requise."),
  password: yup
    .string()
    .required("Le mot de passe est requis.")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  password_confirmation: yup
    .string()
    .required("Veuillez confirmer votre mot de passe.")
    .oneOf([yup.ref("password")], "Les mots de passe doivent correspondre."),
  terms: yup
    .boolean()
    .oneOf([true], "Vous devez accepter les conditions générales."),
});

export default function SignupPage() {
  const { saveAuth, setCurrentUser } = useAuth();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: FormData) => await regiterApi(data),
  });

  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  });

  const navigate = useNavigate();

  const signupFun = async (values: SignupProps) => {
    const formdata = new FormData();
    formdata.append("fname", values.fname);
    formdata.append("lname", values.lname);
    formdata.append("email", values.email);
    formdata.append("password", values.password);
    formdata.append("password_confirmation", values.password_confirmation);
    mutate(formdata, {
      async onSuccess() {
        const data = await loginApi({
          email: values.email,
          password: values.password,
        });

        if (data) {
          const userData: {
            user: User;
            token: string;
          } = data.data;
          const permissions = userData?.user?.permissions;
          const { can, rules } = new AbilityBuilder(Ability);
          permissions?.forEach((permission) => {
            const [action, entity] = permission?.name.split("_");
            can(action, entity);
            ability.update(rules);
          });
          dispatch(setReduxCurrentUser(userData));
          saveAuth(userData?.token);
          setCurrentUser(userData.user);

          navigate("/welcome");
        }
      },
      onError(error: AxiosError<BackendError>) {
        const errorMessage = error.response?.data
          ? getServerErrorResponseMessage(error.response.data)
          : "Une erreur s'est produite";

        toast.error(errorMessage, {
          duration: 9000,
        });
      },
    });
  };

  return (
    <div id="signup-form-container">
      <h2>S'inscrire</h2>
      <p id="signup-form-subtitle">
        Vous avez déjà un compte ?{" "}
        <Link to="/auth/login" id="signup-highlight-link">
          Connectez-vous !
        </Link>
      </p>

      <form id="signup-auth-form" onSubmit={handleSubmit(signupFun)}>
        <div id="signup-name-row">
          <div id="signup-form-group">
            <label htmlFor="signup-fname">Prénom</label>
            <input
              type="text"
              id="signup-fname"
              placeholder="Prénom"
              {...register("fname")}
            />
            {errors.fname && (
              <span id="signup-error-message">{errors.fname.message}</span>
            )}
          </div>

          <div id="signup-form-group">
            <label htmlFor="signup-lname">Nom de famille</label>
            <input
              type="text"
              id="signup-lname"
              placeholder="Nom de famille"
              {...register("lname")}
            />
            {errors.lname && (
              <span id="signup-error-message">{errors.lname.message}</span>
            )}
          </div>
        </div>

        <div id="signup-form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            type="email"
            id="signup-email"
            placeholder="Entrez votre Email"
            {...register("email")}
          />
          {errors.email && (
            <span id="signup-error-message">{errors.email.message}</span>
          )}
        </div>

        <div id="signup-form-group">
          <label htmlFor="signup-password">Mot de passe</label>
          <div id="signup-password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="signup-password"
              placeholder="Entrez votre mot de passe"
              {...register("password")}
            />
            <button
              type="button"
              id="signup-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span id="signup-error-message">{errors.password.message}</span>
          )}
        </div>

        <div id="signup-form-group">
          <label htmlFor="signup-password_confirmation">
            Confirmer le mot de passe
          </label>
          <div id="signup-password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="signup-password_confirmation"
              placeholder="Confirmez votre mot de passe"
              {...register("password_confirmation")}
            />
            <button
              type="button"
              id="signup-toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <span id="signup-error-message">
              {errors.password_confirmation.message}
            </span>
          )}
        </div>

        <div id="signup-terms-group">
          <input type="checkbox" id="signup-terms" {...register("terms")} />
          <label htmlFor="signup-terms">
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
        {errors.terms && (
          <span id="signup-error-message">{errors.terms.message}</span>
        )}

        <button type="submit" id="signup-submit-button">
          {isLoading ? (
            <div id="signup-loading-container">
              <span id="signup-loader"></span>
              <span>Enregistrement...</span>
            </div>
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>
    </div>
  );
}
