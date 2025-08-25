import * as Yup from "yup";

const updateProfileSchema = Yup.object().shape({
  // static props validations
  avatar: Yup.lazy((value: any) => {
    switch (typeof value) {
      case "string":
        return Yup.string().optional(); // Allow optional string for avatar
      case "object":
        return Yup.mixed()
          .test(
            "fileSize",
            "L'avatar est trop volumineux. Veuillez choisir un fichier de moins de 9 Mo.",
            (value: any) => !value || value.size <= 9437184
          )
          .test(
            "fileType",
            "Seuls les formats PNG, JPG et JPEG sont autorisés",
            (value: any) =>
              !value ||
              ["image/png", "image/jpg", "image/jpeg"].includes(value.type)
          );
      default:
        return Yup.mixed(); // Handle other cases as needed
    }
  }),
  fname: Yup.string().required("Le prénom est requis"),
  lname: Yup.string().required("Le nom de famille est requis"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Numéro de téléphone invalide")
    .required("Le numéro de téléphone est requis"),
  address: Yup.string().required("L'adresse est requise"),
  email: Yup.string().email().required("L'e-mail est requis"),

  country: Yup.object()
    .required("Le pays est requis")
    .typeError("Le pays est requis"),

  wilaya: Yup.object().when("country", {
    is: (e) => e?.label === "Algérie",
    then: (schema) => schema.required("La wilaya est requise"),
    otherwise: (schema) => schema.notRequired(),
  }),

  commune: Yup.object().when("country", {
    is: (e) => e?.label === "Algérie",
    then: (schema) => schema.required("La commune est requise"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // institution validation

  institution_type: Yup.object().when("type", {
    is: (e) => e === "institution",
    then: (schema) => schema.required("Le type d'institution est requis"),
    otherwise: (schema) => schema.notRequired(),
  }),

  institution_name: Yup.string().when("type", {
    is: (e) => e === "institution",
    then: (schema) => schema.required("Le nom de l'institution est requis"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // student validation
  university_id: Yup.number().when("type", {
    is: (e) => e === "student",
    then: (schema) =>
      schema
        .required("L'université est requise")
        .typeError("L'université est requise"),
    otherwise: (schema) => schema.notRequired(),
  }),

  foreign_university: Yup.string().when("university_id", {
    is: (university_id) => university_id === 0,
    then: (schema) =>
      schema
        .required("L'université étrangère est requise")
        .typeError("L'université étrangère est requise"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // corporate && independant validations
  occupation_id: Yup.object()
    .typeError("L'occupation est requise")
    .when("type", {
      is: (e) => e === "corporate" || e === "independant",
      then: (schema) =>
        schema
          .required("L'occupation est requise")
          .typeError("L'occupation est requise"),
      otherwise: (schema) => schema.notRequired(),
    }),

  activity_area_ids: Yup.array()
    .of(Yup.object())
    .typeError("Vous devez sélectionner au moins un centre d'intérêt")
    .min(1, "Vous devez sélectionner au moins un centre d'intérêt")
    .required("Vous devez sélectionner au moins un centre d'intérêt")
    .typeError("Vous devez sélectionner au moins un centre d'intérêt"),

  occupation: Yup.string().when("occupation_id", {
    is: (e) => e?.value === 0,
    then: (schema) => schema.required("Le nom de l'occupation est requis"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export { updateProfileSchema };
