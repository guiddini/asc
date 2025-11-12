import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
    },
    setCurrentUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.user = null;
    },
    setUserTicket: (state, action) => {
      if (state.user) {
        state.user.ticket_id = action.payload;
      }
    },
  },
});

// Selectors
export const selectUser = (state) => state.user.user;

// export const canEditCompany = (state) => {
//   const user = state.user.user;
//   if (!user || !user.companyStaffRole) return false;
//   return user?.companyStaffRole?.name === "company_editor";
// };

// export const canViewCompany = (state) => {
//   const user = state.user.user;
//   if (!user || !user.companyStaffRole) return false;
//   return (
//     user.companyStaffRole.name === "company_editor" ||
//     user.companyStaffRole.name === "company_staff"
//   );
// };

// export const companyOwner = (state) => {
//   const user = state.user.user;
//   if (!user || !user.company) return null;
//   return user.company.user_id === user?.id;
// };

export const canEditCompany = (state, companyId) => {
  const user = state?.user?.user;
  if (!user || !user.companyStaffRole) return false;
  if (user?.company?.id === companyId) {
    const role = user.companyStaffRole.name;
    return role === "company_editor";
  }
  return false;
};

export const canViewCompany = (state, companyId) => {
  const user = state.user.user;

  // Allow super admins to view any company
  if (user?.roleValues?.name === "super_admin") return true;

  // Deny access if user or role info is missing
  if (!user || !user.companyStaffRole) return false;

  // Grant access only if the user's company matches the current company page
  if (user?.company?.id === companyId) {
    const role = user.companyStaffRole.name;
    return role === "company_editor" || role === "company_staff";
  }

  // Deny access if no conditions match
  return false;
};

export const companyOwner = (state, companyId) => {
  const user = state.user.user;
  if (!user) return false;
  if (user?.company?.id === companyId) {
    return true;
  }
  return false;
};

export const { setCurrentUser, clearAuth, setAuth, setUserTicket } =
  userSlice.actions;

export default userSlice.reducer;
