import { useAuth } from "../core/Auth";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
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
import { KTIcon } from "../../../../_metronic/helpers";

// ----------------- Schemas -----------------
const step1Schema = yup.object({
  fname: yup.string().required("First name is required."),
  lname: yup.string().required("Last name is required."),
  email: yup.string().email().required("Email is required."),
  phone: yup.string().required("Phone number is required."),
  password: yup.string().required().min(8, "Minimum 8 characters."),
  password_confirmation: yup
    .string()
    .required("Password confirmation is required.")
    .oneOf([yup.ref("password")], "Passwords must match."),
});

const step2Schema = yup.object({
  linkedin_url: yup.string().url().notRequired(),
  country: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required("Country is required."),
  activity_area_ids: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one industry sector is required."),
  languages: yup
    .array()
    .of(
      yup.object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, "At least one language is required."),
  job_title: yup.string().required("Job title is required."),
  company_name: yup.string().required("Company description is required."),
  participation_goals: yup
    .array()
    .of(
      yup.object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, "Participation goal is required."),
  about_you: yup.string().required("About you is required."),
  terms: yup.boolean().oneOf([true], "You must accept the terms."),
});

type SignupProps = yup.InferType<typeof step1Schema> &
  yup.InferType<typeof step2Schema>;

// ----------------- Component -----------------
export default function SignupPage() {
  const { saveAuth, setCurrentUser } = useAuth();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading: loadingActivities } = useQuery({
    queryKey: ["get-activities"],
    queryFn: async () => await getAllActivitiesApi(),
  });

  const activities = data?.data?.map((item: activity) => ({
    label: item.label_en,
    value: item.id,
  }));

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  const { mutate, isLoading } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: FormData) => await regiterApi(data),
  });

  // ✅ Résolveur dynamique
  const currentSchema = useMemo(
    () => (step === 1 ? step1Schema : step2Schema),
    [step]
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm<SignupProps>({
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
      job_title: "",
      company_name: "",
      participation_goals: [],
      about_you: "",
    },
    resolver: yupResolver(currentSchema as any),
    mode: "onChange",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Validation Step 1
  const validateStep1 = async (): Promise<boolean> => {
    const values = getValues();
    try {
      await step1Schema.validate(values, { abortEarly: false });
      return true;
    } catch {
      await trigger([
        "fname",
        "lname",
        "email",
        "phone",
        "password",
        "password_confirmation",
      ]);
      return false;
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("avatar" as any, file, { shouldValidate: true });
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const signupFun = async (values: SignupProps) => {
    console.log("➡️ signupFun called with values:", values);

    const formdata = new FormData();
    formdata.append("fname", values.fname);
    formdata.append("lname", values.lname);
    formdata.append("email", values.email);
    formdata.append("password", values.password);
    formdata.append("password_confirmation", values.password_confirmation);
    formdata.append("phone", values.phone);
    if (values?.linkedin_url) {
      formdata.append("linkedin_url", values.linkedin_url);
    }
    if (values.country?.value)
      formdata.append("country_id", values.country.value);
    formdata.append("job_title", values.job_title);
    formdata.append("company_name", values.company_name);

    // Extraire les valeurs des objets participation_goals
    values.participation_goals.forEach((goal: any) =>
      formdata.append("participation_goals[]", goal.value)
    );

    formdata.append("about_you", values.about_you);
    formdata.append("type", type);

    values.languages.forEach((lang: any) =>
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
          const { can, rules } = new AbilityBuilder(Ability);
          userData.user.permissions?.forEach((permission) => {
            const [action, entity] = permission?.name.split("_");
            can(action, entity);
            ability.update(rules);
          });
          dispatch(setReduxCurrentUser(userData));
          saveAuth(userData.token);
          setCurrentUser(userData.user);
          navigate("/home");
        }
      },
      onError(error: AxiosError<BackendError>) {
        const msg = error.response?.data
          ? getServerErrorResponseMessage(error.response.data)
          : "An error occurred.";
        toast.error(msg, { duration: 9000 });
      },
    });
  };

  return (
    <div id="signup-form-container">
      <h2>Sign Up</h2>
      <p id="signup-form-subtitle">
        Already have an account?{" "}
        <Link to="/auth/login" id="signup-highlight-link">
          Login
        </Link>
      </p>

      <form id="signup-auth-form" onSubmit={handleSubmit(signupFun)}>
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Row>
              <Col md={6}>
                <div id="signup-form-group">
                  <label>First Name</label>
                  <input type="text" {...register("fname")} />
                  {errors.fname && (
                    <span id="signup-error-message">
                      {errors.fname.message}
                    </span>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div id="signup-form-group">
                  <label>Last Name</label>
                  <input type="text" {...register("lname")} />
                  {errors.lname && (
                    <span id="signup-error-message">
                      {errors.lname.message}
                    </span>
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
                    <span id="signup-error-message">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div id="signup-form-group">
                  <label>Phone</label>
                  <input type="text" {...register("phone")} />
                  {errors.phone && (
                    <span id="signup-error-message">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <div id="signup-form-group">
                  <label>Password</label>
                  <div id="signup-password-input">
                    <input
                      type={showPassword ? "text" : "password"}
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
                    <span id="signup-error-message">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div id="signup-form-group">
                  <label>Confirm Password</label>
                  <div id="signup-password-input">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("password_confirmation")}
                    />
                    <button
                      type="button"
                      id="signup-toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                <button
                  type="button"
                  id="signup-submit-button"
                  onClick={async () => {
                    const ok = await validateStep1();
                    if (ok) setStep(2);
                  }}
                >
                  Next
                </button>
              </Col>
            </Row>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Row>
              <Col md={12}>
                <div id="signup-form-group">
                  <label>LinkedIn Profile</label>
                  <input type="url" {...register("linkedin_url")} />
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
                  label="Country"
                  colXS={12}
                  colMD={12}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <SelectComponent
                  control={control}
                  data={activities || []}
                  errors={errors}
                  label="Industry Sectors"
                  name="activity_area_ids"
                  colXS={12}
                  colMD={12}
                  isLoading={loadingActivities}
                  noOptionMessage="No activities available"
                  saveOnlyValue
                  required
                  isMulti
                />
              </Col>
              <Col md={6}>
                <SelectComponent
                  control={control}
                  data={[
                    { label: "Arabic", value: "ar" },
                    { label: "French", value: "fr" },
                    { label: "English", value: "en" },
                  ]}
                  errors={errors}
                  label="Languages"
                  name="languages"
                  colXS={12}
                  colMD={12}
                  isMulti
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div id="signup-form-group">
                  <label>Job Title</label>
                  <input type="text" {...register("job_title")} />
                  {errors.job_title && (
                    <span id="signup-error-message">
                      {errors.job_title.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div id="signup-form-group">
                  <label>Company</label>
                  <input type="text" {...register("company_name")} />
                  {errors.company_name && (
                    <span id="signup-error-message">
                      {errors.company_name.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <SelectComponent
                  control={control}
                  data={[
                    { label: "Networking", value: "Networking" },
                    { label: "B2B Meeting", value: "B2B Meeting" },
                    {
                      label: "Looking for Investors",
                      value: "Looking for Investors",
                    },
                    {
                      label: "Partnership Opportunities",
                      value: "Partnership Opportunities",
                    },
                    {
                      label: "Investing in Startups",
                      value: "Investing in Startups",
                    },
                    { label: "Media Coverage", value: "Media Coverage" },
                  ]}
                  errors={errors}
                  label="Participation Goals"
                  name="participation_goals"
                  colXS={12}
                  colMD={12}
                  isMulti
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div id="signup-form-group">
                  <label>About You</label>
                  <textarea {...register("about_you")} />
                  {errors.about_you && (
                    <span id="signup-error-message">
                      {errors.about_you.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>

            {/* Champ d'avatar caché */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
              accept="image/*"
            />

            <Row>
              <Col md={12}>
                <div id="signup-terms-group">
                  <input type="checkbox" {...register("terms")} />
                  <label>
                    I agree to the{" "}
                    <Link to="/privacy-policy" target="_blank">
                      Terms and Conditions
                    </Link>
                  </label>
                  {errors.terms && (
                    <span id="signup-error-message">
                      {errors.terms.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <button
                  type="button"
                  id="signup-submit-button"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </Col>
              <Col md={6}>
                <button
                  type="submit"
                  id="signup-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Sign Up"}
                </button>
              </Col>
            </Row>
          </>
        )}
      </form>
    </div>
  );
}
