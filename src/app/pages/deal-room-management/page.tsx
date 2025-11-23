import { useMemo, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import {
  getPitchDecks,
  acceptPitchDeck,
  refusePitchDeck,
  downloadPitchDeck,
  showPitchDeck,
} from "../../apis/pitch-deck";
import { Col, Row, Spinner, Badge, Button, Modal } from "react-bootstrap";
import { KTIcon } from "../../../_metronic/helpers";
import {
  PitchDeckWithRelations,
  PitchDeckStatus,
} from "../../types/pitch-deck";
import axiosInstance from "../../apis/axios";
import getMediaUrl from "../../helpers/getMediaUrl";
import { PageTitle } from "../../../_metronic/layout/core";
import { useForm } from "react-hook-form";
import { useQuery as useRQ } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ACTIVITY_SECTOR_OPTIONS,
  INVESTMENT_CATEGORY_OPTIONS,
  MATURITY_LEVEL_OPTIONS,
} from "../../data/pitch-deck";
import { getCountriesApi } from "../../apis/rsources";

function statusVariant(s: PitchDeckStatus) {
  switch (s) {
    case "accepted":
      return "success";
    case "pending":
      return "warning";
    case "refused":
      return "danger";
    default:
      return "secondary";
  }
}

type FormValues = {
  search: string;
  status: "" | PitchDeckStatus;
  investment_category: string;
  maturity_level: string;
  country_id: string;
  activity_sectors: string;
  year_of_creation: string;
  revenue_2024: string;
  users_count: string;
  employees_count: string;
  requested_amount_usd: string;
};

