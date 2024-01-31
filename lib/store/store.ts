import { configureStore } from "@reduxjs/toolkit";
import pathReducer from "./path/pathSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      path: pathReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
