import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import { CreateUserModal } from "./create-user/CreateUserModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getAllRolesApi, getAllUsersApi } from "../../apis";
import moment from "moment";
import UserActionColumn from "./components/user-action-column";
import { useNavigate } from "react-router-dom";
import getMediaUrl from "../../helpers/getMediaUrl";
import UpdateUserModal from "./update-user/UpdateUserModal";
import { Can } from "../../utils/ability-context";
import { User } from "../../types/user";
import { useDispatch, useSelector } from "react-redux";
import { UsersReducer } from "../../types/reducers";
import {
  addUser,
  initUsers,
  nextPage,
  resetCurrentPage,
} from "../../features/usersSlice";
import { useForm } from "react-hook-form";
import { Col, Row, Spinner } from "react-bootstrap";
import { Role } from "../../types/roles";
import { KTIcon } from "../../../_metronic/helpers";

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: "User Management",
    path: "/users",
    isSeparator: false,
    isActive: false,
  },
];

const UsersPage = () => {
  const navigate = useNavigate();
  const columns = [
    {
      name: "User",
      selector: (row) =>
        row?.avatar === null ? (
          <div className="symbol symbol-circle symbol-40px overflow-hidden me-3">
            <div className="symbol-label fs-3 bg-light-danger text-danger">
              {row?.fname?.slice(0, 1)}
            </div>
          </div>
        ) : (
          <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
            <div className="symbol-label">
              <img
                alt={row?.fname + row?.lname}
                src={getMediaUrl(row?.avatar)}
                className="w-100"
              />
            </div>
          </div>
        ),
      sortable: true,
    },
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
      name: "Type",
      selector: (row) => row?.roles[0]?.name,
      sortable: true,
    },
    {
      name: "N° Tickets",
      selector: (row) => Number(row?.ticket_count),
      sortable: true,
    },
    {
      name: "Créé à",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "",
      selector: (row: User) => (
        <UserActionColumn
          openViewModal={() => {
            navigate(`/profile/${row?.id}`);
          }}
          props={row}
        />
      ),
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const { mutate, isLoading } = useMutation({
    mutationKey: ["get-all-users"],
    mutationFn: async (data: {
      nameFilter?: string;
      roleFilter?: string;
      is_registered?: string | number;
      offset: string | number;
    }) => await getAllUsersApi(data),
  });

  const { watch, setValue, handleSubmit, register } = useForm({
    defaultValues: {
      roleFilter: "",
      nameFilter: "",
      prevRoleFilter: null,
      prevNameFilter: null,
      is_registered: 0,
      prev_is_registered: null,
    },
  });

  const { nameFilter, roleFilter, is_registered } = watch();

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateUserID, setUpdateUserID] = useState<string | number | null>(
    null
  );

  const [initialLoading, setInitialLoading] = useState<boolean>(false);

  const { currentPage, users } = useSelector(
    (state: UsersReducer) => state.users
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (users?.length === 0) {
      setInitialLoading(true);
      mutate(
        {
          offset: 0,
        },
        {
          onSuccess(data) {
            setInitialLoading(false);

            const users: User[] = data?.data;
            dispatch(initUsers(users));
            dispatch(nextPage());
          },
          onError(error, variables, context) {
            setInitialLoading(false);
          },
        }
      );
    }
  }, []);

  const observerTarget = useRef(null);

  const handleFilter = async (data: {
    roleFilter?: string;
    nameFilter?: string;
    prevRoleFilter?: string;
    prevNameFilter?: string;
    is_registered?: number;
    prev_is_registered?: number;
  }) => {
    const {
      nameFilter,
      roleFilter,
      prevNameFilter,
      prevRoleFilter,
      is_registered,
      prev_is_registered,
    } = data;

    const paramsChanged =
      nameFilter === prevNameFilter ||
      roleFilter === prevRoleFilter ||
      is_registered === prev_is_registered;

    if (paramsChanged) {
      dispatch(resetCurrentPage());
    }

    const req = {
      nameFilter: nameFilter?.toLocaleLowerCase(),
      roleFilter: roleFilter?.toLocaleLowerCase(),
      offset: paramsChanged ? 0 : currentPage,
      is_registered: is_registered ? 1 : 0,
    };

    mutate(req, {
      onSuccess(res) {
        setValue("prevNameFilter", nameFilter);
        setValue("prevRoleFilter", roleFilter);
        setValue("prev_is_registered", is_registered);
        const users: User[] = res?.data;

        if (paramsChanged && users.length === 0) {
          dispatch(initUsers(users));
        }

        if (users.length > 0) {
          users?.forEach((user) => dispatch(addUser(user)));
          dispatch(nextPage());
          if (paramsChanged) {
            dispatch(initUsers(users));
          }
        }
      },
      onError(error, variables, context) {},
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleFilter({
            nameFilter,
            roleFilter,
            is_registered,
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
    [data, isLoading]
  );
  console.log("type user", users);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs} />

      <Can I="list" a="usersadmin">
        <TableComponent
          columns={columns as any}
          data={users}
          placeholder="utilisateur"
          onAddClick={() => {}}
          canA="users"
          canI="create"
          showSearch={false}
          customFullHeader={
            <form onSubmit={handleSubmit(handleFilter)} className="w-100">
              <div className="card">
                <div className="card-body px-0">
                  <Row className="d-flex align-items-center justify-content-between w-100">
                    <Col className="position-relative w-md-400px me-md-2">
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        name="search"
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nom d'utlisateur"
                        {...register("nameFilter")}
                      />
                    </Col>

                    <Col className="d-flex align-items-center">
                      <button
                        type="submit"
                        className="btn btn-custom-purple-dark text-white me-5"
                      >
                        {isLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Recherche"
                        )}
                      </button>
                    </Col>
                    <Can I="create" a="users">
                      <button
                        type="button"
                        className="btn btn-sm btn-custom-purple-dark text-white w-250px"
                        onClick={() => setCreateModalOpen(true)}
                      >
                        <KTIcon iconName="plus" className="fs-2 text-white" />
                        Ajouter un nouveau utilisateur
                      </button>
                    </Can>
                  </Row>

                  <div>
                    <div className="separator separator-dashed mt-9 mb-6"></div>
                    <Row className="g-8">
                      <Col>
                        <label className="fs-6 form-label fw-bold text-gray-900">
                          Role d'utlisateur
                        </label>
                        <select
                          className="form-select form-select-solid"
                          data-control="select2"
                          data-placeholder="In Progress"
                          data-hide-search="true"
                          {...register("roleFilter")}
                        >
                          <option value=""></option>
                          {ROLES?.map((role, index) => (
                            <option value={role?.value} key={index}>
                              {role?.label}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col>
                        <div className="form-check mt-10">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            {...register("is_registered")}
                          />
                          <label
                            className="form-check-label text-black fw-bold fs-3"
                            htmlFor="flexCheckDefault"
                          >
                            Profil complété
                          </label>
                        </div>
                        <label className="fs-6 form-label fw-bold text-gray-900"></label>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </form>
          }
        />
        {isLoading && (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" color="#000" size="sm" />
          </div>
        )}
        {users?.length >= 10 && <div ref={observerTarget}></div>}
      </Can>

      <Can I="create" a="users">
        <CreateUserModal
          isOpen={createModalOpen}
          setIsOpen={setCreateModalOpen}
          refetch={() => {}}
          key={String(createModalOpen)}
        />
      </Can>

      {/* <ViewUserPermissions
        user={updateUserPermissions}
        setIsOpen={setUpdateUserPermissions}
        refetch={() => {}}
      /> */}

      <Can I="update" a="users">
        <UpdateUserModal
          refetch={() => {}}
          setUserID={setUpdateUserID}
          userID={updateUserID}
        />
      </Can>

      {/* <ViewUserModal user={user} setIsOpen={setUser} /> */}
    </>
  );
};

export { UsersPage };
