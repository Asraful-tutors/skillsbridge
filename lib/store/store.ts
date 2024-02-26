import { configureStore } from "@reduxjs/toolkit";

import hardSkillReducer from "./hardSkill/hardSkill";
import pathReducer from "./path/pathSlice";
import softSkillReducer from "./softSkill/softSkill";
import skillAssessmentSessionReducer from "./skillAssessmentSession/skillAssessmentSession";
import userReducer from "./user/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      path: pathReducer,
      hardSkill: hardSkillReducer,
      softSkill: softSkillReducer,
      skillAssessmentSession: skillAssessmentSessionReducer,
      user: userReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
