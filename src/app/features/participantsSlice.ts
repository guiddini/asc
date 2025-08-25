import { createSlice } from "@reduxjs/toolkit";

const participantsSlice = createSlice({
  name: "participants",
  initialState: {
    participants: [],
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

    initparticipants: (state, action) => {
      state.participants = action.payload; // Initialize participants with payload
    },
    addparticipants: (state, action) => {
      const newparticipant = action.payload;
      state.participants.push(newparticipant); // Add new participants to the existing state
    },
    setFilteringResults: (state, action) => {
      state.filteringResults = action.payload; // Set the filtering results in the state
    },
  },
});

export const {
  initparticipants,
  addparticipants,
  nextPage,
  prevPage,
  resetCurrentPage,
  setFilteringResults,
} = participantsSlice.actions;
export default participantsSlice.reducer;
