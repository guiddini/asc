import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import {
  getMyUserConnections,
  getPendingUserConnections,
  acceptUserConnectionRequest,
  declineUserConnectionRequest,
} from "../../apis/user-connection";
import type {
  UserConnection,
  UserConnectionUser,
} from "../../types/user-connection";
import getMediaUrl from "../../helpers/getMediaUrl";

const ManageMyConnectionsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser } = useSelector((state: UserResponse) => state.user);
  const [activeTab, setActiveTab] = useState<"network" | "requests">("network");
  const [search, setSearch] = useState("");
  const [networkPage, setNetworkPage] = useState(1);
  const [requestsPage, setRequestsPage] = useState(1);
  const perPage = 12;

  const {
    data: myNetwork,
    isLoading: loadingNetwork,
    isError: errorNetwork,
    refetch: refetchNetwork,
  } = useQuery(
    ["connections", "network", networkPage, perPage],
    () => getMyUserConnections(networkPage, perPage),
    {
      keepPreviousData: true,
    }
  );

  const {
    data: myRequests,
    isLoading: loadingRequests,
    isError: errorRequests,
    refetch: refetchRequests,
  } = useQuery(
    ["connections", "pending", requestsPage, perPage],
    () => getPendingUserConnections(requestsPage, perPage),
    {
      keepPreviousData: true,
    }
  );

  const acceptMutation = useMutation(acceptUserConnectionRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(["connections", "pending"]);
      queryClient.invalidateQueries(["connections", "network"]);
    },
  });

  const declineMutation = useMutation(declineUserConnectionRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(["connections", "pending"]);
      queryClient.invalidateQueries(["connections", "pending", "count"]);
    },
  });

  const fullName = (u?: UserConnectionUser) =>
    [u?.fname, u?.lname].filter(Boolean).join(" ") || "Unknown User";

  const initialsOf = (u?: UserConnectionUser) =>
    [u?.fname?.[0], u?.lname?.[0]]
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const goToProfile = (u?: UserConnectionUser) => {
    if (u?.id) {
      navigate(`/profile/${u.id}`);
    }
  };

  const renderUserAvatar = (user?: UserConnectionUser) => {
    const initials = initialsOf(user);
    return (
      <div
        className="d-flex align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => goToProfile(user)}
        title="View profile"
      >
        {user?.avatar ? (
          <img
            src={getMediaUrl(user.avatar)}
            alt={fullName(user)}
            className="rounded-circle me-3"
            style={{ width: 48, height: 48, objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-light border me-3 d-flex align-items-center justify-content-center"
            style={{ width: 48, height: 48 }}
          >
            <span className="fw-semibold text-muted">{initials}</span>
          </div>
        )}
        <div>
          <div className="fw-semibold">{fullName(user)}</div>
        </div>
      </div>
    );
  };

  const counterpartyOf = (
    conn: UserConnection
  ): UserConnectionUser | undefined => {
    const myId = authUser?.id;
    if (!myId) return conn.receiver || conn.sender; // fallback
    return conn.sender_id === myId ? conn.receiver : conn.sender;
  };

  const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div className="col-12 col-md-6 col-xl-4" key={idx}>
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-light border me-3"
                  style={{ width: 48, height: 48 }}
                />
                <div className="flex-grow-1">
                  <div className="placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </div>
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <span className="placeholder col-3"></span>
                <span className="placeholder col-2"></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const NetworkTab = () => {
    if (loadingNetwork) return <SkeletonGrid />;
    if (errorNetwork)
      return (
        <div className="py-5 text-center">
          <div className="text-danger mb-3">Failed to load connections.</div>
          <button
            className="btn btn-outline-secondary btn-sm text-white"
            onClick={() => refetchNetwork()}
          >
            Retry
          </button>
        </div>
      );

    const items = myNetwork?.data || [];
    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      if (!term) return items;
      return items.filter((c) => {
        const u = counterpartyOf(c);
        const text = [u?.fname, u?.lname].filter(Boolean).join(" ");
        return text.toLowerCase().includes(term);
      });
    }, [items, search]);
    if (!filtered.length)
      return (
        <div className="py-5 text-center">
          <i className="fa-solid fa-users mb-3" style={{ fontSize: 36 }}></i>
          <div className="mb-2">No connections match your search.</div>
          <div className="text-muted">
            Try a different name or clear the search.
          </div>
        </div>
      );

    return (
      <div className="row g-4">
        {filtered.map((conn) => (
          <div className="col-12 col-md-6 col-xl-4" key={conn.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                {renderUserAvatar(counterpartyOf(conn))}
                <div className="mt-3 d-flex align-items-center justify-content-between">
                  <span className="badge bg-success">Connected</span>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fa-solid fa-message me-1"></i> Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RequestsTab = () => {
    if (loadingRequests) return <SkeletonGrid />;
    if (errorRequests)
      return (
        <div className="py-5 text-center">
          <div className="text-danger mb-3">Failed to load requests.</div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => refetchRequests()}
          >
            Retry
          </button>
        </div>
      );

    const items = myRequests?.data || [];
    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      if (!term) return items;
      return items.filter((c) => {
        const u = counterpartyOf(c);
        const text = [u?.fname, u?.lname].filter(Boolean).join(" ");
        return text.toLowerCase().includes(term);
      });
    }, [items, search]);
    if (!filtered.length)
      return (
        <div className="py-5 text-center">
          <i
            className="fa-solid fa-envelope-open-text mb-3"
            style={{ fontSize: 36 }}
          ></i>
          <div className="mb-2">No pending requests.</div>
          <div className="text-muted">
            You’ll see requests from other participants here.
          </div>
        </div>
      );

    return (
      <div className="row g-4">
        {filtered.map((conn) => (
          <div className="col-12 col-md-6 col-xl-4" key={conn.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                {renderUserAvatar(counterpartyOf(conn))}
                <div className="mt-3 d-flex align-items-center justify-content-between">
                  <span className="badge bg-warning text-dark">Pending</span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      disabled={acceptMutation.isLoading}
                      onClick={() => acceptMutation.mutate(conn.id)}
                    >
                      {acceptMutation.isLoading ? (
                        "Accepting…"
                      ) : (
                        <>
                          <i className="fa-solid fa-check me-1"></i> Accept
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={declineMutation.isLoading}
                      onClick={() => declineMutation.mutate(conn.id)}
                    >
                      {declineMutation.isLoading ? (
                        "Declining…"
                      ) : (
                        <>
                          <i className="fa-solid fa-xmark me-1"></i> Decline
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid py-6 bg-white card">
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0">My Connections</h2>
      </div>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
        <div className="input-group" style={{ maxWidth: 360 }}>
          <span className="input-group-text">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            className="form-control"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => {
            queryClient.invalidateQueries(["connections", "network"]);
            queryClient.invalidateQueries(["connections", "pending"]);
          }}
        >
          <i className="fa-solid fa-rotate me-1"></i> Refresh
        </button>
      </div>

      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link  ${activeTab === "network" ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "network"}
            onClick={() => setActiveTab("network")}
          >
            My Network
            <span className="badge bg-secondary ms-2 text-white">
              {myNetwork?.total ?? myNetwork?.data?.length ?? 0}
            </span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "requests" ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "requests"}
            onClick={() => setActiveTab("requests")}
          >
            Requests
            <span className="badge bg-secondary ms-2 text-white">
              {myRequests?.total ?? myRequests?.data?.length ?? 0}
            </span>
          </button>
        </li>
      </ul>

      <div className="pt-4">
        {activeTab === "network" ? <NetworkTab /> : <RequestsTab />}
      </div>

      {/* Pagination controls */}
      {activeTab === "network" && myNetwork && (
        <div className="d-flex align-items-center justify-content-between mt-4">
          <div className="text-muted">
            Page {myNetwork.current_page} of {myNetwork.last_page}
          </div>
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary"
              disabled={myNetwork.current_page <= 1}
              onClick={() => setNetworkPage((p) => Math.max(1, p - 1))}
            >
              <i className="fa-solid fa-arrow-left me-1"></i> Prev
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={myNetwork.current_page >= myNetwork.last_page}
              onClick={() =>
                setNetworkPage((p) => Math.min(myNetwork.last_page, p + 1))
              }
            >
              Next <i className="fa-solid fa-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      )}

      {activeTab === "requests" && myRequests && (
        <div className="d-flex align-items-center justify-content-between mt-4">
          <div className="text-muted">
            Page {myRequests.current_page} of {myRequests.last_page}
          </div>
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary"
              disabled={myRequests.current_page <= 1}
              onClick={() => setRequestsPage((p) => Math.max(1, p - 1))}
            >
              <i className="fa-solid fa-arrow-left me-1"></i> Prev
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={myRequests.current_page >= myRequests.last_page}
              onClick={() =>
                setRequestsPage((p) => Math.min(myRequests.last_page, p + 1))
              }
            >
              Next <i className="fa-solid fa-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMyConnectionsPage;
