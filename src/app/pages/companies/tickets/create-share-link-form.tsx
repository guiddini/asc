import React, { useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Ticket } from "lucide-react";
import { useMutation } from "react-query";
import { createShareTicketApi } from "../../../apis/ticket-sharing";

interface TicketType {
  id: string;
  name: string;
  slug: string;
  price: string;
}

interface TicketData {
  id: number;
  user_id: string;
  ticket_id: string;
  gifted_to_user_id: string | null;
  role_slug: string;
  is_used: number;
  is_assigned: number;
  source: string;
  created_at: string;
  updated_at: string;
  transaction_id: string | null;
  type: TicketType;
}

interface GroupedTickets {
  [key: string]: {
    count: number;
    type: TicketType;
  };
}

interface CreateShareLinkFormProps {
  pricingData: TicketData[];
  onSubmitSuccess: (link: string) => void;
}

const CreateShareLinkForm: React.FC<CreateShareLinkFormProps> = ({
  pricingData,
  onSubmitSuccess,
}) => {
  const groupedTickets = useMemo(() => {
    return pricingData.reduce((acc: GroupedTickets, ticket) => {
      if (!acc[ticket?.type?.slug]) {
        acc[ticket?.type?.slug] = { count: 0, type: ticket.type };
      }
      acc[ticket?.type?.slug].count++;
      return acc;
    }, {});
  }, [pricingData]);

  console.log("groupedTickets", groupedTickets);

  const [selectedRoleSlug, setSelectedRoleSlug] = useState(
    Object.keys(groupedTickets)[0] || ""
  );

  const validationSchema = yup.object().shape({
    title: yup.string().required("Le titre est requis"),
    ticket_type: yup.string().required("Veuillez sélectionner un ticket"),
    ticket_count: yup
      .number()
      .min(1, "La quantité minimale est 1")
      .max(
        groupedTickets[selectedRoleSlug]?.count || 1,
        `La quantité maximale est ${
          groupedTickets[selectedRoleSlug]?.count || 1
        }`
      )
      .required("La quantité est requise"),
  });

  type FormValues = yup.InferType<typeof validationSchema>;

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      ticket_type: selectedRoleSlug,
      ticket_count: 1,
    },
    resolver: yupResolver(validationSchema),
  });

  const { mutate, data, isLoading, isSuccess } = useMutation({
    mutationFn: (data: FormData) => createShareTicketApi(data),
    mutationKey: ["create-share-ticket"],
  });

  const ticket_count = watch("ticket_count");
  const selectedTicketGroup = groupedTickets[selectedRoleSlug];

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? ticket_count + 1 : ticket_count - 1;
    setValue(
      "ticket_count",
      Math.max(1, Math.min(newQuantity, selectedTicketGroup?.count || 1))
    );
  };

  const onSubmit = (values: FormValues) => {
    const formdata = new FormData();
    formdata.append("ticket_count", String(values?.ticket_count));
    formdata.append("ticket_type", String(values?.ticket_type));
    formdata.append("title", String(values?.title));

    mutate(formdata, {
      onSuccess(data) {
        const link = `/shared-tickets/${data?.data?.id}`;
        onSubmitSuccess(link);
      },
      onError: (error) => {
        console.error("Error creating share ticket:", error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="share-link-form">
      <div id="share-link-form-group">
        <label htmlFor="title" id="share-link-form-label">
          Titre du lien
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="share-link-form-input"
              placeholder="Par exemple, les Tickets STAFF"
            />
          )}
        />
        {errors.title && (
          <span id="share-link-error-message">{errors.title.message}</span>
        )}
      </div>

      <div id="share-link-ticket-form-group">
        <label id="share-link-ticket-label">
          Sélectionner un ticket <span id="share-link-required">*</span>
        </label>
        <div id="share-link-select-wrapper">
          <Controller
            name="ticket_type"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="share-link-select"
                onChange={(e) => {
                  field.onChange(e);
                  setSelectedRoleSlug(e.target.value);
                }}
              >
                {Object.entries(groupedTickets).map(
                  ([ticket_type, { type, count }]) => (
                    <option key={ticket_type} value={ticket_type}>
                      {type.name} ({count} disponible{count > 1 ? "s" : ""})
                    </option>
                  )
                )}
              </select>
            )}
          />
          {errors.ticket_type && (
            <span id="share-link-error-message">
              {errors.ticket_type.message}
            </span>
          )}
        </div>
      </div>

      <div id="ticket-selection" className="border-0 m-0">
        <div id="ticket-info">
          <div id="ticket-icon">
            <Ticket stroke="#50D7A0" fill="#fff" width="36" height="36" />
          </div>
          <div id="ticket-details" style={{ textAlign: "left" }}>
            <span>{selectedTicketGroup.type.name}</span>
            <span>
              {parseFloat(selectedTicketGroup.type.price).toLocaleString()} DA
            </span>
          </div>
        </div>

        <div id="quantity-controls">
          <button
            type="button"
            id="quantity-decrease"
            disabled={ticket_count <= 1}
            onClick={() => handleQuantityChange(false)}
          >
            -
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="quantity"
            {...register("ticket_count")}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              const numValue = value === "" ? 1 : Math.max(1, parseInt(value));
              setValue("ticket_count", numValue);
            }}
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(true)}
            id="quantity-increase"
            disabled={ticket_count >= selectedTicketGroup.count}
          >
            +
          </button>
        </div>
      </div>

      {errors.ticket_count && (
        <span id="share-link-error-message">{errors.ticket_count.message}</span>
      )}

      <p className="my-4">
        Précisez le nombre de tickets à inclure dans ce lien.
      </p>

      <div className="modal-footer px-0">
        <Button variant="success" type="submit" id="share-link-submit-button">
          Créer Un Lien
        </Button>
      </div>
    </form>
  );
};

export default CreateShareLinkForm;
