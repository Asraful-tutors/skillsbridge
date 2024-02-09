import { configureStore } from "@reduxjs/toolkit";

import hardSkillReducer from "./hardSkill/hardSkill";
import pathReducer from "./path/pathSlice";
import softSkillReducer from "./softSkill/softSkill";
import skillAssessmentSessionReducer from "./skillAssessmentSession/skillAssessmentSession";

export const makeStore = () => {
  return configureStore({
    reducer: {
      path: pathReducer,
      hardSkill: hardSkillReducer,
      softSkill: softSkillReducer,
      skillAssessmentSession: skillAssessmentSessionReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
