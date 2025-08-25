import clsx from "clsx";
import { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../helpers";
import { useQuery } from "react-query";
import {
  getAllFavoriteProducts,
  getAllFavoriteUsers,
} from "../../../../app/apis";
import getMediaUrl from "../../../../app/helpers/getMediaUrl";
import { User } from "../../../../app/types/user";
import { Spinner } from "react-bootstrap";
import { ServiceProductCardType } from "../../../../app/pages";
import { UserResponse } from "../../../../app/types/reducers";
import { useSelector } from "react-redux";

const HeaderFavoritesMenu: FC = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const user_id: string = user?.id;
  const { data, isLoading } = useQuery({
    queryKey: ["get-all-favorite-users"],
    queryFn: async () => await getAllFavoriteUsers(user_id),
  });

  const USERS_DATA: User[] = useMemo(() => data?.data, [data]);

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["get-all-favorite-products"],
    queryFn: async () => await getAllFavoriteProducts(user_id),
  });

  const PRODUCTS_DATA: ServiceProductCardType[] = useMemo(
    () => products?.data,
    [data]
  );

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
      data-kt-menu="true"
    >
      <div className="d-flex flex-column bg-danger rounded-top">
        <h3 className="text-white fw-bold px-9 mt-10 mb-6">Favoris</h3>

        <ul className="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-bold px-9">
          <li className="nav-item">
            <a
              className="nav-link text-white opacity-75 opacity-state-100 pb-4 active"
              data-bs-toggle="tab"
              href="#users_tab"
            >
              Utilisateurs
            </a>
          </li>

          <li className="nav-item">
            <a
              className="nav-link text-white opacity-75 opacity-state-100 pb-4"
              data-bs-toggle="tab"
              href="#products_tab"
            >
              Produits
            </a>
          </li>
        </ul>
      </div>

      <div className="tab-content">
        {/* USERS TAB */}
        <div
          className="tab-pane fade show active"
          id="users_tab"
          role="tabpanel"
        >
          <div className="scroll-y mh-325px my-5 px-8">
            {isLoading ? (
              <div className="w-100 h-325px d-flex justify-content-center align-items-center bg-white">
                <Spinner animation="border" className="text-danger" />
              </div>
            ) : (
              <>
                {USERS_DATA?.length > 0 ? (
                  <>
                    {USERS_DATA?.map((user, index) => (
                      <div
                        key={`alert${index}`}
                        className="d-flex flex-stack py-4"
                      >
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-35px me-4">
                            <span
                              className={clsx(
                                "symbol-label",
                                `bg-light-primary`
                              )}
                            >
                              <img
                                src={getMediaUrl(user?.avatar)}
                                alt={user?.fname}
                                className="w-100 h-100 rounded-3"
                              />
                            </span>
                          </div>

                          <div className="mb-0 me-2">
                            <Link
                              to={`/profile/${user?.id}`}
                              className="fs-6 text-gray-800 text-hover-primary fw-bolder"
                            >
                              {user?.fname} {user?.lname}
                            </Link>
                            <div className="text-gray-500 fs-7">
                              {user?.email}
                            </div>
                          </div>
                        </div>

                        {/* <span className="badge badge-light fs-8">20</span> */}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="d-flex flex-column p-9">
                    <div className="pt-10 pb-0">
                      <h3 className="text-gray-900 text-center fw-bolder">
                        Vous n'avez encore aimé aucun utilisateur
                      </h3>

                      <div className="text-center text-gray-600 fw-bold pt-1">
                        vous pouvez le faire facilement en cliquant sur le
                        bouton J'aime sur n'importe quelle page utilisateur.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="py-3 text-center border-top">
            <Link
              to="/participants"
              className="btn btn-color-gray-600 btn-active-color-primary"
            >
              Voir tous les participants{" "}
              <KTIcon iconName="arrow-right" className="fs-5" />
            </Link>
          </div>
        </div>

        {/* PRODUCTS TAB */}

        <div className="tab-pane fade " id="products_tab" role="tabpanel">
          <div className="scroll-y mh-325px my-5 px-8">
            {loadingProducts ? (
              <div className="w-100 h-325px d-flex justify-content-center align-items-center bg-white">
                <Spinner animation="border" className="text-danger" />
              </div>
            ) : (
              <>
                {PRODUCTS_DATA?.length > 0 ? (
                  <>
                    {PRODUCTS_DATA?.map((product, index) => (
                      <div
                        key={`alert${index}`}
                        className="d-flex flex-stack py-2"
                      >
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-35px me-4">
                            <span
                              className={clsx(
                                "symbol-label",
                                `bg-light-primary`
                              )}
                            >
                              <img
                                src={
                                  product?.featured_image === null
                                    ? "https://cdn-icons-png.flaticon.com/512/7807/7807083.png"
                                    : getMediaUrl(product?.featured_image)
                                }
                                alt={product?.name}
                                className="w-100 h-100 rounded-3"
                              />
                            </span>
                          </div>

                          <div className="mb-0 me-2">
                            <Link
                              to={`/products/${product?.id}`}
                              className="fs-6 text-gray-800 text-hover-primary fw-bolder"
                            >
                              {product?.name?.slice(0, 8)}
                            </Link>
                            <div
                              className="text-gray-500 fs-7"
                              dangerouslySetInnerHTML={{
                                __html: `${product?.description?.slice(
                                  0,
                                  10
                                )}...`,
                              }}
                            />
                          </div>
                        </div>

                        <span
                          className={clsx("badge  fs-8", {
                            "badge-light-primary": product?.type === "Product",
                            "badge-light-success": product?.type === "Service",
                          })}
                        >
                          {product?.type}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="d-flex flex-column p-9">
                    <div className="pt-10 pb-0">
                      <h3 className="text-gray-900 text-center fw-bolder">
                        Vous n'avez encore aimé aucun produit
                      </h3>

                      <div className="text-center text-gray-600 fw-bold pt-1">
                        vous pouvez le faire facilement en cliquant sur le
                        bouton J'aime sur n'importe quelle page produit.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="py-3 text-center border-top">
            <Link
              to="/products"
              className="btn btn-color-gray-600 btn-active-color-primary"
            >
              Voir tous les produits{" "}
              <KTIcon iconName="arrow-right" className="fs-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeaderFavoritesMenu };
