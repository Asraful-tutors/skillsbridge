import { configureStore } from "@reduxjs/toolkit";

import hardSkillReducer from "./hardSkill/hardSkill";
import pathReducer from "./path/pathSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      path: pathReducer,
      hardSkill: hardSkillReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
