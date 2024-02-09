import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface skillAssessmentSessionState {
  currentStep: number;
  currentSkillType: "hard" | "soft";
  questions: any[];
  answers: any[];
}

const initialState: skillAssessmentSessionState = {
  currentStep: 0,
  currentSkillType: "hard",
  questions: [],
  answers: [],
};

const skillAssessmentSessionState = createSlice({
  name: "skillAssessmentSession",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<any[]>) => {
      state.questions = action.payload || [];
    },
    setAnswers: (state, action: PayloadAction<any[]>) => {
      state.answers = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setCurrentSkillType: (state, action: PayloadAction<"hard" | "soft">) => {
      state.currentSkillType = action.payload;
    },
    addSelectedAnswer: (
      state,
      action: PayloadAction<{ question: string; answer: any }>
    ) => {
      state.answers.push(action.payload);
    },
  },
});

export const {
  setQuestions,
  setAnswers,
  setCurrentSkillType,
  setCurrentStep,
  addSelectedAnswer,
} = skillAssessmentSessionState.actions;

export default skillAssessmentSessionState.reducer;
