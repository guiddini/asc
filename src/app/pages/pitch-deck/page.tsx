import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { PageTitle } from "../../../_metronic/layout/core";
import {
  getPitchDeckStatus,
  getMyPitchDeck,
  uploadPitchDeck,
  updatePitchDeck,
} from "../../apis/pitch-deck";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CountriesSelect } from "../../components/common/countries-select";
import { SelectComponent } from "../../components/common/select-component";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { Upload, CheckCircle, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import {
  ACTIVITY_SECTOR_OPTIONS,
  INVESTMENT_CATEGORY_OPTIONS,
  MATURITY_LEVEL_OPTIONS,
} from "../../data/pitch-deck";

const PitchDeckPage = () => {
  const qc = useQueryClient();
  const { user } = useSelector((state: UserResponse) => state.user);
  const { data: statusRes, isLoading: loadingStatus } = useQuery(
    ["pitch-deck-status"],
    getPitchDeckStatus,
    { staleTime: 60_000 }
  );
  const {
    data: myDeckRes,
    isLoading: loadingDeck,
    isSuccess,
  } = useQuery(["my-pitch-deck"], getMyPitchDeck, { staleTime: 60_000 });

  const existing = myDeckRes?.pitch_deck || null;
  const status = statusRes?.status ?? null;

  type FormValues = {
    title: string;
    phone: string;
    country: number | string | null;
    founder_linkedin: string;
    year_of_creation?: number | "";
    project_description?: string;
    maturity_level?: string;
    investment_category?: string;
    requested_amount_usd?: number | "";
    revenue_2024?: number | "";
    users_count?: number | "";
    employees_count?: number | "";
    website_links?: string[];
    website_link_input?: string;
    activity_sectors?: string[];
    file?: File | null;
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      phone: "",
      country: null,
      founder_linkedin: "",
      year_of_creation: "",
      project_description: "",
      maturity_level: "",
      requested_amount_usd: "",
      revenue_2024: "",
      users_count: "",
      employees_count: "",
      website_links: [],
      website_link_input: "",
      activity_sectors: [],
      file: null,
    },
  });

  const {
    title,
    description,
    badge,
    badgeClass,
    icon: StatusIcon,
  } = useMemo(() => {
    if (status === "pending") {
      return {
        title: "Pitch Deck Under Review",
        description:
          "Your pitch deck has been submitted and is currently under review.",
        badge: "In Review",
        badgeClass: "bg-warning text-dark",
        icon: Clock,
      };
    }
    if (status === "refused") {
      return {
        title: "Pitch Deck Refused",
        description:
          "Your pitch deck did not meet the review criteria. Please upload a revised version.",
        badge: "Action Required",
        badgeClass: "bg-danger",
        icon: XCircle,
      };
    }
    if (status === "accepted") {
      return {
        title: "Pitch Deck Accepted",
        description: "Great news — your pitch deck has been accepted.",
        badge: "Approved",
        badgeClass: "bg-success",
        icon: CheckCircle,
      };
    }
    return {
      title: "Upload Your Pitch Deck",
      description:
        "Upload your pitch deck for review and unlock investor access once approved.",
      badge: "Get Started",
      badgeClass: "bg-info text-white",
      icon: Upload,
    };
  }, [status]);

  const vals = watch();
  const canSubmit = existing
    ? (vals.title || "").trim().length > 0
    : [
        vals.title,
        vals.phone,
        vals.country,
        vals.founder_linkedin,
        vals.year_of_creation,
        vals.project_description,
        vals.maturity_level,
        vals.investment_category,
        vals.requested_amount_usd,
        vals.revenue_2024,
        vals.users_count,
        vals.employees_count,
      ].every(
        (v) =>
          v !== "" &&
          v !== undefined &&
          v !== null &&
          String(v).trim().length > 0
      ) &&
      (vals.website_links || []).length > 0 &&
      (vals.activity_sectors || []).length > 0 &&
      !!vals.file;

  const buildOptions = () => {
    const vals = getValues();
    const wl = (vals.website_links || [])
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0);
    const countryNum =
      vals.country === null || vals.country === undefined
        ? undefined
        : Number(vals.country);
    return {
      title: vals.title || undefined,
      phone: vals.phone || undefined,
      country: countryNum,
      founder_linkedin: vals.founder_linkedin || undefined,
      year_of_creation:
        vals.year_of_creation === "" || vals.year_of_creation === undefined
          ? undefined
          : Number(vals.year_of_creation),
      project_description: vals.project_description || undefined,
      maturity_level: vals.maturity_level || undefined,
      investment_category: vals.investment_category || undefined,
      requested_amount_usd:
        vals.requested_amount_usd === "" ||
        vals.requested_amount_usd === undefined
          ? undefined
          : Number(vals.requested_amount_usd),
      revenue_2024:
        vals.revenue_2024 === "" || vals.revenue_2024 === undefined
          ? undefined
          : Number(vals.revenue_2024),
      users_count:
        vals.users_count === "" || vals.users_count === undefined
          ? undefined
          : Number(vals.users_count),
      employees_count:
        vals.employees_count === "" || vals.employees_count === undefined
          ? undefined
          : Number(vals.employees_count),
      website_links: wl.length ? wl : undefined,
      activity_sectors:
        vals.activity_sectors && vals.activity_sectors.length
          ? vals.activity_sectors
          : undefined,
    } as const;
  };

  const buildCreateOptions = () => {
    const vals = getValues();
    const wl = (vals.website_links || [])
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0);
    return {
      title: String(vals.title),
      phone: String(vals.phone),
      country: Number(vals.country),
      founder_linkedin: String(vals.founder_linkedin),
      year_of_creation: Number(vals.year_of_creation),
      project_description: String(vals.project_description),
      maturity_level: String(vals.maturity_level),
      investment_category: String(vals.investment_category),
      requested_amount_usd: Number(vals.requested_amount_usd),
      revenue_2024: Number(vals.revenue_2024),
      users_count: Number(vals.users_count),
      employees_count: Number(vals.employees_count),
      website_links: wl,
      activity_sectors: (vals.activity_sectors || []) as string[],
    } as any;
  };

  const createMut = useMutation({
    mutationFn: async () => {
      const f = getValues("file");
      if (!f) throw new Error("Missing file");
      const opts = buildCreateOptions();
      const res = await uploadPitchDeck(f as File, opts);
      return res;
    },
    onSuccess: async () => {
      await qc.invalidateQueries(["pitch-deck-status"]);
      await qc.invalidateQueries(["my-pitch-deck"]);
      setValue("file", null);
      toast.success("Pitch deck uploaded successfully");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload pitch deck";
      toast.error(msg);
    },
  });

  const updateMut = useMutation({
    mutationFn: async () => {
      const opts = buildOptions();
      const f = getValues("file");
      const payload = f ? { ...opts, file: f as File } : { ...opts };
      const res = await updatePitchDeck(String(existing?.id), payload);
      return res;
    },
    onSuccess: async () => {
      await qc.invalidateQueries(["pitch-deck-status"]);
      await qc.invalidateQueries(["my-pitch-deck"]);
      toast.success("Pitch deck updated successfully");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update pitch deck";
      toast.error(msg);
    },
  });

  useEffect(() => {
    if (myDeckRes && reset) {
      reset({
        title: existing?.title,
        phone: user?.info?.phone || "",
        country: existing?.country_id,
        founder_linkedin: user?.info?.linkedin_url || "",
        year_of_creation: existing?.year_of_creation || "",
        project_description: existing?.project_description || "",
        maturity_level: existing?.maturity_level || "",
        requested_amount_usd: existing?.requested_amount_usd || "",
        revenue_2024: (existing as any)?.revenue_2024 || "",
        users_count: (existing as any)?.users_count || "",
        employees_count: (existing as any)?.employees_count || "",
        website_links: existing?.website_links || [],
        website_link_input: existing?.website_links?.[0] || "",
        activity_sectors: existing?.activity_sectors || [],
      });
    }
  }, [reset, myDeckRes]);

  return (
    <>
      <PageTitle
        breadcrumbs={[
          {
            title: "Pitch Deck",
            path: "/pitch-deck",
            isSeparator: false,
            isActive: false,
          },
        ]}
      />

      <Card className="mb-4 border-0 shadow-sm rounded-4">
        <Card.Body>
          <div className="d-flex align-items-start justify-content-between">
            <div className="d-flex align-items-center">
              <StatusIcon className="text-primary me-3" size={28} />
              <div>
                <div className="small text-muted fw-semibold">
                  Pitch Deck Status
                </div>
                <h3 className="mb-1">{title}</h3>

                <div className="text-muted mt-2">{description}</div>
              </div>
            </div>
            <span className={`badge ${badgeClass}`}>{badge}</span>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Form>
            <Row className="g-4">
              <Col md={6}>
                <Form.Label>Project Title</Form.Label>
                <Form.Control
                  {...register("title")}
                  placeholder="Project title"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  {...register("phone")}
                  placeholder="Contact phone"
                />
                <Form.Text className="text-muted">
                  This is your registered phone; changes here will update your
                  profile.
                </Form.Text>
              </Col>
              <Col md={6}>
                <CountriesSelect
                  control={control}
                  errors={errors}
                  colMD={12}
                  onValueChange={(val) => setValue("country", val as any)}
                  defaultValue={
                    existing?.company?.country
                      ? {
                          label: existing.company.country.name_en,
                          value: existing.company.country.id,
                        }
                      : undefined
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label>Founder LinkedIn</Form.Label>
                <Form.Control
                  {...register("founder_linkedin")}
                  placeholder="https://linkedin.com/in/..."
                />
                <Form.Text className="text-muted">
                  This is your registered LinkedIn; changes here will update
                  your profile.
                </Form.Text>
              </Col>
              <Col md={6}>
                <Form.Label>Year of Creation</Form.Label>
                <Form.Control
                  type="number"
                  {...register("year_of_creation")}
                  placeholder="YYYY"
                />
              </Col>
              <Col md={12}>
                <Form.Label>Project Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  {...register("project_description")}
                  placeholder="Describe your project"
                />
              </Col>
              <SelectComponent
                name="maturity_level"
                control={control}
                errors={errors}
                label="Maturity Level"
                data={MATURITY_LEVEL_OPTIONS}
                saveOnlyValue
                defaultValue={
                  existing?.maturity_level
                    ? {
                        label: existing.maturity_level,
                        value: existing.maturity_level,
                      }
                    : undefined
                }
                colMD={6}
                colXS={12}
              />

              <SelectComponent
                name="investment_category"
                control={control}
                errors={errors}
                label="Investment Category"
                data={INVESTMENT_CATEGORY_OPTIONS}
                saveOnlyValue
                defaultValue={
                  (existing as any)?.investment_category
                    ? {
                        label: (existing as any).investment_category,
                        value: (existing as any).investment_category,
                      }
                    : undefined
                }
                colMD={6}
                colXS={12}
              />

              <Col md={6}>
                <Form.Label>Requested Amount (USD)</Form.Label>
                <Form.Control
                  type="number"
                  {...register("requested_amount_usd", { required: true })}
                  placeholder="e.g. 50000"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Revenue 2024 (USD)</Form.Label>
                <Form.Control
                  type="number"
                  {...register("revenue_2024", { required: true })}
                  placeholder="e.g. 120000"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Users Count</Form.Label>
                <Form.Control
                  type="number"
                  {...register("users_count", { required: true })}
                  placeholder="e.g. 1000"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Employees Count</Form.Label>
                <Form.Control
                  type="number"
                  {...register("employees_count", { required: true })}
                  placeholder="e.g. 25"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Website Links</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    {...register("website_link_input")}
                    placeholder="https://example.com"
                  />
                  <Button
                    variant="light"
                    type="button"
                    onClick={() => {
                      const v = (getValues("website_link_input") || "").trim();
                      if (v) {
                        const list = getValues("website_links") || [];
                        setValue("website_links", [...list, v]);
                        setValue("website_link_input", "");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {(watch("website_links") || []).map((link, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-dark d-inline-flex align-items-center gap-2"
                    >
                      {link}
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0"
                        onClick={() => {
                          const list = (
                            getValues("website_links") || []
                          ).filter((l) => l !== link);
                          setValue("website_links", list);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Add each website and click Add. Use × to remove.
                </Form.Text>
              </Col>

              <SelectComponent
                name="activity_sectors"
                control={control}
                errors={errors}
                label="Activity Sector (max 3)"
                data={ACTIVITY_SECTOR_OPTIONS}
                isMulti
                maxLimit={3}
                saveOnlyValue
                defaultValue={
                  existing?.activity_sectors
                    ? existing.activity_sectors.map((s) => ({
                        label: s,
                        value: s,
                      }))
                    : undefined
                }
                colMD={6}
                colXS={12}
              />

              <Col md={12}>
                <Form.Label>Pitch Deck File</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    setValue("file", input.files?.[0] || null);
                  }}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              {existing ? (
                <Button
                  variant="primary"
                  disabled={!canSubmit || updateMut.isLoading}
                  onClick={handleSubmit(() => updateMut.mutate())}
                >
                  {updateMut.isLoading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : null}
                  Update Pitch Deck
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={!canSubmit || createMut.isLoading}
                  onClick={handleSubmit(() => createMut.mutate())}
                >
                  {createMut.isLoading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : null}
                  Upload Pitch Deck
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default PitchDeckPage;
