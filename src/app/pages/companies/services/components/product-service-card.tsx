import { Col } from "react-bootstrap";
import { ServiceProductCardType } from "../services-page";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "react-query";
import {
  deleteProductServiceApi,
  getAllProductServiceApi,
  getCompanyProductServiceApi,
} from "../../../../apis";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import getMediaUrl from "../../../../helpers/getMediaUrl";

const MySwal = withReactContent(Swal);

const ProductServiceCard = (props: ServiceProductCardType) => {
  const { id } = useParams();
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

  const handleDeleteStaff = async () => {
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

  const navigate = useNavigate();

  return (
    <Col xs={12} md={6} lg={4}>
      <div
        className="card border-hover-primary border mb-5 shadow-sm mh-lg-550px bg-md-danger"
        style={
          {
            // maxHeight: "65vh",
          }
        }
      >
        <div className="card-header border-0 pt-4 d-flex flex-row align-items-center justify-content-between w-100 overflow-hidden mb-3 rounded-3">
          <img
            src={getMediaUrl(props?.featured_image)}
            // src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
            className="bg-primary-subtle w-100 h-100 object-fit-center rounded-3"
          />
        </div>
        <div className="card-body px-9">
          <div className="fs-3 fw-bold text-gray-900">{props?.name}</div>
          <div className="d-flex flex-wrap mb-5">
            <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3 bg-info">
              <div className="fs-6 text-light fw-bold">{props?.type}</div>
              <div className="fw-semibold text-light">Type</div>
            </div>
            {/* <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3">
              <div className="fs-6 text-gray-800 fw-bold">
                {props?.category?.name_fr}
              </div>
              <div className="fw-semibold text-gray-500">Catégorie</div>
            </div> */}
          </div>

          <div>
            <button
              onClick={() => navigate(`/products/${props?.id}`)}
              className="btn btn-sm btn-light-success btn-flex btn-center me-2"
              data-kt-follow-btn="true"
            >
              <i className="fa-regular fa-eye"></i>
              Voir
            </button>

            <button
              onClick={() =>
                navigate(`/company/${id}/services/update/${props?.id}`)
              }
              className="btn btn-sm btn-light-primary btn-flex btn-center me-2"
              data-kt-follow-btn="true"
            >
              <i className="fa-solid fa-pen"></i>
              Modifier
            </button>

            <button
              onClick={handleDeleteStaff}
              className="btn btn-sm btn-light-danger btn-flex btn-center"
              data-kt-follow-btn="true"
            >
              <i className="fa-regular bi-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductServiceCard;
