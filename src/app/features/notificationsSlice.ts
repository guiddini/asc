import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  currentPage: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    initNotification: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    loadMoreNotification: (state, action) => {
      const newPosts = action.payload;
      state.notifications = [...state.notifications, ...newPosts]; // Create a new array with new posts appended
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    markNotificationAsSeen: (state, action) => {
      const notification = state.notifications.find(
        (notification) => notification.id === action.payload
      );
      if (notification) {
        notification.seen = true;
      }
    },
    nextPage: (state) => {
      state.currentPage += 10;
    },
    prevPage: (state) => {
      if (state.currentPage > 10) {
        state.currentPage = state.currentPage - 10;
      }
    },
    resetCurrentPage: (state) => {
      state.currentPage = 0;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  nextPage,
  prevPage,
  resetCurrentPage,
  markNotificationAsSeen,
  initNotification,
  loadMoreNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
