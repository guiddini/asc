import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addCompanyStaffApi,
  getAllNotInCompanyStaffApi,
  getAllRolesApi,
} from "../../../../apis";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Col, Row, Spinner, Modal, Button } from "react-bootstrap";
import { errorResponse } from "../../../../types/responses";
import {
  UserNotInCompany,
  usersNotInCompanyReducer,
} from "../../../../types/reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserNotInCompany,
  initUsersNotInCompany,
  nextPage,
  removeUserNotInCompany,
  resetCurrentPage,
} from "../../../../features/usersNotInCompanySlice";
import { useForm } from "react-hook-form";
import { Role } from "../../../../types/roles";
import { TableComponent } from "../../../../components";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { canEditCompany } from "../../../../features/userSlice";

interface CreateStaffPageProps {
  refetch: () => void;
}

type createStaffType = {
  user_id: string;
  company_id: string;
  role: string;
};

const CreateStaffPage: React.FC<CreateStaffPageProps> = ({ refetch }) => {
  const { id } = useParams();
  const isCompanyEditor = useSelector((state) => canEditCompany(state, id));

  const columns = [
    {
      name: "Prénom",
      selector: (row) => row?.fname,
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row) => row?.lname,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <button
          onClick={() => handleOpenModal(row.id)}
          className="btn ms-auto btn-success p-0 w-70px py-2 fs-6"
        >
          {selectedRow === row?.id && isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Ajouter"
          )}
        </button>
      ),
      sortable: true,
      omit: !isCompanyEditor,
    },
  ];

  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const dispatch = useDispatch();
  const { currentPage, users } = useSelector(
    (state: usersNotInCompanyReducer) => state.usersNotInCompany
  );

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      roleFilter: "",
      nameFilter: "",
      prevRoleFilter: "",
      prevNameFilter: "",
    },
  });

  const { nameFilter, roleFilter } = watch();

  const observerTarget = useRef(null);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["create-staff"],
    mutationFn: async (data: createStaffType) => await addCompanyStaffApi(data),
  });

  const { mutate: filterMutate, isLoading: isFiltering } = useMutation({
    mutationKey: ["get-all-not-assigned-staff"],
    mutationFn: async (data: {
      nameFilter?: string;
      roleFilter?: string;
      offset: string | number;
    }) => await getAllNotInCompanyStaffApi(data),
  });

  const handleOpenModal = (userId: string) => {
    setSelectedRow(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole("");
    setSelectedRow(null);
  };

  const createStaffFN = async () => {
    if (!selectedRow || !selectedRole) return;

    const req = {
      user_id: selectedRow,
      company_id: id,
      role: selectedRole,
    };
    mutate(req, {
      onSuccess() {
        toast.success(
          "L'utilisateur a été ajouté avec succès à votre entreprise"
        );
        refetch();
        dispatch(removeUserNotInCompany(selectedRow));
        handleCloseModal();
      },
      onError(error: errorResponse) {
        toast.error(
          `Erreur lors de l'ajout de staff : ${error?.response?.data?.error}`
        );
        handleCloseModal();
      },
    });
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleFilter = async (data: {
    roleFilter?: string;
    nameFilter?: string;
    prevRoleFilter?: string;
    prevNameFilter?: string;
  }) => {
    const { nameFilter, roleFilter, prevNameFilter, prevRoleFilter } = data;

    const paramsChanged =
      nameFilter === prevNameFilter || roleFilter === prevRoleFilter;

    if (paramsChanged) {
      dispatch(resetCurrentPage());
    }

    const req: any = {
      nameFilter: nameFilter?.toLocaleLowerCase(),
      roleFilter: roleFilter?.toLocaleLowerCase(),
      offset: paramsChanged ? 0 : currentPage,
    };

    filterMutate(req, {
      onSuccess(res) {
        setValue("prevNameFilter", nameFilter);
        setValue("prevRoleFilter", roleFilter);
        const users: UserNotInCompany[] = res?.data;
        if (paramsChanged && users.length === 0) {
          dispatch(initUsersNotInCompany(users));
        }

        if (users.length > 0) {
          users?.forEach((user) => dispatch(addUserNotInCompany(user)));
          dispatch(nextPage());
          if (paramsChanged) {
            dispatch(initUsersNotInCompany(users));
          }
        }
      },
      onError(error, variables, context) {
        console.log("error", error);
      },
    });
  };
  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRolesApi,
  });

  const ROLES: {
    label: string;
    value: string;
  }[] = useMemo(
    () =>
      data?.data
        ?.filter((e) => e?.name !== "admin" && e?.name !== "committee")
        .map((r: Role) => {
          return {
            label: r.display_name || "",
            value: r.name || "",
          };
        }) || [],
    [data, isFiltering]
  );

  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  useEffect(() => {
    if (users?.length === 0) {
      setInitialLoading(true);
      filterMutate(
        {
          offset: 0,
        },
        {
          onSuccess(data) {
            setInitialLoading(false);
            const users: UserNotInCompany[] = data?.data;
            dispatch(initUsersNotInCompany(users));
            dispatch(nextPage());
          },
          onError(error, variables, context) {
            console.log("error getting participants");
            setInitialLoading(false);
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleFilter({
            nameFilter,
            roleFilter,
          });
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [users?.length, initialLoading]);

  return (
    <>
      <PageTitle>Ajouter staff</PageTitle>
      <KTCardBody className="py-4">
        <TableComponent
          columns={columns as any}
          data={users}
          onAddClick={() => {}}
          showCreate={false}
          showSearch={false}
          placeholder=""
          customFullHeader={
            <form onSubmit={handleSubmit(handleFilter)} className="w-100">
              <Row className="d-flex align-items-center p-4">
                <Col className="position-relative w-md-400px me-md-2">
                  <label className="fs-6 form-label fw-bold text-gray-900">
                    Nom du participant
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    name="search"
                    placeholder="Nom du participant"
                    {...register("nameFilter")}
                  />
                </Col>

                <Col>
                  <label className="fs-6 form-label fw-bold text-gray-900">
                    Role du participant
                  </label>
                  <select
                    className="form-select form-select-solid"
                    data-control="select2"
                    data-placeholder="In Progress"
                    data-hide-search="true"
                    {...register("roleFilter")}
                  >
                    <option value="">Tous</option>
                    {ROLES?.map((role, index) => (
                      <option value={role?.value} key={index}>
                        {role?.label}
                      </option>
                    ))}
                  </select>
                </Col>

                <Col className="d-flex align-items-center">
                  <button
                    type="submit"
                    className="btn btn-custom-purple-dark text-white ms-auto mt-8"
                  >
                    {isFiltering ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Recherche"
                    )}
                  </button>
                </Col>
              </Row>
            </form>
          }
        />
        {isFiltering && (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" color="#000" size="sm" />
          </div>
        )}
        <div ref={observerTarget}></div>

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          dialogClassName="modal-dialog modal-dialog-centered mw-400px"
        >
          <Modal.Header closeButton>
            <Modal.Title>Sélectionner un rôle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-column gap-4">
              <div className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="staffRadio"
                  value="staff"
                  onChange={() => handleRoleChange("staff")}
                  checked={selectedRole === "staff"}
                />
                <label className="form-check-label" htmlFor="staffRadio">
                  Staff
                </label>
              </div>
              <div className="form-check form-check-custom form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="editorRadio"
                  value="editor"
                  onChange={() => handleRoleChange("editor")}
                  checked={selectedRole === "editor"}
                />
                <label className="form-check-label" htmlFor="editorRadio">
                  Moderateur
                </label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={createStaffFN}
              disabled={!selectedRole}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Confirmer"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </KTCardBody>
    </>
  );
};

export default CreateStaffPage;
