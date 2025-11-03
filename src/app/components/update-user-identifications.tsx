import React, { useMemo, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { UserResponse } from "../types/reducers";
import { updateUserApi } from "../apis/user";

type Props = {
  show: boolean;
  onHide: () => void;
};

type FormValues = {
  passport_path?: File | null;
  identity_path?: File | null;
  passport_number?: string | null;
  identity_number?: string | null;
  doc_type?: "passport" | "nin" | null;
};

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const fileSchema = yup
  .mixed<File | null>()
  .nullable()
  .test("fileType", "Unsupported file type.", (file) => {
    if (!file) return true;
    return ACCEPTED_TYPES.includes(file.type);
  })
  .test("fileSize", "File must be 15MB or smaller.", (file) => {
    if (!file) return true;
    return file.size <= MAX_SIZE_BYTES;
  });

const schema = yup
  .object()
  .shape({
    passport_path: fileSchema,
    identity_path: fileSchema,
    passport_number: yup
      .string()
      .nullable()
      .transform((val) => {
        const v = typeof val === "string" ? val.trim() : val;
        return v === "" ? null : (v as string);
      })
      .test(
        "passport-len",
        "Passport number must be at least 7 characters.",
        (val) => !val || val.length >= 7
      )
      .max(255),
    identity_number: yup
      .string()
      .nullable()
      .transform((val) => {
        const v = typeof val === "string" ? val.trim() : val;
        return v === "" ? null : (v as string);
      })
      .test(
        "identity-len",
        "Identity number must be exactly 18 characters.",
        (val) => !val || val.length === 18
      ),
    doc_type: yup
      .string()
      .nullable()
      .test(
        "doc-type-required",
        "Please select Passport or NIN.",
        function (value) {
          const isAlgerian = this.options?.context?.isAlgerian as
            | boolean
            | undefined;
          if (isAlgerian === true) {
            return !!value;
          }
          return true;
        }
      ),
  })
  .test(
    "conditional-required",
    "Please provide the required identification.",
    function (values) {
      const {
        passport_number,
        passport_path,
        identity_number,
        identity_path,
        doc_type,
      } = values as FormValues;
      const hasIdentity = Boolean(identity_number?.trim() || identity_path);
      const hasPassport = Boolean(passport_number?.trim() || passport_path);
      const isAlgerian = this.options?.context?.isAlgerian as
        | boolean
        | undefined;

      // Rule based on country when we can detect it
      // Algerian users: require based on selected type
      if (isAlgerian === true) {
        if (doc_type === "passport") return hasPassport;
        if (doc_type === "nin") return hasIdentity;
        return hasIdentity || hasPassport;
      }
      if (isAlgerian === false) return hasPassport;

      // Fallback: if country detection is ambiguous, accept either identity or passport
      return hasIdentity || hasPassport;
    }
  );

const UpdateUserIdentificationsModal: React.FC<Props> = ({ show, onHide }) => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: UserResponse) => state.user);

  const isAlgerian = useMemo(
    () =>
      (user?.info?.country?.name_en || "")
        .toLowerCase()
        .trim()
        .includes("algeria"),
    [user]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema, { context: { isAlgerian } }),
    defaultValues: {
      passport_path: null,
      identity_path: null,
      passport_number: null,
      identity_number: null,
      doc_type: isAlgerian ? "nin" : null,
    },
  });

  const selectedDocType = isAlgerian ? watch("doc_type") : null;

  useEffect(() => {
    if (!isAlgerian) return;
    if (selectedDocType === "nin") {
      setValue("passport_number", null, { shouldValidate: true });
      setValue("passport_path", null, { shouldValidate: true });
    } else if (selectedDocType === "passport") {
      setValue("identity_number", null, { shouldValidate: true });
      setValue("identity_path", null, { shouldValidate: true });
    }
  }, [selectedDocType, isAlgerian, setValue]);

  const mutation = useMutation(updateUserApi, {
    onSuccess: () => {
      toast.success("Identification updated successfully.");
      // Refresh user data if present
      if (user?.id) queryClient.invalidateQueries(["get-user-data", user.id]);
      reset();
      onHide();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Failed to update identification.";
      toast.error(msg);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const fd = new FormData();
    // Always include user_id
    if (user?.id) fd.append("user_id", String(user.id));

    if (isAlgerian) {
      // Algerian: send only the selected identification type
      if (data.doc_type === "nin") {
        if (data.identity_number)
          fd.append("identity_number", data.identity_number);
        if (data.identity_path) fd.append("identity_path", data.identity_path);
      } else if (data.doc_type === "passport") {
        if (data.passport_number)
          fd.append("passport_number", data.passport_number);
        if (data.passport_path) fd.append("passport_path", data.passport_path);
      }
    } else {
      // Non-Algerian: Passport is primary
      if (data.passport_number)
        fd.append("passport_number", data.passport_number);
      if (data.passport_path) fd.append("passport_path", data.passport_path);
    }
    await mutation.mutateAsync(fd);
  };

  const heading = isAlgerian
    ? "Verify Your Identification (Algeria)"
    : "Verify Your Identification (Passport)";
  const subheading = isAlgerian
    ? "For participants whose country is Algeria, please provide your National Identity (Carte d’Identité). You can upload a clear scan or enter its identification number. Accepted formats: JPG, JPEG, PNG, WEBP, PDF. Max size: 15MB."
    : "For non-Algerian participants, please provide your Passport details. You can upload a clear scan or enter the passport number. Accepted formats: JPG, JPEG, PNG, WEBP, PDF. Max size: 15MB.";

  console.log("errors", errors);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-4">{subheading}</p>

          {isAlgerian ? (
            <div>
              <div className="mb-4">
                <Form.Label className="fw-semibold">
                  Select Identification Type
                </Form.Label>
                <div className="d-flex gap-4">
                  <Form.Check
                    type="radio"
                    id="doc-nin"
                    label="National Identity Number (NIN)"
                    value="nin"
                    disabled={mutation.isLoading || isSubmitting}
                    {...register("doc_type")}
                    checked={selectedDocType === "nin"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setValue("doc_type", e.target.value as any, {
                        shouldValidate: true,
                      });
                    }}
                  />
                  <Form.Check
                    type="radio"
                    id="doc-passport"
                    label="Passport"
                    value="passport"
                    disabled={mutation.isLoading || isSubmitting}
                    {...register("doc_type")}
                    checked={selectedDocType === "passport"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setValue("doc_type", e.target.value as any, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>
                {errors.doc_type && (
                  <div className="text-danger mt-1">
                    {errors.doc_type.message as any}
                  </div>
                )}
              </div>

              {selectedDocType === "passport" ? (
                <>
                  <div className="mb-3">
                    <Form.Label>
                      Provide either a Passport file or number
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      disabled={mutation.isLoading || isSubmitting}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] ?? null;
                        setValue("passport_path", file, {
                          shouldValidate: true,
                        });
                        // If a passport file is provided, clear the number to avoid conflicting errors
                        setValue("passport_number", null, { shouldValidate: true });
                      }}
                    />
                    {errors.passport_path && (
                      <div className="text-danger mt-1">
                        {errors.passport_path.message as any}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      Accepted: JPG, JPEG, PNG, WEBP, PDF. Max 15MB.
                    </Form.Text>
                  </div>

                  <div className="mb-3">
                    <Form.Label>
                      Passport Number (alternative to file)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., A1234567 (min 7 chars)"
                      disabled={mutation.isLoading || isSubmitting}
                      {...register("passport_number")}
                    />
                    {errors.passport_number && (
                      <div className="text-danger mt-1">
                        {errors.passport_number.message}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      You can enter the number instead of uploading a file.
                    </Form.Text>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <Form.Label>
                      Provide either an Identity file or number
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      disabled={mutation.isLoading || isSubmitting}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] ?? null;
                        setValue("identity_path", file, {
                          shouldValidate: true,
                        });
                        // If an identity file is provided, clear the number to avoid conflicting errors
                        setValue("identity_number", null, { shouldValidate: true });
                      }}
                    />
                    {errors.identity_path && (
                      <div className="text-danger mt-1">
                        {errors.identity_path.message as any}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      Accepted: JPG, JPEG, PNG, WEBP, PDF. Max 15MB.
                    </Form.Text>
                  </div>

                  <div className="mb-3">
                    <Form.Label>
                      Identity Number (alternative to file)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter National ID (exactly 18 chars)"
                      disabled={mutation.isLoading || isSubmitting}
                      {...register("identity_number")}
                    />
                    {errors.identity_number && (
                      <div className="text-danger mt-1">
                        {errors.identity_number.message}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      You can enter the number instead of uploading a file.
                    </Form.Text>
                  </div>
                </>
              )}
              {errors.root && (
                <Alert variant="danger">{errors.root.message as any}</Alert>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <Form.Label>
                  Provide either a Passport file or number
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  disabled={mutation.isLoading || isSubmitting}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] ?? null;
                  setValue("passport_path", file, { shouldValidate: true });
                  // If a passport file is provided, clear the number to avoid conflicting errors
                  setValue("passport_number", null, { shouldValidate: true });
                }}
              />
                {errors.passport_path && (
                  <div className="text-danger mt-1">
                    {errors.passport_path.message as any}
                  </div>
                )}
                <Form.Text className="text-muted">
                  Accepted: JPG, JPEG, PNG, WEBP, PDF. Max 15MB.
                </Form.Text>
              </div>

              <div className="mb-3">
                <Form.Label>Passport Number (alternative to file)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., P1234567"
                  disabled={mutation.isLoading || isSubmitting}
                  {...register("passport_number")}
                />
                {errors.passport_number && (
                  <div className="text-danger mt-1">
                    {errors.passport_number.message}
                  </div>
                )}
                <Form.Text className="text-muted">
                  You can enter the number instead of uploading a file.
                </Form.Text>
              </div>
              {errors.root && (
                <Alert variant="danger">{errors.root.message as any}</Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={mutation.isLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={mutation.isLoading || isSubmitting}
          >
            {mutation.isLoading || isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateUserIdentificationsModal;
