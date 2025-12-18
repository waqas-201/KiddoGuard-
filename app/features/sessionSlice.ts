// store/sessionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "parent" | "child";

export interface SessionUser {
    id: number;
    role: UserRole;
    name: string;
    age?: number;           // only for children
    timeLimit?: number;     // only for children
    parentId?: number;      // only for children
}

export interface SessionState {
    currentUser: SessionUser | null;
    status: "unknown" | "unauthenticated" | "authenticated";
}

const initialState: SessionState = {
    currentUser: null,
    status: "unknown",
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<SessionUser>) {
            state.currentUser = action.payload;
            state.status = "authenticated";
        },
        resetSession(state) {
            state.currentUser = null;
            state.status = "unauthenticated";
        },
    },
});

export const { setUser, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
