import { FC, lazy, Suspense } from "react";
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
import EventPage from "../pages/event/event-page";
import WelcomePage from "../pages/welcome";
import ComingSoon from "../pages/coming-soon";
import PRessConferencePage from "../pages/press-conference/page";
import TicketTransactionsPage from "../pages/ticket-transactions/page";
import ExhibitionRequest from "../pages/exhibitor/demand";
import EventManagement from "../pages/event-management/page";
import ExhibitionRequests from "../pages/exhibition-requests/page";
import ExhibitionConfirmation from "../pages/exhibitor/confirm";
import ExhibitorOnlinePaymentResults from "../pages/exhibitor/results";
import CompanyReservationPage from "../pages/reservations/page";
import { TicketWrapper } from "../helpers/ticket-wrapper";
import UserProfileWrapper from "../utils/user-profile-wrapper";
import BlogsManagementPage from "../pages/blog-management/page";
import CreateBlogPage from "../pages/blog-management/create-blog/page";
import UpdateBlogPage from "../pages/blog-management/update-blog/page";

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
  const WizardsPage = lazy(() => import("../modules/wizards/WizardsPage"));
  const AccountPage = lazy(() => import("../modules/accounts/AccountPage"));
  const WidgetsPage = lazy(() => import("../modules/widgets/WidgetsPage"));
  const ChatPage = lazy(() => import("../modules/apps/chat/ChatPage"));
  const Users2Page = lazy(
    () => import("../modules/apps/user-management/UsersPage")
  );

  return (
    <Routes>
      <Route
        element={
          <TicketWrapper>
            <Outlet />
          </TicketWrapper>
        }
      >
        <Route path="/welcome" element={<WelcomePage />} />

        <Route
          element={
            <UserProfileWrapper>
              <Outlet />
            </UserProfileWrapper>
          }
        >
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/exhibition/request" element={<ExhibitionRequest />} />
          <Route
            path="/exhibition/confirm/:companyId"
            element={<ExhibitionConfirmation />}
          />
          <Route path="/events/manage" element={<EventManagement />} />
          <Route
            path="/exhibition/request/results/:transactionID"
            element={<ExhibitorOnlinePaymentResults />}
          />

          <Route element={<MasterLayout />}>
            {/* Redirect to Dashboard after success login/registartion */}
            <Route path="auth/*" element={<Navigate to="/home" />} />
            {/* Pages */}
            {/* home feed */}
            <Route
              path="/home"
              element={
                <SuspensedView>
                  <HomeWrapper />
                </SuspensedView>
              }
            />

            <Route
              path="/blogs-management"
              element={
                <SuspensedView>
                  <BlogsManagementPage />
                </SuspensedView>
              }
            />

            <Route
              path="/blogs-management/create"
              element={
                <SuspensedView>
                  <CreateBlogPage />
                </SuspensedView>
              }
            />

            <Route
              path="/blogs-management/update/:id"
              element={
                <SuspensedView>
                  <UpdateBlogPage />
                </SuspensedView>
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
            <Route
              path="apps/chat/*"
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
              path="/company/stand/reservations"
              element={
                <SuspensedView>
                  <CompanyReservationPage />
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

            <Route
              path="/config/activities"
              element={
                <SuspensedView>
                  <Activities />
                </SuspensedView>
              }
            />

            <Route
              path="/exhibition-requests"
              element={
                <SuspensedView>
                  <ExhibitionRequests />
                </SuspensedView>
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
