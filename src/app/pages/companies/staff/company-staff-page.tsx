import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getAllCompanyStaffApi } from "../../../apis";
import { useParams } from "react-router-dom";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Staff } from "../../../types/user";
import ViewAllStaff from "./view-staffs/view-all-staff";
import CreateStaffPage from "./create-staff/create-staff-page";
import clsx from "clsx";
import { useCompanyRedirect } from "../../../hooks/useCompanyRedirect";

export const CompanyStaffPage = () => {
  const { id } = useParams();
  const { isCompanyEditor } = useCompanyRedirect({
    companyId: id,
    restrictForStaff: false,
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-all-company-staff"],
    queryFn: async () => await getAllCompanyStaffApi(id),
  });

  const STAFFS_DATA: Staff[] = useMemo(() => data?.data, [data]);

  const [key, setKey] = useState<string>("view");

  return (
    <>
      <PageTitle>l'ensemble staff</PageTitle>

      <div className="mx-auto d-flex flex-row align-items-center justify-content-center">
        <div
          className="nav-group nav-group-outline bg-white my-4 d-flex flex-row align-items-center justify-content-center p-3"
          style={{
            width: "380px",
          }}
          data-kt-buttons="true"
        >
          <button
            className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
              " btn-active btn-custom-purple-dark text-white": key === "view",
            })}
            onClick={(e) => {
              e.preventDefault();
              setKey("view");
            }}
          >
            Voir tout l'ensemble staff
          </button>
          {isCompanyEditor && (
            <button
              className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
                " btn-active btn-custom-purple-dark text-white":
                  key === "create",
              })}
              onClick={(e) => {
                e.preventDefault();
                setKey("create");
              }}
            >
              Ajouter staff
            </button>
          )}
        </div>
      </div>

      {key === "view" ? (
        <ViewAllStaff staffs={STAFFS_DATA} isLoading={isLoading} />
      ) : (
        <CreateStaffPage refetch={refetch} />
      )}
    </>
  );
};
