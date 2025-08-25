import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  getAllProductServiceApi,
  promotProductApi,
  publishProductServiceApi,
  refuseProductServiceApi,
  unPromotProductApi,
} from "../../../apis";
import toast from "react-hot-toast";
import { PageTitle } from "../../../../_metronic/layout/core";
import { TableComponent } from "../../../components";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Dropdown } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { errorResponse } from "../../../types/responses";
import { Can } from "../../../utils/ability-context";

const MySwal = withReactContent(Swal);

export const FeaturedProducts = () => {
  const columns = [
    {
      name: "Produit",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Catégorie",
      selector: (row) => row.category?.name_fr,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },

    {
      name: "Featured",
      selector: (row) => {
        const is_featured = row?.promotion_flag === "Promoted";
        if (!is_featured) {
          return (
            <span className="badge badge-light-danger fw-bolder">False</span>
          );
        } else {
          return (
            <span className="badge badge-light-success fw-bolder">True</span>
          );
        }
      },
      sortable: true,
    },
    {
      name: "Créé à",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => {
        const is_featured = row?.promotion_flag === "Promoted";

        return (
          <Dropdown placement="top-start">
            <Dropdown.Toggle
              variant="transparent"
              color="#fff"
              id="post-dropdown"
              className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
            >
              <i className="ki-duotone ki-dots-square fs-1">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
              </i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="separator border-gray-200"></div>
              <div className="p-2">
                <Can I="view" a="companyproductsservices">
                  {/* view product */}
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/products/${row.id}`);
                    }}
                    className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
                  >
                    <KTIcon
                      iconName="eye"
                      className={`fs-1 cursor-pointer m-0 text-primary`}
                    />
                    <span className="text-muted mt-1 ms-2">View product</span>
                  </Dropdown.Item>
                  {/*  */}
                </Can>

                {/* promot product */}
                {!is_featured ? (
                  <Can I="makepromoted" a="companyproductsservices">
                    <Dropdown.Item
                      className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-warning btn-active-light-warning fw-bold collapsible m-0 px-5 py-3"
                      onClick={() => {
                        handlePromot(row.id);
                      }}
                    >
                      <KTIcon
                        iconName="star"
                        className={`fs-1 cursor-pointer m-0 text-warning`}
                      />
                      <span className="ms-2">Make featured</span>
                    </Dropdown.Item>
                  </Can>
                ) : (
                  <Can I="removepromoted" a="companyproductsservices">
                    <Dropdown.Item
                      onClick={() => {
                        handleRemovePromoted(row.id);
                      }}
                      className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-warning btn-active-light-warning fw-bold collapsible m-0 px-5 py-3"
                    >
                      <i className="fa-solid fa-star text-warning"></i>
                      <span className="ms-2 text-warning">Remove featured</span>
                    </Dropdown.Item>
                  </Can>
                )}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const navigate = useNavigate();

  const { data, refetch } = useQuery({
    queryKey: ["get-all-products-services"],
    queryFn: getAllProductServiceApi,
  });

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const PRODUCTS_DATA = useMemo(() => data?.data, [data, createModalOpen]);

  const handlePromot = (id: string | number) => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir promovoir ?",
      icon: "question",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Confirmer",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        promotProduct(id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            refetch();
            toast.success("Le produit a été promote avec succès !");
          },
          onError(error: errorResponse) {
            toast.error(`Error while : ${error.response?.data?.message}`);
          },
        });
      }
    });
  };

  const { mutate: promotProduct } = useMutation({
    mutationFn: async (id: string | number) => await promotProductApi(id, true),
    mutationKey: ["promot-product"],
  });

  const handleRemovePromoted = (id: string | number) => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir remove promovoir ?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Confirmer",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        unPromotProduct(id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            refetch();
            toast.success("Le produit a été unpromote avec succès !");
          },
          onError(error: errorResponse) {
            toast.error(`Error while : ${error.response?.data?.message}`);
          },
        });
      }
    });
  };

  const { mutate: unPromotProduct } = useMutation({
    mutationFn: async (id: string | number) => await unPromotProductApi(id),
    mutationKey: ["unpromot-product"],
  });

  return (
    <>
      <PageTitle>Featured Products</PageTitle>
      <Can I="list" a="featuredproducts">
        <TableComponent
          columns={columns as any}
          data={PRODUCTS_DATA}
          placeholder="produit"
          onAddClick={() => {
            //   navigate('')
          }}
          showCreate={false}
          showExport={false}
        />
      </Can>
    </>
  );
};
