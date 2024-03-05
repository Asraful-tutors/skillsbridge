import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { HardSkill } from "@/lib/data/hardSkills";

interface HardSkillsState {
  selectedSkills: { skill: HardSkill; selectedScale: number }[];
}

const initialState: HardSkillsState = {
  selectedSkills: [],
};

const hardSkillsSlice = createSlice({
  name: "hardSkills",
  initialState,
  reducers: {
    addSelectedSkill: (
      state,
      action: PayloadAction<{ skill: HardSkill; selectedScale: number }>
    ) => {
      const { skill, selectedScale } = action.payload;
      const existingIndex = state.selectedSkills.findIndex(
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

    removeSelectedSkill: (state, action: PayloadAction<HardSkill>) => {
      state.selectedSkills = state.selectedSkills.filter(
        (entry) => entry.skill !== action.payload
      );
    },
  },
});

export const { addSelectedSkill, removeSelectedSkill } =
  hardSkillsSlice.actions;

export default hardSkillsSlice.reducer;
