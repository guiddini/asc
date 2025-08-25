import { useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { registerOnPressConferenceApi } from "../../../apis/press-conference";
import toast from "react-hot-toast";

// Props for the Modal Component
interface SignupPressConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Error Component
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <span id="error-message">{message}</span>;
};

// Validation Schema using Yup
const validationSchema = Yup.object({
  lname: Yup.string().required("Le nom est requis."),
  fname: Yup.string().required("Le prénom est requis."),
  email: Yup.string()
    .email("Adresse e-mail invalide.")
    .required("L'e-mail est requis."),
  phone: Yup.string()
    .min(4, "Le numéro de téléphone est requis.")
    .required("Le numéro de téléphone est requis."),
  type: Yup.string().required("Veuillez sélectionner une option."),

  type_other: Yup.string().when("type", {
    is: (e) => e === "autre",
    then: () => Yup.string().required("ce champ est requis"),
    otherwise: (schema) => schema.notRequired(),
  }),
  distinguished: Yup.string().required("Ce champ est requis."),
  terms: Yup.boolean().oneOf(
    [true],
    "Vous devez accepter les conditions générales."
  ),
});

type schemaType = Yup.InferType<typeof validationSchema>;

export default function SignupPressConferenceModal({
  isOpen,
  onClose,
}: SignupPressConferenceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { type } = watch();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: FormData) => registerOnPressConferenceApi(data),
    mutationKey: ["register-press-conference"],
  });

  // Form submit handler
  const onSubmit = (data: schemaType) => {
    const formdata = new FormData();
    formdata.append("fname", data?.fname);
    formdata.append("lname", data?.lname);
    formdata.append("email", data?.email);
    formdata.append("phone_number", data?.phone);
    if (data?.type === "autre") {
      formdata.append("occupation", data?.type_other);
      formdata.append("occupation_place", data?.distinguished);
    } else {
      formdata.append("occupation", data?.type);
      formdata.append("occupation_place", data?.distinguished);
    }

    mutate(formdata, {
      onSuccess: () => {
        toast.success(
          "Merci de votre inscription! Vous receverez une confirmation par émail prochainement"
        );
        reset();
        onClose();
      },
      onError: (error) => {
        toast.error(
          "Une erreur s'est produite lors de votre inscription. Veuillez réessayer."
        );
      },
    });
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="signup-press-conference-overlay">
      <div id="signup-press-conference-modal" ref={modalRef}>
        <div id="signup-press-conference-header">
          <h2>Confirmez votre Inscription</h2>
          <button onClick={onClose} id="signup-press-conference-close">
            ×
          </button>
        </div>

        <form
          id="signup-press-conference-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div id="signup-press-conference-name-row">
            <div className="form-group">
              <label htmlFor="lname">Nom</label>
              <input
                type="text"
                id="lname"
                placeholder="Nom"
                {...register("lname")}
              />
              <ErrorMessage message={errors.lname?.message} />
            </div>
            <div className="form-group">
              <label htmlFor="fname">Prénom</label>
              <input
                type="text"
                id="fname"
                placeholder="Prénom"
                {...register("fname")}
              />
              <ErrorMessage message={errors.fname?.message} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Entrez votre Email"
              {...register("email")}
            />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Numéro de téléphone</label>
            <input
              type="tel"
              id="phone"
              placeholder="Entrez votre Numéro de téléphone"
              {...register("phone")}
            />
            <ErrorMessage message={errors.phone?.message} />
          </div>

          <div id="signup-press-conference-select-row">
            <div className="form-group">
              <label htmlFor="type">Vous êtes ?</label>
              <select id="type" {...register("type")} defaultValue="">
                <option value="" disabled>
                  Sélectionnez une option
                </option>
                <option value="entreprise">Entreprise</option>
                <option value="startup">Startup</option>
                <option value="etudiant">Étudiant</option>
                <option value="influenceur">Influenceur</option>
                <option value="autre">Autre</option>
              </select>
              <ErrorMessage message={errors.type?.message} />
            </div>

            {type === "autre" && (
              <div className="form-group">
                <label htmlFor="type_other">Entrez votre type</label>
                <input
                  id="type_other"
                  placeholder=""
                  {...register("type_other")}
                />

                <ErrorMessage message={errors.type_other?.message} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="distinguished">Nom de l'institution</label>
              <input
                id="distinguished"
                placeholder=""
                {...register("distinguished")}
              />

              <ErrorMessage message={errors.distinguished?.message} />
            </div>
          </div>

          <div id="signup-press-conference-terms">
            <label className="checkbox-container">
              <input type="checkbox" {...register("terms")} />
              <span className="checkmark"></span>
              <span className="terms-text">
                J'ai lu et j'accepte les{" "}
                <a href="/terms" className="terms-link">
                  Conditions générales
                </a>
              </span>
            </label>
          </div>
          <ErrorMessage message={errors.terms?.message} />

          <button type="submit" id="signup-press-conference-submit">
            Inscrire à l'événement
          </button>
        </form>
      </div>
    </div>
  );
}
