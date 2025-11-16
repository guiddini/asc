import { Navigate, useLocation } from "react-router-dom";

const ATDPage = () => {
  const { search, hash } = useLocation();
  const target =
    "/side-events/african-telecommunications-day-2025-qe2kLa" +
    (search || "") +
    (hash || "");

  return <Navigate to={target} replace />;
};

export default ATDPage;
