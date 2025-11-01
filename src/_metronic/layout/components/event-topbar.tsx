import {
  ArrowLeftRight,
  Calendar,
  Menu,
  Building,
  DollarSign,
  Plane,
  Newspaper,
  FileText,
} from "lucide-react";
import { Spinner, Dropdown } from "react-bootstrap";
import { KTIcon } from "../../helpers/components/KTIcon";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { getCompanyExhibitionDemand } from "../../../app/apis/exhibition";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../app/types/reducers";
import { TicketsPrivilege } from "../../../app/components";
import { useState, useEffect } from "react";
import { HeaderUserMenu } from "../../partials";
import clsx from "clsx";
import getMediaUrl from "../../../app/helpers/getMediaUrl";
import RevenueUpdateModal from "../../../app/components/revenue-update-modal";

const EventTopbar = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();
  const [showRevenueModal, setShowRevenueModal] = useState(false);

  // Fetch company/demand info
  const { data, isLoading, refetch } = useQuery({
    queryFn: getCompanyExhibitionDemand,
    queryKey: ["company-exhibition-demand"],
    retry: 1,
    onError: (error) => {
      console.error("Error fetching company exhibition demand:", error);
    },
  });

  // Unpack response data
  const reservationData = data?.data;
  const company = reservationData?.company;
  const demand = reservationData?.demand;

  // Check if company is missing revenue information
  useEffect(() => {
    if (company && !isLoading && demand) {
      const missingRevenue =
        !demand?.company.revenue_2024 ||
        !demand?.company.revenue_2025 ||
        !demand?.company.total_funds_raised;

      if (missingRevenue) {
        setShowRevenueModal(true);
      }
    }
  }, [company, isLoading]);

  // Evaluate paid status defensively (supports multiple backend shapes)
  const isDemandPaid = Boolean(
    demand &&
      (demand?.isPaid ||
        demand?.paid ||
        demand?.payment_status === "paid" ||
        demand?.status === "paid" ||
        demand?.transaction?.status === "paid")
  );

  // Removed standalone CTA; the action is now inside the dropdown

  const [showTicketPrivileges, setShowTicketPrivileges] = useState(false);

  return (
    <div id="event-top-bar">
      <div className="container-xxl">
        <div id="event-top-bar-content">
          <div id="event-top-bar-left">
            <div title="Show aside menu " className="d-lg-none">
              <div id="kt_aside_mobile_toggle">
                <div
                  style={{
                    border: "1px #59EFB2 solid",
                  }}
                  id="event-top-bar-switch"
                  role="button"
                >
                  <Menu stroke="#59EFB2" />
                </div>
              </div>
            </div>
            <div id="event-top-bar-event-infos">
              <img
                src="/media/eventili/logos/logo.svg"
                alt="Event logo"
                className="d-none d-md-block"
              />
              <div id="event-top-bar-info">
                <h1>African Startup Conference</h1>

                <div
                  id="event-top-bar-info-calendar"
                  className="d-none d-md-flex"
                >
                  <Calendar />
                  December 06-07-08
                </div>
              </div>
            </div>
          </div>

          <div id="event-top-bar-cta-container">
            {/* Applications & Services Dropdown */}
            <div className="mx-3">
              <Dropdown align="end">
                <Dropdown.Toggle
                  id="applications-services-dropdown"
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                >
                  <KTIcon
                    iconType="outline"
                    iconName="element-11"
                    className="me-1"
                  />
                  Applications & Services
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow">
                  {/* Dynamic Exhibitor / Startup link (temporarily disabled) */}
                  <Dropdown.Item
                    as={Link}
                    to={!company ? "/startup/create" : "/startup/demand"}
                  >
                    <FileText size={16} className="me-2" />
                    {!company
                      ? "Become an Exhibitor"
                      : isDemandPaid
                      ? "My Startup"
                      : "My Exhibition Request"}
                  </Dropdown.Item>

                  <Dropdown.Item as={Link} to="/sponsor-demand">
                    <DollarSign size={16} className="me-2" />
                    Become a Sponsor
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/visa-demand">
                    <Plane size={16} className="me-2" />
                    Visa Demand
                  </Dropdown.Item>
                  <Dropdown.Item disabled>
                    <Newspaper size={16} className="me-2" />
                    Journalist Accreditation
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div
              className={clsx("cursor-pointer symbol")}
              data-kt-menu-trigger="click"
              data-kt-menu-attach="parent"
              data-kt-menu-placement="bottom-end"
            >
              <img
                src={getMediaUrl(user?.avatar)}
                alt="Profile"
                // id="event-management-nav-profile"
                id="event-management-nav-profile"
              />
            </div>
            <HeaderUserMenu />
          </div>
        </div>
      </div>

      <TicketsPrivilege
        ticket={user?.ticket?.slug}
        setIsOpen={() => setShowTicketPrivileges(false)}
        isOpen={showTicketPrivileges}
      />

      {/* Revenue Update Modal */}
      {company && (
        <RevenueUpdateModal
          show={showRevenueModal}
          onHide={() => setShowRevenueModal(false)}
          companyId={company.id}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};

export default EventTopbar;
