// StatisticsPage component
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  ProgressBar,
} from "react-bootstrap";
// Use Lucide icons only
import {
  Users,
  Store,
  IdCard,
  CalendarDays,
  UserCircle,
  Wallet,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { KTIcon } from "../../../_metronic/helpers";
import { useQuery } from "react-query";
import { getAdminStats } from "../../apis/statistics";
import {
  AdminStatsResponse,
  ExhibitionStatus,
  VisaStatus,
  MeetingStatus,
} from "../../types/statistics";

const StatisticsPage = () => {
  const { data, isLoading, error } = useQuery<AdminStatsResponse>({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    staleTime: 60_000,
  });

  const formatNumber = (n?: number) =>
    typeof n === "number" ? new Intl.NumberFormat().format(n) : "0";

  // Replace USD with Dinar and add " DA" suffix
  const formatCurrencyDA = (n?: number) =>
    typeof n === "number"
      ? `${new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
        }).format(n)} DA`
      : "0 DA";

  // Humanize labels like "scale_up_booth" -> "Scale Up Booth"
  const formatLabel = (label: string) =>
    label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "warning",
      accepted: "success",
      refused: "danger",
      paid: "primary",
      failed: "danger",
      declined: "danger",
      cancelled: "danger",
    };
    return colors[status] || "secondary";
  };

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  interface StatCardProps {
    Icon: React.ElementType;
    title: string;
    value: string;
    color: string;
    trend?: number;
  }

  const StatCard: React.FC<StatCardProps> = ({
    Icon,
    title,
    value,
    color,
    trend,
  }) => (
    <Card className="border-0 shadow-sm h-100 overflow-hidden position-relative">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            className={`d-flex align-items-center justify-content-center rounded-3 bg-${color} bg-opacity-10`}
            style={{ width: "56px", height: "56px" }}
          >
            <Icon size={28} className={`text-${color}`} />
          </div>
        </div>
        <h2 className="fw-bold mb-1">{value}</h2>
        <p className="text-muted mb-0 small">{title}</p>
      </Card.Body>
      <div
        className={`position-absolute bottom-0 start-0 w-100 bg-${color} opacity-10`}
        style={{ height: "4px" }}
      ></div>
    </Card>
  );

  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="d-flex flex-column align-items-center justify-content-center py-10">
          <Spinner animation="border" role="status" className="mb-3" />
          <div className="text-muted">Loading statistics...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Failed to load statistics.</Alert>
      </Container>
    );
  }

  if (!data) return null;

  return (
    <Container fluid className="py-4 px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Dashboard Statistics</h1>
        <p className="text-muted mb-0">Overview of your platform metrics</p>
      </div>

      {/* Main Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <StatCard
            Icon={Users}
            title="Total Users"
            value={formatNumber(data.users.total)}
            color="primary"
            trend={12}
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            Icon={Store}
            title="Total Exhibitions"
            value={formatNumber(data.expositions.total)}
            color="success"
            trend={8}
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            Icon={IdCard}
            title="Visa Demands"
            value={formatNumber(data.visas.total)}
            color="info"
            trend={-3}
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            Icon={CalendarDays}
            title="Total Meetings"
            value={formatNumber(data.meetings.total)}
            color="warning"
            trend={15}
          />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* Users by Type */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 me-3"
                  style={{ width: "40px", height: "40px" }}
                >
                  <UserCircle size={20} className="text-primary" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Users by Type</h5>
                  <small className="text-muted">User distribution</small>
                </div>
              </div>

              <div className="mb-3">
                {data.users.by_type.map((type, idx) => {
                  const percentage = calculatePercentage(
                    type.count,
                    data.users.total
                  );
                  const colors = ["primary", "success", "info"];
                  return (
                    <div key={idx} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold">{type.type}</span>
                        <span className="text-muted">
                          {formatNumber(type.count)} ({percentage}%)
                        </span>
                      </div>
                      <ProgressBar
                        now={percentage}
                        variant={colors[idx % colors.length]}
                        style={{ height: "8px" }}
                      />
                    </div>
                  );
                })}
                {data.users.by_type.length === 0 && (
                  <div className="text-muted text-center py-3">
                    No user type data available
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Exhibition Revenue */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 me-3"
                  style={{ width: "40px", height: "40px" }}
                >
                  <Wallet size={20} className="text-success" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Exhibition Revenue</h5>
                  <small className="text-muted">Total revenue breakdown</small>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-baseline mb-2">
                  <h3 className="fw-bold mb-0 me-2">
                    {formatCurrencyDA(data.expositions.revenue.total)}
                  </h3>
                  <Badge bg="success" className="px-2 py-1">
                    <i className="bi bi-arrow-up me-1"></i>Active
                  </Badge>
                </div>
                <p className="text-muted small mb-0">Total collected revenue</p>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <div className="bg-light rounded-3 p-3">
                    <h6 className="fw-bold mb-3 small text-uppercase text-muted">
                      By Stand Type
                    </h6>
                    {Object.entries(
                      data.expositions.revenue.by_stand_type || {}
                    ).map(([type, val], idx) => (
                      <div
                        key={idx}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <span className="small">{formatLabel(type)}</span>
                        <Badge bg="dark" className="px-2 text-white">
                          {formatCurrencyDA(val)}
                        </Badge>
                      </div>
                    ))}
                    {Object.keys(data.expositions.revenue.by_stand_type || {})
                      .length === 0 && (
                      <div className="text-muted text-center small">
                        No data available
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="bg-light rounded-3 p-3">
                    <h6 className="fw-bold mb-3 small text-uppercase text-muted">
                      By Payment Method
                    </h6>
                    {Object.entries(
                      data.expositions.revenue.by_payment_method || {}
                    ).map(([method, val], idx) => (
                      <div
                        key={idx}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <span className="small">{formatLabel(method)}</span>
                        <Badge bg="dark" className="px-2 text-white">
                          {formatCurrencyDA(val)}
                        </Badge>
                      </div>
                    ))}
                    {Object.keys(
                      data.expositions.revenue.by_payment_method || {}
                    ).length === 0 && (
                      <div className="text-muted text-center small">
                        No data available
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Exhibition Status */}
      <Row className="g-4">
        {/* Exhibition Status */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 me-3"
                  style={{ width: "40px", height: "40px" }}
                >
                  <LineChart size={20} className="text-success" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Exhibition Status</h5>
                  <small className="text-muted">Current status breakdown</small>
                </div>
              </div>

              {/* CHANGED: row layout like "By Stand Type" */}
              {["pending", "accepted", "refused", "paid", "failed"].map(
                (status) => (
                  <div
                    key={status}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span className="small text-capitalize">
                      {formatLabel(status)}
                    </span>
                    <Badge bg="dark" className="px-2 text-white">
                      {formatNumber(data.expositions.by_status?.[status] || 0)}
                    </Badge>
                  </div>
                )
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Visa Status */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 me-3"
                  style={{ width: "40px", height: "40px" }}
                >
                  <IdCard size={20} className="text-info" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Visa Status</h5>
                  <small className="text-muted">Application status</small>
                </div>
              </div>

              {/* CHANGED: row layout like "By Stand Type" */}
              {["pending", "accepted", "refused", "cancelled"].map((status) => (
                <div
                  key={status}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <span className="small text-capitalize">
                    {formatLabel(status)}
                  </span>
                  <Badge bg="dark" className="px-2 text-white">
                    {formatNumber(data.visas.by_status?.[status] || 0)}
                  </Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Meeting Status */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 me-3"
                  style={{ width: "40px", height: "40px" }}
                >
                  <CalendarDays size={20} className="text-warning" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Meeting Status</h5>
                  <small className="text-muted">Scheduling overview</small>
                </div>
              </div>

              {/* CHANGED: row layout like "By Stand Type" */}
              {["pending", "accepted", "declined", "cancelled"].map(
                (status) => (
                  <div
                    key={status}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span className="small text-capitalize">
                      {formatLabel(status)}
                    </span>
                    <Badge bg="dark" className="px-2 text-white">
                      {formatNumber(data.meetings.by_status?.[status] || 0)}
                    </Badge>
                  </div>
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StatisticsPage;
