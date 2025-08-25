import * as yup from "yup";

const UpdateJobOfferSchema = yup.object().shape({
  name: yup.string().required("L'intitulé de poste est requise."),

  workplace_type: yup
    .object()
    .required("Le type de lieu de travail est requis."),

  work_type: yup.object().required("Le type de travail est requis."),

  wilaya: yup.object().required("La wilaya est requise."),

  commune: yup.object().required("La commune est requise."),

  workplace_address: yup
    .string()
    .required("L'adresse du lieu de travail est requise."),

  desc: yup
    .string()
    .required("La description de l'offre de travail est requise."),

  work_requirements: yup.array().notRequired(),

  work_benefits: yup.array().notRequired(),

  application_terms: yup.array().notRequired(),

  work_roles: yup.array().notRequired(),

  work_skills: yup.array().notRequired(),
  // step 4 validation

  emails: yup.array().notRequired(),
  email: yup.string().when("step", {
    is: 8,
    then: (schema) => schema.email("Adresse e-mail invalide."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
});

export default UpdateJobOfferSchema;
