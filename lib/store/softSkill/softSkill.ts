import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SoftSkills } from "@/lib/data/softSkills";

interface SoftSkillsState {
  selectedSkills: { skill: SoftSkills; selectedScale: number }[];
}

const initialState: SoftSkillsState = {
  selectedSkills: [],
};

const softSkillsSlice = createSlice({
  name: "softSkills",
  initialState,
  reducers: {
    addSelectedSkill: (
      state,
      action: PayloadAction<{ skill: SoftSkills; selectedScale: number }>
    ) => {
      const { skill, selectedScale } = action.payload;
      state.selectedSkills.push({
        skill,
        selectedScale,
      });
    },
  },
});

export const { addSelectedSkill } = softSkillsSlice.actions;

export default softSkillsSlice.reducer;
