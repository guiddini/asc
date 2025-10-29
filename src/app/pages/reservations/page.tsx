import {
  ArrowRight,
  Package,
  Ticket,
  BriefcaseBusiness,
  Users,
  Banknote,
  Edit,
} from "lucide-react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  getCompanyExhibitionDemand,
  payOnlineExhibitionDemandApi,
} from "../../apis/exhibition";
import { AxiosResponse } from "axios";
import { getCompanyApi } from "../../apis";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { companyOwner } from "../../features/userSlice";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Card, Table, Button, Spinner, Alert } from "react-bootstrap";
import ExhibitionTypeModal from "./components/exhibition-type-modal";
import { useState } from "react";
import { UploadTransferModal } from "./components/upload-exhibition-transfer-document-modal";
import toast from "react-hot-toast";

interface ExhibitionDemand {
  id: string;
  exhibition_demand_transaction_id: string | null;
  company_id: string;
  user_id: string;
  exhibition_type: string;
  notes?: string;
  status:
    | "pending"
    | "refused"
    | "accepted"
    | "Pending transfer confirmation"
    | string;
  created_at: string;
  updated_at: string;
}

interface ExhibitionTransaction {
  id: string;
  gateway_code: string;
  status: string;
}

interface Company {
  id: string;
  logo: string;
  name: string;
  founded_date: string;
  phone_1: string | null;
  email: string | null;
  city: string;
  address: string;
  activity_areas: string;
  country: {
    name_fr: string;
    name_en: string;
    code: string;
  };
}

interface ApiResponse {
  company: Company;
  demand: ExhibitionDemand | null;
  transaction: ExhibitionTransaction | null;
}

// Pricing configuration
const EXHIBITION_PRICES: Record<string, { dzd: number; usd: number }> = {
  premium_exhibition_space: { dzd: 299900, usd: 1999 },
  connect_desk: { dzd: 29900, usd: 199 },
};

