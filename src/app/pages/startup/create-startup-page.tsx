import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Col, Row, Button } from "react-bootstrap";
import {
  CountriesSelect,
  InputComponent,
  TextAreaComponent,
} from "../../components";
import clsx from "clsx";
import { useMutation, useQuery } from "react-query";
import { createCompanyApi } from "../../apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { checkExhibitionDemandTransactionApi } from "../../apis/exhibition";

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
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  logo: Yup.mixed().required("Logo is required"),
  activity_areas: Yup.array()
    .of(Yup.string())
    .min(1, "At least one activity area is required")
    .required(),
});

type StartupFormData = Yup.InferType<typeof validationSchema>;

const CreateStartupPage = () => {
  const navigate = useNavigate();

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
  } = useForm<StartupFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      country: null,
      city: "",
      address: "",
      logo: null,
      activity_areas: [],
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { mutate: createCompany, isLoading } = useMutation({
    mutationFn: (data: FormData) => createCompanyApi(data),
    onSuccess: () => {
      toast.success("Startup created successfully!");
      navigate("/startup/demand");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

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
    formData.append("city", data.city);
    formData.append("address", data.address);
    if (data.logo instanceof File) formData.append("logo", data.logo);
    data.activity_areas.forEach((area, index) => {
      formData.append(`activity_areas[${index}]`, area);
    });
    createCompany(formData);
  };

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
    </div>
  );
};

export default CreateStartupPage;
