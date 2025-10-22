import React from "react";
import { useQuery } from "react-query";
import { Row } from "react-bootstrap";
import { getCompanyProductServiceApi } from "../../../../apis";
import CompanyDetailProductserviceCard from "./company-detail-productservice-card";

interface CompanyProductsProps {
  companyId: string;
}

const CompanyProducts: React.FC<CompanyProductsProps> = ({ companyId }) => {
  const { data: services } = useQuery([
    "get-all-company-products-services",
    companyId,
  ], () => getCompanyProductServiceApi(companyId));

  const PRODUCTS_SERVICES = services?.data || [];

  if (PRODUCTS_SERVICES.length === 0) {
    return null;
  }

  return (
    <div className="mb-16" id="products">
      <div className="text-center mb-12">
        <h3 className="fs-2hx text-dark mb-5">Products and Services</h3>
      </div>
      <Row xs={12} md={12} lg={12}>
        {PRODUCTS_SERVICES.map((product, index) => (
          <CompanyDetailProductserviceCard {...product} key={index} />
        ))}
      </Row>
    </div>
  );
};

export default CompanyProducts;
