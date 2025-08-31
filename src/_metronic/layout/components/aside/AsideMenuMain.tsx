import { AsideMenuItemWithSubMain } from "./AsideMenuItemWithSubMain";
import { AsideMenuItem } from "./AsideMenuItem";
import { Can } from "../../../../app/utils/ability-context";
import { UserResponse } from "../../../../app/types/reducers";
import { useSelector } from "react-redux";
import {
  canEditCompany,
  canViewCompany,
} from "../../../../app/features/userSlice";
import RoleGuard from "../../../../app/components/role-guard";

const isAdmin = (permissions) => {
  const adminPermissions = [
    "list_usersadmin",
    "list_guests",
    "list_roles",
    "list_companyproductsservicesadmin",
    "list_featuredproducts",
    "list_companyproductsservicecategories",
    "list_adsadmin",
    "list_reports",
    "list_activities",
    "list_occupations",
    "list_legalstatus",
  ];

  const hasAdminPermission = adminPermissions.some((permission) =>
    permissions.some((userPermission) => userPermission.name === permission)
  );

  return hasAdminPermission;
};

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
        title="Accueil"
        // fontIcon="bi-house-solid fs-2"
        customIcon={<i className="fa-solid fa-house"></i>}
        bsTitle="Accueil"
        className="py-2"
      />
      <RoleGuard allowedRoles={["admin", "super_admin", "staff"]}>
        <AsideMenuItem
          to="/blogs-management"
          title="Blogs"
          customIcon={<i className="fa-solid fa-blog"></i>}
          bsTitle="Blogs"
          className="py-2"
        />
      </RoleGuard>

      <AsideMenuItem
        to={`/meetings`}
        title="Meetings"
        bsTitle="Meetings"
        customIcon={<i className="fa-solid fa-handshake"></i>}
      />

      <AsideMenuItem
        to={`/participants`}
        title="Participants"
        bsTitle="Participants"
        customIcon={<i className="fa-solid fa-users"></i>}
      />

      <AsideMenuItem
        to={`/companies`}
        title="Exposants"
        bsTitle="Exposants"
        customIcon={<i className="fa-solid fa-handshake"></i>}
      />

      <AsideMenuItemWithSubMain
        to={`/products`}
        title="Produits"
        bsTitle="Produits"
        customIcon={<i className="fa-solid fa-bag-shopping"></i>}
      >
        <AsideMenuItem
          to={`/products`}
          title="Voir tous les produits"
          bsTitle="Voir tous les produits"
          hasBullet={true}
        />

        {isCompanyStaff && (
          <AsideMenuItem
            to={`/company/${companyID}/products`}
            title="Mes produits"
            bsTitle="Mes produits"
            hasBullet={true}
          />
        )}
        {isCompanyEditor && (
          <AsideMenuItem
            to={`/company/${companyID}/products/create`}
            title="Ajouter un produit"
            bsTitle="Ajouter un produit"
            hasBullet={true}
          />
        )}
      </AsideMenuItemWithSubMain>

      {/* dashboard */}

      <AsideMenuItem
        to="/badge"
        title="Mon badge"
        bsTitle="Mon badge"
        customIcon={<i className="fa-solid fa-qrcode"></i>}
      />

      <AsideMenuItem
        to={`/tickets`}
        title="Tickets"
        bsTitle="Tickets"
        customIcon={<i className="fa-solid fa-ticket"></i>}
      />

      {isCompanyStaff && (
        <>
          <AsideMenuItem
            to={`/ads`}
            title="Annonces"
            bsTitle="Annonces"
            customIcon={<i className="fa-solid fa-tower-broadcast"></i>}
          />
          <AsideMenuItemWithSubMain
            to="/company"
            title="Mon entreprise"
            bsTitle="Mon entreprise"
            fontIcon="bi-briefcase fs-2"
            icon="briefcase"
          >
            <AsideMenuItem
              to={`/company/stand/reservations`}
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
        to="/job-offers/all"
        title="Offres d'emploi"
        bsTitle="Offres d'emploi"
        customIcon={<i className="fa-solid fa-house-laptop"></i>}
        icon="briefcase"
      >
        <AsideMenuItem
          to={`/job-offers/all`}
          title="Toutes les offres d'emploi"
          bsTitle="Toutes les offres d'emploi"
          hasBullet={true}
        />
        {!hasCompany && (
          <AsideMenuItem
            to={`/job-offers/applications`}
            title="Mes candidatures"
            bsTitle="Mes candidatures"
            hasBullet={true}
          />
        )}
        {isCompanyEditor && (
          <AsideMenuItem
            to={`/job-offers/create/${companyID}`}
            title="Ajouter un offre d'emploi"
            bsTitle="Ajouter un offre d'emploi"
            hasBullet={true}
          />
        )}

        {isCompanyStaff && (
          <>
            <AsideMenuItem
              to={`/job-offers/${companyID}`}
              title="Mes offres d'emploi"
              bsTitle="Mes offres d'emploi"
              hasBullet={true}
            />
          </>
        )}
      </AsideMenuItemWithSubMain>

      {isAdmin(user?.permissions) && (
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
          {user?.roleValues?.name === "super_admin" && (
            <>
              <AsideMenuItem
                to="/press-conference-management"
                title="Conférence de Presse"
                hasBullet={true}
                bsTitle="Conférence de Presse"
                customIcon={<i className="fa-solid fa-users-rectangle"></i>}
              />
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
            </>
          )}
          {/* <Can I="list" a="usersadmin">
          </Can> */}
          <Can I="list" a="guests">
            <AsideMenuItem
              to="/guests"
              title="Guests management"
              hasBullet={true}
              bsTitle="User management"
              customIcon={<i className="fa-solid fa-user-check"></i>}
            />
          </Can>
          <Can I="list" a="roles">
            <AsideMenuItem
              to="/roles"
              title="Roles management"
              hasBullet={true}
              bsTitle="Roles management"
              customIcon={<i className="fa-solid fa-user-shield"></i>}
            />
          </Can>

          <Can I="list" a="companyproductsservicesadmin">
            <AsideMenuItem
              to="/config/products"
              title="Products management"
              fontIcon="bi-cart fs-3"
              hasBullet
            />
          </Can>

          <Can I="list" a="featuredproducts">
            <AsideMenuItem
              to="/config/featured-products"
              title="Featured Products"
              customIcon={<i className="fa-solid fa-star"></i>}
              hasBullet
            />
          </Can>
          <Can I="list" a="companyproductsservicecategories">
            <AsideMenuItem
              to="/config/productsCategories"
              title="Products categories"
              customIcon={<i className="fa-solid fa-list" />}
              hasBullet
            />
          </Can>

          <Can I="list" a="adsadmin">
            <AsideMenuItem
              to="/config/ads"
              title="Advertisements"
              customIcon={<i className="fa-solid fa-bullhorn"></i>}
              hasBullet
            />
          </Can>

          <Can I="list" a="reports">
            <AsideMenuItem
              to="/config/reports"
              title="Reports"
              customIcon={<i className="fa-solid fa-flag"></i>}
              hasBullet
            />
          </Can>

          <Can I="list" a="activities">
            <AsideMenuItem
              to="/config/activities"
              title="Activities"
              // fontIcon="bi-chart-line fs-3"
              customIcon={<i className="fa-solid fa-chart-line me-2"></i>}
              hasBullet
            />
          </Can>

          <Can I="list" a="occupations">
            <AsideMenuItem
              to="/config/occupations"
              title="Occupations"
              customIcon={<i className="fa-solid fa-briefcase"></i>}
              // fontIcon="bi-cart fs-3"
              hasBullet
            />
          </Can>

          {user?.roleValues?.name === "super_admin" && (
            <AsideMenuItem
              to="/config/legal-status"
              title="Legal Statut"
              customIcon={<i className="fa-solid fa-scale-balanced"></i>}
              // fontIcon="bi-cart fs-3"
              hasBullet
            />
          )}
        </AsideMenuItemWithSubMain>
      )}
    </>
  );
}
