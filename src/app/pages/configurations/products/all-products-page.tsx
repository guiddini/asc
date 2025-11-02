import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  getAllProductServiceApi,
  publishProductServiceApi,
  refuseProductServiceApi,
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
import { Can } from "../../../utils/ability-context";

const MySwal = withReactContent(Swal);

export const AllProductsPage = () => {
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
      name: "Statut",
      selector: (row) => {
        if (row.status === "Pending") {
          return (
            <span className="badge badge-light-warning fw-bolder">
              {row.status}
            </span>
          );
        } else if (row.status === "Published") {
          return (
            <span className="badge badge-light-success fw-bolder">
              {row.status}
            </span>
          );
        } else if (row.status === "Refused") {
          return (
            <span className="badge badge-light-danger fw-bolder">
              {row.status}
            </span>
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
              <div className="p-2">
                {/* view product */}
                <Can I="view" a="companyproductsservices">
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

                {row?.status !== "Published" ? (
                  <Can I="publish" a="companyproductsservices">
                    {/* publish product */}
                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        if (row.status !== "Published") {
                          handlePublishProductService(row?.id);
                        }
                      }}
                      className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
                    >
                      <KTIcon
                        iconName="check-square"
                        className={`fs-1 cursor-pointer m-0 text-primary`}
                      />
                      <span className="text-muted mt-1 ms-2">Publier</span>
                    </Dropdown.Item>
                  </Can>
                ) : (
                  <Can I="refuse" a="companyproductsservices">
                    {/* refus product */}

                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        handleRefuseProductService(row?.id);
                      }}
                      className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-danger btn-active-light-danger fw-bold collapsible m-0 px-5 py-3"
                    >
                      <KTIcon
                        iconName="cross-square"
                        className={`fs-1 cursor-pointer m-0 text-danger `}
                      />
                      <span className="text-muted mt-1 ms-2">Refuser</span>
                    </Dropdown.Item>
                  </Can>
                )}

                {/*  */}

                {/* */}
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

  const { mutate: publishProductMutate } = useMutation({
    mutationKey: ["publish-product-service"],
    mutationFn: (id: string | number) => publishProductServiceApi(id),
  });

  const { mutate: refuseProductMutate } = useMutation({
    mutationKey: ["publish-product-service"],
    mutationFn: ({
      id,
      status_reason,
    }: {
      id: string | number;
      status_reason: string;
    }) => refuseProductServiceApi(id, status_reason),
  });

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const PRODUCTS_DATA = useMemo(() => data?.data, [data, createModalOpen]);

  const handleRefuseProductService = async (id: string | number) => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir refuser ?",
      icon: "error",
      input: "text",
      text: "Veuillez ajouter le motif du refus",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "le motif du refus",
      },
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        if (login?.length > 0) {
          refuseProductMutate(
            {
              id: id,
              status_reason: login,
            },
            {
              onSuccess(data, variables, context) {
                MySwal.hideLoading();
                refetch();
                toast.success("Le produit a été refusé avec succès !");
                Swal.fire({
                  title: "Le produit a été rejeté avec succès",
                });
              },
              onError(error, variables, context) {
                toast.error("Error while refusing product !");
              },
            }
          );
        } else {
          Swal.showValidationMessage("Veuillez ajouter le motif du refus");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handlePublishProductService = async (id: string | number) => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir publier ?",
      icon: "info",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Confirmer",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        publishProductMutate(id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            refetch();
            toast.success("Le produit a été publié avec succès !");
          },
          onError(error, variables, context) {
            toast.error("Error while acepting product !");
          },
        });
      }
    });
  };

  return (
    <>
      <PageTitle>Products list</PageTitle>
      <Can I="list" a="companyproductsservicesadmin">
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
