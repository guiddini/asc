import React from "react";
import InfoSettings from "./components/info-settings";
import PrivacySettings from "./components/privacy-settings";
import DesactivateAccount from "./components/desactivate-account";
import { User } from "../../../types/user";

const AccountSettings = (props: User) => {
  return (
    <>
      <InfoSettings user={props} />
      <PrivacySettings />
      {/* <DesactivateAccount /> */}
    </>
  );
};

export default AccountSettings;
