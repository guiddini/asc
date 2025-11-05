import { AsideMenuItemWithSubMain } from "./AsideMenuItemWithSubMain";
import { AsideMenuItem } from "./AsideMenuItem";
import { UserResponse } from "../../../../app/types/reducers";
import { useSelector } from "react-redux";
import {
  canEditCompany,
  canViewCompany,
} from "../../../../app/features/userSlice";
import RoleGuard from "../../../../app/components/role-guard";
import { useQuery } from "react-query";
import { getPendingUserConnectionsCount } from "../../../../app/apis/user-connection";
import {
  adminRoles,
  exhibitionRoles,
  mediaRoles,
  programRoles,
  staffRoles,
} from "../../../../app/utils/roles";

// Permission checks are handled via RoleGuard using adminRoles

export function AsideMenuMain() {
  const { user } = useSelector((state: UserResponse) => state.user);
  const hasCompany = user?.company ? true : false;
  const companyID = user?.company?.id;

  const isCompanyEditor = useSelector((state) =>
    canEditCompany(state, companyID)
  );

  const isCompanyStaff = useSelector((state) =>
    canViewCompany(state, companyID)
  );

  const { data: pendingCountData } = useQuery(
    ["connections", "pending", "count"],
    getPendingUserConnectionsCount,
    {
      staleTime: 60 * 1000,
    }
  );
  const pendingBadge =
    pendingCountData && pendingCountData.count > 0
      ? pendingCountData.count
      : undefined;

  return (
    <>
      {/* home */}
      <AsideMenuItem
        to="/home"
        title="Home"
        // fontIcon="bi-house-solid fs-2"
        customIcon={<i className="fa-solid fa-house"></i>}
        bsTitle="Home"
        className="py-2"
      />
      <RoleGuard allowedRoles={mediaRoles}>
        <AsideMenuItem
          to="/media"
          title="Media"
          // fontIcon="bi-house-solid fs-2"
          customIcon={<i className="fa-solid fa-photo-film"></i>}
          bsTitle="Media"
          className="py-2"
        />
      </RoleGuard>
      {isCompanyStaff && (
        <>
          <AsideMenuItemWithSubMain
            to="/company"
            title="My Company"
            bsTitle="My Company"
            fontIcon="bi-briefcase fs-2"
            icon="briefcase"
          >
            <AsideMenuItem
              to={`/startup/demand`}
              title="Reservations"
              bsTitle="Reservations"
              hasBullet={true}
            />
            <AsideMenuItem
              to={`/company/${companyID}`}
              title="Profile"
              bsTitle="Profile"
              hasBullet={true}
            />

            <AsideMenuItem
              to={`/company/${companyID}/staff`}
              title="Staff"
              bsTitle="Staff"
              hasBullet={true}
            />
          </AsideMenuItemWithSubMain>
        </>
      )}

      <AsideMenuItemWithSubMain
        to={`/agenda`}
        title="Agenda"
        bsTitle="Agenda"
        customIcon={<i className="fa-solid fa-calendar"></i>}
      >
        <AsideMenuItem
          to={`/program`}
          title="Program"
          bsTitle="Program"
          hasBullet
        />
        <AsideMenuItem
          to={`/agenda`}
          title="Agenda"
          bsTitle="Agenda"
          hasBullet
        />
        <AsideMenuItem
          to={`/meetings`}
          title="Meetings"
          bsTitle="Meetings"
          hasBullet
        />
      </AsideMenuItemWithSubMain>

      <AsideMenuItemWithSubMain
        to={`/participants`}
        title="Participants"
        bsTitle="Participants"
        customIcon={<i className="fa-solid fa-users"></i>}
        badge={pendingBadge}
      >
        <AsideMenuItem
          to={`/participants`}
          title="Participants"
          bsTitle="Participants"
          hasBullet={true}
        />
        <AsideMenuItem
          to={`/my-connections`}
          title="My Connections"
          bsTitle="My Connections"
          hasBullet={true}
          badge={pendingBadge}
        />
      </AsideMenuItemWithSubMain>

      <AsideMenuItem
        to={`/companies`}
        title="Exhibitors"
        bsTitle="Exposants"
        customIcon={<i className="fa-solid fa-handshake"></i>}
      />

      <AsideMenuItemWithSubMain
        to={`/products`}
        title="Products"
        bsTitle="Produits"
        customIcon={<i className="fa-solid fa-bag-shopping"></i>}
      >
        <AsideMenuItem
          to={`/products`}
          title="View All Products"
          bsTitle="Voir tous les produits"
          hasBullet={true}
        />

        {isCompanyStaff && (
          <AsideMenuItem
            to={`/company/${companyID}/products`}
            title="My Products"
            bsTitle="Mes produits"
            hasBullet={true}
          />
        )}
        {isCompanyEditor && (
          <AsideMenuItem
            to={`/company/${companyID}/products/create`}
            title="Add Product"
            bsTitle="Ajouter un produit"
            hasBullet={true}
          />
        )}
      </AsideMenuItemWithSubMain>

      {/* dashboard */}

      <AsideMenuItem
        to="/badge"
        title="My badge"
        bsTitle="Mon badge"
        customIcon={<i className="fa-solid fa-qrcode"></i>}
      />

      <AsideMenuItem
        to={`/visa-demand`}
        title="Visa Demand"
        bsTitle="Visa Demand"
        customIcon={<i className="fa-solid fa-id-card"></i>}
      />

      <AsideMenuItem
        to={`/tickets`}
        title="Tickets"
        bsTitle="Tickets"
        customIcon={<i className="fa-solid fa-ticket"></i>}
      />

      {isCompanyStaff && (
        <AsideMenuItem
          to={`/ads`}
          title="Ads"
          bsTitle="Ads"
          customIcon={<i className="fa-solid fa-tower-broadcast"></i>}
        />
      )}

      <AsideMenuItemWithSubMain
        to="/job-offers/all"
        title="Job Offers"
        bsTitle="Offres d'emploi"
        customIcon={<i className="fa-solid fa-house-laptop"></i>}
        icon="briefcase"
      >
        <AsideMenuItem
          to={`/job-offers/all`}
          title="All Job Offers"
          bsTitle="Toutes les offres d'emploi"
          hasBullet={true}
        />
        {!hasCompany && (
          <AsideMenuItem
            to={`/job-offers/applications`}
            title="My Applications"
            bsTitle="Mes candidatures"
            hasBullet={true}
          />
        )}
        {isCompanyEditor && (
          <AsideMenuItem
            to={`/job-offers/create/${companyID}`}
            title="Add Job Offer"
            bsTitle="Ajouter un offre d'emploi"
            hasBullet={true}
          />
        )}

        {isCompanyStaff && (
          <>
            <AsideMenuItem
              to={`/job-offers/${companyID}`}
              title="My Job Offers"
              bsTitle="Mes offres d'emploi"
              hasBullet={true}
            />
          </>
        )}
      </AsideMenuItemWithSubMain>

      <RoleGuard allowedRoles={staffRoles}>
        <AsideMenuItemWithSubMain
          to="/config"
          title="Admin"
          bsTitle="Admin"
          fontIcon="bi-gear"
        >
          <RoleGuard allowedRoles={["admin", "super_admin"]}>
            <AsideMenuItem
              to="/statistics"
              title="Statistics"
              customIcon={<i className="fa-solid fa-chart-simple"></i>}
              hasBullet
            />

            <AsideMenuItem
              to="/users"
              title="User management"
              hasBullet
              bsTitle="User management"
              customIcon={<i className="fa-solid fa-user"></i>}
            />

            <AsideMenuItem
              to="/media-management"
              title="Media Management"
              customIcon={<i className="fa-solid fa-blog"></i>}
              bsTitle="Media Management"
              hasBullet
            />

            <AsideMenuItem
              to="/contact-management"
              title="Contact Management"
              hasBullet
              bsTitle="Contact Management"
              customIcon={<i className="fa-solid fa-address-book"></i>}
            />

            <AsideMenuItem
              to="/sponsor-requests-management"
              title="Sponsor Requests"
              hasBullet
              bsTitle="Sponsor Requests"
              customIcon={<i className="fa-solid fa-handshake"></i>}
            />

            <AsideMenuItem
              to="/ticket-transactions"
              title="Ticket Transactions"
              hasBullet
              bsTitle="Ticket Transactions"
              customIcon={<i className="fa-solid fa-ticket"></i>}
            />

            <AsideMenuItem
              to="/visa-demand-management"
              title="Visa Demands"
              hasBullet
              bsTitle="Visa Demands"
              customIcon={<i className="fa-solid fa-person-chalkboard"></i>}
            />

            <AsideMenuItem
              to="/guests"
              title="Guests management"
              hasBullet
              bsTitle="Guests management"
              customIcon={<i className="fa-solid fa-user-check"></i>}
            />

            <AsideMenuItem
              to="/roles"
              title="Roles management"
              hasBullet
              bsTitle="Roles management"
              customIcon={<i className="fa-solid fa-user-shield"></i>}
            />

            <AsideMenuItem
              to="/config/products"
              title="Products management"
              fontIcon="bi-cart fs-3"
              hasBullet
            />

            <AsideMenuItem
              to="/config/featured-products"
              title="Featured Products"
              customIcon={<i className="fa-solid fa-star"></i>}
              hasBullet
            />

            <AsideMenuItem
              to="/config/productsCategories"
              title="Products categories"
              customIcon={<i className="fa-solid fa-list" />}
              hasBullet
            />

            <AsideMenuItem
              to="/config/ads"
              title="Advertisements"
              customIcon={<i className="fa-solid fa-bullhorn"></i>}
              hasBullet
            />

            <AsideMenuItem
              to="/config/reports"
              title="Reports"
              customIcon={<i className="fa-solid fa-flag"></i>}
              hasBullet
            />

            <AsideMenuItem
              to="/config/activities"
              title="Activities"
              customIcon={<i className="fa-solid fa-chart-line me-2"></i>}
              hasBullet
            />

            <AsideMenuItem
              to="/config/occupations"
              title="Occupations"
              customIcon={<i className="fa-solid fa-briefcase"></i>}
              hasBullet
            />

            <AsideMenuItem
              to="/config/legal-status"
              title="Legal Statut"
              customIcon={<i className="fa-solid fa-scale-balanced"></i>}
              hasBullet
            />
          </RoleGuard>

          <RoleGuard allowedRoles={programRoles}>
            <AsideMenuItem
              to="/side-events-management"
              title="Side Events Management"
              hasBullet
              bsTitle="Side Events Management"
              customIcon={<i className="fa-solid fa-calendar-days"></i>}
            />
            <AsideMenuItem
              to="/program-event-management"
              title="Program Events"
              hasBullet
              bsTitle="Program Events"
              customIcon={<i className="fa-solid fa-calendar-days"></i>}
            />
            <AsideMenuItem
              to="/conferences-management"
              title="Conferences"
              hasBullet
              bsTitle="Conferences"
              customIcon={<i className="fa-solid fa-calendar-days"></i>}
            />
            <AsideMenuItem
              to="/workshop-management"
              title="Workshops"
              hasBullet
              bsTitle="Workshops"
              customIcon={<i className="fa-solid fa-chalkboard-user"></i>}
            />
          </RoleGuard>

          <RoleGuard allowedRoles={exhibitionRoles}>
            <AsideMenuItem
              to="/exhibition-requests"
              title="Exhibition Requests"
              hasBullet
              bsTitle="Exhibition Requests"
              customIcon={<i className="fa-solid fa-users"></i>}
            />
          </RoleGuard>
        </AsideMenuItemWithSubMain>
      </RoleGuard>
    </>
  );
}
