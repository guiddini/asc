import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Ticket } from "lucide-react";
import { Button } from "react-bootstrap";

interface TicketType {
  id: string;
  name: string;
  slug: string;
  price: string;
}

interface UpdateShareLinkFormProps {
  onUpdateSuccess: (link: string) => void;
  currentData: {
    title: string;
    roleSlug: string;
    quantity: number;
    link: string;
  };
}

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  quantity: yup
    .number()
    .min(1, "Minimum quantity is 1")
    .required("Quantity is required"),
});

const UpdateShareLinkForm: React.FC<UpdateShareLinkFormProps> = ({
  onUpdateSuccess,
  currentData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: currentData.title,
      quantity: currentData.quantity,
    },
    resolver: yupResolver(validationSchema),
  });

  const quantity = watch("quantity");

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Here you would typically make an API call to update the share link
    onUpdateSuccess(currentData.link); // Using the same link for this example
  };

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? quantity + 1 : quantity - 1;
    setValue("quantity", newQuantity);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="share-link-form">
      <div id="share-link-form-group">
        <label htmlFor="title" id="share-link-form-label">
          Link title
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="share-link-form-input"
              placeholder="For example, STAFF Tickets"
            />
          )}
        />
        {errors.title && (
          <span id="share-link-error-message">{errors.title.message}</span>
        )}
      </div>

      <div id="share-link-ticket-form-group">
        <label id="share-link-ticket-label">
          Select a ticket<span id="share-link-required">*</span>
        </label>
        <div id="share-link-select-wrapper">
          <select
            id="share-link-select"
            value={currentData?.roleSlug}
            disabled
          ></select>
        </div>
      </div>

      <div id="ticket-selection" className="border-0 m-0">
        <div id="ticket-info">
          <div id="ticket-icon">
            <Ticket stroke="#50D7A0" fill="#fff" width="36" height="36" />
          </div>
          <div id="ticket-details" style={{ textAlign: "left" }}>
            <span>{currentData?.roleSlug}</span>
            <span>5000 DA</span>
          </div>
        </div>

        <div id="quantity-controls">
          <button
            type="button"
            id="quantity-decrease"
            disabled={quantity <= 1}
            onClick={() => handleQuantityChange(false)}
          >
            -
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="quantity"
            {...register("quantity")}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              const numValue = value === "" ? 1 : Math.max(1, parseInt(value));
              setValue("quantity", numValue);
            }}
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(true)}
            id="quantity-increase"
          >
            +
          </button>
        </div>
      </div>

      {errors.quantity && (
        <span id="share-link-error-message">{errors.quantity.message}</span>
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

export default UpdateShareLinkForm;
