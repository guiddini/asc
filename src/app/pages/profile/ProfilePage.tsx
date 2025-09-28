import { useParams } from "react-router-dom";
import { Overview } from "./components/Overview";
import { ProfileHeader } from "./ProfileHeader";
import { useMemo, useState } from "react";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import { useQuery } from "react-query";
import { getUserDataApi } from "../../apis";
import { User } from "../../types/user";
import AccountSettings from "./settings/account-settings";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useSelector((state: UserResponse) => state.user);

  const [key, setKey] = useState<string>("overview");

  const { isLoading, data } = useQuery({
    queryKey: ["get-user-data", id],
    queryFn: () => getUserDataApi(id),
  });

  const USER_DATA: User = useMemo(() => data?.data, [data, id]);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            height: "70vh",
          }}
          className="w-100 d-flex justify-content-center align-items-center bg-white"
        >
          <Spinner animation="border" color="#000" />
        </div>
      ) : (
        <>
          <ProfileHeader user={USER_DATA} />
          {user?.id === USER_DATA?.id && <AccountSettings {...USER_DATA} />}
        </>
      )}
    </>
  );
};

export default ProfilePage;