function DealRoomManagementPage() {
  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      search: "",
      status: "",
      investment_category: "",
      maturity_level: "",
      country_id: "",
      activity_sectors: "",
      year_of_creation: "",
      revenue_2024: "",
      users_count: "",
      employees_count: "",
      requested_amount_usd: "",
    },
  });

  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data: detailRes, isLoading: detailLoading } = useRQ(
    ["pitchdeck-detail", detailId],
    async () => {
      if (!detailId) return null as any;
      return await showPitchDeck(detailId);
    },
    { enabled: !!detailId }
  );

  const search = watch("search");
  const status = watch("status");
  const investment_category = watch("investment_category");
  const maturity_level = watch("maturity_level");
  const country_id = watch("country_id");
  const activity_sectors = watch("activity_sectors");
  const year_of_creation = watch("year_of_creation");
  const revenue_2024 = watch("revenue_2024");
  const users_count = watch("users_count");
  const employees_count = watch("employees_count");
  const requested_amount_usd = watch("requested_amount_usd");

  // Debounced query params container
  const [queryParams, setQueryParams] = useState<{
    page: number;
    status: "" | PitchDeckStatus;
    search: string;
    investment_category: string;
    maturity_level: string;
    country_id: string;
    activity_sectors: string;
    year_of_creation: string;
    revenue_2024: string;
    users_count: string;
    employees_count: string;
    requested_amount_usd: string;
  }>({
    page,
    status,
    search,
    investment_category,
    maturity_level,
    country_id,
    activity_sectors,
    year_of_creation,
    revenue_2024,
    users_count,
    employees_count,
    requested_amount_usd,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setQueryParams({
        page: 1,
        status,
        search,
        investment_category,
        maturity_level,
        country_id,
        activity_sectors,
        year_of_creation,
        revenue_2024,
        users_count,
        employees_count,
        requested_amount_usd,
      });
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [
    search,
    status,
    investment_category,
    maturity_level,
    country_id,
    activity_sectors,
    year_of_creation,
    revenue_2024,
    users_count,
    employees_count,
    requested_amount_usd,
  ]);

  // Update page immediately (no debounce)
  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      page,
    }));
  }, [page]);

  // Companies for filter
  const { data: companiesRes, isLoading: companiesLoading } = useRQ(
    ["companies-all"],
    async () => {
      const res = await axiosInstance.get("/company/all");
      return res.data;
    }
  );

  const { data: countriesRes, isLoading: countriesLoading } = useRQ(
    ["countries-all"],
    getCountriesApi
  );

  const companies: { id: string; name: string }[] = useMemo(() => {
    const raw = Array.isArray(companiesRes)
      ? companiesRes
      : companiesRes?.data || [];
    return (raw || []).map((c: any) => ({
      id: String(c?.id || ""),
      name: String(c?.name || ""),
    }));
  }, [companiesRes]);

  const countries: { id: string; name: string }[] = useMemo(() => {
    const raw = countriesRes?.data || [];
    return (raw || []).map((c: any) => ({
      id: String(c?.id || ""),
      name: String(c?.name_en || c?.name_fr || c?.name || ""),
    }));
  }, [countriesRes]);

  // Pitch decks query (backend pagination via page/per_page)
  const {
    data: decksRes,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    [
      "pitch-decks",
      queryParams.page,
      queryParams.status,
      queryParams.search,
      queryParams.investment_category,
      queryParams.maturity_level,
      queryParams.country_id,
      queryParams.activity_sectors,
      queryParams.year_of_creation,
      queryParams.revenue_2024,
      queryParams.users_count,
      queryParams.employees_count,
      queryParams.requested_amount_usd,
    ],
    async () => {
      const res = await getPitchDecks({
        page: queryParams.page,
        status: queryParams.status || undefined,
        search: queryParams.search || undefined,
        investment_category: queryParams.investment_category || undefined,
        maturity_level: queryParams.maturity_level || undefined,
        country_id: queryParams.country_id
          ? Number(queryParams.country_id)
          : undefined,
        activity_sectors: queryParams.activity_sectors || undefined,
        year_of_creation: queryParams.year_of_creation
          ? Number(queryParams.year_of_creation)
          : undefined,
        revenue_2024: queryParams.revenue_2024
          ? Number(queryParams.revenue_2024)
          : undefined,
        users_count: queryParams.users_count
          ? Number(queryParams.users_count)
          : undefined,
        employees_count: queryParams.employees_count
          ? Number(queryParams.employees_count)
          : undefined,
        requested_amount_usd: queryParams.requested_amount_usd
          ? Number(queryParams.requested_amount_usd)
          : undefined,
      });
      return res;
    },
    {
      keepPreviousData: true,
    }
  );

  const decks: PitchDeckWithRelations[] = useMemo(() => {
    if (Array.isArray(decksRes)) return decksRes as PitchDeckWithRelations[];
    return (decksRes as any)?.data || [];
  }, [decksRes]);

  // Accept / Reject mutations
  const acceptMut = useMutation((id: string) => acceptPitchDeck(id), {
    onSuccess: () => {
      toast.success("Pitch deck accepted");
      refetch();
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to accept pitch deck";
      toast.error(msg);
    },
  });

  const rejectMut = useMutation((id: string) => refusePitchDeck(id), {
    onSuccess: () => {
      toast.success("Pitch deck rejected");
      refetch();
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to reject pitch deck";
      toast.error(msg);
    },
  });

  const handleAccept = useCallback(
    (id: string) => {
      acceptMut.mutate(id);
    },
    [acceptMut]
  );

  const handleReject = useCallback(
    (id: string) => {
      rejectMut.mutate(id);
    },
    [rejectMut]
  );

  const downloadingMap = useState<Record<string, boolean>>({})[0];
  const [, setDownloadingMap] = useState<Record<string, boolean>>({});

  const handleDownload = useCallback(async (deck: PitchDeckWithRelations) => {
    try {
      setDownloadingMap((m) => ({ ...m, [deck.id]: true }));
      const blob = await downloadPitchDeck(deck.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = deck.file_path?.match(/\.[a-z0-9]+$/i)?.[0] || "";
      const name = (deck.title?.trim() || "pitch-deck") + ext || "pitch-deck";
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Download started");
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to download pitch deck";
      toast.error(msg);
    } finally {
      setDownloadingMap((m) => ({ ...m, [deck.id]: false }));
    }
  }, []);

  // Remove submit handler; debounce handles refetch
  // const onSubmit: SubmitHandler<FormValues> = () => {
  //   setPage(1);
  //   refetch();
  // };

  const metaCurrent = (decksRes as any)?.current_page ?? page;
  const metaLast = (decksRes as any)?.last_page ?? page;
  const metaTotal = (decksRes as any)?.total ?? decks.length;
  const canPrev = metaCurrent > 1;
  const canNext = metaCurrent < metaLast;

  return (
    <>
      <PageTitle />
      {/* Replace form submit with plain container; debounce triggers fetch */}
      <div className="w-100">
        <div className="card">
          <div className="card-body p-6">
            <Row className="g-4">
              <Col className="position-relative w-md-400px me-md-2">
                <label htmlFor="pitchdeck-search" className="form-label mb-2">
                  Search
                </label>
                <input
                  id="pitchdeck-search"
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Search by title or uploader"
                  {...register("search")}
                />
              </Col>

              <Col className="w-md-200px">
                <label htmlFor="pitchdeck-status" className="form-label mb-2">
                  Status
                </label>
                <select
                  id="pitchdeck-status"
                  className="form-select form-select-solid"
                  data-control="select2"
                  data-placeholder="Filter by status"
                  data-hide-search="true"
                  {...register("status", { onChange: () => setPage(1) })}
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="refused">Refused</option>
                </select>
              </Col>

              <Col className="w-md-200px">
                <label className="form-label mb-2">Investment Category</label>
                <select
                  className="form-select form-select-solid"
                  {...register("investment_category", {
                    onChange: () => setPage(1),
                  })}
                >
                  <option value="">All categories</option>
                  {INVESTMENT_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Col>

              <Col className="w-md-200px">
                <label className="form-label mb-2">Maturity Level</label>
                <select
                  className="form-select form-select-solid"
                  {...register("maturity_level", {
                    onChange: () => setPage(1),
                  })}
                >
                  <option value="">All levels</option>
                  {MATURITY_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>

            <Row className="g-4 mt-4">
              <Col className="w-md-200px">
                <label className="form-label mb-2">Country</label>
                <select
                  className="form-select form-select-solid"
                  {...register("country_id", { onChange: () => setPage(1) })}
                >
                  <option value="">All countries</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Col>

              <Col className="w-md-250px">
                <label className="form-label mb-2">Activity Sector</label>
                <select
                  className="form-select form-select-solid"
                  {...register("activity_sectors", {
                    onChange: () => setPage(1),
                  })}
                >
                  <option value="">All sectors</option>
                  {ACTIVITY_SECTOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>

            <Row className="g-4 mt-4">
              <Col className="w-md-150px">
                <label className="form-label mb-2">Year of Creation</label>
                <input
                  type="number"
                  className="form-control form-control-solid"
                  {...register("year_of_creation", {
                    onChange: () => setPage(1),
                  })}
                />
              </Col>

              <Col className="w-md-150px">
                <label className="form-label mb-2">Revenue 2024</label>
                <input
                  type="number"
                  className="form-control form-control-solid"
                  {...register("revenue_2024", { onChange: () => setPage(1) })}
                />
              </Col>

              <Col className="w-md-150px">
                <label className="form-label mb-2">Users</label>
                <input
                  type="number"
                  className="form-control form-control-solid"
                  {...register("users_count", { onChange: () => setPage(1) })}
                />
              </Col>

              <Col className="w-md-180px">
                <label className="form-label mb-2">Employees</label>
                <input
                  type="number"
                  className="form-control form-control-solid"
                  {...register("employees_count", {
                    onChange: () => setPage(1),
                  })}
                />
              </Col>

              <Col className="w-md-200px">
                <label className="form-label mb-2">
                  Requested Amount (USD)
                </label>
                <input
                  type="number"
                  className="form-control form-control-solid"
                  {...register("requested_amount_usd", {
                    onChange: () => setPage(1),
                  })}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div className="card mt-5">
        <div className="card-body p-4">
          {isLoading && (
            <div className="d-flex align-items-center justify-content-center py-10">
              <Spinner animation="border" />
            </div>
          )}

          {isError && (
            <div className="alert alert-danger">
              Failed to load pitch decks.
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table align-middle table-row-dashed fs-6 gy-5">
                  <thead>
                    <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                      <th className="min-w-250px">Title</th>
                      <th className="min-w-200px">Uploader</th>
                      <th className="min-w-120px">Status</th>
                      <th className="min-w-180px">Uploaded At</th>
                      <th className="min-w-180px">Country</th>
                      <th className="min-w-180px">Investment Category</th>
                      <th className="min-w-180px">Maturity Level</th>
                      <th className="min-w-220px">Activity Sectors</th>
                      <th className="min-w-100px">Year</th>
                      <th className="min-w-140px">Revenue 2024</th>
                      <th className="min-w-120px">Users</th>
                      <th className="min-w-120px">Employees</th>
                      <th className="min-w-180px">Requested Amount (USD)</th>
                      <th className="text-end min-w-250px">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-semibold">
                    {decks.map((deck) => (
                      <tr key={deck.id}>
                        <td
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {deck.title || "(Untitled)"}
                        </td>

                        <td>
                          {deck.uploader ? (
                            <Link
                              to={`/profile/${deck.uploader.id}`}
                              className="d-flex align-items-center text-decoration-none"
                            >
                              {deck.uploader.avatar ? (
                                <img
                                  src={getMediaUrl(deck.uploader.avatar)}
                                  alt="avatar"
                                  className="rounded-circle me-2"
                                  style={{
                                    width: 32,
                                    height: 32,
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div className="symbol symbol-circle symbol-32px overflow-hidden me-2">
                                  <div className="symbol-label fs-6 bg-light-primary text-primary">
                                    {deck.uploader.fname?.slice(0, 1) || "U"}
                                  </div>
                                </div>
                              )}
                              <span>
                                {(deck.uploader.fname || "") +
                                  " " +
                                  (deck.uploader.lname || "")}
                              </span>
                            </Link>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td>
                          <Badge bg={statusVariant(deck.status) as any}>
                            {deck.status === "accepted"
                              ? "Accepted"
                              : deck.status === "pending"
                              ? "Pending"
                              : "Refused"}
                          </Badge>
                        </td>

                        <td>
                          {deck.created_at
                            ? new Date(deck.created_at).toLocaleString()
                            : "—"}
                        </td>

                        <td>
                          {(countries || []).find(
                            (c) => Number(c.id) === (deck.country_id ?? -1)
                          )?.name || "—"}
                        </td>

                        <td>{deck.investment_category || "—"}</td>
                        <td>{deck.maturity_level || "—"}</td>
                        <td>
                          {(deck.activity_sectors || [])?.join(", ") || "—"}
                        </td>
                        <td>{deck.year_of_creation ?? "—"}</td>
                        <td>{deck.revenue_2024 ?? "—"}</td>
                        <td>{deck.users_count ?? "—"}</td>
                        <td>{deck.employees_count ?? "—"}</td>
                        <td>{deck.requested_amount_usd ?? "—"}</td>

                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setDetailId(deck.id)}
                            >
                              <KTIcon
                                iconName="information"
                                className="fs-2 me-1"
                              />
                              View
                            </Button>

                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleDownload(deck)}
                              disabled={!!downloadingMap[deck.id]}
                            >
                              {downloadingMap[deck.id] ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                  />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <KTIcon
                                    iconName="download"
                                    className="fs-2 me-1"
                                  />
                                  Download
                                </>
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleAccept(deck.id)}
                              disabled={
                                acceptMut.isLoading ||
                                deck.status === "accepted"
                              }
                            >
                              <KTIcon iconName="check" className="fs-2 me-1" />
                              Accept
                            </Button>

                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(deck.id)}
                              disabled={
                                rejectMut.isLoading || deck.status === "refused"
                              }
                            >
                              <KTIcon iconName="cross" className="fs-2 me-1" />
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {decks.length === 0 && (
                      <tr>
                        <td
                          colSpan={14}
                          className="text-center text-muted py-10"
                        >
                          No pitch decks found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                  Page {metaCurrent} of {metaLast} • Total {metaTotal}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!canPrev || isLoading}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!canNext || isLoading}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal show={!!detailId} onHide={() => setDetailId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {detailRes?.pitch_deck?.title || "Pitch Deck"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div className="d-flex align-items-center justify-content-center py-6">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Row className="gy-3">
                <Col xs={12}>
                  <div className="d-flex align-items-center gap-3">
                    <Badge
                      bg={
                        statusVariant(
                          (detailRes?.pitch_deck?.status as any) || "pending"
                        ) as any
                      }
                    >
                      {detailRes?.pitch_deck?.status || "—"}
                    </Badge>
                    <span className="text-muted">
                      {detailRes?.pitch_deck?.created_at
                        ? new Date(
                            detailRes.pitch_deck.created_at
                          ).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </Col>

                <Col xs={12}>
                  <div className="fw-bold">Uploader</div>
                  <div>
                    {(detailRes?.pitch_deck?.uploader?.fname || "") +
                      " " +
                      (detailRes?.pitch_deck?.uploader?.lname || "")}
                  </div>
                  <div className="mt-1">
                    <span className="me-3">
                      {detailRes?.pitch_deck?.uploader?.info?.phone || "—"}
                    </span>
                    {detailRes?.pitch_deck?.uploader?.info?.linkedin_url ? (
                      <a
                        href={detailRes.pitch_deck.uploader.info.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Investment Category</div>
                  <div>{detailRes?.pitch_deck?.investment_category || "—"}</div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Maturity Level</div>
                  <div>{detailRes?.pitch_deck?.maturity_level || "—"}</div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Country</div>
                  <div>
                    {(countries || []).find(
                      (c) =>
                        Number(c.id) ===
                        (detailRes?.pitch_deck?.country_id ?? -1)
                    )?.name || "—"}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Year of Creation</div>
                  <div>{detailRes?.pitch_deck?.year_of_creation ?? "—"}</div>
                </Col>

                <Col xs={12}>
                  <div className="fw-bold">Activity Sectors</div>
                  <div>
                    {(detailRes?.pitch_deck?.activity_sectors || [])?.join(
                      ", "
                    ) || "—"}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Revenue 2024</div>
                  <div>{detailRes?.pitch_deck?.revenue_2024 ?? "—"}</div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Requested Amount (USD)</div>
                  <div>
                    {detailRes?.pitch_deck?.requested_amount_usd ?? "—"}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Users</div>
                  <div>{detailRes?.pitch_deck?.users_count ?? "—"}</div>
                </Col>

                <Col md={6}>
                  <div className="fw-bold">Employees</div>
                  <div>{detailRes?.pitch_deck?.employees_count ?? "—"}</div>
                </Col>

                <Col xs={12}>
                  <div className="fw-bold">Description</div>
                  <div>{detailRes?.pitch_deck?.project_description || "—"}</div>
                </Col>

                <Col xs={12}>
                  <div className="fw-bold">Websites</div>
                  <div>
                    {(detailRes?.pitch_deck?.website_links || [])?.map(
                      (u, i) => (
                        <div key={i}>
                          <a href={u} target="_blank" rel="noreferrer">
                            {u}
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DealRoomManagementPage;
