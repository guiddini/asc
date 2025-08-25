import * as Yup from "yup";

const createUserSchema = Yup.object().shape({
  fname: Yup.string().required("Le prénom est requis"),
  lname: Yup.string().required("Le nom de famille est requis"),
  email: Yup.string()
    .email("L'adresse e-mail n'est pas valide")
    .required("L'adresse e-mail est requise"),
  tickets: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .required("La quantité est requise")
        .min(1, "La quantité doit être d'au moins 1")
        .positive("La quantité doit être positive")
        .typeError("La quantité est requise"),
      ticket_type: Yup.object()
        .required("Le type du ticket est requis")
        .typeError("Le type du ticket est requis"),
    })
  ),
  password: Yup.string().required("Password is required"),
});

export { createUserSchema };
