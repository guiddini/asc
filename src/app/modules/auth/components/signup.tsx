import { useAuth } from "../core/Auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as yup from "yup";
import { getAllActivitiesApi, loginApi, regiterApi } from "../../../apis";
import { activity, User } from "../../../types/user";
import { Ability, AbilityBuilder } from "@casl/ability";
import ability from "../../../utils/ability";
import { setCurrentUser as setReduxCurrentUser } from "../../../features/userSlice";
import {
  BackendError,
  getServerErrorResponseMessage,
} from "../../../utils/server-error";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { CountriesSelect, SelectComponent } from "../../../components";
import { Col, Row } from "react-bootstrap";

const signupSchema = yup.object({
  fname: yup.string().required("Le prénom est requis."),
  lname: yup.string().required("Le nom est requis."),
  email: yup.string().email().required("L'adresse email est requise."),
  password: yup.string().required().min(8, "8 caractères minimum."),
  password_confirmation: yup
    .string()
    .required("Confirmation requise.")
    .oneOf([yup.ref("password")], "Les mots de passe doivent correspondre."),
  terms: yup.boolean().oneOf([true], "Vous devez accepter les conditions."),
  phone: yup.string().required("Le numéro de téléphone est requis."),
  linkedin_url: yup.string().url().required("Le lien LinkedIn est requis."),
  country: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required("Le pays est requis."),
  activity_area_ids: yup
    .array()
    .of(yup.string().required())
    .min(1, "Au moins une activité est requise."),
  languages: yup
    .array()
    .of(
      yup.object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, "Les langues sont requises."),
});

type SignupProps = yup.InferType<typeof signupSchema>;

export default function SignupPage() {
  const { saveAuth, setCurrentUser } = useAuth();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, isLoading: loadingActivities } = useQuery({
    queryKey: ["get-activities"],
    queryFn: async () => await getAllActivitiesApi(),
  });

  const activities = data?.data?.map((item: activity) => ({
    label: item.label_fr,
    value: item.id,
  }));

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  const { mutate, isLoading } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: FormData) => await regiterApi(data),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
      phone: "",
      linkedin_url: "",
      country: null,
      activity_area_ids: [],
      languages: [],
    },
  });

  console.log("watch", watch());
  console.log("errors : ", errors);

  const navigate = useNavigate();

  const signupFun = async (values: SignupProps) => {
    const formdata = new FormData();
    formdata.append("fname", values.fname);
    formdata.append("lname", values.lname);
    formdata.append("email", values.email);
    formdata.append("password", values.password);
    formdata.append("password_confirmation", values.password_confirmation);
    formdata.append("phone", values.phone);
    formdata.append("linkedin_url", values.linkedin_url);
    formdata.append("country_id", values.country.value);
    formdata.append("type", type);

    values.languages.forEach((lang) =>
      formdata.append("languages[]", lang.value)
    );

    values.activity_area_ids.forEach((id) =>
      formdata.append("activity_area_ids[]", id)
    );

    mutate(formdata, {
      async onSuccess() {
        const data = await loginApi({
          email: values.email,
          password: values.password,
        });

        if (data) {
          const userData: { user: User; token: string } = data.data;
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
        toast.error(errorMessage, { duration: 9000 });
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
        <Row>
          <Col md={6}>
            <div id="signup-form-group">
              <label>Prénom</label>
              <input type="text" {...register("fname")} />
              {errors.fname && (
                <span id="signup-error-message">{errors.fname.message}</span>
              )}
            </div>
          </Col>

          <Col md={6}>
            <div id="signup-form-group">
              <label>Nom</label>
              <input type="text" {...register("lname")} />
              {errors.lname && (
                <span id="signup-error-message">{errors.lname.message}</span>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <div id="signup-form-group">
              <label>Email</label>
              <input type="email" {...register("email")} />
              {errors.email && (
                <span id="signup-error-message">{errors.email.message}</span>
              )}
            </div>
          </Col>

          <Col md={6}>
            <div id="signup-form-group">
              <label>Téléphone</label>
              <input type="text" {...register("phone")} />
              {errors.phone && (
                <span id="signup-error-message">{errors.phone.message}</span>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <div id="">
              <label htmlFor="linkedin_url" className="form-label">
                LinkedIn Profile
              </label>
              <div className="input-group mb-5">
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://www.linkedin.com/in/your-username"
                  {...register("linkedin_url")}
                />
              </div>

              {errors.linkedin_url && (
                <span id="signup-error-message">
                  {errors.linkedin_url.message}
                </span>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <CountriesSelect
              control={control}
              errors={errors}
              label="Pays"
              colXS={12}
              colMD={12}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <SelectComponent
              control={control as any}
              data={activities}
              errors={errors}
              label="Secteurs d’activité"
              name="activity_area_ids"
              colXS={12}
              colMD={12}
              isLoading={loadingActivities}
              noOptionMessage="Aucune activité disponible"
              saveOnlyValue
              required
              isMulti
            />
          </Col>

          <Col md={6}>
            <SelectComponent
              control={control as any}
              data={[
                { label: "Arabic", value: "ar" },
                { label: "French", value: "fr" },
                { label: "English", value: "en" },
              ]}
              errors={errors}
              label="Langues"
              name="languages"
              colXS={12}
              colMD={12}
              isMulti
              required
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
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
          </Col>

          <Col md={6}>
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
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <span id="signup-error-message">
                  {errors.password_confirmation.message}
                </span>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <div id="signup-terms-group">
              <input type="checkbox" {...register("terms")} />
              <label>
                J'accepte les{" "}
                <Link to="/privacy-policy" target="_blank">
                  Conditions générales
                </Link>
              </label>
              {errors.terms && (
                <span id="signup-error-message">{errors.terms.message}</span>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <button type="submit" id="signup-submit-button">
              {isLoading ? "Enregistrement..." : "S'inscrire"}
            </button>
          </Col>
        </Row>
      </form>
    </div>
  );
}
