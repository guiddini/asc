import { Row, Spinner } from "react-bootstrap";
import { PageTitle } from "../../../_metronic/layout/core";
import { CompanyCard, CountriesSelect, InputComponent } from "../../components";
import { useCompany } from "../../hooks";
import { companyType } from "../../types/company";
import { KTCard, KTCardBody, toAbsoluteUrl } from "../../../_metronic/helpers";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const CompaniesPageWrapper = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      search: "",
      country: null,
    },
  });

  const searchWatch = watch("search");
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchWatch || ""), 350);
    return () => clearTimeout(t);
  }, [searchWatch]);

  const [countryId, setCountryId] = useState<string | number | null>(null);

  const { MEMORIZED_COMPANIES, loadingCompanies } = useCompany({
    search,
    country_id: countryId ?? undefined,
  });

  return (
    <>
      <PageTitle breadcrumbs={[]}>Exposants</PageTitle>

      {/* Filters */}
      <KTCard>
        <KTCardBody>
          <Row xl={12} md={12}>
            <InputComponent
              control={control}
              name="search"
              type="text"
              errors={errors}
              label="Search companies"
              placeholder="Type to search by name or description"
              colXS={12}
              colMD={6}
            />
            <CountriesSelect
              control={control}
              errors={errors}
              colXS={12}
              colMD={6}
              label="Country"
              onValueChange={(value) => setCountryId(value)}
              debounceMs={350}
            />
          </Row>
        </KTCardBody>
      </KTCard>

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
