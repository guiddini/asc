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

// Add KYC management role group: admins + kyc_manager
export const kycManagementRoles = [...adminRoles, "kyc_manager"];

// accommodation_manager
export const accommodationManagementRoles = [
  ...adminRoles,
  "accommodation_manager",
];

// statistics_manager
export const statisticsManagementRoles = [...adminRoles, "statistics_manager"];

// investor
export const investorRoles = [...adminRoles, "investor"];

// Update staff roles to include KYC management
export const staffRoles = [
  ...new Set([
    ...adminRoles,
    ...mediaRoles,
    ...exhibitionRoles,
    ...programRoles,
    ...dealroomRoles,
    ...kycManagementRoles,
    ...accommodationManagementRoles,
    ...statisticsManagementRoles,
  ]),
];
