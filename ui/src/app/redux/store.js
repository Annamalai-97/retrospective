import { configureStore } from "@reduxjs/toolkit";
import multiStepReducer from "./multiStepSlice"; 

const store = configureStore({
  reducer: {
    multiStepModal: multiStepReducer, 
  },
});

export default store;
