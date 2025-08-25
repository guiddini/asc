import * as Yup from "yup";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().required("Le mot de passe actuel est requis"),
  new_password: Yup.string()
    .required("Le nouveau mot de passe est requis")
    .min(8, "Le mot de passe doit avoir au moins 8 caractères"),
  password_confirmation: Yup.string()
    .oneOf(
      [Yup.ref("new_password"), null],
      "Les mots de passe ne correspondent pas"
    )
    .required("La confirmation du mot de passe est requise"),
});

export { resetPasswordSchema };
