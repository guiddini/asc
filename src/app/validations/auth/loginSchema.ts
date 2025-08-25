import { t } from "i18next";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(t(`login.validation.email.email`))
    .min(3, t(`login.validation.email.min`))
    .max(50, t(`login.validation.email.max`))
    .required(t(`login.validation.email.required`)),
  password: Yup.string()
    .min(3, t(`login.validation.password.min`))
    .max(50, t(`login.validation.password.max`))
    .required(t(`login.validation.password.max`)),
});

export { loginSchema };
