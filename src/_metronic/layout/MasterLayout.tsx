import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AsideDefault } from "./components/aside/AsideDefault";
import { Footer } from "./components/Footer";
import { HeaderWrapper } from "./components/header/HeaderWrapper";
import { Toolbar } from "./components/toolbar/Toolbar";
import { ScrollTop } from "./components/ScrollTop";
import { Content } from "./components/Content";
import { PageDataProvider } from "./core";
import {
  ActivityDrawer,
  DrawerMessenger,
  InviteUsers,
  UpgradePlan,
} from "../partials";
import { MenuComponent } from "../assets/ts/components";
import { useTicket } from "../../app/hooks";
import EventTopbar from "./components/event-topbar";

const MasterLayout = () => {
  const location = useLocation();
  const { checkUnassignedTickets } = useTicket();

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization();
    }, 500);
  }, [location.key]);

  useEffect(() => {
    // Call the checkUnassignedTickets function initially
    checkUnassignedTickets();

    // Set up an interval to check every 5 minutes
    const intervalId = setInterval(checkUnassignedTickets, 5 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <PageDataProvider>
      <div className="d-flex flex-column flex-root">
        {/* begin::Page */}
        <div
          className="page d-flex flex-row flex-column-fluid"
          id="global-wrapper"
        >
          <AsideDefault />
          {/* begin::Wrapper */}
          <div
            // className="wrapper d-flex flex-column flex-row-fluid bg-white"
            className="wrapper d-flex flex-column flex-row-fluid"
            id="kt_wrapper"
          >
            <EventTopbar />
            {/* <HeaderWrapper /> */}
            {/* 

            <Toolbar /> */}

            {/* begin::Content */}
            <div
              id="kt_content"
              className="content d-flex flex-column flex-column-fluid"
            >
              <Content>
                <Outlet />
              </Content>
            </div>
            {/* end::Content */}
            {/* <Footer /> */}
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Page */}
      </div>

      {/* begin:: Drawers */}
      {/* <RightToolbar /> */}
      <ActivityDrawer />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  );
};

export { MasterLayout };
