import * as yup from "yup";

const CreateJobOfferSchema = yup.object().shape({
  step: yup.number(),

  // Step 1 validation
  // Validation de l'étape 1
  name: yup.string().when("step", {
    is: 1,
    then: (schema) => schema.required("L'intitulé de poste est requise."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
  workplace_type: yup.object().when("step", {
    is: 1,
    then: (schema) => schema.required("Le type de lieu de travail est requis."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
  work_type: yup.object().when("step", {
    is: 1,
    then: (schema) => schema.required("Le type de travail est requis."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
  wilaya: yup.object().when("step", {
    is: 1,
    then: (schema) => schema.required("La wilaya est requise."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
  commune: yup.object().when("step", {
    is: 1,
    then: (schema) => schema.required("La commune est requise."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
  workplace_address: yup.string().when("step", {
    is: 1,
    then: (schema) =>
      schema.required("L'adresse du lieu de travail est requise."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),

  // step 2 validation
  desc: yup.string().when("step", {
    is: 2,
    then: (schema) =>
      schema.required("La description de l'offre de travail est requise."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),

  // step 3 validation

  work_requirements: yup.array().when("step", {
    is: 3,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),

  work_benefits: yup.array().when("step", {
    is: 3,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),

  application_terms: yup.array().when("step", {
    is: 3,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),

  work_roles: yup.array().when("step", {
    is: 3,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),

  work_skills: yup.array().when("step", {
    is: 3,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
  // step 4 validation

  emails: yup.array().when("step", {
    is: 4,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
  email: yup.string().when("step", {
    is: 8,
    then: (schema) => schema.email("Adresse e-mail invalide."),
    otherwise: (schema) => schema.notRequired(), // Retourne le schéma initial
  }),
});

export default CreateJobOfferSchema;
