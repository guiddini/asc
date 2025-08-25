import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { SuggestionsApi } from "../../../apis";
import { Link } from "react-router-dom";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { ParticipantProps } from "../../../types/user";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

const SuggestionBox = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const { data, isLoading } = useQuery({
    queryKey: ["get-suggestions"],
    queryFn: async () =>
      await SuggestionsApi({
        offset: "0",
        user_id: user?.id,
      }),
  });

  const USERS_DATA: ParticipantProps[] = useMemo(() => data?.data, [data]);

  return (
    <>
      {USERS_DATA?.length > 0 && (
        <div className="card mb-5 mb-xl-8">
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold text-gray-900">
                Suggestions
              </span>
              <span className="text-muted mt-1 fw-semibold fs-7">
                {/* Suggestions pour vous */}
              </span>
            </h3>

            {/* <div className="card-toolbar">
          <Link to="/participants" className="btn btn-sm btn-light">
            Voir tout
          </Link>
        </div> */}
          </div>

          <div className="card-body pt-5">
            {USERS_DATA?.filter((el) => el.avatar !== null)
              ?.slice(0, 5)
              ?.map((user) => {
                return (
                  <>
                    <div className="d-flex flex-stack">
                      <div className="symbol symbol-40px me-5">
                        <img
                          src={getMediaUrl(user?.avatar)}
                          className="h-40px align-self-center object-fit-cover"
                          alt={`${user.fname} ${user.lname} pic`}
                        />
                      </div>

                      <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                        <span
                          className="text-gray-800 fs-6 fw-bold cursor-default w-75"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                          }}
                        >
                          {user?.fname} {user?.lname}
                        </span>

                        <Link
                          to={`/profile/${user?.id}`}
                          className="btn btn-sm btn-light fs-8 fw-bold"
                        >
                          Voir
                        </Link>
                      </div>
                    </div>

                    <div className="separator separator-dashed my-4"></div>
                  </>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default SuggestionBox;
