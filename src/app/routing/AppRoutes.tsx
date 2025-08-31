import { FC } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { Logout, AuthPage } from "../modules/auth";
import { App } from "../App";
import ProfileRoutes from "../pages/profiles";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";
import PrivacyPolicy from "../pages/privacy-policy/page";
import SharedTicketsPage from "../pages/shared-tickets/shared-tickets";
import SharedTicketsSuccess from "../pages/shared-tickets/shared-tickets-success";
import SearchTicketPage from "../pages/public/search-ticket-page";
import MonBadge from "../pages/public/mon-badge";
import SpeakerDetail from "../pages/speakers/speaker-detail";
import LandingPage from "../pages/landing-page/page";
import BlogsPage from "../pages/blogs/page";
import LandingLayout from "../pages/landing-page/layout/layout-landing";
import BLogDetailsPage from "../pages/blogs/slug/page";

const AppRoutes: FC = () => {
  const { user } = useSelector((state: UserResponse) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* Landing layout wrapper */}
          <Route
            element={
              <LandingLayout>
                <Outlet />
              </LandingLayout>
            }
          >
            <Route path="/" element={<LandingPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BLogDetailsPage />} />
          </Route>

          {/* Other routes */}
          <Route path="/speakers/:slug" element={<SpeakerDetail />} />
          <Route path="/profiles/*" element={<ProfileRoutes />} />
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shared-tickets/:id" element={<SharedTicketsPage />} />
          <Route path="/ticket" element={<SearchTicketPage />} />
          <Route path="/ticket/qrcode/:userId" element={<MonBadge />} />
          <Route
            path="/shared-tickets-success"
            element={<SharedTicketsSuccess />}
          />

          {user ? (
            <Route path="/*" element={<PrivateRoutes />} />
          ) : (
            <>
              <Route path="auth/*" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
