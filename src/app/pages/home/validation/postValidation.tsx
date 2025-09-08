import * as Yup from "yup";

const createPostSchema = Yup.object().shape({
  description: Yup.string()
    .required("La description est requise")
    .min(3, "La description doit contenir au moins 10 caractères"),
  // other fields in your form
});

const createCommentSchema = Yup.object().shape({
  comment: Yup.string()
    .required("The comment content is required")
    .min(4, "The comment content must be at least 10 characters")
    .max(200, "The comment content must not exceed 200 characters"),
  // other fields in your comment form, if any
});

export { createPostSchema, createCommentSchema };