const CompanyReservationPage = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const companyID = user?.company?.id;
  const hasCompany = !!user?.company;
  const isCompanyOwner = useSelector((state) => companyOwner(state, companyID));
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [demandId, setDemandId] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const { data, isLoading } = useQuery<AxiosResponse<ApiResponse>>({
    queryFn: getCompanyExhibitionDemand,
    queryKey: ["company-exhibition-demand"],
    retry: 1,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const reservationData = data?.data;
  const company = reservationData?.company;
  const demand = reservationData?.demand;

  const formatExhibitionType = (type?: string) => {
    if (!type) return "-";
    const explicitMap: Record<string, string> = {
      premium_exhibition_space: "Premium Exhibition Space",
      connect_desk: "Connect Desk",
    };
    if (explicitMap[type]) return explicitMap[type];
    return type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getPrice = (exhibitionType?: string) => {
    if (!exhibitionType) return null;
    return EXHIBITION_PRICES[exhibitionType] || null;
  };

  const formatPrice = (price: { dzd: number; usd: number }) => {
    return `${price.dzd.toLocaleString()} DZD / $${price.usd.toLocaleString()}`;
  };

  const renderStatusBadge = (status?: string) => {
    const normalized = (status || "").toLowerCase().replace(/_/g, " ").trim();

    const colorMap: Record<string, string> = {
      pending: "warning",
      accepted: "success",
      approved: "success",
      refused: "danger",
      failed: "danger",
      rejected: "danger",
      "pending transfer confirmation": "info",
      paid: "primary",
      unpaid: "secondary",
    };

    const variant = colorMap[normalized] || "dark";

    return (
      <span
        className={`badge rounded-pill bg-${variant} text-white`}
        style={{ textTransform: "capitalize" }}
      >
        {(status || "-").replace(/_/g, " ")}
      </span>
    );
  };

  const { data: companyData } = useQuery<AxiosResponse<Company>>({
    queryFn: () => getCompanyApi(company?.id),
    queryKey: ["company", company?.id],
    enabled: !!company?.id,
  });

  const companyInfo = companyData?.data;

  if (isLoading)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </div>
    );

  const handleEdit = () => {
    setMode("update");
    setDemandId(demand?.id ?? "");
    setShowModal(true);
  };

  const handlePayOnline = () => {
    if (!demand?.id) return;
    setIsInitiatingPayment(true);
    payOnlineExhibitionDemandApi(demand?.id)
      .then((res) => {
        const formUrl = res?.data?.data?.attributes?.form_url;
        if (formUrl) {
          toast.success("Redirecting to payment...");
          window.open(formUrl, "_blank");
        } else {
          toast.error("Payment initiation failed: missing form URL");
          console.log("Unexpected payment response:", res?.data);
        }
      })
      .catch((err) => {
        toast.error("Failed to initiate payment");
        console.error(err);
      })
      .finally(() => {
        setIsInitiatingPayment(false);
      });
  };

  const handlePayTransfer = () => {
    setShowTransferModal(true);
  };

  return (
    <div id="company-reservation-container">
      {isCompanyOwner && (
        <>
          <Card>
            <Card.Body>
              <div className="mb-5">
                <h1 className="display-5 fw-bold mb-2">Manage Your Startup</h1>
                <p className="lead text-muted">
                  Manage your company details, exhibition requests, and track
                  your payment status.
                </p>
              </div>

              <h4 className="mb-2">Company Information</h4>
              <p className="text-muted mb-4">
                Review the main information of your participating company.
              </p>

              {companyInfo && (
                <div className="table-responsive">
                  <Table bordered hover>
                    <thead className="table-light">
                      <tr>
                        <th>Logo</th>
                        <th>Name</th>
                        <th>Founded Date</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Activity Areas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <img
                            src={getMediaUrl(companyInfo.logo)}
                            alt={companyInfo.name}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>{companyInfo.name}</td>
                        <td>
                          {new Date(
                            companyInfo.founded_date
                          ).toLocaleDateString()}
                        </td>
                        <td>{companyInfo.country?.name_en}</td>
                        <td>{companyInfo.city}</td>
                        <td>{companyInfo.address}</td>
                        <td>
                          {Array.isArray(companyInfo.activity_areas)
                            ? companyInfo.activity_areas.join(", ")
                            : JSON.parse(
                                companyInfo.activity_areas || "[]"
                              ).join(", ")}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}

              {demand ? (
                <>
                  <h4 className="mb-4">Exhibition Reservation Request</h4>
                  {demand?.notes &&
                    (demand.status || "").toLowerCase().trim() ===
                      "pending" && (
                      <Alert variant="warning" className="mb-4">
                        <strong>
                          The payment is declined and here is the reason :
                        </strong>
                        <span className="ms-2">{demand.notes}</span>
                      </Alert>
                    )}
                  <div className="table-responsive">
                    <Table bordered hover>
                      <thead className="table-light">
                        <tr>
                          <th>Reservation ID</th>
                          <th>Type</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Created On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{demand.id.substring(0, 8)}</td>
                          <td>
                            {formatExhibitionType(demand.exhibition_type)}
                          </td>
                          <td>
                            {getPrice(demand.exhibition_type)
                              ? formatPrice(getPrice(demand.exhibition_type)!)
                              : "-"}
                          </td>
                          <td>{renderStatusBadge(demand.status)}</td>
                          <td>
                            {new Date(demand.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            {demand.status === "accepted" ||
                            demand.status === "failed" ||
                            demand.status === "unpaid" ? (
                              <div className="d-flex gap-2 align-items-center justify-content-center">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={handlePayOnline}
                                  disabled={isInitiatingPayment}
                                >
                                  {isInitiatingPayment ? (
                                    <>
                                      <Spinner
                                        animation="border"
                                        size="sm"
                                        className="me-1"
                                      />
                                      Redirecting...
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src="/media/eventili/dahabia.png"
                                        alt="Dahabia"
                                        className="me-2"
                                        style={{
                                          width: 18,
                                          height: 18,
                                          objectFit: "contain",
                                        }}
                                      />
                                      Pay Online (DZD)
                                    </>
                                  )}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="primary"
                                  disabled={true}
                                  title="Visa payment coming soon"
                                >
                                  <img
                                    src="/media/eventili/visa.png"
                                    alt="Visa payment"
                                    className="me-2"
                                    style={{
                                      width: 22,
                                      height: 22,
                                      objectFit: "contain",
                                    }}
                                  />
                                  VISA ($/€)
                                </Button>

                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={handlePayTransfer}
                                >
                                  <Banknote size={14} className="me-1" />
                                  Bank Transfer (DZD/USD)
                                </Button>
                              </div>
                            ) : ["pending", "refused"].includes(
                                demand.status
                              ) ? (
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={handleEdit}
                              >
                                <Edit size={16} className="me-1" />
                                Edit
                              </Button>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center p-5 mb-5">
                  <h5 className="mb-3">No Exhibition Demand Found</h5>
                  <p className="text-muted mb-4">
                    You haven't submitted any exhibition demand yet.
                  </p>
                  <Button
                    style={{ width: "fit-content" }}
                    variant="primary"
                    onClick={() => {
                      setMode("create");
                      setShowModal(true);
                    }}
                    className="d-inline-flex align-items-center gap-2 mx-auto"
                  >
                    Request a Stand <ArrowRight size={18} />
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
          <UploadTransferModal
            demand_id={demand?.id ?? ""}
            show={showTransferModal}
            onHide={() => setShowTransferModal(false)}
            price={getPrice(demand?.exhibition_type)}
          />
        </>
      )}

      <div style={{ marginTop: "20px" }} id="company-features-grid">
        <div id="feature-card">
          <div id="feature-icon">
            <BriefcaseBusiness size={24} />
          </div>
          <h2 id="feature-title">Job Offers</h2>
          <p id="feature-description">
            Discover and post job opportunities for event participants.
          </p>
          <Link
            to={hasCompany ? `/job-offers/${companyID}` : ""}
            id="feature-link"
          >
            Manage Job Offers
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>

        <div id="feature-card">
          <div id="feature-icon">
            <Package size={24} />
          </div>
          <h2 id="feature-title">Products and Services</h2>
          <p id="feature-description">
            Showcase your products or services to other exhibitors and
            participants.
          </p>
          <Link
            to={hasCompany ? `/company/${companyID}/products` : ""}
            id="feature-link"
          >
            Manage Products and Services
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>

        <div id="feature-card">
          <div id="feature-icon">
            <Ticket size={24} />
          </div>
          <h2 id="feature-title">Ticket Management</h2>
          <p id="feature-description">
            Distribute and manage the tickets assigned to your company.
          </p>
          <Link to="/tickets" id="feature-link">
            Manage Tickets
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>

        <div id="feature-card">
          <div id="feature-icon">
            <Users size={24} />
          </div>
          <h2 id="feature-title">Team Management</h2>
          <p id="feature-description">
            Quickly add team members and manage their permissions with ease.
          </p>
          <Link to={`/company/${companyID}/staff`} id="feature-link">
            Manage My Team
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>
      </div>

      <ExhibitionTypeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={mode}
        demandId={demandId ?? ""}
        currentExhibitionType={demand?.exhibition_type}
      />
    </div>
  );
};

export default CompanyReservationPage;
