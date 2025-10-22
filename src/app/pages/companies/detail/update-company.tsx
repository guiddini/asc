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
import { useEffect, useMemo, useState } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import clsx from "clsx";
import htmlToDraftBlocks from "../../../helpers/htmlToDraftJS";
import toast from "react-hot-toast";
import { useCompanyRedirect } from "../../../hooks/useCompanyRedirect";
import { CompanyDetailProps } from "../../../types/company";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const updateCompanySchema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(255),
  address: Yup.string().nullable().max(255),
  city: Yup.string().nullable().max(255),
  email: Yup.string().nullable().email("Invalid email").max(255),
  header_text: Yup.string().nullable().max(5000),
  description: Yup.mixed().nullable(),
  quote_text: Yup.string().nullable().max(1000),
  quote_author: Yup.string().nullable().max(255),
  team_text: Yup.string().nullable().max(5000),
  country: Yup.object().shape({
    value: Yup.number().required(),
    label: Yup.string().required(),
  }),
  wilaya: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .nullable(),
  phone_1: Yup.string().nullable().max(255),
  label_number: Yup.string()
    .nullable()
    .matches(/^\d{10,11}$/, "Label number must be 10–11 digits"),
  activity_areas: Yup.array().of(Yup.string().max(255)).nullable(),
  founded_date: Yup.string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
        ? null
        : originalValue;
    })
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "The founded date field must be a valid date."
    ),
  logo: Yup.mixed().nullable(),
  header_image: Yup.mixed().nullable(),
});

