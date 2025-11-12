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
// Import the components you're using in info-settings
import { CountriesSelect, SelectComponent } from "../../components";
import { useUser } from "../../hooks"; // Import to get activities

type selectProps = {
  label: string;
  value: string | number;
};

export const ParticipantsPage = () => {
  // Get activities for interests filter
  const { MEMORIZED_ACTIVITIES, loadingActivities } = useUser();

  const { mutate: filterMutate, isLoading: isFiltering } = useMutation({
    mutationKey: ["filter-participants"],
    mutationFn: async ({
      nameFilter,
      roleFilter,
      offset,
      country,
      interestsFilter,
    }: {
      roleFilter?: string;
      nameFilter?: string;
      offset: number | string;
      country?: string;
      interestsFilter?: string[];
    }) =>
      await filterParticipantsApi({
        nameFilter,
        roleFilter,
        offset: offset,
        country,
        interestsFilter,
      }),
  });

  const dispatch = useDispatch();

  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  // Prevent concurrent requests and track latest offset to avoid backwards/duplicate calls
  const isRequestInFlightRef = useRef<boolean>(false);
  const latestOffsetRef = useRef<number>(0);

  useEffect(() => {
    if (USERS?.length === 0) {
      setInitialLoading(true);
      isRequestInFlightRef.current = true;
      latestOffsetRef.current = 0;
      filterMutate(
        {
          offset: 0,
        },
        {
          onSuccess(data) {
            setInitialLoading(false);
            isRequestInFlightRef.current = false;
            const users: ParticipantProps[] = data?.data;
            dispatch(initparticipants(users));
            dispatch(nextPage());
          },
          onError(error, variables, context) {
            setInitialLoading(false);
            isRequestInFlightRef.current = false;
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      roleFilter: "",
      nameFilter: "",
      country: null, // Add country filter
      interestsFilter: null, // Add interests filter
      prevRoleFilter: "",
      prevNameFilter: "",
      prevCountry: null,
      prevInterestsFilter: null,
    },
  });

  const handleFilter = async (data: {
    roleFilter?: string;
    nameFilter?: string;
    country?: selectProps | null;
    interestsFilter?: selectProps[] | null;
    prevRoleFilter?: string;
    prevNameFilter?: string;
    prevCountry?: selectProps | null;
    prevInterestsFilter?: selectProps[] | null;
  }) => {
    const {
      nameFilter,
      roleFilter,
      country,
      interestsFilter,
      prevNameFilter,
      prevRoleFilter,
      prevCountry,
      prevInterestsFilter,
    } = data;

    const paramsChanged =
      nameFilter !== prevNameFilter ||
      roleFilter !== prevRoleFilter ||
      JSON.stringify(country) !== JSON.stringify(prevCountry) ||
      JSON.stringify(interestsFilter) !== JSON.stringify(prevInterestsFilter);

    if (paramsChanged) {
      dispatch(resetCurrentPage());
      latestOffsetRef.current = 0;
    }

    const interestsArray =
      interestsFilter?.map((interest: selectProps) => String(interest.value)) ||
      [];

    const computedOffset = paramsChanged ? 0 : currentPage;

    // Guard against duplicate or backward offsets during infinite scroll
    if (!paramsChanged) {
      // Skip if a request is already in flight
      if (isRequestInFlightRef.current) {
        return;
      }
      // Skip if the computed offset is not strictly greater than the last used
      if (computedOffset <= latestOffsetRef.current) {
        return;
      }
    }

    const req = {
      nameFilter: nameFilter?.toLowerCase(),
      roleFilter: roleFilter?.toLowerCase(),
      country: country?.value ? String(country.value) : undefined,
      interestsFilter: interestsArray.length > 0 ? interestsArray : undefined,
      offset: computedOffset,
    };

    // Mark request as in-flight and record latest offset
    isRequestInFlightRef.current = true;
    latestOffsetRef.current = Number(computedOffset) || 0;

    filterMutate(req, {
      onSuccess(res) {
        isRequestInFlightRef.current = false;
        setValue("prevNameFilter", nameFilter);
        setValue("prevRoleFilter", roleFilter);
        setValue("prevCountry", country);
        setValue("prevInterestsFilter", interestsFilter);

        const users: ParticipantProps[] = res?.data || [];

        if (paramsChanged) {
          // Replace list when filters change and reset pagination
          dispatch(initparticipants(users));
          if (users.length > 0) {
            dispatch(nextPage());
          }
        } else {
          // Append for infinite scroll and advance pagination once per fetch
          if (users.length > 0) {
            users.forEach((user) => dispatch(addparticipants(user)));
            dispatch(nextPage());
          }
        }
      },
      onError() {
        isRequestInFlightRef.current = false;
      },
    });
  };

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFiltering && !initialLoading) {
          if (isRequestInFlightRef.current) return;
          const prevNameFilter = getValues("prevNameFilter");
          const prevRoleFilter = getValues("prevRoleFilter");
          const prevCountry = getValues("prevCountry");
          const prevInterestsFilter = getValues("prevInterestsFilter");
          handleFilter({
            nameFilter: getValues("nameFilter"),
            roleFilter: getValues("roleFilter"),
            country: getValues("country"),
            interestsFilter: getValues("interestsFilter"),
            prevNameFilter,
            prevRoleFilter,
            prevCountry,
            prevInterestsFilter,
          });

          observer.unobserve(entries[0].target);
          setTimeout(() => observer.observe(entries[0].target), 1000);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [USERS?.length, initialLoading, currentPage, isFiltering]);

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
                      placeholder="name of participant"
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
                        "Search"
                      )}
                    </button>
                    <a
                      href="#"
                      id="kt_horizontal_search_advanced_link"
                      className="btn btn-link"
                      data-bs-toggle="collapse"
                      data-bs-target="#kt_advanced_search_form"
                    >
                      Advanced Search
                    </a>
                  </Col>
                </Row>

                <div className="collapse" id="kt_advanced_search_form">
                  <div className="separator separator-dashed mt-9 mb-6"></div>
                  <div className="row g-8">
                    <div className="col-12 col-md-4">
                      <label className="fs-6 form-label fw-bold text-gray-900">
                        Participant Role
                      </label>
                      <select
                        className="form-select form-select-solid"
                        data-control="select2"
                        data-placeholder="Select a role"
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

                    {/* Country Filter */}
                    <div className="col-12 col-md-4">
                      <CountriesSelect
                        control={control as any}
                        errors={errors}
                        colMD={12}
                        colXS={12}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      {/* Interests Filter */}
                      <SelectComponent
                        errors={errors}
                        label="Interests"
                        control={control}
                        name="interestsFilter"
                        placeholder="Select interests"
                        data={MEMORIZED_ACTIVITIES || []}
                        isMulti={true}
                        isLoading={loadingActivities}
                        disabled={loadingActivities}
                        colMD={12}
                        colXS={12}
                      />
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
                <span className="fs-3">No participants available</span>
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
