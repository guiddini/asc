import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { PageTitle } from "../../../../_metronic/layout/core";
import { getCompanyApi } from "../../../apis";
import { canEditCompany } from "../../../features/userSlice";
import { CompanyDetailProps } from "../../../types/company";
import CompanyHeader from "./components/CompanyHeader";
import CompanyDescription from "./components/CompanyDescription";
import CompanyStats from "./components/CompanyStats";
import CompanyQuote from "./components/CompanyQuote";
import CompanyProducts from "./components/CompanyProducts";
import CompanyTeam from "./components/CompanyTeam";
import CompanyJobs from "./components/CompanyJobs";
import EditableWrapper from "./components/EditableWrapper";
import { Spinner } from "react-bootstrap";
import ReactCountryFlag from "react-country-flag";

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const isCompanyEditor = useSelector((state) => canEditCompany(state, id));

  const { data, isLoading } = useQuery(["company", id], () =>
    getCompanyApi(id)
  );

  const COMPANY: CompanyDetailProps = useMemo(() => {
    if (!isLoading && data?.data) {
      return {
        ...data.data,
        desc:
          data.data.description ||
          "Discover our story and our commitment to our customers.",
        description: data.data.description || "",
        header_text: data.data.header_text || `Welcome to ${data.data.name}`,
        quote_author: data.data.quote_author || `Company CEO`,
        quote_text:
          data.data.quote_text || "Excellence is not an act, but a habit.",
        team_text:
          data.data.team_text ||
          "Meet the dedicated team that makes it all possible.",
        email: data.data.email || "placeholder@example.com",
      };
    }
    return null;
  }, [data, isLoading]);

  useEffect(() => {
    // No form editing; just ensure COMPANY updates when id changes
  }, [COMPANY?.id, id]);

  const companyBreadCrumbs = [
    {
      title: "Exhibitors",
      path: "/companies",
      isSeparator: false,
      isActive: false,
    },
    {
      title: COMPANY?.name,
      path: "",
      isSeparator: true,
      isActive: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="card-body p-lg-17 w-100 h-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="card" id="company-detail-wrapper">
      <PageTitle breadcrumbs={companyBreadCrumbs}>
        <span className="d-inline-flex align-items-center">
          {COMPANY?.name}
          {data?.data?.country?.code && (
            <ReactCountryFlag
              countryCode={data.data.country.code}
              svg
              title={
                data.data.country.name_fr ||
                data.data.country.name_en ||
                "Country"
              }
              aria-label={
                data.data.country.name_en ||
                data.data.country.name_fr ||
                "Country"
              }
              style={{
                width: "1.2em",
                height: "1.2em",
                marginLeft: "0.5rem",
                display: "inline-block",
              }}
            />
          )}
        </span>
      </PageTitle>
      <div className="card-body p-lg-17 position-relative">
        <EditableWrapper isCompanyEditor={isCompanyEditor} id={id}>
          <CompanyHeader company={COMPANY} />
          <CompanyDescription company={COMPANY} />
          <CompanyStats company={COMPANY} />
          <CompanyQuote company={COMPANY} />
          <CompanyProducts companyId={id} />
          <CompanyTeam companyId={id} />
          <CompanyJobs
            companyId={id}
            companyName={COMPANY?.name}
            logo_image={typeof COMPANY?.logo === "string" ? COMPANY.logo : ""}
          />
        </EditableWrapper>
      </div>
    </div>
  );
};

export { CompanyDetail };
