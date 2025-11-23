import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { PageTitle } from "../../../_metronic/layout/core";
import { getUsersWithFcmTokens, sendFcmToUsers } from "../../apis/fcm";
import getMediaUrl from "../../helpers/getMediaUrl";
import { FcmUserSummary, FcmUsersWithTokensResponse } from "../../types/fcm";
import { Spinner } from "react-bootstrap";

const NotificationsManagement = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<FcmUserSummary[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching } = useQuery(
    ["fcm-users", page],
    () => getUsersWithFcmTokens({ per_page: 50, page }),
    {
      keepPreviousData: true,
      onSuccess: (res: FcmUsersWithTokensResponse) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setUsers((prev) => (page === 1 ? list : [...prev, ...list]));
      },
    }
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          const hasNext = !!data?.next_page_url;
          if (hasNext) {
            setPage((p) => p + 1);
          }
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
  }, [data?.next_page_url, isFetching]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const clone = new Set(prev);
      if (clone.has(id)) clone.delete(id);
      else clone.add(id);
      return clone;
    });
  };

  const sendBulk = useMutation({
    mutationFn: () =>
      sendFcmToUsers({
        title: title.trim(),
        body: body.trim(),
        user_ids: Array.from(selected),
      }),
    onSuccess: () => {
      setSelected(new Set());
    },
  });

  const sendSingle = useMutation({
    mutationFn: (user_id: string) =>
      sendFcmToUsers({ title: title.trim(), body: body.trim(), user_id }),
  });

  const canSend = title.trim().length > 0 && body.trim().length > 0;

  return (
    <>
      <PageTitle breadcrumbs={[{ title: "Notifications", path: "/notifications-management", isSeparator: false, isActive: false }]} />
      <div className="card">
        <div className="card-body p-6">
          <div className="row g-6 align-items-end">
            <div className="col-md-4">
              <label className="fs-6 form-label fw-bold text-gray-900">Title</label>
              <input
                type="text"
                className="form-control form-control-solid"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
              />
            </div>
            <div className="col-md-6">
              <label className="fs-6 form-label fw-bold text-gray-900">Body</label>
              <input
                type="text"
                className="form-control form-control-solid"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Notification body"
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={!canSend || selected.size === 0 || sendBulk.isLoading}
                onClick={() => canSend && selected.size > 0 && sendBulk.mutate()}
              >
                {sendBulk.isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                Send to {selected.size} selected
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  <th className="min-w-120px">Select</th>
                  <th className="text-end min-w-150px">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 fw-semibold">
                {users?.map((row: FcmUserSummary) => (
                  <tr key={String(row?.id)}>
                    <td>
                      {row?.avatar === null ? (
                        <div className="symbol symbol-circle symbol-40px overflow-hidden me-3">
                          <div className="symbol-label fs-3 bg-light-primary text-primary">
                            {(row?.fname || "").slice(0, 1)}
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
                    <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{row?.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selected.has(String(row?.id))}
                        onChange={() => toggleSelect(String(row?.id))}
                      />
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        disabled={!canSend || sendSingle.isLoading}
                        onClick={() => canSend && sendSingle.mutate(String(row?.id))}
                      >
                        {sendSingle.isLoading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : null}
                        Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(isLoading || isFetching) && (
              <div className="d-flex align-items-center justify-content-center py-4">
                <Spinner animation="border" size="sm" />
              </div>
            )}

            {data?.next_page_url && (
              <div ref={observerTarget} style={{ height: 1 }}></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsManagement;