type UpdateCompanyFormData = Yup.InferType<typeof updateCompanySchema>;

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
    label: data?.data?.country?.name_en,
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

  const DEFAULT_VALUES: CompanyDetailProps = useMemo(() => {
    if (!isLoading) {
      return {
        ...data?.data,
        desc:
          data?.data?.description === null
            ? "Discover our story and our commitment to our customers."
            : data?.data?.description,
        description:
          data?.data?.description === null
            ? ""
            : htmlToDraftBlocks(data?.data?.description),
        header_text:
          data?.data?.header_text || `Welcome to ${data?.data?.name}`,
        quote_author: data?.data?.quote_author || `Company CEO`,
        quote_text:
          data?.data?.quote_text || "Excellence is not an act, but a habit.",
        team_text:
          data?.data?.team_text ||
          "Meet the dedicated team that makes it all possible.",
        country: defaultCountry,
        wilaya: defaultWillaya,
        commune: defaultCommune,
        founded_date: data?.data?.founded_date || "",
        label_number: data?.data?.label_number || "",
        city: data?.data?.city || "",
        activity_areas: parseActivityAreas(data?.data?.activity_areas),
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
  } = useForm<UpdateCompanyFormData>({
    resolver: yupResolver(updateCompanySchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateCompanyApi(data);
    },
  });

  const is_algeria = watch("country")?.label === "Algeria" ? true : false;
  const willaya_id = watch("wilaya")?.value || null;

  const logo = watch("logo") as File;
  const watched_header_image = watch("header_image") as
    | File
    | string
    | undefined;
  const header_image = useMemo(() => {
    if (data?.data) {
      if (watched_header_image) {
        switch (typeof watched_header_image) {
          case "string":
            return getMediaUrl(watched_header_image as string);
          default:
            if (watched_header_image instanceof Blob) {
              return URL.createObjectURL(watched_header_image);
            }
            return toAbsoluteUrl("/media/stock/1600x800/img-1.jpg");
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

  function parseActivityAreas(v: any): string[] {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      const trimmed = v.trim();
      if (!trimmed) return [];
      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [trimmed];
    }
    return [];
  }

  const [activityInput, setActivityInput] = useState("");

  const handleUpdate = async (data: any) => {
    const formData = new FormData();

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

    // Added fields from API
    if (isValidValue(data?.founded_date)) {
      formData.append("founded_date", data.founded_date);
    }

    if (isValidValue(data?.label_number)) {
      formData.append("label_number", data.label_number);
    }

    if (isValidValue(data?.city)) {
      formData.append("city", data.city);
    }

    if (isValidValue(data?.activity_areas)) {
      if (Array.isArray(data.activity_areas)) {
        data.activity_areas.forEach((area: string, idx: number) => {
          formData.append(`activity_areas[${idx}]`, area);
        });
      } else {
        formData.append("activity_areas", data.activity_areas);
      }
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
        toast.success("Company updated successfully");
      },
      onError(error) {
        toast.error("Error updating company");
      },
    });
  };

  return (
    <div className="card">
      <PageTitle>Edit Company</PageTitle>
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
                      <span id="company-logo-text">Select a file</span>
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
              label="Name"
              type="text"
              colMD={6}
              colXS={12}
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

                <InputComponent
                  control={control as any}
                  name="city"
                  errors={errors}
                  label="City"
                  type="text"
                  colMD={6}
                  colXS={12}
                />

                <InputComponent
                  control={control as any}
                  name="address"
                  errors={errors}
                  label="Address"
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
                  label="Full Address"
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
              label="Phone 1"
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

            {/* Added fields from API */}
            <InputComponent
              control={control as any}
              name="founded_date"
              errors={errors}
              label="Founded Date"
              type="date"
              colMD={6}
              colXS={12}
            />

            <InputComponent
              control={control as any}
              name="label_number"
              errors={errors}
              label="Label Number"
              type="text"
              colMD={6}
              colXS={12}
            />

            <InputComponent
              control={control as any}
              name="city"
              errors={errors}
              label="City"
              type="text"
              colMD={6}
              colXS={12}
            />

            {/* Activity Areas as chips/tags */}
            <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
              <span className="fw-bold">Activity Areas</span>
            </label>
            <div className="form-control form-control-solid p-3">
              <div className="d-flex flex-wrap gap-2 mb-2">
                {(watch("activity_areas") || []).map(
                  (tag: string, idx: number) => (
                    <span
                      key={`${tag}-${idx}`}
                      className="badge rounded-pill bg-primary d-inline-flex align-items-center"
                    >
                      {tag}
                      <i
                        className="bi bi-x ms-2 cursor-pointer"
                        onClick={() => {
                          const current = (watch("activity_areas") ||
                            []) as string[];
                          const next = current.filter((_, i) => i !== idx);
                          setValue("activity_areas", next, {
                            shouldDirty: true,
                          });
                        }}
                      ></i>
                    </span>
                  )
                )}
              </div>
              <input
                type="text"
                className="border-0 w-100"
                placeholder="Type and press Enter..."
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const val = activityInput.trim();
                    if (val) {
                      const current = (watch("activity_areas") ||
                        []) as string[];
                      if (!current.includes(val)) {
                        const next = [...current, val];
                        setValue("activity_areas", next, { shouldDirty: true });
                      }
                      setActivityInput("");
                    }
                  } else if (e.key === "Backspace" && activityInput === "") {
                    const current = (watch("activity_areas") || []) as string[];
                    if (current.length > 0) {
                      const next = current.slice(0, -1);
                      setValue("activity_areas", next, { shouldDirty: true });
                    }
                  }
                }}
              />
            </div>

            <div className="separator my-4"></div>

            <h2 className="mb-3">- Header :</h2>

            <TextAreaComponent
              control={control as any}
              name="header_text"
              errors={errors}
              label="Header Text"
              colMD={12}
              colXS={12}
              required
            />

            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold`}>Header image:</span>
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
                    Upload image
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
                    The header image must have a 16:9 aspect ratio!
                  </h4>
                </div>
              </div>
            </div>

            <div className="fs-5 fw-semibold text-gray-600">
              <p
                dangerouslySetInnerHTML={{
                  __html: (watch("description") as string) || "",
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
                <span className="indicator-label">Back</span>
              </button>
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-custom-purple-dark text-white"
                disabled={isUpdating}
                onClick={handleSubmit(handleUpdate)}
              >
                {!isUpdating && <span className="indicator-label">Update</span>}
                {isUpdating && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
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
