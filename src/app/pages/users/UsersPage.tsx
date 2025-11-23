// UsersPage component
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
import { User } from "../../types/user";
import { useDispatch, useSelector } from "react-redux";
import { UsersReducer, UserResponse } from "../../types/reducers";
import {
  addUser,
  initUsers,
  nextPage,
  resetCurrentPage,
} from "../../features/usersSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { Col, Row, Spinner } from "react-bootstrap";
import { Role } from "../../types/roles";
import { KTIcon } from "../../../_metronic/helpers";
import { USER_TYPES } from "../landing-page/layout/type-user-component";
import { KycStatus } from "../../apis/user";
import ExportUsersModal from "./components/export-users-modal";
import { kycManagementRoles } from "../../utils/roles";

// Define the form values shape so types align everywhere
type FormValues = {
  roleFilter: string;
  typeFilter: string;
  kyc_status: "" | KycStatus;
  nameFilter: string;
  prevRoleFilter: string;
  prevTypeFilter: string;
  prevKycStatus: "" | KycStatus;
  prevNameFilter: string;
  has_accommodation_only: boolean;
  is_companion_only: boolean;
  prevHasAccommodationOnly: boolean;
  prevIsCompanionOnly: boolean;
};

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
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const currentUser = useSelector((state: UserResponse) => state.user.user);
  const canExport =
    !!currentUser &&
    (currentUser.roles?.some((r) => kycManagementRoles.includes(r.name)) ||
      (currentUser.roleValues &&
        kycManagementRoles.includes(currentUser.roleValues.name)));

  const { mutate, isLoading } = useMutation({
    mutationKey: ["get-all-users"],
    mutationFn: async (data: {
      nameFilter?: string;
      roleFilter?: string;
      typeFilter?: string;
      kyc_status?: KycStatus;
      has_accommodation_only?: boolean;
      is_companion_only?: boolean;
      offset: string | number;
    }) => await getAllUsersApi(data),
  });

  const { watch, setValue, handleSubmit, register, getValues } =
    useForm<FormValues>({
      defaultValues: {
        roleFilter: "",
        typeFilter: "",
        kyc_status: "",
        nameFilter: "",
        prevRoleFilter: "",
        prevTypeFilter: "",
        prevKycStatus: "",
        prevNameFilter: "",
        has_accommodation_only: false,
        is_companion_only: false,
        prevHasAccommodationOnly: false,
        prevIsCompanionOnly: false,
      },
    });

  const {
    nameFilter,
    roleFilter,
    typeFilter,
    kyc_status,
    has_accommodation_only,
    is_companion_only,
  } = watch();

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
            // Normalize API response shape (array vs object with `data`)
            const fetched: User[] = Array.isArray(data)
              ? (data as User[])
              : ((data as any)?.data as User[]) || [];
            dispatch(initUsers(fetched));
            if (fetched.length > 0) {
              dispatch(nextPage());
            }
          },
          onError(error, variables, context) {
            setInitialLoading(false);
          },
        }
      );
    }
  }, []);

  const observerTarget = useRef(null);

  // Accept a partial of the fields that matter to filtering
  const handleFilter = async (
    data?: Partial<
      Pick<
        FormValues,
        | "roleFilter"
        | "nameFilter"
        | "typeFilter"
        | "kyc_status"
        | "has_accommodation_only"
        | "is_companion_only"
      >
    >
  ) => {
    const nameFilter = data?.nameFilter ?? watch("nameFilter");
    const roleFilter = data?.roleFilter ?? watch("roleFilter");
    const typeFilter = data?.typeFilter ?? watch("typeFilter");
    const kyc_status = data?.kyc_status ?? watch("kyc_status");
    const has_accommodation_only =
      data?.has_accommodation_only ?? watch("has_accommodation_only");
    const is_companion_only =
      data?.is_companion_only ?? watch("is_companion_only");

    const prevNameFilter = getValues("prevNameFilter");
    const prevRoleFilter = getValues("prevRoleFilter");
    const prevTypeFilter = getValues("prevTypeFilter");
    const prevKycStatus = getValues("prevKycStatus");
    const prevHasAccommodationOnly = getValues("prevHasAccommodationOnly");
    const prevIsCompanionOnly = getValues("prevIsCompanionOnly");

    // Detect any change in filters compared to previous submitted values
    const paramsChanged =
      nameFilter !== prevNameFilter ||
      roleFilter !== prevRoleFilter ||
      typeFilter !== prevTypeFilter ||
      kyc_status !== prevKycStatus ||
      has_accommodation_only !== prevHasAccommodationOnly ||
      is_companion_only !== prevIsCompanionOnly;

    if (paramsChanged) {
      dispatch(resetCurrentPage());
    }

    const req = {
      nameFilter: nameFilter?.toLocaleLowerCase(),
      roleFilter: roleFilter?.toLocaleLowerCase(),
      typeFilter: typeFilter?.toLocaleLowerCase(),
      kyc_status: (kyc_status || "") as KycStatus | undefined,
      has_accommodation_only: has_accommodation_only ? true : undefined,
      is_companion_only: is_companion_only ? true : undefined,
      offset: paramsChanged ? 0 : currentPage,
    };

    mutate(req, {
      onSuccess(res) {
        // Normalize API response shape (array vs object with `data`)
        const fetched: User[] = Array.isArray(res)
          ? (res as User[])
          : ((res as any)?.data as User[]) || [];

        // Update previous submitted values to current
        setValue("prevNameFilter", nameFilter);
        setValue("prevRoleFilter", roleFilter);
        setValue("prevTypeFilter", typeFilter);
        setValue("prevKycStatus", kyc_status || "");
        setValue("prevHasAccommodationOnly", !!has_accommodation_only);
        setValue("prevIsCompanionOnly", !!is_companion_only);

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

  // Wire the form submit with the proper type
  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    return handleFilter(formData);
  };

  // Auto-submit when role/type changes
  const handleRoleChange = (e: any) => {
    const value = e?.target?.value ?? "";
    setValue("roleFilter", value);
    handleFilter({
      roleFilter: value,
      nameFilter,
      typeFilter,
      kyc_status,
      has_accommodation_only,
      is_companion_only,
    });
  };

  const handleTypeChange = (e: any) => {
    const value = e?.target?.value ?? "";
    setValue("typeFilter", value);
    handleFilter({
      typeFilter: value,
      nameFilter,
      roleFilter,
      kyc_status,
      has_accommodation_only,
      is_companion_only,
    });
  };

  const handleKycStatusChange = (e: any) => {
    const value = e?.target?.value ?? "";
    setValue("kyc_status", value as "" | KycStatus);
    handleFilter({
      kyc_status: value as "" | KycStatus,
      nameFilter,
      roleFilter,
      typeFilter,
      has_accommodation_only,
      is_companion_only,
    });
  };

  const handleHasAccommodationOnlyChange = (e: any) => {
    const checked = !!e?.target?.checked;
    setValue("has_accommodation_only", checked);
    handleFilter({
      has_accommodation_only: checked,
      nameFilter,
      roleFilter,
      typeFilter,
      kyc_status,
      is_companion_only,
    });
  };

  const handleIsCompanionOnlyChange = (e: any) => {
    const checked = !!e?.target?.checked;
    setValue("is_companion_only", checked);
    handleFilter({
      is_companion_only: checked,
      nameFilter,
      roleFilter,
      typeFilter,
      kyc_status,
      has_accommodation_only,
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
            kyc_status,
            has_accommodation_only,
            is_companion_only,
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-100">
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
              <button
                type="button"
                className="btn btn-sm btn-custom-purple-dark text-white w-250px me-3"
                onClick={() => setCreateModalOpen(true)}
              >
                <KTIcon iconName="plus" className="fs-2 text-white" />
                Add New User
              </button>
              {/* Export button visible only to kycManagementRoles; compact style */}
              {canExport && (
                <button
                  type="button"
                  className="btn btn-sm btn-light-primary d-flex align-items-center gap-2 w-auto"
                  onClick={() => setExportOpen(true)}
                >
                  <KTIcon iconName="exit-up" className="fs-2" />
                  <span>Export</span>
                </button>
              )}
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
                <Col>
                  <label className="fs-6 form-label fw-bold text-gray-900">
                    KYC Status
                  </label>
                  <select
                    className="form-select form-select-solid"
                    data-control="select2"
                    data-placeholder="Select KYC status"
                    data-hide-search="true"
                    {...register("kyc_status", {
                      onChange: handleKycStatusChange,
                    })}
                  >
                    <option value=""></option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="refused">Refused</option>
                  </select>
                </Col>
                <Col className="d-flex align-items-end">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="hasAccommodationOnly"
                      {...register("has_accommodation_only", {
                        onChange: handleHasAccommodationOnlyChange,
                      })}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="hasAccommodationOnly"
                    >
                      Accommodation Only
                    </label>
                  </div>
                </Col>
                <Col className="d-flex align-items-end">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isCompanionOnly"
                      {...register("is_companion_only", {
                        onChange: handleIsCompanionOnlyChange,
                      })}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="isCompanionOnly"
                    >
                      Companion Only
                    </label>
                  </div>
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
            style={{ minHeight: "65vh", overflowY: "auto", maxHeight: "65vh" }}
          >
            <table className="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-150px">User</th>
                  <th className="min-w-150px">First Name</th>
                  <th className="min-w-150px">Last Name</th>
                  <th className="min-w-200px">Email</th>
                  <th className="min-w-150px">Phone</th>
                  <th className="min-w-150px">Role</th>
                  <th className="min-w-170px">Registration Type</th>
                  <th className="min-w-120px">KYC Status</th>
                  <th className="min-w-120px">Has KYC</th>
                  <th className="min-w-150px">Has Accommodation</th>
                  <th className="min-w-120px">Is Companion</th>
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

                    <td>{row?.info?.phone || "—"}</td>

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

                      {(!row?.roles || row.roles.length === 0) &&
                        !row?.roleValues && (
                          <span className="badge bg-light text-muted">
                            No role
                          </span>
                        )}
                    </td>

                    <td>
                      {row?.info?.type ? (
                        <span className="badge bg-secondary text-white rounded-pill">
                          {row.info.type}
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted">
                          Unknown
                        </span>
                      )}
                    </td>

                    <td>
                      {row?.info?.kyc_status ? (
                        <span
                          className={
                            "badge rounded-pill " +
                            (row.info.kyc_status === "accepted"
                              ? "bg-success text-white"
                              : row.info.kyc_status === "pending"
                              ? "bg-warning text-dark"
                              : row.info.kyc_status === "refused"
                              ? "bg-danger text-white"
                              : "bg-light text-muted")
                          }
                        >
                          {row.info.kyc_status.charAt(0).toUpperCase() +
                            row.info.kyc_status.slice(1)}
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted">
                          Unknown
                        </span>
                      )}
                    </td>

                    <td>
                      {row?.has_kyc ? (
                        <span className="badge bg-success text-white rounded-pill">
                          Yes
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted">No</span>
                      )}
                    </td>

                    <td>
                      {row?.has_accommodation ? (
                        <span className="badge bg-success text-white rounded-pill">
                          Yes
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted">No</span>
                      )}
                    </td>

                    <td>
                      {row?.is_companion ? (
                        <span className="badge bg-info text-white rounded-pill">
                          Yes
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted">No</span>
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

      <ExportUsersModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />
      {/* <ViewUserModal user={user} setIsOpen={setUser} /> */}
    </>
  );
};

export { UsersPage };
