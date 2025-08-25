import * as Yup from "yup";

const assignTicketSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  ticket: Yup.object().required("Ticket is required"),
});

export { assignTicketSchema };
