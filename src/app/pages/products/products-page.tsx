import { useEffect, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import ProductCard from "./components/product-card";
import { PageTitle } from "../../../_metronic/layout/core";
import { useMutation } from "react-query";
import { getAllPublishedProductServiceApi } from "../../apis";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

export type ProductCardProps = {
  id: number;
  name: string;
  type: string;
  description: string;
  email: string;
  phone_1: string;
  yt_link: string;
  external_link: string;
  featured_image: string;
  has_media: string;
  promotion_flag: string;
  status: string;
  status_reason: string;
  company_id: string;
  category_id: string;
  category: {
    id: number;
    name_en: string;
    name_fr: string;
    name_ar: string;
  };
  company: {
    id: string;
    logo: string;
    name: string;
    legal_status: string;
    address: string;
    email: string;
    header_text: string | null;
    header_image: string | null;
    description: string | null;
    quote_text: string | null;
    quote_author: string | null;
    team_text: string | null;
    country_id: string;
    wilaya_id: string | null;
    commune_id: string | null;
    phone_1: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  };
  owner: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    avatar: string;
    can_create_company: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    ticket_count: string;
    user_has_ticket_id: string;
    has_password: string;
  };
};

export const ProductsPage = () => {
  const { data, isLoading, mutate } = useMutation({
    mutationKey: ["get-all-published-products-services"],
    mutationFn: async () => await getAllPublishedProductServiceApi(),
  });

  useEffect(() => {
    mutate();
  }, []);

  const PRODUCTS: ProductCardProps[] = useMemo(() => data?.data, [isLoading]);

  return (
    <div>
      <PageTitle>Produits</PageTitle>

      {isLoading ? (
        <div
          style={{
            height: "70vh",
          }}
          className="w-100 d-flex justify-content-center align-items-center"
        >
          <Spinner animation="border" color="#000" />
        </div>
      ) : (
        <div>
          {PRODUCTS?.length > 0 ? (
            <div className="d-flex flex-row flex-wrap justify-content-evenly">
              {PRODUCTS?.map((product) => {
                return <ProductCard {...product} key={product?.id} />;
              })}
            </div>
          ) : (
            <div
              className="card"
              style={{
                minHeight: "70vh",
              }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <span className="fs-3">Aucun produit disponible</span>
                <img
                  src={toAbsoluteUrl(
                    "/media/illustrations/sigma-1/21-dark.png"
                  )}
                  className="h-250px w-250px"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
