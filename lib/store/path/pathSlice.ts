import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LearningPath } from "@/lib/data/learning-paths";

interface PathState {
  selectedPath: LearningPath | null;
}

const inititalpathState: PathState = {
  selectedPath: null,
};

const pathSlice = createSlice({
  name: "path",
  initialState: inititalpathState,
  reducers: {
    setSelectedPath: (state, action: PayloadAction<LearningPath | null>) => {
      state.selectedPath = action.payload;
    },
  },
});

export const { setSelectedPath } = pathSlice.actions;
export default pathSlice.reducer;
