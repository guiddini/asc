import { PageLink, PageTitle } from "../../../_metronic/layout/core";
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
import { USER_TYPES } from "../landing-page/layout/type-user-component";

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["get-all-users"],
    mutationFn: async (data: {
      nameFilter?: string;
      roleFilter?: string;
      typeFilter?: string;
      is_registered?: string | number;
      offset: string | number;
    }) => await getAllUsersApi(data),
  });

  const { watch, setValue, handleSubmit, register, getValues } = useForm({
    defaultValues: {
      roleFilter: "",
      typeFilter: "",
      nameFilter: "",
      prevRoleFilter: "",
      prevTypeFilter: "",
      prevNameFilter: "",
      is_registered: 0,
      prev_is_registered: 0,
    },
  });

  const { nameFilter, roleFilter, typeFilter, is_registered } = watch();

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

  const handleFilter = async (data?: {
    roleFilter?: string;
    nameFilter?: string;
    is_registered?: number;
    typeFilter?: string;
  }) => {
    const nameFilter = data?.nameFilter ?? watch("nameFilter");
    const roleFilter = data?.roleFilter ?? watch("roleFilter");
    const typeFilter = data?.typeFilter ?? watch("typeFilter");
    const is_registered = data?.is_registered ?? watch("is_registered");

    const prevNameFilter = getValues("prevNameFilter");
    const prevRoleFilter = getValues("prevRoleFilter");
    const prevTypeFilter = getValues("prevTypeFilter");
    const prev_is_registered = getValues("prev_is_registered");

    // Detect any change in filters compared to previous submitted values
    const paramsChanged =
      nameFilter !== prevNameFilter ||
      roleFilter !== prevRoleFilter ||
      typeFilter !== prevTypeFilter ||
      is_registered !== prev_is_registered;

    if (paramsChanged) {
      dispatch(resetCurrentPage());
    }

    const req = {
      nameFilter: nameFilter?.toLocaleLowerCase(),
      roleFilter: roleFilter?.toLocaleLowerCase(),
      typeFilter: typeFilter?.toLocaleLowerCase(),
      offset: paramsChanged ? 0 : currentPage,
      is_registered: is_registered ? 1 : 0,
    };

    mutate(req, {
      onSuccess(res) {
        const fetched: User[] = res?.data;

        // Update previous submitted values to current
        setValue("prevNameFilter", nameFilter);
        setValue("prevRoleFilter", roleFilter);
        setValue("prevTypeFilter", typeFilter);
        setValue("prev_is_registered", is_registered);

        if (paramsChanged) {
          // New search: replace list and reset pagination
          dispatch(initUsers(fetched));
          dispatch(resetCurrentPage());
          if (fetched.length > 0) {
            dispatch(nextPage());
          }
          return;
        }

        // Infinite scroll: append and advance page
        if (!paramsChanged && fetched.length > 0) {
          fetched.forEach((user) => dispatch(addUser(user)));
          dispatch(nextPage());
        }
      },
      onError(error, variables, context) {},
    });
  };

  // Auto-submit when role/type changes
  const handleRoleChange = (e: any) => {
    const value = e?.target?.value ?? "";
    setValue("roleFilter", value);
    handleFilter({
      roleFilter: value,
      nameFilter,
      typeFilter,
      is_registered,
    });
  };

  const handleTypeChange = (e: any) => {
    const value = e?.target?.value ?? "";
    setValue("typeFilter", value);
    handleFilter({
      typeFilter: value,
      nameFilter,
      roleFilter,
      is_registered,
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Avoid multiple triggers while a request is in-flight or initial load
          if (isLoading || initialLoading) return;
          handleFilter({
            nameFilter,
            roleFilter,
            typeFilter,
            is_registered,
          });
        }
      },
      {
        root: scrollContainerRef.current || null,
        threshold: 0,
        rootMargin: "0px 0px 300px 0px",
      }
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

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs} />

      <form onSubmit={handleSubmit(handleFilter)} className="w-100">
        <div className="card">
          <div className="card-body p-6">
            <Row className="d-flex align-items-center justify-content-between w-100">
              <Col className="position-relative w-md-400px me-md-2">
                <input
                  type="text"
                  className="form-control form-control-solid"
                  name="search"
                  placeholder="User name"
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
                    "Search"
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
                  Add New User
                </button>
              </Can>
            </Row>

            <div>
              <div className="separator separator-dashed mt-9 mb-6"></div>
              <Row className="g-8">
                <Col>
                  <label className="fs-6 form-label fw-bold text-gray-900">
                    User Role
                  </label>
                  <select
                    className="form-select form-select-solid"
                    data-control="select2"
                    data-placeholder="Select a role"
                    data-hide-search="true"
                    {...register("roleFilter", { onChange: handleRoleChange })}
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
                  <label className="fs-6 form-label fw-bold text-gray-900">
                    Registration Type
                  </label>
                  <select
                    className="form-select form-select-solid"
                    data-control="select2"
                    data-placeholder="Select a type"
                    data-hide-search="true"
                    {...register("typeFilter", { onChange: handleTypeChange })}
                  >
                    <option value=""></option>
                    {USER_TYPES?.map((t, index) => (
                      <option value={t?.value} key={index}>
                        {t?.label}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </form>

      <div className="card mt-5">
        <div className="card-body p-4">
          <div
            ref={scrollContainerRef}
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <table className="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-150px">User</th>
                  <th className="min-w-150px">First Name</th>
                  <th className="min-w-150px">Last Name</th>
                  <th className="min-w-200px">Email</th>
                  <th className="min-w-150px">Role</th>
                  <th className="min-w-170px">Registration Type</th>
                  <th className="min-w-120px">Created At</th>
                  <th className="text-end min-w-150px">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 fw-semibold">
                {users?.map((row: User) => (
                  <tr key={String(row?.id)}>
                    <td>
                      {row?.avatar === null ? (
                        <div className="symbol symbol-circle symbol-40px overflow-hidden me-3">
                          <div className="symbol-label fs-3 bg-light-danger text-danger">
                            {row?.fname?.slice(0, 1)}
                          </div>
                        </div>
                      ) : (
                        <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
                          <div className="symbol-label">
                            <img
                              alt={(row?.fname || "") + (row?.lname || "")}
                              src={getMediaUrl(row?.avatar)}
                              className="w-100"
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td>{row?.fname}</td>
                    <td>{row?.lname}</td>
                    <td
                      style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                    >
                      {row?.email}
                    </td>
                    {/* Role badges */}
                    <td>
                      {(row?.roles && row.roles.length > 0
                        ? row.roles
                        : row?.roleValues
                        ? [row.roleValues]
                        : []
                      ).map((r: any, idx: number) => (
                        <span
                          key={String(r?.id || idx)}
                          className="badge bg-primary text-white rounded-pill me-2"
                        >
                          {r?.display_name || r?.name || "Role"}
                        </span>
                      ))}
                      {(!row?.roles || row.roles.length === 0) && !row?.roleValues && (
                        <span className="badge bg-light text-muted">No role</span>
                      )}
                    </td>
                    {/* Registration type badge */}
                    <td>
                      {row?.info?.type ? (
                        <span className="badge bg-secondary text-white rounded-pill">
                          {row.info.type}
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted">Unknown</span>
                      )}
                    </td>
                    <td>{moment(row.created_at).format("DD/MM/YYYY")}</td>
                    <td className="text-end">
                      <UserActionColumn
                        openViewModal={() => {
                          navigate(`/profile/${row?.id}`);
                        }}
                        props={row}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoading && (
              <div className="d-flex align-items-center justify-content-center py-4">
                <Spinner animation="border" size="sm" />
              </div>
            )}

            {users?.length >= 10 && (
              <div ref={observerTarget} style={{ height: 1 }}></div>
            )}
          </div>
        </div>
      </div>
      <CreateUserModal
        isOpen={createModalOpen}
        setIsOpen={setCreateModalOpen}
        refetch={() => {}}
        key={String(createModalOpen)}
      />

      {/* <ViewUserPermissions
        user={updateUserPermissions}
        setIsOpen={setUpdateUserPermissions}
        refetch={() => {}}
      /> */}
      <UpdateUserModal
        refetch={() => {}}
        setUserID={setUpdateUserID}
        userID={updateUserID}
      />

      {/* <ViewUserModal user={user} setIsOpen={setUser} /> */}
    </>
  );
};

export { UsersPage };
