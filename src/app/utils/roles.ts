export const adminRoles = ["admin", "super_admin"];
export const mediaRoles = [...adminRoles, "media", "press", "journalist"];

export const exhibitionManagerRoles = [...adminRoles, "exhibition_manager"];
export const exhibitionFinanceOfficerRoles = [
  ...adminRoles,
  "exhibition_finance_officer",
];
export const exhibitionRoles = [
  ...new Set([...exhibitionManagerRoles, ...exhibitionFinanceOfficerRoles]),
];

export const programRoles = [...adminRoles, "program_coordinator"];
export const dealroomRoles = [...adminRoles, "dealroom_manager"];

export const staffRoles = [
  ...new Set([
    ...adminRoles,
    ...mediaRoles,
    ...exhibitionRoles,
    ...programRoles,
    ...dealroomRoles,
  ]),
];
