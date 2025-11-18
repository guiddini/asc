import { useEffect, useMemo, useState } from "react";
import { Spinner, Row, Col } from "react-bootstrap";
import ProductCard from "./components/product-card";
import { PageTitle } from "../../../_metronic/layout/core";
import { useQuery } from "react-query";
import { getAllPublishedProductServiceApi, getCountriesApi, getAllProductsServicesCategoriesApi } from "../../apis";
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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: countriesRes } = useQuery(["countries-all"], getCountriesApi, {
    staleTime: 60 * 60 * 1000,
  });
  const { data: categoriesRes } = useQuery(
    ["products-categories-all"],
    getAllProductsServicesCategoriesApi,
    { staleTime: 60 * 60 * 1000 }
  );

  const { data, isLoading } = useQuery(
    [
      "get-all-published-products-services",
      debouncedSearch,
      countryId,
      categoryId,
    ],
    () =>
      getAllPublishedProductServiceApi({
        search: debouncedSearch || undefined,
        country_id: countryId,
        category_id: categoryId,
      }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const COUNTRIES = useMemo(() => countriesRes?.data || [], [countriesRes]);
  const CATEGORIES = useMemo(() => categoriesRes?.data || [], [categoriesRes]);
  const PRODUCTS: ProductCardProps[] = useMemo(() => data?.data, [data]);

  return (
    <div>
      <PageTitle>Produits</PageTitle>

      <div className="card mb-4">
        <div className="card-body">
          <Row className="g-3">
            <Col xs={12} md={4}>
              <label className="form-label fw-semibold">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search products/services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col xs={12} md={4}>
              <label className="form-label fw-semibold">Country</label>
              <select
                className="form-select"
                value={countryId ?? ""}
                onChange={(e) =>
                  setCountryId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              >
                <option value="">All countries</option>
                {COUNTRIES.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en || c.name_fr || c.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col xs={12} md={4}>
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                value={categoryId ?? ""}
                onChange={(e) =>
                  setCategoryId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              >
                <option value="">All categories</option>
                {CATEGORIES.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_en || cat.name_fr || cat.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
        </div>
      </div>

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
                <span className="fs-3">No products available</span>
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
