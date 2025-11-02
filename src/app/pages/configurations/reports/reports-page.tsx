import { useMemo } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useQuery } from "react-query";
import { getAllReports } from "../../../apis";
import { TableComponent } from "../../../components";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Can } from "../../../utils/ability-context";

const ReportsPage = () => {
  const { data } = useQuery({
    queryKey: ["reports"],
    queryFn: getAllReports,
  });

  const REPORTS = useMemo(() => data?.data, [data]);

  const navigate = useNavigate();

  const columns = [
    {
      name: "Type",
      selector: "reportable_type",
      cell: (row) => getReportedType(row.reportable_type),
      sortable: true,
      //   wrap: true,
    },
    {
      name: "Créé à",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
      //   wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        return (
          <div className="d-flex flex-row align-items-center gap-2">
            <Can I="list" a="reports">
              <button
                className="btn btn-sm btn-custom-purple-dark text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/profile/${row?.reporter_id}`);
                }}
              >
                View Reporter
              </button>
              <button
                className="btn btn-sm btn-custom-blue-dark text-white"
                onClick={(e) => {
                  e.preventDefault();
                  if (getReportedType(row.reportable_type) === "post") {
                    navigate(`/home#afes-post-${row.reportable_id}`);
                  } else if (
                    getReportedType(row.reportable_type) === "product"
                  ) {
                    navigate(`/products/${row.reportable_id}`);
                  }
                }}
              >
                View Reported
              </button>
            </Can>
          </div>
        );
      },
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      grow: 1,
      wrap: false,
    },
  ];

  const getReportedType = (type: string) => {
    const parts = type.split("\\"); // Split the string by backslash
    const report_type = parts[parts.length - 1]; // Get the last part of the array

    switch (report_type) {
      case "Post":
        return "post";
      case "CompanyProductService":
        return "product";
      default:
        return "unknown";
    }
  };

  return (
    <>
      <PageTitle>Reports</PageTitle>
      <Can I="list" a="reports">
        <TableComponent
          columns={columns as any}
          data={REPORTS}
          onAddClick={() => {}}
          showExport={false}
          showCreate={false}
          placeholder=""
        />
      </Can>
    </>
  );
};

export default ReportsPage;
