import { Dropdown, Modal, Button } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { deleteBlogApi } from "../../../apis";

const NewsActionColumn = ({ blog }: { blog: any }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteBlogMutate, isLoading } = useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: async (id: string) => {
      await deleteBlogApi(id);
    },
    onSuccess() {
      toast.success("News supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setOpenDeleteModal(false);
    },
    onError() {
      toast.error("Erreur lors de la suppression de la news");
    },
  });

  return (
    <>
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
          <Dropdown.Item
            as={Link}
            to={`/news-management/${blog.id}`}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info fw-bold px-5 py-3"
          >
            <KTIcon
              iconName="eye"
              className="fs-1 cursor-pointer m-0 text-success"
            />
            <span className="text-muted ms-2">View</span>
          </Dropdown.Item>

          <Dropdown.Item
            as={Link}
            to={`/news-management/update/${blog.id}`}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info fw-bold px-5 py-3"
          >
            <KTIcon
              iconName="pencil"
              className="fs-1 cursor-pointer m-0 text-primary"
            />
            <span className="text-muted ms-2">Modifier</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => setOpenDeleteModal(true)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info fw-bold px-5 py-3"
          >
            <KTIcon
              iconName="trash"
              className="fs-1 cursor-pointer m-0 text-danger"
            />
            <span className="text-muted ms-2">Supprimer</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal
        show={openDeleteModal}
        onHide={() => setOpenDeleteModal(false)}
        dialogClassName="modal-dialog modal-dialog-centered mw-450px"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Confirmation</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              onClick={() => setOpenDeleteModal(false)}
              style={{ cursor: "pointer" }}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>
          <Modal.Body>
            <p>
              Êtes-vous sûr de vouloir supprimer la news{" "}
              <strong>{blog?.title}</strong> ?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="light"
              onClick={() => setOpenDeleteModal(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteBlogMutate(blog.id)}
              disabled={isLoading}
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default NewsActionColumn;
