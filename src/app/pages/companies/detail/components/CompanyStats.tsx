import { CompanyDetailProps } from "../../../../types/company";
import { useQuery } from "react-query";
import { getCompanyStats } from "../../../../apis/company";

interface CompanyStatsProps {
  company: CompanyDetailProps;
}

const CompanyStats: React.FC<CompanyStatsProps> = ({ company }) => {
  const { data } = useQuery({
    queryKey: ["company-stats", company?.id],
    queryFn: getCompanyStats,
  });
  const stats = (data as any)?.data || {};
  const productsCount = Number(stats?.product_services_count || 0);
  const staffCount = Number(stats?.staff_count || 0);

  return (
    <div className="card bg-light mb-18">
      <div className="card-body py-15">
        <div className="d-flex flex-center">
          <div className="d-flex flex-center flex-wrap mb-10 mx-auto gap-5 w-xl-900px">
            <div className="octagon d-flex flex-center h-200px w-200px bg-body mx-lg-10">
              <div className="text-center">
                <i className="ki-outline ki-element-11 fs-2tx text-primary"></i>
                <div className="mt-1">
                  <div className="fs-lg-2hx fs-2x fw-bold text-gray-800 d-flex align-items-center">
                    <div
                      className="min-w-70px"
                      data-kt-countup="true"
                      data-kt-countup-value="700"
                    >
                      {productsCount}
                    </div>
                  </div>
                  <span className="text-gray-600 fw-semibold fs-5 lh-0">
                    Products
                  </span>
                </div>
              </div>
            </div>
            <div className="octagon d-flex flex-center h-200px w-200px bg-body mx-lg-10">
              <div className="text-center">
                <i className="fa-solid fa-users fs-2tx text-success"></i>
                <div className="mt-1">
                  <div className="fs-lg-2hx fs-2x fw-bold text-gray-800 d-flex align-items-center">
                    <div
                      className="min-w-50px"
                      data-kt-countup="true"
                      data-kt-countup-value="80"
                    >
                      {staffCount}
                    </div>
                  </div>
                  <span className="text-gray-600 fw-semibold fs-5 lh-0">
                    Staff
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStats;
