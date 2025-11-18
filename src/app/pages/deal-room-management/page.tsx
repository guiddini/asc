import { useMemo, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import {
  getPitchDecks,
  acceptPitchDeck,
  refusePitchDeck,
  downloadPitchDeck,
} from "../../apis/pitch-deck";
import { Col, Row, Spinner, Badge, Button } from "react-bootstrap";
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
  company_id: string;
  per_page: number;
};

function DealRoomManagementPage() {
  // Filters and pagination
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      search: "",
      status: "",
      company_id: "",
      per_page: 10,
    },
  });

  const [page, setPage] = useState(1);

  const search = watch("search");
  const status = watch("status");
  const company_id = watch("company_id");
  const per_page = watch("per_page");

  // Debounced query params container
  const [queryParams, setQueryParams] = useState<{
    page: number;
    per_page: number;
    status: "" | PitchDeckStatus;
    company_id: string;
    search: string;
  }>({
    page,
    per_page,
    status,
    company_id,
    search,
  });

  // Debounce search and filters; reset page to 1 when filters change
  useEffect(() => {
    const t = setTimeout(() => {
      setQueryParams({
        page: 1,
        per_page,
        status,
        company_id,
        search,
      });
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search, status, company_id, per_page]);

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

  const companies: { id: string; name: string }[] = useMemo(() => {
    // Normalize shape: either array or { data: [...] }
    const raw = Array.isArray(companiesRes)
      ? companiesRes
      : companiesRes?.data || [];
    return (raw || []).map((c: any) => ({
      id: String(c?.id || ""),
      name: String(c?.name || ""),
    }));
  }, [companiesRes]);

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
      queryParams.per_page,
      queryParams.status,
      queryParams.company_id,
      queryParams.search,
    ],
    async () => {
      const res = await getPitchDecks({
        page: queryParams.page,
        per_page: queryParams.per_page,
        status: queryParams.status || undefined,
        company_id: queryParams.company_id || undefined,
        search: queryParams.search || undefined,
      });
      return res;
    },
    {
      keepPreviousData: true,
    }
  );

  const decks: PitchDeckWithRelations[] = useMemo(() => {
    // API returns array (according to types). If backend returns paginated {data: [...]},
    // gracefully support both without breaking.
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

  const canPrev = page > 1;
  const canNext = decks.length >= queryParams.per_page;

  return (
    <>
      <PageTitle />
      {/* Replace form submit with plain container; debounce triggers fetch */}
      <div className="w-100">
        <div className="card">
          <div className="card-body p-6">
            <Row className="d-flex align-items-center justify-content-between w-100">
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

              <Col className="w-md-250px">
                <label htmlFor="pitchdeck-company" className="form-label mb-2">
                  Company
                </label>
                <select
                  id="pitchdeck-company"
                  className="form-select form-select-solid"
                  data-control="select2"
                  data-placeholder="Filter by company"
                  data-hide-search="true"
                  {...register("company_id", {
                    onChange: () => setPage(1),
                  })}
                >
                  <option value="">All companies</option>
                  {companies.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
                  {...register("status", {
                    onChange: () => setPage(1),
                  })}
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="refused">Refused</option>
                </select>
              </Col>

              <Col className="w-md-120px">
                <label htmlFor="pitchdeck-per-page" className="form-label mb-2">
                  Items per page
                </label>
                <select
                  id="pitchdeck-per-page"
                  className="form-select form-select-solid"
                  {...register("per_page", {
                    valueAsNumber: true,
                    onChange: () => setPage(1),
                  })}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </Col>

              {/* Removed Search button */}
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
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-250px">Title</th>
                    <th className="min-w-200px">Company</th>
                    <th className="min-w-200px">Uploader</th>
                    <th className="min-w-120px">Status</th>
                    <th className="min-w-200px">Uploaded At</th>
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
                        {deck.company ? (
                          <Link
                            to={`/company/${deck.company.id}`}
                            className="d-inline-flex align-items-center text-decoration-none"
                          >
                            {deck.company.logo && (
                              <img
                                src={getMediaUrl(deck.company.logo)}
                                alt={deck.company.name}
                                className="rounded me-2"
                                style={{
                                  width: 32,
                                  height: 32,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <span className="fw-semibold">
                              {deck.company.name}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
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
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
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
                            disabled={acceptMut.isLoading || deck.status === "accepted"}
                          >
                            <KTIcon iconName="check" className="fs-2 me-1" />
                            Accept
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(deck.id)}
                            disabled={rejectMut.isLoading || deck.status === "refused"}
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
                      <td colSpan={6} className="text-center text-muted py-10">
                        No pitch decks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">Page {page}</div>
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
    </>
  );
};

export default DealRoomManagementPage;
