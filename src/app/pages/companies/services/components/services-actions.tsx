import React from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useNavigate, useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "react-query";
import {
  deleteProductServiceApi,
  getCompanyProductServiceApi,
} from "../../../../apis";
import toast from "react-hot-toast";
import { Dropdown } from "react-bootstrap";
import { useCompanyRedirect } from "../../../../hooks/useCompanyRedirect";

const MySwal = withReactContent(Swal);

const ServicesActions = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  useCompanyRedirect({
    companyId: id,
    restrictForStaff: true,
  });
  const { mutate, isLoading } = useMutation({
    mutationKey: ["delete-product-service", props?.id],
    mutationFn: async (id: string | number) =>
      await deleteProductServiceApi({
        productservice_id: id,
      }),
  });

  const { refetch } = useQuery({
    queryKey: ["get-all-products-services"],
    queryFn: () => getCompanyProductServiceApi(id),
  });

  const handleDeleteProduct = async () => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      backdrop: true,
      showLoaderOnConfirm: isLoading,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        mutate(props?.id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();

            refetch();
            toast.success(`Le ${props?.type} a été supprimé avec succès !`);
          },
          onError(error, variables, context) {},
        });
      }
    });
  };
  return (
    <Dropdown placement="auto">
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
          <Dropdown.Item
            onClick={() => navigate(`/products/${props?.id}`)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="eye"
              className={`fs-1 cursor-pointer m-0 text-primary`}
            />
            <span className="text-muted mt-1 ms-2">Voir</span>
          </Dropdown.Item>
          {/*  */}
          <Dropdown.Item
            onClick={() =>
              navigate(`/company/${id}/services/update/${props?.id}`)
            }
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="pencil"
              className={`fs-1 cursor-pointer m-0 text-primary`}
            />
            <span className="text-muted mt-1 ms-2">Editer</span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleDeleteProduct()}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="trash"
              className="fs-1 cursor-pointer m-0 text-danger"
            />
            <span className="text-muted mt-1 ms-2">Supprimer</span>
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ServicesActions;
