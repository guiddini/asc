import { AsideMenuItemWithSubMain } from "./AsideMenuItemWithSubMain";
import { AsideMenuItem } from "./AsideMenuItem";
import { UserResponse } from "../../../../app/types/reducers";
import { useSelector } from "react-redux";
import {
  canEditCompany,
  canViewCompany,
} from "../../../../app/features/userSlice";
import RoleGuard from "../../../../app/components/role-guard";
import { adminRoles } from "../../../../app/routing/PrivateRoutes";

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
      {/* <RoleGuard allowedRoles={adminRoles}>
        <AsideMenuItem
          to="/blogs-management"
          title="Blogs"
          customIcon={<i className="fa-solid fa-blog"></i>}
          bsTitle="Blogs"
          className="py-2"
        />
      </RoleGuard> */}

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

      <AsideMenuItem
        to={`/participants`}
        title="Participants"
        bsTitle="Participants"
        customIcon={<i className="fa-solid fa-users"></i>}
      />

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

      <RoleGuard allowedRoles={adminRoles}>
        <AsideMenuItemWithSubMain
          to="/config"
          title="Admin"
          bsTitle="Admin"
          fontIcon="bi-gear"
        >
          <AsideMenuItem
            to="/users"
            title="User management"
            hasBullet={true}
            bsTitle="User management"
            customIcon={<i className="fa-solid fa-user"></i>}
          />
          {/* <AsideMenuItem
            to="/press-conference-management"
            title="Press Conference"
            hasBullet={true}
            bsTitle="Press Conference"
            customIcon={<i className="fa-solid fa-users-rectangle"></i>}
          /> */}
          <AsideMenuItem
            to="/ticket-transactions"
            title="Ticket Transactions"
            hasBullet={true}
            bsTitle="Ticket Transactions"
            customIcon={<i className="fa-solid fa-ticket"></i>}
          />
          <AsideMenuItem
            to="/exhibition-requests"
            title="Exhibition Requests"
            hasBullet={true}
            bsTitle="Exhibition Requests"
            customIcon={<i className="fa-solid fa-users"></i>}
          />

          <AsideMenuItem
            to="/program-event-management"
            title="Program Events"
            hasBullet={true}
            bsTitle="Program Events"
            customIcon={<i className="fa-solid fa-calendar-days"></i>}
          />

          <AsideMenuItem
            to="/conferences-management"
            title="Conferences"
            hasBullet={true}
            bsTitle="Conferences"
            customIcon={<i className="fa-solid fa-calendar-days"></i>}
          />

          <AsideMenuItem
            to="/workshop-management"
            title="Workshops"
            hasBullet={true}
            bsTitle="Workshops"
            customIcon={<i className="fa-solid fa-chalkboard-user"></i>}
          />

          <AsideMenuItem
            to="/visa-demand-management"
            title="Visa Demands"
            hasBullet={true}
            bsTitle="Visa Demands"
            customIcon={<i className="fa-solid fa-person-chalkboard"></i>}
          />

          <AsideMenuItem
            to="/guests"
            title="Guests management"
            hasBullet={true}
            bsTitle="User management"
            customIcon={<i className="fa-solid fa-user-check"></i>}
          />
          <AsideMenuItem
            to="/roles"
            title="Roles management"
            hasBullet={true}
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
            // fontIcon="bi-chart-line fs-3"
            customIcon={<i className="fa-solid fa-chart-line me-2"></i>}
            hasBullet
          />

          <AsideMenuItem
            to="/config/occupations"
            title="Occupations"
            customIcon={<i className="fa-solid fa-briefcase"></i>}
            // fontIcon="bi-cart fs-3"
            hasBullet
          />

          <AsideMenuItem
            to="/config/legal-status"
            title="Legal Statut"
            customIcon={<i className="fa-solid fa-scale-balanced"></i>}
            // fontIcon="bi-cart fs-3"
            hasBullet
          />
        </AsideMenuItemWithSubMain>
      </RoleGuard>
    </>
  );
}
