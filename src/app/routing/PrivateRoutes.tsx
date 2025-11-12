import { FC, lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { MenuTestPage } from "../pages/MenuTestPage";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import {
  GuestsPage,
  HomeWrapper,
  RolesPage,
  UsersPage,
  CompaniesPageWrapper,
  CompanyDetail,
  ServicesPage,
  CreateService,
  TicketPage,
  Activities,
  FeaturedProducts,
  LegalStatus,
  Occupations,
  AdsPage,
  CompanyStaffPage,
  CompanyProductServiceCategoriesPage,
  UpdateProductServicePage,
  ProductsPage,
  ProductdetailPage,
  ParticipantsPage,
  AllProductsPage,
  UpdateCompanyPage,
  BadgePage,
  CompanyAdsPage,
  CompanyJobOffers,
  CreateJobOffer,
  AllJobOffers,
  UserJobApplications,
  JobOfferDetailPage,
  CompanyJobApplications,
  UpdateJobOffer,
  DevTalentSubsciptions,
} from "../pages";
import ReportsPage from "../pages/configurations/reports/reports-page";
import StatisticsPage from "../pages/statistics/page";
import EventPage from "../pages/event/event-page";
import PRessConferencePage from "../pages/press-conference/page";
import TicketTransactionsPage from "../pages/ticket-transactions/page";
import EventManagement from "../pages/event-management/page";
import ExhibitionRequests from "../pages/exhibition-requests/page";
import CompanyReservationPage from "../pages/reservations/page";
import UserProfileWrapper from "../utils/user-profile-wrapper";
import MediaManagementPage from "../pages/media-management/page";
import CreateMediaPage from "../pages/media-management/create-media/page";
import UpdateMediaPage from "../pages/media-management/update-media/page";
import RoleGuard from "../components/role-guard";
import MeetingsCalendar from "../pages/meetings/page";
import AgendaPage from "../pages/agenda/page";
import ConferencesPage from "../pages/conference/page";
import ConferenceDetailPage from "../pages/conference/detail/page";
import ComingSoonASC from "../pages/commingsoonAsc/page";
import ProgramPage from "../pages/program/page";
import CreateStartupPage from "../pages/startup/create-startup-page";
import OnlinePaymentResultsPage from "../pages/payment/results/page";
import AppModal from "../components/app-modal";
import { Calendar, Phone } from "lucide-react";
import { Button } from "react-bootstrap";
import WorkshopsManagementPage from "../pages/workshop/page";
import WorkshopDetailPage from "../pages/workshop/detail/page";
import VisaDemandsManagementPage from "../pages/visa-demands-management/page";
import VisaDemandPage from "../pages/visa-demand/page";
import ProgramEventManagement from "../pages/program-event-management/page";
import ManageMyConnectionsPage from "../pages/connections/page";
import ChatPage from "../pages/chat/page";
import MediaPage from "../pages/media/page";
import MediaSlugPage from "../pages/media/slug/page";
import ContactManagementPage from "../pages/contact-management/page";
import SponsorRequestsManagementPage from "../pages/sponsors-requests-management/page";
import SideEventsManagement from "../pages/side-events-management/page";
import CreateSideEvent from "../pages/side-events-management/create-side-event";
import UpdateSideEvent from "../pages/side-events-management/update-side-event";
import SideEventDetails from "../pages/side-events-management/side-event-details";
import {
  adminRoles,
  exhibitionRoles,
  mediaRoles,
  programRoles,
} from "../utils/roles";
import SponsorsManagementPage from "../pages/sponsor-management/page";

const PrivateRoutes = () => {
  const [showAppModal, setShowAppModal] = useState(false);
  const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
  const WizardsPage = lazy(() => import("../modules/wizards/WizardsPage"));
  const AccountPage = lazy(() => import("../modules/accounts/AccountPage"));
  const WidgetsPage = lazy(() => import("../modules/widgets/WidgetsPage"));
  const Users2Page = lazy(
    () => import("../modules/apps/user-management/UsersPage")
  );
  const MODAL_STORAGE_KEY = "asc_app_modal_last_seen";
  const MODAL_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

  useEffect(() => {
    try {
      const lastSeenStr = localStorage.getItem(MODAL_STORAGE_KEY);
      const now = Date.now();
      const lastSeen = lastSeenStr ? parseInt(lastSeenStr, 10) : 0;

      // Show if never seen or cooldown expired
      if (!lastSeenStr || now - lastSeen >= MODAL_COOLDOWN_MS) {
        setShowAppModal(true);
        // Mark as viewed immediately to avoid re-show on refresh
        localStorage.setItem(MODAL_STORAGE_KEY, String(now));
      }
    } catch {
      // Ignore localStorage errors (e.g., privacy mode)
    }
  }, []);

  return (
    <Routes>
      <Route
        element={
          <div className="w-100 h-100">
            <Button
              variant="secondary"
              className="position-fixed bottom-0 end-0 m-4 px-4 py-3"
              style={{ zIndex: 99999 }}
              type="button"
              onClick={() => setShowAppModal(true)}
            >
              <i className="ki-duotone ki-phone fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              <span className="fw-bold">Get Application</span>
            </Button>

            <Outlet />
            <AppModal
              onHide={() => setShowAppModal(false)}
              show={showAppModal}
            />
          </div>
        }
      >
        <Route
          element={
            <UserProfileWrapper>
              <Outlet />
            </UserProfileWrapper>
          }
        >
          {/* <Route path="/coming-soon" element={<ComingSoon />} /> */}
          <Route path="/comingSoon" element={<ComingSoonASC />} />

          <Route path="/events/manage" element={<EventManagement />} />

          <Route element={<MasterLayout />}>
            {/* Redirect to Dashboard after success login/registartion */}
            <Route path="auth/*" element={<Navigate to="/home" />} />
            {/* Pages */}
            {/* General Routes */}
            {/* home feed */}
            <Route
              path="/home"
              element={
                <SuspensedView>
                  <HomeWrapper />
                </SuspensedView>
              }
            />

            {/* Media Routes */}
            <Route
              path="/media"
              element={
                <RoleGuard allowedRoles={mediaRoles}>
                  <SuspensedView>
                    <MediaPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/media/:slug"
              element={
                <RoleGuard allowedRoles={mediaRoles}>
                  <SuspensedView>
                    <MediaSlugPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/my-connections"
              element={
                <SuspensedView>
                  <ManageMyConnectionsPage />
                </SuspensedView>
              }
            />

            {/* Program Routes */}
            <Route
              path="/side-events-management/update/:id"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <UpdateSideEvent />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/side-events-management/:id"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <SideEventDetails />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/side-events-management/create"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <CreateSideEvent />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/side-events-management"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <SideEventsManagement />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/contact-management"
              element={
                <RoleGuard allowedRoles={adminRoles} showError>
                  <SuspensedView>
                    <ContactManagementPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />
            <Route
              path="/sponsor-requests-management"
              element={
                <RoleGuard allowedRoles={adminRoles} showError>
                  <SuspensedView>
                    <SponsorRequestsManagementPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/media-management"
              element={
                <RoleGuard allowedRoles={adminRoles} showError>
                  <SuspensedView>
                    <MediaManagementPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/media-management/create"
              element={
                <RoleGuard allowedRoles={adminRoles} showError>
                  <SuspensedView>
                    <CreateMediaPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/media-management/update/:id"
              element={
                <RoleGuard allowedRoles={adminRoles} showError>
                  <SuspensedView>
                    <UpdateMediaPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/program-event-management"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <ProgramEventManagement />
                  </SuspensedView>
                </RoleGuard>
              }
            />
            <Route
              path="/visa-demand-management"
              element={
                <RoleGuard allowedRoles={adminRoles} showError>
                  <SuspensedView>
                    <VisaDemandsManagementPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />
            <Route
              path="/visa-demand"
              element={
                <SuspensedView>
                  <VisaDemandPage />
                </SuspensedView>
              }
            />
            <Route
              path="/workshop-management"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <WorkshopsManagementPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />
            <Route
              path="/workshop-management/:id"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <WorkshopDetailPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />
            <Route
              path="/conferences-management"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <ConferencesPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />
            <Route
              path="/conferences-management/:id"
              element={
                <RoleGuard allowedRoles={programRoles} showError>
                  <SuspensedView>
                    <ConferenceDetailPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/event/:slug"
              element={
                <SuspensedView>
                  <EventPage />
                </SuspensedView>
              }
            />

            <Route
              path="/meetings"
              element={
                <SuspensedView>
                  <MeetingsCalendar />
                </SuspensedView>
              }
            />
            <Route
              path="/agenda"
              element={
                <SuspensedView>
                  <AgendaPage />
                </SuspensedView>
              }
            />

            {/*  */}
            {/* <Route path="dashboard" element={<DashboardWrapper />} /> */}
            <Route path="menu-test" element={<MenuTestPage />} />
            {/* Lazy Modules */}
            <Route
              path="/profile/:id/*"
              element={
                <SuspensedView>
                  <ProfilePage />
                </SuspensedView>
              }
            />
            <Route
              path="crafted/pages/wizards/*"
              element={
                <SuspensedView>
                  <WizardsPage />
                </SuspensedView>
              }
            />
            <Route
              path="crafted/widgets/*"
              element={
                <SuspensedView>
                  <WidgetsPage />
                </SuspensedView>
              }
            />
            <Route
              path="crafted/account/*"
              element={
                <SuspensedView>
                  <AccountPage />
                </SuspensedView>
              }
            />
            {/* <Route
              path="apps/chat/*"
              element={
                <SuspensedView>
                  <ChatPage />
                </SuspensedView>
              }
            /> */}

            {/* Conversations/Chat */}
            <Route
              path="/chat"
              element={
                <SuspensedView>
                  <ChatPage />
                </SuspensedView>
              }
            />
            <Route
              path="/users"
              element={
                <SuspensedView>
                  <UsersPage />
                </SuspensedView>
              }
            />
            <Route
              path="/ticket-transactions"
              element={
                <SuspensedView>
                  <TicketTransactionsPage />
                </SuspensedView>
              }
            />

            <Route
              path="/statistics"
              element={
                <RoleGuard allowedRoles={adminRoles} showError>
                  <SuspensedView>
                    <StatisticsPage />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/press-conference-management"
              element={
                <SuspensedView>
                  <PRessConferencePage />
                </SuspensedView>
              }
            />
            <Route
              path="/users-management"
              element={
                <SuspensedView>
                  <Users2Page />
                </SuspensedView>
              }
            />

            {/* Products routes */}
            <Route
              path="/products"
              element={
                <SuspensedView>
                  <ProductsPage />
                </SuspensedView>
              }
            />
            {/* Products routes */}
            <Route
              path="/products/:id"
              element={
                <SuspensedView>
                  <ProductdetailPage />
                </SuspensedView>
              }
            />

            {/* Startups */}
            <Route
              path="/startup/create"
              element={
                <SuspensedView>
                  <CreateStartupPage />
                </SuspensedView>
              }
            />

            {/* companies routes */}
            <Route
              path="/companies"
              element={
                <SuspensedView>
                  <CompaniesPageWrapper />
                </SuspensedView>
              }
            />
            <Route
              path="/company/:id"
              element={
                <SuspensedView>
                  <CompanyDetail />
                </SuspensedView>
              }
            />
            <Route
              path="/company/:id/products"
              element={
                <SuspensedView>
                  <ServicesPage />
                </SuspensedView>
              }
            />
            <Route
              path="/startup/demand"
              element={
                <SuspensedView>
                  <CompanyReservationPage />
                </SuspensedView>
              }
            />

            <Route
              path="/payment/results/:demand_id"
              element={
                <SuspensedView>
                  <OnlinePaymentResultsPage />
                </SuspensedView>
              }
            />

            <Route
              path="/company/:id/update"
              element={
                <SuspensedView>
                  <UpdateCompanyPage />
                </SuspensedView>
              }
            />
            <Route
              path="/company/:id/services/update/:productID"
              element={
                <SuspensedView>
                  <UpdateProductServicePage />
                </SuspensedView>
              }
            />
            <Route
              path="/company/:id/staff"
              element={
                <SuspensedView>
                  <CompanyStaffPage />
                </SuspensedView>
              }
            />
            <Route
              path="/company/:id/products/create"
              element={
                <SuspensedView>
                  <CreateService />
                </SuspensedView>
              }
            />
            {/* tickets page */}

            <Route
              path="/tickets"
              element={
                <SuspensedView>
                  <TicketPage />
                </SuspensedView>
              }
            />

            {/* guests routes */}
            <Route
              path="/guests/*"
              element={
                <SuspensedView>
                  <GuestsPage />
                </SuspensedView>
              }
            />

            {/* participants page */}
            <Route
              path="/participants/*"
              element={
                <SuspensedView>
                  <ParticipantsPage />
                </SuspensedView>
              }
            />

            {/* roles page */}

            <Route
              path="/roles/"
              element={
                <SuspensedView>
                  <RolesPage />
                  {/* <ProtectedRoute requiredPermission="view-role">
                  </ProtectedRoute> */}
                </SuspensedView>
              }
            />

            {/* Job offers */}

            <Route
              path="/job-offers/:companyID"
              element={
                <SuspensedView>
                  <CompanyJobOffers />
                  {/* <ProtectedRoute requiredPermission="view-role">
                  </ProtectedRoute> */}
                </SuspensedView>
              }
            />

            <Route
              path="/job-offers/create/:companyID"
              element={
                <SuspensedView>
                  <CreateJobOffer />
                  {/* <ProtectedRoute requiredPermission="view-role">
                  </ProtectedRoute> */}
                </SuspensedView>
              }
            />

            <Route
              path="/job-offers/all"
              element={
                <SuspensedView>
                  <AllJobOffers />
                </SuspensedView>
              }
            />

            <Route
              path="/job-offers/applications"
              element={
                <SuspensedView>
                  <UserJobApplications />
                </SuspensedView>
              }
            />

            <Route
              path="/job-offers/:companyID/detail/:jobID"
              element={
                <SuspensedView>
                  <JobOfferDetailPage />
                </SuspensedView>
              }
            />

            <Route
              path="/job-offers/:companyID/update/:jobID"
              element={
                <SuspensedView>
                  <UpdateJobOffer />
                </SuspensedView>
              }
            />

            <Route
              path="/job-offers/:companyID/applications/:jobID"
              element={
                <SuspensedView>
                  <CompanyJobApplications />
                </SuspensedView>
              }
            />

            <Route
              path="/job-offers/dev-talents"
              element={
                <SuspensedView>
                  <DevTalentSubsciptions />
                </SuspensedView>
              }
            />

            {/* configuration page */}

            {/* Config Routes */}
            <Route
              path="/config/activities"
              element={
                <SuspensedView>
                  <Activities />
                </SuspensedView>
              }
            />

            {/* Exhibition Routes */}
            <Route
              path="/exhibition-requests"
              element={
                <RoleGuard allowedRoles={exhibitionRoles} showError>
                  <SuspensedView>
                    <ExhibitionRequests />
                  </SuspensedView>
                </RoleGuard>
              }
            />

            <Route
              path="/config/activities"
              element={
                <SuspensedView>
                  <Activities />
                </SuspensedView>
              }
            />

            {/* <Route
              path="/gichet-unique-subscriptions"
              element={
                <SuspensedView>
                  <GichetUniqueManagement />
                </SuspensedView>
              }
            /> */}

            <Route
              path="/config/products"
              element={
                <SuspensedView>
                  <AllProductsPage />
                </SuspensedView>
              }
            />

            <Route
              path="/config/featured-products"
              element={
                <SuspensedView>
                  <FeaturedProducts />
                </SuspensedView>
              }
            />

            <Route
              path="/config/legal-status"
              element={
                <SuspensedView>
                  <LegalStatus />
                </SuspensedView>
              }
            />

            <Route
              path="/config/occupations"
              element={
                <SuspensedView>
                  <Occupations />
                </SuspensedView>
              }
            />

            <Route
              path="/config/ads"
              element={
                <SuspensedView>
                  <AdsPage />
                </SuspensedView>
              }
            />

            <Route
              path="/config/reports"
              element={
                <SuspensedView>
                  <ReportsPage />
                </SuspensedView>
              }
            />

            {/* badge page */}

            <Route
              path="/badge"
              element={
                <SuspensedView>
                  <BadgePage />
                </SuspensedView>
              }
            />

            <Route
              path="/config/productsCategories"
              element={
                <SuspensedView>
                  <CompanyProductServiceCategoriesPage />
                </SuspensedView>
              }
            />

            {/* ads */}

            <Route
              path="/ads"
              element={
                <SuspensedView>
                  <CompanyAdsPage />
                </SuspensedView>
              }
            />

            {/* sponsor management */}

            <Route
              path="/sponsors-management"
              element={
                <SuspensedView>
                  <SponsorsManagementPage />
                </SuspensedView>
              }
            />

            {/* Page Not Found */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
          <Route index element={<Navigate to="/home" />} />
        </Route>
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
