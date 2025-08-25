import { t } from "i18next";
import * as Yup from "yup";

const assignInvitationSchema = Yup.object().shape({
  type: Yup.string()
    .required(
      t(`invitation.validation.assignInvitation.assignInvitation.required`)
    )
    .typeError(
      t(`invitation.validation.assignInvitation.assignInvitation.typeError`)
    ),

  // when type is me only email is required
  email: Yup.string().when("type", {
    is: (e) => e === "me",
    then: (res) =>
      res
        .email(t(`invitation.validation.assignInvitation.email.me.email`))
        .min(3, t(`invitation.validation.assignInvitation.email.me.min`))
        .max(50, t(`invitation.validation.assignInvitation.email.me.max`))
        .required(
          t(`invitation.validation.assignInvitation.email.me.required`)
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // when type is other email, fname, lname are required
  delegated_email: Yup.string().when("type", {
    is: (e) => e === "other",
    then: (res) =>
      res
        .email(t(`invitation.validation.assignInvitation.email.other.email`))
        .min(3, t(`invitation.validation.assignInvitation.email.other.min`))
        .max(50, t(`invitation.validation.assignInvitation.email.other.max`))
        .required(
          t(`invitation.validation.assignInvitation.email.other.required`)
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  delegated_fname: Yup.string().when("type", {
    is: (e) => e === "other",
    then: (res) =>
      res
        .min(
          3,
          t(`invitation.validation.assignInvitation.delegated_fname.other.min`)
        )
        .required(
          t(
            `invitation.validation.assignInvitation.delegated_fname.other.required`
          )
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  delegated_lname: Yup.string().when("type", {
    is: (e) => e === "other",
    then: (res) =>
      res
        .min(
          3,
          t(
            `invitation.validation.assignInvitation.delegated_lname.other.required`
          )
        )
        .required(
          t(
            `invitation.validation.assignInvitation.delegated_lname.other.required`
          )
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const InvitSchema = Yup.object().shape({
  invitation_code: Yup.string()
    .required(t(`invitation.validation.invitCode.invitation_code.required`))
    .typeError(t(`invitation.validation.invitCode.invitation_code.typeError`))
    .max(12, t(`invitation.validation.invitCode.invitation_code.max`)),

  general_conditions: Yup.boolean()
    .required(t(`invitation.validation.invitCode.generalConditionError`))
    .oneOf([true], t(`invitation.validation.invitCode.generalConditionError`)),
});

export type assignInvitationSchemaType = Yup.InferType<typeof InvitSchema>;

export { assignInvitationSchema, InvitSchema };
