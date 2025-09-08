import { Spinner } from "react-bootstrap";
import { PageTitle } from "../../../_metronic/layout/core";
import { CompanyCard } from "../../components";
import { useCompany } from "../../hooks";
import { companyType } from "../../types/company";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const CompaniesPageWrapper = () => {
  const { MEMORIZED_COMPANIES, loadingCompanies } = useCompany();

  return (
    <>
      <PageTitle breadcrumbs={[]}>Exposants</PageTitle>

      {loadingCompanies ? (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          <Spinner animation="border" className="m-auto" />
        </div>
      ) : (
        <>
          {MEMORIZED_COMPANIES?.length > 0 ? (
            <div className="row g-6 g-xl-9 mt-4">
              {MEMORIZED_COMPANIES?.map(
                (company: companyType, index: number) => {
                  return <CompanyCard {...company} key={index} />;
                }
              )}
            </div>
          ) : (
            <div
              className="card"
              style={{
                minHeight: "70vh",
              }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <span className="fs-3">No exhibitors available</span>
                <img
                  src={toAbsoluteUrl(
                    "/media/illustrations/sigma-1/17-dark.png"
                  )}
                  className="h-250px w-250px"
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export { CompaniesPageWrapper };
