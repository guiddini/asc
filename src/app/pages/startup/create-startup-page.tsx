import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Col, Row, Button, Card, Modal } from "react-bootstrap";
import {
  CountriesSelect,
  InputComponent,
  TextAreaComponent,
  WillayasSelect,
} from "../../components";
import clsx from "clsx";
import { useMutation, useQuery } from "react-query";
import { createCompanyApi } from "../../apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  checkExhibitionDemandTransactionApi,
  createExhibitionDemandApi,
} from "../../apis/exhibition";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  founded_date: Yup.date()
    .required("Founded date is required")
    .typeError("Invalid date format")
    .max(new Date(), "Founded date cannot be in the future"),
  country: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .required("Country is required")
    .nullable(),
  wilaya: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.number(),
    })
    .when("country", {
      is: (country: any) => country?.label === "Algeria",
      then: (schema) => schema.required("Wilaya is required"),
      otherwise: (schema) => schema.notRequired(),
    })
    .nullable(),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  phone_1: Yup.string().required("Phone number is required"),
  logo: Yup.mixed().required("Logo is required"),
  activity_areas: Yup.array()
    .of(Yup.string())
    .min(1, "At least one activity area is required")
    .required(),
  label_number: Yup.string().when("country", {
    is: (country: any) => country?.label === "Algeria",
    then: (schema) =>
      schema
        .required("Label number is required")
        .nullable()
        .matches(/^\d{10}$/, {
          message: "Label number must be exactly 10 digits",
          excludeEmptyString: true,
        }),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  revenue_2024: Yup.number()
    .typeError("Revenue must be a number")
    .required("Revenue for 2024 is required $"),
  revenue_2025: Yup.number()
    .typeError("Revenue must be a number")
    .required("Revenue for 2025 is required $"),
  total_funds_raised: Yup.number()
    .typeError("Total funds raised must be a number")
    .required("Total funds raised is required $"),
  exhibition_type: Yup.string()
    .oneOf(["connect_desk", "scale_up_booth", "premium_exhibition_space"])
    .required("Please select an exhibition type"),
});

type StartupFormData = Yup.InferType<typeof validationSchema>;

