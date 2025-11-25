import React, { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createVisaDemand,
  editVisaDemand,
  deleteVisaDemand,
  cancelVisaDemand,
  getUserVisaDemand,
  downloadVisaDemand,
} from "../../apis/visa-demand";
import {
  VisaDemandStatus,
  CreateVisaDemandRequest,
  EditVisaDemandRequest,
  GetUserVisaDemandResponse,
} from "../../types/visa-demand";
import moment from "moment";

const statusBadgeClass = (status?: VisaDemandStatus) => {
  switch (status) {
    case "accepted":
      return "badge badge-light-success";
    case "refused":
      return "badge badge-light-danger";
    case "cancelled":
      return "badge badge-light-warning";
    default:
      return "badge badge-light";
  }
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "-";
  return moment(iso).format("YYYY-MM-DD HH:mm");
};

const VisaDemandPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch the current user's visa demands (assumes backend returns only the current user's items for non-admins)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchDemands,
  } = useQuery({
    queryKey: ["visa-demands", "me"],
    queryFn: () => getUserVisaDemand(),
  });

  const isDemand = (d: any): d is GetUserVisaDemandResponse => {
    return (
      d &&
      typeof d === "object" &&
      "id" in d &&
      "status" in d &&
      typeof d.status === "string"
    );
  };

  const myDemand: GetUserVisaDemandResponse | null = useMemo(() => {
    return isDemand(data) ? data : null;
  }, [data]);

  // Create form state
  const [createForm, setCreateForm] = useState<CreateVisaDemandRequest>({
    first_name: "",
    last_name: "",
    profession: "",
    company_name: "",
    passport_number: "",
    passport_issue_date: "",
    passport_expiration_date: "",
    authorities_password: "",
  });

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditVisaDemandRequest>({
    demand_id: "",
    first_name: "",
    last_name: "",
    profession: "",
    company_name: "",
    passport_number: "",
    passport_issue_date: "",
    passport_expiration_date: "",
    authorities_password: "",
  });

  useEffect(() => {
    if (myDemand) {
      setEditForm({
        demand_id: myDemand.id,
        first_name: myDemand.first_name ?? "",
        last_name: myDemand.last_name ?? "",
        profession: myDemand.profession ?? "",
        company_name: myDemand.company_name ?? "",
        passport_number: myDemand.passport_number ?? "",
        passport_issue_date: myDemand.passport_issue_date ?? "",
        passport_expiration_date: myDemand.passport_expiration_date ?? "",
        authorities_password: myDemand.authorities_password ?? "",
      });
    }
  }, [myDemand]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateVisaDemandRequest) => createVisaDemand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visa-demands", "me"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: (payload: EditVisaDemandRequest) => editVisaDemand(payload),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["visa-demands", "me"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (payload: { demand_id: string }) => deleteVisaDemand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visa-demands", "me"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (payload: { demand_id: string }) => cancelVisaDemand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visa-demands", "me"] });
    },
  });

  // Handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...createForm,
      profession: createForm.profession || null,
      company_name: createForm.company_name || null,
      passport_issue_date: createForm.passport_issue_date || null,
      passport_expiration_date: createForm.passport_expiration_date || null,
      authorities_password: createForm.authorities_password || null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myDemand) return;
    editMutation.mutate({
      ...editForm,
      demand_id: myDemand.id,
      profession: editForm.profession || null,
      company_name: editForm.company_name || null,
      passport_issue_date: editForm.passport_issue_date || null,
      passport_expiration_date: editForm.passport_expiration_date || null,
      authorities_password: editForm.authorities_password || null,
    });
  };

  const handleDelete = () => {
    if (!myDemand) return;
    const ok = window.confirm("Delete this visa demand permanently?");
    if (!ok) return;
    deleteMutation.mutate({ demand_id: myDemand.id });
  };

  const handleCancel = () => {
    if (!myDemand) return;
    const ok = window.confirm("Cancel this visa demand?");
    if (!ok) return;
    cancelMutation.mutate({ demand_id: myDemand.id });
  };

  // Download handler
  const [downloading, setDownloading] = useState(false);
  const handleDownload = async () => {
    if (!myDemand?.id) return;
    try {
      setDownloading(true);
      const blob = await downloadVisaDemand(myDemand.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visa-demand-${myDemand.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } finally {
      setDownloading(false);
    }
  };

  // UI helpers
  const canEdit = myDemand && myDemand.status !== "accepted";
  const canCancel = myDemand && myDemand.status === "pending";
  const canDelete = myDemand && myDemand.status !== "accepted";

  if (isLoading) {
    return (
      <div className="card p-6">
        <span>Loading your visa demand...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card p-6">
        <div className="alert alert-danger">
          Failed to load data
          {error instanceof Error ? `: ${error.message}` : ""}.
        </div>
        <button
          className="btn btn-light-primary"
          onClick={() => refetchDemands()}
        >
          Retry
        </button>
      </div>
    );
  }

  // If user does NOT have a demand, show creation form
  if (!myDemand) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create Visa Demand</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateSubmit}>
            <div className="row g-6">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  value={createForm.first_name}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, first_name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  value={createForm.last_name}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, last_name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Profession</label>
                <input
                  className="form-control"
                  value={createForm.profession ?? ""}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, profession: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Startup Name</label>
                <input
                  className="form-control"
                  value={createForm.company_name ?? ""}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      company_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Passport Number</label>
                <input
                  className="form-control"
                  value={createForm.passport_number}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      passport_number: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Authorities Password</label>
                <input
                  className="form-control"
                  value={createForm.authorities_password ?? ""}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      authorities_password: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Passport Issue Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={createForm.passport_issue_date ?? ""}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      passport_issue_date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Passport Expiration Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={createForm.passport_expiration_date ?? ""}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      passport_expiration_date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-6 d-flex gap-3">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={createMutation.isLoading}
              >
                {createMutation.isLoading ? "Creating..." : "Create Demand"}
              </button>
              {createMutation.isError && (
                <div className="text-danger">
                  {createMutation.error instanceof Error
                    ? createMutation.error.message
                    : "Failed to create demand"}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Otherwise, show the existing demand and edit/cancel/delete as allowed
  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h3 className="card-title">My Visa Demand</h3>
        <div className="d-flex align-items-center gap-3">
          <span className={statusBadgeClass(myDemand?.status)}>
            {myDemand?.status ? myDemand.status.toUpperCase() : "-"}
          </span>
          {myDemand?.status === "accepted" && (
            <button
              className="btn btn-sm btn-primary"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "Download Visa"}
            </button>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="card-body">
          <div className="row g-6">
            <div className="col-md-6">
              <div className="fw-bold">Name</div>
              <div>
                {myDemand.first_name} {myDemand.last_name}
              </div>
            </div>
            <div className="col-md-6">
              <div className="fw-bold">Profession</div>
              <div>{myDemand.profession ?? "-"}</div>
            </div>

            <div className="col-md-6">
              <div className="fw-bold">Startup</div>
              <div>{myDemand.company_name ?? "-"}</div>
            </div>
            <div className="col-md-6">
              <div className="fw-bold">Passport Number</div>
              <div>{myDemand.passport_number}</div>
            </div>

            <div className="col-md-6">
              <div className="fw-bold">Authorities Password</div>
              <div>{myDemand.authorities_password ?? "-"}</div>
            </div>

            <div className="col-md-6">
              <div className="fw-bold">Passport Issue Date</div>
              <div>{myDemand.passport_issue_date ?? "-"}</div>
            </div>

            <div className="col-md-6">
              <div className="fw-bold">Passport Expiration Date</div>
              <div>{myDemand.passport_expiration_date ?? "-"}</div>
            </div>

            <div className="col-md-6">
              <div className="fw-bold">Created At</div>
              <div>{formatDateTime(myDemand.created_at)}</div>
            </div>
            <div className="col-md-6">
              <div className="fw-bold">Updated At</div>
              <div>{formatDateTime(myDemand.updated_at)}</div>
            </div>
          </div>

          <div className="mt-6 d-flex gap-3">
            {canEdit && (
              <button
                className="btn btn-light-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
            {canCancel && (
              <button
                className="btn btn-light-warning"
                onClick={handleCancel}
                disabled={cancelMutation.isLoading}
              >
                {cancelMutation.isLoading ? "Cancelling..." : "Cancel Demand"}
              </button>
            )}
            {canDelete && (
              <button
                className="btn btn-light-danger"
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? "Deleting..." : "Delete Demand"}
              </button>
            )}
          </div>

          {(cancelMutation.isError || deleteMutation.isError) && (
            <div className="mt-4 text-danger">
              {(cancelMutation.error instanceof Error &&
                cancelMutation.error.message) ||
                (deleteMutation.error instanceof Error &&
                  deleteMutation.error.message) ||
                "Operation failed"}
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="card-body border-top">
          <form onSubmit={handleEditSubmit}>
            <div className="row g-6">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  value={editForm.first_name ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, first_name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  value={editForm.last_name ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, last_name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Profession</label>
                <input
                  className="form-control"
                  value={editForm.profession ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, profession: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Startup Name</label>
                <input
                  className="form-control"
                  value={editForm.company_name ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      company_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Passport Number</label>
                <input
                  className="form-control"
                  value={editForm.passport_number ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      passport_number: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Authorities Password</label>
                <input
                  className="form-control"
                  value={editForm.authorities_password ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      authorities_password: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Passport Issue Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editForm.passport_issue_date ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      passport_issue_date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Passport Expiration Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editForm.passport_expiration_date ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      passport_expiration_date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-6 d-flex gap-3">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={editMutation.isLoading}
              >
                {editMutation.isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="btn btn-light"
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={editMutation.isLoading}
              >
                Cancel
              </button>
            </div>

            {editMutation.isError && (
              <div className="mt-4 text-danger">
                {editMutation.error instanceof Error
                  ? editMutation.error.message
                  : "Failed to save changes"}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default VisaDemandPage;
