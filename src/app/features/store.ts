import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import participantsReducer from "./participantsSlice";
import postsReducer from "./postsSlice";
import notificationsReducer from "./notificationsSlice";
import usersReducer from "./usersSlice";
import usersNotInCompanyReducer from "./usersNotInCompanySlice";
import jobsReducer from "./jobsSlice";

const reducers = combineReducers({
  user: userReducer,
  participants: participantsReducer,
  posts: postsReducer,
  notifications: notificationsReducer,
  users: usersReducer,
  jobs: jobsReducer,
  usersNotInCompany: usersNotInCompanyReducer,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
