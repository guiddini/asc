import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { createCompanyProps } from "../../types/company";
import { useCompany } from "../../hooks";
import { useAuth } from "../../modules/auth";
import {
  CommuneSelect,
  CountriesSelect,
  InputComponent,
  SelectComponent,
  WillayasSelect,
} from "..";
import { Col, Row } from "react-bootstrap";
import { errorResponse } from "../../types/responses";
import backendErrorHandler from "../../utils/backend-error-handler";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";

export const CreateCompanyForm = ({ next }: { next: () => void }) => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const createCompanySchema = yup.object().shape({
    name: yup.string().required("Le nom est requis"),
    legal_status: yup.string().required("Le statut juridique est requis"),
    country: yup
      .object()
      .shape({
        label: yup.string().required("Le pays est requis"),
        value: yup.string().required("La valeur du pays est requise"),
      })
      .required("Le pays est requis"),

    wilaya: yup.mixed().when("country", {
      is: (e) => e && e.label === "Algérie",
      then: () =>
        yup
          .object()
          .shape({
            label: yup.string().required("La wilaya est requise"),
            value: yup.string().required("La valeur de la wilaya est requise"),
          })
          .required("La wilaya est requise")
          .typeError("La wilaya est requise"),
      otherwise: (schema) => schema.notRequired(),
    }),

    commune: yup.mixed().when("country", {
      is: (e) => e && e.label === "Algérie",
      then: () =>
        yup
          .object()
          .shape({
            label: yup.string().required("La commune est requise"),
            value: yup.string().required("La valeur de la commune est requise"),
          })
          .required("La commune est requise")
          .typeError("La commune est requise"),
      otherwise: (schema) => schema.notRequired(),
    }),

    address: yup.string().required("L'adresse est requise"),
    phone_1: yup.string().required("Le téléphone 1 est requis"),
    email: yup.string().email("Email invalide").required("L'e-mail est requis"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
  } = useForm<any>({
    resolver: yupResolver(createCompanySchema),
    defaultValues: {},
  });

  const { createCompanyMutate, isCreatingCompany } = useCompany();

  const is_algeria = watch("country")?.label === "Algérie" ? true : false;
  const willaya_id = watch("wilaya")?.value || null;

  const createCompanyFun = async (data: createCompanyProps) => {
    const formdata = new FormData();
    formdata.append("logo", data.logo);
    formdata.append("name", data.name);
    formdata.append("legal_status", data.legal_status);
    formdata.append("country_id", String(data.country?.value));
    data.wilaya?.value &&
      formdata.append("wilaya_id", String(data.wilaya?.value));
    data.commune?.value &&
      formdata.append("commune_id", String(data.commune?.value));
    formdata.append("address", data.address);
    formdata.append("phone_1", data.phone_1);
    formdata.append("email", data.email);
    formdata.append("user_id", String(user?.id));

    createCompanyMutate(formdata, {
      onSuccess: (data) => {
        next();
      },
      onError: (error) => {
        const backendError = error as errorResponse;
        backendErrorHandler(setError, backendError);

        toast.error(
          `Une erreur est survenue lors de la création de l'entreprise : ${backendError?.response?.data?.message}`
        );
      },
    });
  };

  const logo = watch("logo") as File;

  return (
    <>
      <Row xs={12} md={12}>
        <Col xs={12} md={12} className="mb-8">
          <>
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold required`}>Logo</span>
            </label>
            <input
              type="file"
              name="logo-file"
              id="logo-file"
              accept="image/png, image/jpg, image/jpeg"
              className="avatar-inputfile"
              onChange={(e) => {
                setValue("logo", e.target.files[0]);
              }}
            />

            {logo === undefined || logo === null ? (
              <label htmlFor="logo-file">
                <span className="text-white m-auto text-center">
                  Sélectionner un fichier
                </span>
              </label>
            ) : (
              <div id="avatar-image" className="position-relative">
                <img
                  src={URL?.createObjectURL(logo)}
                  className="w-100 h-100"
                  id="avatar-image-preview"
                />

                <i
                  className={`ki-duotone ki-trash fs-1 me-5 position-absolute text-danger bg-light rounded-3 end-0 bottom-0 cursor-pointer`}
                  onClick={() => {
                    setValue("logo", undefined);
                  }}
                >
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                  <span className="path4"></span>
                  <span className="path5"></span>
                </i>
              </div>
            )}
          </>
        </Col>

        <InputComponent
          control={control as any}
          name="name"
          errors={errors}
          label="Nom de l'entreprise"
          type="text"
          colMD={6}
          colXS={12}
        />

        <SelectComponent
          control={control as any}
          name="legal_status"
          errors={errors}
          label="Statut juridique"
          colMD={6}
          colXS={12}
          data={[
            {
              label: "EURL",
              value: "EURL",
            },
            {
              label: "SARL",
              value: "SARL",
            },
            {
              label: "SPA",
              value: "SPA",
            },
            {
              label: "SNC",
              value: "SNC",
            },
            {
              label: "SCS",
              value: "SCS",
            },
            {
              label: "SCA",
              value: "SCA",
            },
            {
              label: "Personne physique",
              value: "Personne physique",
            },
            {
              label: "SPAS",
              value: "SPAS",
            },
            {
              label: "SPASU",
              value: "SPASU",
            },
            {
              label: "Association",
              value: "Association",
            },
            {
              label: "Banque",
              value: "Banque",
            },
            {
              label: "Assurance",
              value: "Assurance",
            },
            {
              label: "Projet innovant labélisé",
              value: "Projet innovant labélisé",
            },
            {
              label: "Institution publique",
              value: "Institution Publique",
            },
          ]}
          noOptionMessage="Rien trouvé"
          saveOnlyValue
          required
        />

        <CountriesSelect
          control={control as any}
          errors={errors}
          colXS={12}
          colMD={6}
        />

        {is_algeria ? (
          <>
            <WillayasSelect
              control={control as any}
              errors={errors}
              colXS={12}
              colMD={6}
            />

            <CommuneSelect
              willaya_id={willaya_id}
              control={control as any}
              errors={errors}
              colXS={12}
              colMD={6}
              key={willaya_id}
            />

            <InputComponent
              control={control as any}
              name="address"
              errors={errors}
              label="Adresse"
              type="text"
              colMD={6}
              colXS={12}
            />
          </>
        ) : (
          <>
            <InputComponent
              control={control as any}
              errors={errors}
              label="Adresse complète"
              name="address"
              type="text"
              required
              colXS={12}
              colMD={6}
            />
          </>
        )}

        <InputComponent
          control={control as any}
          name="phone_1"
          errors={errors}
          label="Téléphone N1"
          type="number"
          colMD={6}
          colXS={12}
        />

        <InputComponent
          control={control as any}
          name="email"
          errors={errors}
          label="E-mail"
          type="email"
          colMD={6}
          colXS={12}
        />

        {/* <TextAreaComponent
    control={control as any}
    name="description"
    errors={errors}
    label="Description"
    colMD={12}
    colXS={12}
  /> */}
      </Row>
      <div className="d-flex flex-row align-items-center justify-content-end mt-6">
        <button
          type="button"
          id="kt_sign_in_submit"
          className="btn btn-custom-purple-dark text-white"
          disabled={isCreatingCompany}
          onClick={handleSubmit(createCompanyFun)}
        >
          {!isCreatingCompany && <span className="indicator-label">Créer</span>}
          {isCreatingCompany && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Veuillez patienter...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </>
  );
};
