import { useForm } from "react-hook-form";
import {
  CommuneSelect,
  CountriesSelect,
  InputComponent,
  SelectComponent,
  TextAreaComponent,
  TextEditor,
  WillayasSelect,
} from "../../../components";
import { Col, Row, Spinner } from "react-bootstrap";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { getCompanyApi, updateCompanyApi } from "../../../apis";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { useEffect, useMemo } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import clsx from "clsx";
import htmlToDraftBlocks from "../../../helpers/htmlToDraftJS";
import toast from "react-hot-toast";
import { useCompanyRedirect } from "../../../hooks/useCompanyRedirect";
import { CompanyDetailProps } from "../../../types/company";

const UpdateCompanyPage = () => {
  const { id } = useParams();
  useCompanyRedirect({
    companyId: id,
    restrictForStaff: true,
  });
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      return await getCompanyApi(id);
    },
  });

  const defaultCountry = {
    label: data?.data?.country?.name_fr,
    value: data?.data?.country?.id,
  };

  const defaultCommune = {
    label: data?.data?.commune?.name,
    value: data?.data?.commune?.id,
  };

  const defaultWillaya = {
    label: data?.data?.wilaya?.name,
    value: data?.data?.wilaya?.id,
  };

  const defaultLegalStatus = {
    label: data?.data.legal_status,
    value: data?.data.legal_status,
  };

  const DEFAULT_VALUES: CompanyDetailProps = useMemo(() => {
    if (!isLoading) {
      return {
        ...data?.data,
        desc:
          data?.data?.description === null
            ? "Découvrez notre histoire et notre engagement envers nos clients."
            : data?.data?.description,
        description:
          data?.data?.description === null
            ? ""
            : htmlToDraftBlocks(data?.data?.description),
        header_text:
          data?.data?.header_text || `Bienvenue chez ${data?.data?.name}`,
        quote_author: data?.data?.quote_author || `CEO de l'entreprise`,
        quote_text:
          data?.data?.quote_text ||
          "L'excellence n'est pas une action, mais une habitude.",
        team_text:
          data?.data?.team_text ||
          "Rencontrez l'équipe dévouée qui rend tout cela possible.",
        legal_status: defaultLegalStatus,
        country: defaultCountry,
        wilaya: defaultWillaya,
        commune: defaultCommune,
      };
    }
  }, [data]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<any>({
    // resolver: yupResolver(createCompanySchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateCompanyApi(data);
    },
  });

  const is_algeria = watch("country")?.label === "Algérie" ? true : false;
  const willaya_id = watch("wilaya")?.value || null;

  const logo = watch("logo") as File;
  const watched_header_image = watch("header_image");
  const header_image = useMemo(() => {
    if (data?.data) {
      if (watched_header_image) {
        switch (typeof watched_header_image) {
          case "string":
            return getMediaUrl(watched_header_image);

          default:
            return URL?.createObjectURL(watched_header_image);
        }
      } else {
        return toAbsoluteUrl("/media/stock/1600x800/img-1.jpg");
      }
    }
  }, [watched_header_image]);

  useEffect(() => {
    if (reset) {
      reset(DEFAULT_VALUES);
    }
  }, [DEFAULT_VALUES?.id, reset, id]);

  const isValidValue = (value: any): boolean =>
    value !== null &&
    value !== "null" &&
    value !== undefined &&
    value !== "undefined";

  const handleUpdate = async (data: any) => {
    const formData = new FormData();

    // Use helper function for each field
    if (isValidValue(data?.logo) && typeof data?.logo !== "string") {
      formData.append("logo", data.logo);
    }

    if (
      isValidValue(data?.header_image) &&
      typeof data?.header_image !== "string"
    ) {
      formData.append("header_image", data.header_image);
    }

    if (isValidValue(data?.name)) {
      formData.append("name", data.name);
    }

    if (isValidValue(data?.address)) {
      formData.append("address", data.address);
    }

    if (isValidValue(data?.email)) {
      formData.append("email", data.email);
    }

    if (isValidValue(data?.header_text)) {
      formData.append("header_text", data.header_text);
    }

    if (isValidValue(data?.description)) {
      formData.append("description", data.desc);
    }

    if (isValidValue(data?.quote_author)) {
      formData.append("quote_author", data.quote_author);
    }

    if (isValidValue(data?.quote_text)) {
      formData.append("quote_text", data.quote_text);
    }

    if (isValidValue(data?.team_text)) {
      formData.append("team_text", data.team_text);
    }

    if (isValidValue(data?.phone_1)) {
      formData.append("phone_1", data.phone_1);
    }

    formData.append("company_id", id);

    if (isValidValue(data?.country?.value)) {
      formData.append("country_id", data.country?.value);
    }

    if (isValidValue(data?.wilaya?.value)) {
      formData.append("wilaya_id", data.wilaya?.value);
    }

    if (isValidValue(data?.commune?.value)) {
      formData.append("commune_id", data.commune?.value);
    }

    if (isValidValue(data?.legal_status)) {
      formData.append(
        "legal_status",
        data.legal_status?.value ? data.legal_status?.value : data.legal_status
      );
    }

    mutate(formData, {
      onSuccess() {
        toast.success("L'entreprise a été mise à jour avec succès");
      },
      onError(error) {
        toast.error("Erreur lors de la mise à jour de l'entreprise");
      },
    });
  };

  return (
    <div className="card">
      <PageTitle>Modifier l'entreprise</PageTitle>
      <div className="card-body">
        {isLoading ? (
          <div
            style={{
              height: "70vh",
            }}
            className="w-100 d-flex justify-content-center align-items-center bg-white"
          >
            <Spinner animation="border" color="#000" />
          </div>
        ) : (
          <Row className="mx-auto">
            <Col xs={12} md={12} className="mb-8">
              <div id="company-logo-wrapper">
                <label id="company-logo-label">
                  Logo <span id="company-logo-required">*</span>
                </label>

                <div id="company-logo-upload-container">
                  <input
                    type="file"
                    name="logo-file"
                    id="company-logo-input"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setValue("logo", e.target.files[0]);
                      }
                    }}
                  />

                  <label htmlFor="company-logo-input" id="company-logo-circle">
                    {logo === undefined || logo === null ? (
                      <span id="company-logo-text">
                        Sélectionnez un fichier
                      </span>
                    ) : (
                      <img
                        src={
                          typeof logo === "string"
                            ? getMediaUrl(data?.data?.logo)
                            : URL.createObjectURL(logo)
                        }
                        alt="Company logo"
                        id="company-logo-preview"
                      />
                    )}
                  </label>

                  {logo && (
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
                  )}
                </div>
              </div>
            </Col>

            <InputComponent
              control={control as any}
              name="name"
              errors={errors}
              label="Nom"
              type="text"
              colMD={6}
              colXS={12}
            />

            <SelectComponent
              control={control as any}
              name="legal_status"
              errors={errors}
              label="Statut Juridique"
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
              defaultValue={defaultLegalStatus}
            />

            <CountriesSelect
              control={control as any}
              errors={errors}
              colXS={12}
              colMD={6}
              defaultValue={defaultCountry}
            />

            {is_algeria ? (
              <>
                <WillayasSelect
                  control={control as any}
                  errors={errors}
                  colXS={12}
                  colMD={6}
                  defaultValue={defaultWillaya}
                />

                <CommuneSelect
                  willaya_id={willaya_id}
                  control={control as any}
                  errors={errors}
                  colXS={12}
                  colMD={6}
                  key={willaya_id}
                  defaultValue={defaultCommune}
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
              label="Email"
              type="email"
              colMD={6}
              colXS={12}
            />

            <div className="separator my-4"></div>

            <h2 className="mb-3">- En-tête :</h2>

            <TextAreaComponent
              control={control as any}
              name="header_text"
              errors={errors}
              label="Texte de l'en-tête"
              colMD={12}
              colXS={12}
              required
            />

            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold`}>Image d'en-tête :</span>
            </label>
            <div className="overlay d-flex flex-row align-items-center justify-content-center">
              <img
                className="card-rounded mx-auto w-100"
                src={header_image}
                style={{
                  minHeight: "50vh",
                  maxHeight: "70vh",
                  objectFit: "cover",
                  aspectRatio: "16/9",
                }}
                alt=""
              />
              <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                <label htmlFor="header_image">
                  <span className="text-white m-auto text-center btn btn-primary">
                    Télécharger l'image
                  </span>

                  <input
                    type="file"
                    name="file"
                    id="header_image"
                    accept="image/png, image/jpg, image/jpeg"
                    className="btn btn-primary"
                    onChange={(e) =>
                      setValue("header_image", e.target.files[0])
                    }
                  />
                </label>
              </div>
            </div>

            <div className="notice d-flex bg-light-danger rounded border-danger border border-dashed mb-12 p-6 my-6">
              <div className="d-flex flex-stack flex-grow-1 ">
                <div className=" fw-semibold">
                  <h4 className="text-gray-900 fw-bold text-center">
                    L'image d'en-tête doit avoir un format d'image 16:9 !
                  </h4>
                </div>
              </div>
            </div>

            <div className="fs-5 fw-semibold text-gray-600">
              <p
                dangerouslySetInnerHTML={{
                  __html: watch("desc"),
                }}
                className={clsx("mb-8 p-2 border border-primary")}
              />

              <TextEditor
                control={control as any}
                name="description"
                setValue={setValue}
                withPreview={false}
              />
            </div>

            <div className="d-flex flex-row align-items-center justify-content-between mt-6">
              <button
                type="button"
                className="btn btn-custom-blue-dark text-white"
                onClick={() => navigate(-1)}
              >
                <span className="indicator-label">Retour</span>
              </button>
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-custom-purple-dark text-white"
                disabled={isUpdating}
                onClick={handleSubmit(handleUpdate)}
              >
                {!isUpdating && (
                  <span className="indicator-label">Mettre à jour</span>
                )}
                {isUpdating && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Veuillez patienter...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </Row>
        )}
      </div>
    </div>
  );
};

export { UpdateCompanyPage };
