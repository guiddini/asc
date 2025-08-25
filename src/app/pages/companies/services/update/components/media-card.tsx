import React from "react";
import { Col } from "react-bootstrap";
import getMediaUrl from "../../../../../helpers/getMediaUrl";
import { MediaProps } from "./update-product-service-media";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import { deleteMediaApi } from "../../../../../apis";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const MySwal = withReactContent(Swal);

interface SelectedMediaProps {
  file: MediaProps;
  //   id: string | number | null;
  refetch: any;
}

const MediaCard = ({ file, refetch }: SelectedMediaProps) => {
  const { productID } = useParams();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["create-staff", file.id],
    mutationFn: async (id: string) => await deleteMediaApi(id),
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
        mutate(String(file?.id), {
          onSuccess(data, variables, context) {
            refetch();
            toast.success("L'image a été supprimé avec succès !");
            MySwal.hideLoading();
          },
          onError(error, variables, context) {
            toast?.error("Erreur lors de la suppression de l'image");
          },
        });
      }
    });
  };

  return (
    <Col
      xs={2}
      md={2}
      style={{
        overflow: "hidden",
        width: "120px",
        height: "120px",
        position: "relative",
        display: "block",
      }}
      // className="h-75px mb-4 d-flex align-items-center justify-content-center position-relative overflow-hidden my-4"
    >
      <>
        <button
          className="border-0 bg-transparent position-absolute top-0 end-0"
          onClick={handleDeleteStaff}
          //   disabled={isUploading}
        >
          <i className="fa-solid fa-trash text-danger"></i>
        </button>
        {/* {isUploading ? (
          <div
            className="position-absolute top-0 end-0 start-0 bottom-0 d-flex justify-content-center z-2"
            style={{
              background: "rgb(1, 1, 1,0.5)",
              width: "120px",
              height: "120px",
            }}
          >
            <Spinner
              animation="border"
              color="#fff"
              className="z-3 text-light m-auto"
            />
          </div>
        ) : (
          <></>
        )} */}
        <div
          style={{
            width: "120px",
            height: "120px",
          }}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <img
            src={getMediaUrl(file.path)}
            // src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
            className="object-fit-cover"
            style={{
              width: "auto",
              height: "120px",
            }}
          />
        </div>
      </>
    </Col>
  );
};

export default MediaCard;
