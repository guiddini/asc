import { t } from "i18next";
import * as Yup from "yup";

const userInfoSchema = Yup.object().shape({
  // static props validations
  avatar: Yup.mixed()
    .required(t(`completeProfile.validation.avatar.required`))
    .test(
      "fileSize",
      "L'avatar est trop volumineux. Veuillez choisir un fichier de moins de 9 Mo.",
      (value: any) => {
        if (!value) {
          return true; // Allow null/undefined values
        }
        return value.size <= 9437184; // Check file size in bytes (9MB)
      }
    ),
  fname: Yup.string().required(t(`completeProfile.validation.fname.required`)),
  lname: Yup.string().required(t(`completeProfile.validation.lname.required`)),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, t(`completeProfile.validation.phone.matches`))
    .required(t(`completeProfile.validation.phone.required`)),
  address: Yup.string().required(
    t(`completeProfile.validation.address.required`)
  ),

  country: Yup.object()
    .required(t(`completeProfile.validation.country.required`))
    .typeError(t(`completeProfile.validation.country.typeError`)),

  wilaya: Yup.object().when("country", {
    is: (e) => e?.label === "Algérie",
    then: (schema) =>
      schema.required(t(`completeProfile.validation.wilaya.required`)),
    otherwise: (schema) => schema.notRequired(),
  }),

  commune: Yup.object().when("country", {
    is: (e) => e?.label === "Algérie",
    then: (schema) =>
      schema.required(t(`completeProfile.validation.commune.required`)),
    otherwise: (schema) => schema.notRequired(),
  }),

  //   institution validation

  institution_type: Yup.string().when("type", {
    is: (e) => e === "institution",
    then: (schema) =>
      schema.required(
        t(`completeProfile.validation.institution_type.required`)
      ),
    otherwise: (schema) => schema.notRequired(),
  }),

  institution_name: Yup.string().when("type", {
    is: (e) => e === "institution",
    then: (schema) =>
      schema.required(
        t(`completeProfile.validation.institution_name.required`)
      ),
    otherwise: (schema) => schema.notRequired(),
  }),

  //   student validation
  university_id: Yup.number().when("type", {
    is: (e) => e === "student",
    then: (schema) =>
      schema
        .required(t(`completeProfile.validation.university_id.required`))
        .typeError(t(`completeProfile.validation.university_id.typeError`)),
    otherwise: (schema) => schema.notRequired(),
  }),

  foreign_university: Yup.string().when("university_id", {
    is: (university_id) => university_id === 0,
    then: (schema) =>
      schema
        .required(t(`completeProfile.validation.foreign_university.required`))
        .typeError(
          t(`completeProfile.validation.foreign_university.typeError`)
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  //   corporate && independant validations

  occupation_id: Yup.number()
    .typeError("Occupation is required")
    .when("type", {
      is: (e) => e === "corporate" || e === "independant",
      then: (schema) =>
        schema
          .required(t(`completeProfile.validation.occupation_id.typeError`))
          .typeError(t(`completeProfile.validation.occupation_id.typeError`)),
      otherwise: (schema) => schema.notRequired(),
    }),

  activity_area_ids: Yup.array()
    .of(Yup.number())
    .typeError("Vous devez sélectionner au moins un centre d'intérêt")
    .min(1, "Vous devez sélectionner au moins un centre d'intérêt")
    .required("Vous devez sélectionner au moins un centre d'intérêt")
    .typeError("Vous devez sélectionner au moins un centre d'intérêt"),

  occupation: Yup.string().when("occupation_id", {
    is: (e) => e === 0,
    then: (schema) =>
      schema.required(t(`completeProfile.validation.occupation.required`)),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export { userInfoSchema };
