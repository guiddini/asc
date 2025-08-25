import { createSlice } from "@reduxjs/toolkit";

const usersNotInCompanySlice = createSlice({
  name: "usersNotInCompany",
  initialState: {
    users: [],
    currentPage: 0,
  },
  reducers: {
    nextPage: (state) => {
      state.currentPage = state.currentPage + 10;
    },

    prevPage: (state) => {
      if (state.currentPage > 10) {
        state.currentPage = state.currentPage - 10;
      }
    },

    resetCurrentPage: (state) => {
      return {
        ...state,
        currentPage: 0,
      };
    },

    initUsersNotInCompany: (state, action) => {
      state.users = action.payload; // Initialize users with payload
    },
    addUserNotInCompany: (state, action) => {
      const newUser = action.payload;
      state.users.push(newUser); // Add new user to the existing state
    },
    removeUserNotInCompany: (state, action) => {
      const userIdToRemove = action.payload;
      state.users = state.users.filter((user) => user.id !== userIdToRemove);
    },
    addOneUserNotInCompany: (state, action) => {
      const newUser = action.payload;
      state.users.push(newUser);
    },
  },
});

export const {
  initUsersNotInCompany,
  addUserNotInCompany,
  nextPage,
  prevPage,
  resetCurrentPage,
  removeUserNotInCompany,
  addOneUserNotInCompany,
} = usersNotInCompanySlice.actions;
export default usersNotInCompanySlice.reducer;
