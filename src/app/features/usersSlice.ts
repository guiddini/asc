import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    filteringResults: [],
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

    initUsers: (state, action) => {
      state.users = action.payload; // Initialize users with payload
    },
    addUser: (state, action) => {
      const newUser = action.payload;
      state.users.push(newUser); // Add new user to the existing state
    },
    setFilteringResults: (state, action) => {
      state.filteringResults = action.payload; // Set the filtering results in the state
    },
  },
});

export const {
  initUsers,
  addUser,
  nextPage,
  prevPage,
  resetCurrentPage,
  setFilteringResults,
} = usersSlice.actions;

export default usersSlice.reducer;
