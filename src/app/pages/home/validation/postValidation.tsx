import * as Yup from "yup";

const createPostSchema = Yup.object().shape({
  description: Yup.string()
    .required("La description est requise")
    .min(3, "La description doit contenir au moins 10 caractères"),
  // other fields in your form
});

const createCommentSchema = Yup.object().shape({
  comment: Yup.string()
    .required("Le contenu du commentaire est requis")
    .min(4, "Le contenu du commentaire doit contenir au moins 10 caractères")
    .max(200, "Le contenu du commentaire ne doit pas dépasser 200 caractères"),
  // other fields in your comment form, if any
});

export { createPostSchema, createCommentSchema };