const CreateStartupPage = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: hasDemand, isLoading: checkingDemand } = useQuery(
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

  useEffect(() => {
    if (hasDemand) navigate("/startup/demand");
  }, [hasDemand, navigate]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<StartupFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      country: null,
      city: "",
      address: "",
      phone_1: "",
      logo: null,
      activity_areas: [],
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { mutate: createCompany, isLoading } = useMutation({
    mutationFn: (data: FormData) => createCompanyApi(data),
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  const createExhibitionMutation = useMutation((formData: FormData) =>
    createExhibitionDemandApi(formData)
  );

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("activity_areas", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue("activity_areas", newTags);
  };

  const onSubmit = (data: StartupFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append(
      "founded_date",
      new Date(data.founded_date).toISOString().split("T")[0]
    );
    formData.append("country_id", data.country?.value || "");
    if (data?.wilaya?.value) {
      formData.append("wilaya_id", String(data.wilaya?.value) || "");
    }
    formData.append("city", data.city);
    formData.append("address", data.address);
    formData.append("phone_1", data.phone_1);
    if (data.label_number) {
      formData.append("label_number", data.label_number);
    }
    if (data.revenue_2024 !== undefined) {
      formData.append("revenue_2024", data.revenue_2024.toString());
    }
    if (data.revenue_2025 !== undefined) {
      formData.append("revenue_2025", data.revenue_2025.toString());
    }
    if (data.total_funds_raised !== undefined) {
      formData.append("total_funds_raised", data.total_funds_raised.toString());
    }
    if (data.logo instanceof File) formData.append("logo", data.logo);
    data.activity_areas.forEach((area, index) => {
      formData.append(`activity_areas[${index}]`, area);
    });

    const exhibitionFormData = new FormData();
    exhibitionFormData.append("exhibition_type", data.exhibition_type);
    createCompany(formData, {
      onSuccess(data, variables, context) {
        createExhibitionMutation.mutate(exhibitionFormData, {
          onSuccess(data, variables, context) {
            setShowSuccessModal(true);
          },
          onError(error, variables, context) {
            toast.error("Failed to create exhibition demand.");
            navigate("/startup/demand");
          },
        });
      },
    });
  };

  const isAlgeria = watch("country")?.label === "Algeria";

  if (checkingDemand) return null;

  return (
    <div className="d-flex flex-column bg-white rounded-3 p-6">
      <h2 className="mb-2 fw-bold">Add Your Startup</h2>
      <p className="text-muted mb-8">
        Share details about your startup — tell us who you are, what you do, and
        where you're based.
      </p>
      <Row>
        <InputComponent
          control={control}
          name="name"
          label="Startup Name"
          errors={errors}
          type="text"
          placeholder="Enter startup name"
          required
          colXS={12}
          colMD={6}
        />
        <InputComponent
          control={control}
          name="founded_date"
          label="Founded Date"
          errors={errors}
          type="date"
          required
          colXS={12}
          colMD={6}
        />
        <CountriesSelect
          control={control}
          errors={errors}
          label="Country"
          colXS={12}
          colMD={6}
        />
        {isAlgeria && (
          <>
            <WillayasSelect
              control={control}
              errors={errors}
              colXS={12}
              colMD={6}
            />
            <InputComponent
              control={control}
              name="label_number"
              label="Label Number (optional)"
              errors={errors}
              type="text"
              placeholder="Enter label number"
              colXS={12}
              colMD={12}
            />
          </>
        )}
        <InputComponent
          control={control}
          name="city"
          label="City"
          errors={errors}
          type="text"
          placeholder="Enter city"
          required
          colXS={12}
          colMD={6}
        />
        <InputComponent
          control={control}
          name="phone_1"
          label="Phone Number"
          errors={errors}
          type="tel"
          placeholder="Enter phone number"
          required
          colXS={12}
          colMD={6}
        />
        <TextAreaComponent
          control={control}
          name="address"
          label="Address"
          errors={errors}
          placeholder="Enter full address"
          required
          colXS={12}
          colMD={12}
        />

        <Col xs={12} md={4} className="mb-3">
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="fw-bold required">Revenue 2024</span>
          </label>
          <div className="input-group input-group-solid">
            <Controller
              control={control}
              name="revenue_2024"
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className={clsx("form-control", {
                    "is-invalid": errors.revenue_2024,
                  })}
                  placeholder="Enter revenue for 2024"
                />
              )}
            />
            <span className="input-group-text">$</span>
          </div>
          {errors.revenue_2024 && (
            <div className="text-danger fs-7">
              {errors.revenue_2024.message}
            </div>
          )}
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="fw-bold required">Revenue 2025</span>
          </label>
          <div className="input-group input-group-solid">
            <Controller
              control={control}
              name="revenue_2025"
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className={clsx("form-control", {
                    "is-invalid": errors.revenue_2025,
                  })}
                  placeholder="Enter revenue for 2025"
                />
              )}
            />
            <span className="input-group-text">$</span>
          </div>
          {errors.revenue_2025 && (
            <div className="text-danger fs-7">
              {errors.revenue_2025.message}
            </div>
          )}
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="fw-bold required">Total Funds Raised</span>
          </label>
          <div className="input-group input-group-solid">
            <Controller
              control={control}
              name="total_funds_raised"
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className={clsx("form-control", {
                    "is-invalid": errors.total_funds_raised,
                  })}
                  placeholder="Enter total funds raised"
                />
              )}
            />
            <span className="input-group-text">$</span>
          </div>
          {errors.total_funds_raised && (
            <div className="text-danger fs-7">
              {errors.total_funds_raised.message}
            </div>
          )}
        </Col>

        <Col xs={12} md={12} className="mb-3">
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="fw-bold required">Logo</span>
          </label>
          <Controller
            control={control}
            name="logo"
            render={({ field: { onChange } }) => (
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className={clsx("form-control bg-transparent", {
                  "is-invalid": errors.logo,
                })}
              />
            )}
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Logo Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
          {errors.logo && (
            <div className="text-danger fs-7">{errors.logo.message}</div>
          )}
        </Col>

        <Col xs={12} md={12} className="mb-3">
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="fw-bold required">Activity Areas</span>
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type an activity area and press Enter"
            className={clsx("form-control bg-transparent", {
              "is-invalid": errors.activity_areas,
            })}
          />
          <div className="form-text mt-1">
            Press Enter to add each activity area.
          </div>
          <div className="mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="badge bg-primary me-2 mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveTag(index)}
              >
                {tag} ×
              </span>
            ))}
          </div>
          {errors.activity_areas && (
            <div className="text-danger fs-7">
              {errors.activity_areas.message}
            </div>
          )}
        </Col>

        <Col xs={12} className="mt-4">
          <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
            <span className="fw-bold required">Choose Exhibition Type</span>
          </label>
          <div className="row g-4">
            <div className="col-md-4">
              <Card
                className={`h-100 border-3 transition-all ${
                  watch("exhibition_type") === "connect_desk"
                    ? "border-primary shadow-lg bg-primary bg-opacity-10"
                    : "border-light"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform:
                    watch("exhibition_type") === "connect_desk"
                      ? "translateY(-4px)"
                      : "none",
                }}
                onClick={() => setValue("exhibition_type", "connect_desk")}
              >
                <Card.Body className="position-relative">
                  {watch("exhibition_type") === "connect_desk" && (
                    <div
                      className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-3">
                    <h4 className="fw-bold mb-0">Connect Desk</h4>
                  </div>
                  <p className="text-muted small mb-3">
                    Your gateway to meaningful connections at Africa's premier
                    startup event.
                  </p>
                  <ul className="small mb-4">
                    <li>2 exhibitor badges</li>
                    <li>3 days of exhibition at main lobby</li>
                    <li>
                      Access to trainings with internationally renowned partners
                    </li>
                    <li>Pitch competition (up to $10,000 prize)</li>
                    <li>Access to investor deal room</li>
                  </ul>
                  <h5 className="fw-bold text-primary mb-1">29.900 DZD</h5>
                  <div className="text-muted small">≈ 199 $</div>
                </Card.Body>
              </Card>
            </div>

            <div className="col-md-4">
              <Card
                className={`h-100 border-3 transition-all ${
                  watch("exhibition_type") === "scale_up_booth"
                    ? "border-primary shadow-lg bg-primary bg-opacity-10"
                    : "border-light"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform:
                    watch("exhibition_type") === "scale_up_booth"
                      ? "translateY(-4px)"
                      : "none",
                }}
                onClick={() => setValue("exhibition_type", "scale_up_booth")}
              >
                <Card.Body className="position-relative">
                  {watch("exhibition_type") === "scale_up_booth" && (
                    <div
                      className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-3">
                    <h4 className="fw-bold mb-0">Scale Up Booth</h4>
                  </div>
                  <p className="text-muted small mb-3">
                    An elevated exhibition experience offering greater
                    visibility and stronger connections.
                  </p>
                  <ul className="small mb-4">
                    <li>4 exhibitor badges</li>
                    <li>1 access pass to the Gala Dinner</li>
                    <li>3 days of exhibition in prime area</li>
                    <li>Advanced trainings with renowned partners</li>
                    <li>Exclusive networking with investors</li>
                    <li>Pitch competition (up to $10,000 prize)</li>
                    <li>Priority access to investor deal room</li>
                  </ul>
                  <h5 className="fw-bold text-primary mb-1">99.900 DZD</h5>
                  <div className="text-muted small">≈ 399 $</div>
                </Card.Body>
              </Card>
            </div>

            <div className="col-md-4">
              <Card
                className={`h-100 border-3 transition-all ${
                  watch("exhibition_type") === "premium_exhibition_space"
                    ? "border-primary shadow-lg bg-primary bg-opacity-10"
                    : "border-light"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform:
                    watch("exhibition_type") === "premium_exhibition_space"
                      ? "translateY(-4px)"
                      : "none",
                }}
                onClick={() =>
                  setValue("exhibition_type", "premium_exhibition_space")
                }
              >
                <Card.Body className="position-relative">
                  {watch("exhibition_type") === "premium_exhibition_space" && (
                    <div
                      className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-3">
                    <h4 className="fw-bold mb-0">Premium Exhibition Space</h4>
                  </div>
                  <p className="text-muted small mb-3">
                    Make a bold statement with your own customizable 15m²
                    showcase.
                  </p>
                  <ul className="small mb-4">
                    <li>5 exhibitor badges</li>
                    <li>Access to Champions-Gov Summit</li>
                    <li>Access to VIP lounge</li>
                    <li>3 Gala Dinner passes</li>
                    <li>Build your own 15m² stand</li>
                    <li>Strategic position in main lobby</li>
                    <li>Priority access to investor deal room</li>
                  </ul>
                  <h5 className="fw-bold text-primary mb-1">299.900 DZD</h5>
                  <div className="text-muted small">≈ 1,999 $</div>
                </Card.Body>
              </Card>
            </div>
          </div>
          {errors.exhibition_type && (
            <div className="text-danger mt-2">
              {errors.exhibition_type.message}
            </div>
          )}
        </Col>

        <Col xs={12} className="mt-4">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Col>
      </Row>
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Startup Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Your startup has been submitted successfully. Our team will review
            your request shortly. Once approved, you’ll receive an email with
            the next steps to proceed with payment and confirm your
            participation.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/startup/demand");
            }}
          >
            I understand
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateStartupPage;
