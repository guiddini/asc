import * as Yup from "yup";

const createServiceSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis"),
  desc: Yup.string()
    .required("La description est requise")
    .min(10, "La description doit contenir au moins 10 caractères"),
  category_id: Yup.number().required("La catégorie est requise"),
  featured_image: Yup.mixed()
    .required("L'image en vedette est requise")
    .typeError("L'image en vedette est requise"),
  phone_1: Yup.string(),
  external_link: Yup.string().url("Lien externe invalide"),
  email: Yup.string().email("L'adresse e-mail n'est pas valide"),
  type: Yup.string()
    .required("Le type est requis")
    .typeError("Le type est requis"),
  yt_link: Yup.string().url("Lien YouTube invalide"),
  is_promoted: Yup.boolean(),
  media: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required("L'identifiant du média est requis"),
      })
    )
    .min(1, "Ce champ est requis")
    .required("Ce champ est requis")
    .typeError("Ce champ est requis"),
});

const updateServiceSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis"),
  desc: Yup.string()
    .required("La description est requise")
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(1000, "La description ne doit pas dépasser 1000 caractères"),
  category_id: Yup.mixed().required("La catégorie est requise"),
  featured_image: Yup.mixed().test(
    "is-string-or-file",
    "L'image en vedette doit être une chaîne de caractères ou un fichier",
    function (value) {
      return typeof value === "string" || value instanceof File;
    }
  ),
  email: Yup.string().email("L'adresse e-mail n'est pas valide"),
  phone_1: Yup.string(),
  type: Yup.string().required("Le type est requis"),
  external_link: Yup.string().typeError("Lien externe invalide"),
  is_promoted: Yup.boolean(),
  media: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required("L'identifiant du média est requis"),
      })
    )
    .nullable(),
});

export { createServiceSchema, updateServiceSchema };
