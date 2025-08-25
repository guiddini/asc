import { createSlice } from "@reduxjs/toolkit";
import { JobOffer } from "../types/company";

interface JobsState {
  jobs: JobOffer[];
}

const initialState: JobsState = {
  jobs: [],
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    initJobs: (state, action) => {
      state.jobs = action.payload; // Initialize jobs with payload
    },
    addJob: (state, action) => {
      const newJob = action.payload;
      state.jobs.push(newJob); // Add new job to the existing state
    },
    updateJob: (state, action) => {
      const updatedJob = action.payload;
      const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
      if (index !== -1) {
        state.jobs[index] = updatedJob; // Update the job if found
      }
    },
  },
});

export const { initJobs, addJob, updateJob } = jobsSlice.actions;
export default jobsSlice.reducer;
