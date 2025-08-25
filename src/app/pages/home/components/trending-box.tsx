import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllPromotedProductServiceApi } from "../../../apis";
import { ServiceProductCardType } from "../..";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Carousel } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

const TrendingBox = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: UserResponse) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-promoted-products-services"],
    queryFn: getAllPromotedProductServiceApi,
  });

  const PRODUCTS: ServiceProductCardType[] = useMemo(() => data?.data, [data]);

  return (
    <div className="card card-flush mb-5 mb-xl-8">
      <div className="card-header pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">
            Produits sponsorisés
          </span>
          {user?.company?.id && (
            <Link
              to={`/company/${user?.company?.id}/products/create`}
              className="text-muted mt-1 fw-semibold fs-7 cursor-pointer"
            >
              Ajouter vos produits
            </Link>
          )}
        </h3>

        <div className="card-toolbar">
          <Link to="/products" className="btn btn-sm btn-light">
            Voir tout
          </Link>
        </div>
      </div>
      <div className="card-body">
        {PRODUCTS?.length > 0 ? (
          <Carousel
            indicators={false}
            style={{
              height: "100%",
            }}
          >
            {PRODUCTS?.map((product) => (
              <Carousel.Item
                id="carousel-item"
                key={product?.id}
                as={Link}
                to={`/products/${product?.id}`}
              >
                <img
                  src={getMediaUrl(product?.featured_image)}
                  alt={product?.name}
                  id="carousel-img"
                  className="rounded-2"
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="w-100 h-lg-325px d-flex flex-column align-items-center justify-content-center">
            <img
              src={toAbsoluteUrl("/media/svg/illustrations/easy/2.svg")}
              alt="no featured product found"
            />
            <span className="text-muted mt-1 fw-semibold fs-4">
              Aucun produit trouvé
            </span>
            {user?.company?.id && (
              <span
                className="mt-1 fw-semibold fs-7 cursor-pointer"
                onClick={() => {
                  if (user?.company?.id) {
                    navigate(`/company/${user?.company?.id}/products/create`);
                  }
                }}
              >
                Ajouter vos produits
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingBox;
