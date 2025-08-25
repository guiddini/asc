import { usePermissions } from "../hooks";
import Unauthorized from "./unauthorized";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const { USER_PERMISIONS } = usePermissions();

  if (!user || !USER_PERMISIONS?.includes(requiredPermission)) {
    // navigate(-1); // Redirect to the previous route
    return <Unauthorized />; // Show a dedicated message
  }

  return children;
};

export default ProtectedRoute;
