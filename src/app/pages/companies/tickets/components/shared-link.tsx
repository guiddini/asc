import React, { useState } from "react";
import { Pencil, Unlink, Ticket, Copy, Share2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import UpdateShareLinkModal from "../update-share-link-modal";
import ShareTicketLinkModal from "../share-ticket-link-modal";
import { switchSharedTicketStatusApi } from "../../../../apis/ticket-sharing";

interface SharedLinkProps {
  id: string;
  title: string;
  remaining: number;
  total: number;
  isActive: boolean;
  createdAt: string;
}

const SharedLink: React.FC<SharedLinkProps> = ({
  id,
  title,
  remaining,
  total,
  isActive: initialIsActive,
  createdAt,
}) => {
  const queryClient = useQueryClient();
  const { control, setValue, watch } = useForm({
    defaultValues: {
      isActive: initialIsActive,
    },
  });

  const isActive = watch("isActive");

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);

  const switchStatusMutation = useMutation(switchSharedTicketStatusApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(["shared-tickets"]);
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
      // Revert the toggle if the API call fails
      setValue("isActive", !initialIsActive);
    },
  });

  const link = `${window.location.origin}/shared-tickets/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const handleStatusChange = (newStatus: boolean) => {
    switchStatusMutation.mutate(id);
  };

  return (
    <div
      id="shared-link-component-container"
      className={initialIsActive ? "active" : "inactive"}
    >
      <div id="shared-link-component-content">
        <div id="shared-link-component-header">
          <div id="shared-link-component-title">
            <span>{title}</span>
            <button
              id="shared-link-component-edit"
              onClick={() => setOpenUpdateModal(true)}
            >
              <Pencil size={16} strokeWidth={1.5} />
            </button>
          </div>
          <div id="shared-link-component-status">
            <div className="form-check form-switch form-check-custom form-check-solid">
              <span
                className={`status-label ${
                  initialIsActive ? "status-active" : "status-inactive"
                }`}
              >
                {initialIsActive ? "Active" : "Désactivé"}
              </span>
              <Controller
                name="isActive"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`flexSwitchDefault-${id}`}
                    checked={value}
                    onChange={(e) => {
                      onChange(e);
                      handleStatusChange(e.target.checked);
                    }}
                    disabled={switchStatusMutation.isLoading}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div id="shared-link-component-url">
          <a
            href={isActive ? link : ""}
            target={isActive && "_blank"}
            id="shared-link-component-url-left"
          >
            <Unlink size={16} strokeWidth={1.5} />
            <span>{link}</span>
          </a>

          <div id="shared-link-component-actions">
            <button
              disabled={!isActive}
              onClick={handleCopy}
              id="shared-link-component-copy"
              title="Copy link"
            >
              <Copy size={16} strokeWidth={1.5} />
            </button>
            <button
              disabled={!isActive}
              onClick={() => setOpenShareModal(true)}
              id="shared-link-component-share"
            >
              <Share2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div id="shared-link-component-info">
          <div id="shared-link-component-ticket">
            <Ticket size={16} strokeWidth={1.5} />
            <span className="ticket-type">Shared Ticket</span>
            <span id="shared-link-component-count">
              {remaining}/{total} restant
            </span>
          </div>
          <div id="shared-link-component-date">
            Created: {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {openUpdateModal && (
        <UpdateShareLinkModal
          show={openUpdateModal}
          onHide={() => setOpenUpdateModal(false)}
          currentData={{
            link: link,
            quantity: total,
            roleSlug: "participant", // This might need to be updated based on your actual data
            title: title,
          }}
        />
      )}

      {openShareModal && (
        <ShareTicketLinkModal
          show={openShareModal}
          onHide={() => setOpenShareModal(false)}
          link={link}
        />
      )}
    </div>
  );
};

export default SharedLink;
