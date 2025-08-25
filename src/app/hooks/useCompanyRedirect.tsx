import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { canEditCompany, canViewCompany } from "../features/userSlice";

type UseCompanyRedirectProps = {
  companyId: string;
  restrictForStaff?: boolean;
};

export function useCompanyRedirect({
  companyId,
  restrictForStaff = false,
}: UseCompanyRedirectProps) {
  const isCompanyEditor = useSelector((state) =>
    canEditCompany(state, companyId)
  );
  const isCompanyStaff = useSelector((state) =>
    canViewCompany(state, companyId)
  );

  const navigate = useNavigate();

  // Check if the user has company staff permission and if the company IDs match
  if (!isCompanyStaff) {
    navigate("/home");
  }

  // If the page is restricted for staff, ensure the user has editor permissions
  if (restrictForStaff && isCompanyStaff && !isCompanyEditor) {
    navigate("/home");
  }

  return { isCompanyEditor, isCompanyStaff };
}
