import { Outlet } from "react-router-dom";
import { AsideDefault } from "./components/aside/AsideDefault";
import { ScrollTop } from "./components/ScrollTop";
import { Content } from "./components/Content";
import { PageDataProvider } from "./core";
import {
  ActivityDrawer,
  DrawerMessenger,
  InviteUsers,
  UpgradePlan,
} from "../partials";
import EventTopbar from "./components/event-topbar";

const MasterLayout = () => {
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
