import { LearningPath } from "@/lib/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
