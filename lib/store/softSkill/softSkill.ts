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
      const existingIndex = state.selectedSkills.findIndex(
        //@ts-ignore
        (entry) => entry.skill.title === skill.title
      );

      if (existingIndex !== -1) {
        // Skill already exists, update the selectedScale
        state.selectedSkills[existingIndex].selectedScale = selectedScale;
      } else {
        // Skill doesn't exist, add a new entry
        state.selectedSkills.push({ skill, selectedScale });
      }
    },
  },
});

export const { addSelectedSkill } = softSkillsSlice.actions;

export default softSkillsSlice.reducer;
