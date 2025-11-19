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
import { getStatistics } from "../../../../app/apis/statistics";
import {
  adminRoles,
  exhibitionRoles,
  mediaRoles,
  programRoles,
  staffRoles,
  kycManagementRoles, // added
  accommodationManagementRoles, // added
  statisticsManagementRoles,
  investorRoles,
  dealroomRoles, // added
} from "../../../../app/utils/roles";

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

  // Admin visibility control: hide non-admin sections for admins
  const isAdmin = (user?.roles || []).some((r: any) =>
    adminRoles.includes(r?.name)
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

  const { data: statsData } = useQuery(
    ["statistics", "unread"],
    getStatistics,
    {
      staleTime: 60 * 1000,
    }
  );
  const chatBadge =
    statsData && statsData.unread_conversations > 0
      ? statsData.unread_conversations
      : undefined;
  const meetingsBadge =
    statsData && statsData.pending_meetings > 0
      ? statsData.pending_meetings
      : undefined;

  return (
    <>
      {/* home */}
      <AsideMenuItem
        to="/home"
        title="Home"
        customIcon={<i className="fa-solid fa-house"></i>}
        bsTitle="Home"
        className="py-2"
      />
      {/* Statistics visible to admins and statistics managers */}
      <RoleGuard allowedRoles={statisticsManagementRoles}>
        <AsideMenuItem
          to="/statistics"
          title="Statistics"
          customIcon={<i className="fa-solid fa-chart-simple"></i>}
          bsTitle="Statistics"
        />
      </RoleGuard>
      <AsideMenuItem
        to="/chat"
        title="Chat"
        customIcon={<i className="fa-solid fa-comments"></i>}
        bsTitle="Chat"
        badge={chatBadge}
        className="py-2"
      />

      <AsideMenuItemWithSubMain
        to="/deal-room"
        title="Deal Room"
        bsTitle="Deal Room"
        customIcon={<i className="fa-solid fa-handshake"></i>}
      >
        <RoleGuard allowedRoles={investorRoles}>
          <AsideMenuItem
            to="/deal-room"
            title="Browse Pitch Decks"
            bsTitle="Browse Pitch Decks"
            hasBullet
          />
          <RoleGuard allowedRoles={["investor"]}>
            <AsideMenuItem
              to="/deal-room/favorites"
              title="My Favorite Pitch Decks"
              bsTitle="My Favorite Pitch Decks"
              hasBullet
            />
          </RoleGuard>
        </RoleGuard>
        <AsideMenuItem
          to="/deal-room/interested-investors"
          title="Investors Interested in my Deck"
          bsTitle="Investors Interested in my Deck"
          hasBullet
        />
      </AsideMenuItemWithSubMain>

      {!isAdmin && (
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
      )}
      {isCompanyStaff && !isAdmin && (
        <>
          <AsideMenuItemWithSubMain
            to="/company"
            title="My Startup"
            bsTitle="My Startup"
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

      {!isAdmin && (
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
            badge={meetingsBadge}
            hasBullet
          />
        </AsideMenuItemWithSubMain>
      )}

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
        {!isAdmin && (
          <AsideMenuItem
            to={`/my-connections`}
            title="My Connections"
            bsTitle="My Connections"
            hasBullet={true}
            badge={pendingBadge}
          />
        )}
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

        {isCompanyStaff && !isAdmin && (
          <AsideMenuItem
            to={`/company/${companyID}/products`}
            title="My Products"
            bsTitle="Mes produits"
            hasBullet={true}
          />
        )}
        {(isCompanyEditor || isAdmin) && (
          <AsideMenuItem
            to={`/company/${companyID}/products/create`}
            title="Add Product"
            bsTitle="Ajouter un produit"
            hasBullet={true}
          />
        )}
      </AsideMenuItemWithSubMain>

      {/* dashboard */}

      {!isAdmin && (
        <AsideMenuItem
          to="/badge"
          title="My badge"
          bsTitle="Mon badge"
          customIcon={<i className="fa-solid fa-qrcode"></i>}
        />
      )}

      {!isAdmin && (
        <AsideMenuItem
          to={`/visa-demand`}
          title="Visa Demand"
          bsTitle="Visa Demand"
          customIcon={<i className="fa-solid fa-id-card"></i>}
        />
      )}
      {/* 
      <AsideMenuItem
        to={`/tickets`}
        title="Tickets"
        bsTitle="Tickets"
        customIcon={<i className="fa-solid fa-ticket"></i>}
      /> */}

      {isCompanyStaff && !isAdmin && (
        <AsideMenuItem
          to={`/ads`}
          title="Ads"
          bsTitle="Ads"
          customIcon={<i className="fa-solid fa-tower-broadcast"></i>}
        />
      )}

      {!isAdmin && (
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
      )}

      <RoleGuard allowedRoles={staffRoles}>
        <AsideMenuItemWithSubMain
          to="/config"
          title="Admin"
          bsTitle="Admin"
          fontIcon="bi-gear"
        >
          {/* Hébergement management (Hotels & Accommodations) */}
          <RoleGuard allowedRoles={accommodationManagementRoles}>
            <AsideMenuItemWithSubMain
              to="/accommodation-management"
              title="Accommodation Management"
              bsTitle="Accommodation Management"
              customIcon={<i className="fa-solid fa-bed"></i>}
              hasBullet
            >
              <AsideMenuItem
                to="/hotels-management"
                title="Hotels"
                bsTitle="Hotels"
                hasBullet
              />
              <AsideMenuItem
                to="/accommodation-management"
                title="Accommodations"
                bsTitle="Accommodations"
                hasBullet
              />
            </AsideMenuItemWithSubMain>
          </RoleGuard>
          {/* Allow KYC Managers to see only User Management inside Admin */}
          <RoleGuard allowedRoles={[...adminRoles, ...kycManagementRoles]}>
            <AsideMenuItem
              to="/users"
              title="User Management"
              hasBullet
              bsTitle="User Management"
              customIcon={<i className="fa-solid fa-users"></i>}
            />
          </RoleGuard>

          {/* Keep the rest of Admin-only items restricted to adminRoles */}
          <RoleGuard allowedRoles={programRoles}>
            <AsideMenuItemWithSubMain
              to="/program-management"
              title="Programs & Events"
              bsTitle="Programs & Events"
              customIcon={<i className="fa-solid fa-calendar-days"></i>}
              hasBullet
            >
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
            </AsideMenuItemWithSubMain>
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

          <RoleGuard allowedRoles={adminRoles}>
            {/* Removed the duplicate User Management here */}
            <AsideMenuItem
              to="/sponsors-management"
              title="Sponsors & Partners"
              hasBullet
              bsTitle="Sponsors & Partners"
              customIcon={<i className="fa-solid fa-handshake"></i>}
            />

            <RoleGuard allowedRoles={dealroomRoles}>
              <AsideMenuItem
                to="/deal-room-management"
                title="Deal Room Management"
                hasBullet
                bsTitle="Deal Rooms Management"
                customIcon={<i className="fa-solid fa-handshake"></i>}
              />
            </RoleGuard>

            <AsideMenuItemWithSubMain
              to="/media-management"
              title="Media"
              bsTitle="Media"
              customIcon={<i className="fa-solid fa-blog"></i>}
              hasBullet
            >
              <AsideMenuItem
                to="/media-management"
                title="Media Management"
                hasBullet
                bsTitle="Media Management"
              />
            </AsideMenuItemWithSubMain>

            <AsideMenuItemWithSubMain
              to="/config/products"
              title="Catalog & Ads"
              bsTitle="Catalog & Ads"
              fontIcon="bi-cart fs-3"
              hasBullet
            >
              <AsideMenuItem
                to="/config/products"
                title="Products management"
                hasBullet
                bsTitle="Products management"
              />
              <AsideMenuItem
                to="/config/featured-products"
                title="Featured Products"
                hasBullet
                bsTitle="Featured Products"
              />
              <AsideMenuItem
                to="/config/productsCategories"
                title="Products categories"
                hasBullet
                bsTitle="Products categories"
              />
              <AsideMenuItem
                to="/config/ads"
                title="Advertisements"
                hasBullet
                bsTitle="Advertisements"
              />
            </AsideMenuItemWithSubMain>

            <AsideMenuItemWithSubMain
              to="/config/activities"
              title="Configurations"
              bsTitle="Configurations"
              customIcon={<i className="fa-solid fa-gear"></i>}
              hasBullet
            >
              <AsideMenuItem
                to="/config/activities"
                title="Activities"
                hasBullet
                bsTitle="Activities"
              />
              <AsideMenuItem
                to="/config/occupations"
                title="Occupations"
                hasBullet
                bsTitle="Occupations"
              />
              <AsideMenuItem
                to="/config/legal-status"
                title="Legal Statut"
                hasBullet
                bsTitle="Legal Statut"
              />
            </AsideMenuItemWithSubMain>

            {/* Admin utilities at bottom */}
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
              customIcon={<i className="fa-solid fa-clipboard-list"></i>}
            />
            <AsideMenuItem
              to="/visa-demand-management"
              title="Visa Management"
              hasBullet
              bsTitle="Visa Management"
              customIcon={<i className="fa-solid fa-id-card"></i>}
            />
          </RoleGuard>
        </AsideMenuItemWithSubMain>
      </RoleGuard>
    </>
  );
}
