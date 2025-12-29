import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 export interface RestrictionState {
    isTimeExhausted: boolean;
}

const initialState: RestrictionState = {
    isTimeExhausted: false,
};

const restrictionSlice = createSlice({
    name: "restriction",
    initialState,
    reducers: {
        // This is the only "lever" we need to pull
        setTimeExhausted: (state, action: PayloadAction<boolean>) => {
            state.isTimeExhausted = action.payload;
        },
    },
});

export const { setTimeExhausted } = restrictionSlice.actions;
export default restrictionSlice.reducer;