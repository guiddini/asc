import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Trash2 } from "lucide-react";
import { Row } from "react-bootstrap";
import { SelectComponent } from "../../components";
import ExhibitionNav from "./components/exhibition-nav";
import { useNavigate } from "react-router-dom";
import {
  getImagesForStandType,
  spaceOptions,
  StandsTypes,
} from "../../utils/standsData";
import { calculatePricing } from "../../utils/stands-pricing";
import { createOrUpdateCompanyApi } from "../../apis";
import getMediaUrl from "../../helpers/getMediaUrl";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { useQuery } from "react-query";
import { checkExhibitionDemandTransactionApi } from "../../apis/exhibition";

// Validation schema in French using Yup
const ExhibitionSchema = Yup.object().shape({
  logo: Yup.mixed().test(
    "fileType",
    "Seuls les fichiers image (JPEG, PNG, JPG) sont acceptés.",
    (value) => {
      if (!value) return false; // Allow empty value
      if (value instanceof File) {
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
      return true; // For existing logos that might not be File objects
    }
  ),
  companyName: Yup.string()
    .required("Le nom de l'entreprise est requis.")
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères.")
    .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères."),
  phoneNumber: Yup.string()
    .required("Le numéro de téléphone est requis.")
    .matches(
      /^[0-9+\-().\s]+$/,
      "Veuillez entrer un numéro de téléphone valide."
    ),
  standType: Yup.object()
    .shape({
      label: Yup.string().required("Le type de stand est requis."),
      value: Yup.string().required("Le type de stand est requis."),
    })
    .required("Le type de stand est requis."),
  spaceSize: Yup.object()
    .shape({
      label: Yup.string().required("La taille de l'espace est requise."),
      value: Yup.string().required("La taille de l'espace est requise."),
    })
    .required("La taille de l'espace est requise."),
});

type RequestPageProps = Yup.InferType<typeof ExhibitionSchema>;

const ExhibitionRequest = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoChanged, setLogoChanged] = useState(false);
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();

  const { data: hasDemand } = useQuery(
    "checkExhibitionDemand",
    async () => {
      const res = await checkExhibitionDemandTransactionApi();
      return res?.data || false;
    },
    {
      retry: 1,
      onError: (error) => {
        console.error("Error checking exhibition demand:", error);
      },
    }
  );

  if (hasDemand) {
    navigate("/company/stand/reservations");
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RequestPageProps>({
    resolver: yupResolver(ExhibitionSchema), // Use the Yup schema resolver
  });

  useEffect(() => {
    if (user?.company) {
      setValue("companyName", user.company.name || "");
      setValue("phoneNumber", user.company.phone_1 || "");
      if (user.company.logo) {
        setValue("logo", user.company.logo);
        setLogoPreview(getMediaUrl(user.company.logo));
      }
    }
  }, [user, setValue]);

  const watchStandType = watch("standType");

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setValue("logo", file);
        setLogoChanged(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Show an error message
        alert("Seuls les fichiers image (JPEG, PNG, JPG) sont acceptés.");
        // Clear the file input
        event.target.value = "";
      }
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setValue("logo", undefined);
    setLogoChanged(true);
  };

  const onSubmit = async (data: RequestPageProps) => {
    try {
      const formData = new FormData();
      if (logoChanged) {
        // formData.append("logo", data?.logo);
      }
      formData.append("name", data.companyName);
      formData.append("phone_1", data.phoneNumber);

      const response = await createOrUpdateCompanyApi(formData);
      const companyId = response?.data?.company?.id;

      const pricing = calculatePricing({
        standType: data.standType.value,
        spaceSize: data.spaceSize.value,
      });

      navigate(`/exhibition/confirm/${companyId}`, {
        state: {
          standType: data.standType,
          spaceSize: data.spaceSize,
          pricing,
        },
      });
    } catch (error) {
      console.error("Error creating company:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div id="exhibition-request-page">
      <div id="exhibition-request-container">
        <ExhibitionNav />

        <main id="exhibition-request-content">
          <div id="exhibition-request-title">
            <span id="label">DEVENIR EXPOSANT</span>
            <h1>
              Réservez votre{" "}
              <span id="exhibition-request-highlight">Espace</span> et
              <br />
              développez votre activité
            </h1>
            <p>
              Présentez votre entreprise et contactez un public plus large.
              Renseignez les informations relatives à votre entreprise et
              choisissez le stand idéal pour représenter votre entreprise lors
              de l'événement.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <section id="form-section">
              <h2>Informations sur l'entreprise</h2>

              <div id="form-group">
                <label id="form-label">
                  <span id="required-label">Logo</span>
                </label>
                <div id="logo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    id="logo-input"
                  />
                  <label htmlFor="logo-input" id="upload-area">
                    <i className="ki-duotone ki-file-up text-primary fs-3x">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                    <span>Téléchargez le logo de votre entreprise</span>
                  </label>
                  {errors.logo && (
                    <span id="error-message">{errors.logo.message}</span>
                  )}
                </div>
                {logoPreview && (
                  <div id="logo-preview-container">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      id="logo-preview"
                    />
                    <button
                      type="button"
                      onClick={handleLogoRemove}
                      id="remove-logo-button"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div
                id="form-group"
                style={{
                  marginTop: "8px",
                }}
              >
                <label htmlFor="companyName" id="form-label">
                  <span id="required-label">Nom de l'entreprise</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  {...register("companyName")}
                  placeholder="Nom de l'entreprise"
                />
                {errors.companyName && (
                  <span id="error-message">{errors.companyName.message}</span>
                )}
              </div>

              <div id="form-group">
                <label htmlFor="phoneNumber" id="form-label">
                  <span id="required-label">Numéro de téléphone</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  placeholder="Numéro de téléphone de l'entreprise"
                />
                {errors.phoneNumber && (
                  <span id="error-message">{errors.phoneNumber.message}</span>
                )}
              </div>
            </section>

            <section id="form-section">
              <h2>Détails de l'exposant</h2>

              <Row>
                <SelectComponent
                  name="standType"
                  control={control}
                  errors={errors}
                  label="Type de stand"
                  data={StandsTypes}
                  placeholder="Sélectionnez un type de stand"
                  required={true}
                  colXS={12}
                  colMD={12}
                />

                <SelectComponent
                  name="spaceSize"
                  control={control}
                  errors={errors}
                  key={watchStandType?.label}
                  label="Espace d'exposition souhaité"
                  disabled={!watchStandType}
                  data={
                    watchStandType
                      ? spaceOptions[
                          watchStandType.value as keyof typeof spaceOptions
                        ]
                      : []
                  }
                  placeholder="Sélectionnez une taille d'espace"
                  required={true}
                  colXS={12}
                  colMD={12}
                />
              </Row>

              {watchStandType ? (
                <div id="space-grid">
                  {getImagesForStandType(watchStandType.value).map(
                    (image, index) => (
                      <div key={index} id="space-item">
                        <img src={image} alt={`Space ${index + 1}`} />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div id="shimmer-container">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} id="shimmer-item"></div>
                  ))}
                </div>
              )}
            </section>

            <section id="form-section">
              <div id="form-actions">
                <button type="button" id="button-secondary">
                  Annuler
                </button>
                <button type="submit" id="button-primary">
                  Confirmer la réservation
                </button>
              </div>
            </section>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ExhibitionRequest;
