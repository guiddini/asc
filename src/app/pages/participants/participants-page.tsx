import { useEffect, useMemo, useRef, useState } from "react";
import ParticipantCard from "./components/participant-card";
import { Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { filterParticipantsApi, getAllRolesApi } from "../../apis";
import { ParticipantProps } from "../../types/user";
import { PageTitle } from "../../../_metronic/layout/core";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  resetCurrentPage,
  addparticipants,
  initparticipants,
} from "../../features/participantsSlice";
import { ParticipantsReducer } from "../../types/reducers";
import { useForm } from "react-hook-form";
import { Role } from "../../types/roles";

export const ParticipantsPage = () => {
  const { mutate: filterMutate, isLoading: isFiltering } = useMutation({
    mutationKey: ["filter-participants"],
    mutationFn: async ({
      nameFilter,
      roleFilter,
      offset,
    }: {
      roleFilter?: string;
      nameFilter?: string;
      offset: number | string;
    }) =>
      await filterParticipantsApi({
        nameFilter,
        roleFilter,
        offset: offset,
      }),
  });

  const dispatch = useDispatch();

  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  useEffect(() => {
    if (USERS?.length === 0) {
      setInitialLoading(true);
      filterMutate(
        {
          offset: 0,
        },
        {
          onSuccess(data) {
            setInitialLoading(false);
            const users: ParticipantProps[] = data?.data;
            dispatch(initparticipants(users));
            dispatch(nextPage());
          },
          onError(error, variables, context) {
            setInitialLoading(false);
          },
        }
      );
    }
  }, []);

  const USERS: ParticipantProps[] = useSelector(
    (state: ParticipantsReducer) => state?.participants?.participants
  );

  const currentPage = useSelector(
    (state: ParticipantsReducer) => state?.participants?.currentPage
  );

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

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      roleFilter: "",
      nameFilter: "",
      prevRoleFilter: "",
      prevNameFilter: "",
    },
  });

  const { nameFilter, roleFilter } = watch();

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

    const req = {
      nameFilter: nameFilter?.toLocaleLowerCase(),
      roleFilter: roleFilter?.toLocaleLowerCase(),
      offset: paramsChanged ? 0 : currentPage,
    };

    filterMutate(req, {
      onSuccess(res) {
        setValue("prevNameFilter", nameFilter);
        setValue("prevRoleFilter", roleFilter);
        const users: ParticipantProps[] = res?.data;
        if (paramsChanged && users.length === 0) {
          dispatch(initparticipants(users));
        }

        if (users.length > 0) {
          users?.forEach((user) => dispatch(addparticipants(user)));
          dispatch(nextPage());
          if (paramsChanged) {
            dispatch(initparticipants(users));
          }
        }
      },
      onError(error, variables, context) {},
    });
  };

  const observerTarget = useRef(null);

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
  }, [USERS?.length, initialLoading]);

  return (
    <div>
      <PageTitle>Participants</PageTitle>

      {initialLoading ? (
        <div
          style={{
            height: "70vh",
          }}
          className="w-100 d-flex justify-content-center align-items-center bg-white"
        >
          <Spinner animation="border" color="#000" />
        </div>
      ) : (
        <Row className="">
          <form onSubmit={handleSubmit(handleFilter)}>
            <div className="card mb-7">
              <div className="card-body">
                <Row className="d-flex align-items-center">
                  <Col className="position-relative w-md-400px me-md-2">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="search"
                      // value={searchTerm}
                      // onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nom du participant"
                      {...register("nameFilter")}
                    />
                  </Col>

                  <Col className="d-flex align-items-center">
                    <button
                      type="submit"
                      className="btn btn-custom-purple-dark text-white me-5"
                    >
                      {isFiltering ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Recherche"
                      )}
                    </button>
                    <a
                      href="#"
                      id="kt_horizontal_search_advanced_link"
                      className="btn btn-link"
                      data-bs-toggle="collapse"
                      data-bs-target="#kt_advanced_search_form"
                    >
                      Recherche avancée
                    </a>
                  </Col>
                </Row>

                <div className="collapse" id="kt_advanced_search_form">
                  <div className="separator separator-dashed mt-9 mb-6"></div>
                  <div className="row g-8">
                    <div className="col-12">
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
                        <option value=""></option>
                        {ROLES?.map((role, index) => (
                          <option value={role?.value} key={index}>
                            {role?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {USERS?.length > 0 ? (
            <>
              {USERS?.map((user, index) => (
                <ParticipantCard {...user} key={index} />
              ))}
              {isFiltering && (
                <div className="w-100 d-flex align-items-center justify-content-center">
                  <Spinner animation="border" color="#000" size="sm" />
                </div>
              )}
              {USERS?.length >= 10 && <div ref={observerTarget}></div>}
            </>
          ) : (
            <div
              className="card"
              style={{
                minHeight: "70vh",
              }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <span className="fs-3">Aucun participant disponible</span>
                <img
                  src={toAbsoluteUrl("/media/illustrations/sigma-1/9-dark.png")}
                  className="h-250px w-250px"
                />
              </div>
            </div>
          )}
        </Row>
      )}
    </div>
  );
};
