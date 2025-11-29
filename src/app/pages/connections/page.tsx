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
import { getMyScannedLogsApi, getWhoScannedMeApi } from "../../apis/qr-code";
import type {
  UserConnection,
  UserConnectionUser,
} from "../../types/user-connection";
import type {
  MyScannedLogsResponse,
  WhoScannedMeResponse,
  QrScanDoneItem,
  QrScanReceivedItem,
  UserLite,
  CompanyLite,
} from "../../types/qr-code";
import getMediaUrl from "../../helpers/getMediaUrl";

type TabType = "network" | "requests" | "i-scanned" | "scanned-me";

const ManageMyConnectionsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser } = useSelector((state: UserResponse) => state.user);
  const [activeTab, setActiveTab] = useState<TabType>("network");
  const [search, setSearch] = useState("");
  const [networkPage, setNetworkPage] = useState(1);
  const [requestsPage, setRequestsPage] = useState(1);
  const [iScannedPage, setIScannedPage] = useState(1);
  const [scannedMePage, setScannedMePage] = useState(1);
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

  const {
    data: iScannedData,
    isLoading: loadingIScanned,
    isError: errorIScanned,
    refetch: refetchIScanned,
  } = useQuery(
    ["qr-scans", "i-scanned", iScannedPage, perPage],
    () => getMyScannedLogsApi({ page: iScannedPage, per_page: perPage }),
    {
      keepPreviousData: true,
      enabled: activeTab === "i-scanned",
    }
  );

  const {
    data: scannedMeData,
    isLoading: loadingScannedMe,
    isError: errorScannedMe,
    refetch: refetchScannedMe,
  } = useQuery(
    ["qr-scans", "scanned-me", scannedMePage, perPage],
    () => getWhoScannedMeApi({ page: scannedMePage, per_page: perPage }),
    {
      keepPreviousData: true,
      enabled: activeTab === "scanned-me",
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

  const fullName = (u?: UserConnectionUser | UserLite) =>
    [u?.fname, u?.lname].filter(Boolean).join(" ") || "Unknown User";

  const initialsOf = (u?: UserConnectionUser | UserLite) =>
    [u?.fname?.[0], u?.lname?.[0]]
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const goToProfile = (u?: UserConnectionUser | UserLite) => {
    if (u?.id) {
      navigate(`/profile/${u.id}`);
    }
  };

  const goToCompany = (c?: CompanyLite) => {
    if (c?.id) {
      navigate(`/startup/${c.id}`);
    }
  };

  const renderUserAvatar = (
    user?: UserConnectionUser | UserLite,
    showName = true
  ) => {
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
        {showName && (
          <div>
            <div className="fw-semibold">{fullName(user)}</div>
            {user?.email && <small className="text-muted">{user.email}</small>}
          </div>
        )}
      </div>
    );
  };

  const renderCompanyAvatar = (company?: CompanyLite) => {
    const name = company?.company_name || company?.name || "Unknown Company";
    return (
      <div
        className="d-flex align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => goToCompany(company)}
        title="View company"
      >
        {company?.logo ? (
          <img
            src={getMediaUrl(company.logo)}
            alt={name}
            className="rounded me-3"
            style={{ width: 48, height: 48, objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded bg-light border me-3 d-flex align-items-center justify-content-center"
            style={{ width: 48, height: 48 }}
          >
            <i className="fa-solid fa-building text-muted"></i>
          </div>
        )}
        <div>
          <div className="fw-semibold">{name}</div>
          <small className="text-muted">Company</small>
        </div>
      </div>
    );
  };

  const counterpartyOf = (
    conn: UserConnection
  ): UserConnectionUser | undefined => {
    const myId = authUser?.id;
    if (!myId) return conn.receiver || conn.sender;
    return conn.sender_id === myId ? conn.receiver : conn.sender;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
            className="btn btn-outline-secondary btn-sm"
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
            You'll see requests from other participants here.
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

  const IScannedTab = () => {
    if (loadingIScanned) return <SkeletonGrid />;
    if (errorIScanned)
      return (
        <div className="py-5 text-center">
          <div className="text-danger mb-3">Failed to load scan history.</div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => refetchIScanned()}
          >
            Retry
          </button>
        </div>
      );

    const items = iScannedData?.i_scanned?.data || [];
    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      if (!term) return items;
      return items.filter((scan) => {
        const scannable = scan.scannable as UserLite | CompanyLite;
        if ("fname" in scannable && "lname" in scannable) {
          const text = [scannable.fname, scannable.lname]
            .filter(Boolean)
            .join(" ");
          return text.toLowerCase().includes(term);
        }
        if ("company_name" in scannable || "name" in scannable) {
          const name = scannable.company_name || scannable.name || "";
          return name.toLowerCase().includes(term);
        }
        return false;
      });
    }, [items, search]);

    if (!filtered.length)
      return (
        <div className="py-5 text-center">
          <i className="fa-solid fa-qrcode mb-3" style={{ fontSize: 36 }}></i>
          <div className="mb-2">No scans found.</div>
          <div className="text-muted">
            {search
              ? "Try a different search term."
              : "You haven't scanned any QR codes yet."}
          </div>
        </div>
      );

    return (
      <div className="row g-4">
        {filtered.map((scan) => {
          const scannable = scan.scannable as UserLite | CompanyLite;
          const isUser = scannable && "fname" in scannable;
          const isCompany =
            scannable && ("company_name" in scannable || "name" in scannable);

          return (
            <div className="col-12 col-md-6 col-xl-4" key={scan.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  {isUser && renderUserAvatar(scannable as UserLite)}
                  {isCompany && renderCompanyAvatar(scannable as CompanyLite)}
                  {!isUser && !isCompany && (
                    <div className="text-muted">Unknown scannable</div>
                  )}
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span
                          className={`badge ${
                            scan.type === "networking"
                              ? "bg-primary"
                              : scan.type === "exhibition"
                              ? "bg-info"
                              : "bg-secondary"
                          }`}
                        >
                          <i className="fa-solid fa-qrcode me-1"></i>
                          {scan.type}
                        </span>
                      </div>
                      <small className="text-muted">
                        {formatDate(scan.scanned_at)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ScannedMeTab = () => {
    if (loadingScannedMe) return <SkeletonGrid />;
    if (errorScannedMe)
      return (
        <div className="py-5 text-center">
          <div className="text-danger mb-3">Failed to load scan history.</div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => refetchScannedMe()}
          >
            Retry
          </button>
        </div>
      );

    const items = scannedMeData?.scanned_me?.data || [];
    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      if (!term) return items;
      return items.filter((scan) => {
        const scanner = scan.scanner;
        if (scanner) {
          const text = [scanner.fname, scanner.lname].filter(Boolean).join(" ");
          return text.toLowerCase().includes(term);
        }
        return false;
      });
    }, [items, search]);

    if (!filtered.length)
      return (
        <div className="py-5 text-center">
          <i className="fa-solid fa-qrcode mb-3" style={{ fontSize: 36 }}></i>
          <div className="mb-2">No scans found.</div>
          <div className="text-muted">
            {search
              ? "Try a different search term."
              : "No one has scanned your QR code yet."}
          </div>
        </div>
      );

    return (
      <div className="row g-4">
        {filtered.map((scan) => (
          <div className="col-12 col-md-6 col-xl-4" key={scan.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                {renderUserAvatar(scan.scanner)}
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <span
                        className={`badge ${
                          scan.type === "networking"
                            ? "bg-primary"
                            : scan.type === "exhibition"
                            ? "bg-info"
                            : "bg-secondary"
                        }`}
                      >
                        <i className="fa-solid fa-qrcode me-1"></i>
                        {scan.type}
                      </span>
                    </div>
                    <small className="text-muted">
                      {formatDate(scan.scanned_at)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    let currentPage = 1;
    let lastPage = 1;
    let setPage: (page: number) => void = () => {};

    switch (activeTab) {
      case "network":
        if (!myNetwork) return null;
        currentPage = myNetwork.current_page;
        lastPage = myNetwork.last_page;
        setPage = setNetworkPage;
        break;
      case "requests":
        if (!myRequests) return null;
        currentPage = myRequests.current_page;
        lastPage = myRequests.last_page;
        setPage = setRequestsPage;
        break;
      case "i-scanned":
        if (!iScannedData?.i_scanned) return null;
        currentPage = iScannedData.i_scanned.current_page;
        lastPage = iScannedData.i_scanned.last_page;
        setPage = setIScannedPage;
        break;
      case "scanned-me":
        if (!scannedMeData?.scanned_me) return null;
        currentPage = scannedMeData.scanned_me.current_page;
        lastPage = scannedMeData.scanned_me.last_page;
        setPage = setScannedMePage;
        break;
    }

    if (lastPage <= 1) return null;

    return (
      <div className="d-flex align-items-center justify-content-between mt-4">
        <div className="text-muted">
          Page {currentPage} of {lastPage}
        </div>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                disabled={currentPage === 1}
                onClick={() => setPage(Math.max(1, currentPage - 1))}
              >
                <i className="fa-solid fa-arrow-left me-1"></i> Prev
              </button>
            </li>

            {/* Page numbers */}
            {[...Array(lastPage)].map((_, idx) => {
              const pageNum = idx + 1;
              if (
                pageNum === 1 ||
                pageNum === lastPage ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <li
                    key={pageNum}
                    className={`page-item ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return (
                  <li key={pageNum} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
              return null;
            })}

            <li
              className={`page-item ${
                currentPage === lastPage ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                disabled={currentPage === lastPage}
                onClick={() => setPage(Math.min(lastPage, currentPage + 1))}
              >
                Next <i className="fa-solid fa-arrow-right ms-1"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="container-fluid py-6 bg-white card">
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0">My Connections & Networking</h2>
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
            queryClient.invalidateQueries(["connections"]);
            queryClient.invalidateQueries(["qr-scans"]);
          }}
        >
          <i className="fa-solid fa-rotate me-1"></i> Refresh
        </button>
      </div>

      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "network" ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "network"}
            onClick={() => setActiveTab("network")}
          >
            <i className="fa-solid fa-users me-1"></i>
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
            <i className="fa-solid fa-envelope me-1"></i>
            Requests
            <span className="badge bg-secondary ms-2 text-white">
              {myRequests?.total ?? myRequests?.data?.length ?? 0}
            </span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "i-scanned" ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "i-scanned"}
            onClick={() => setActiveTab("i-scanned")}
          >
            <i className="fa-solid fa-qrcode me-1"></i>
            Who I Scanned
            <span className="badge bg-secondary ms-2 text-white">
              {iScannedData?.total ?? 0}
            </span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "scanned-me" ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === "scanned-me"}
            onClick={() => setActiveTab("scanned-me")}
          >
            <i className="fa-solid fa-user-check me-1"></i>
            Who Scanned Me
            <span className="badge bg-secondary ms-2 text-white">
              {scannedMeData?.total ?? 0}
            </span>
          </button>
        </li>
      </ul>

      <div className="pt-4">
        {activeTab === "network" && <NetworkTab />}
        {activeTab === "requests" && <RequestsTab />}
        {activeTab === "i-scanned" && <IScannedTab />}
        {activeTab === "scanned-me" && <ScannedMeTab />}
      </div>

      {renderPagination()}
    </div>
  );
};

export default ManageMyConnectionsPage;
