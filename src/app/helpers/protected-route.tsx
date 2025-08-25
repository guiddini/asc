import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { UserResponse } from "../types/reducers";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  let location = useLocation();

  if (!user.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
