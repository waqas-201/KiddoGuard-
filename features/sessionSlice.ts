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
    requireReauth: boolean; // new flag

}

const initialState: SessionState = {
    currentUser: null,
    status: "unknown",
    requireReauth: false, // initially false


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

        requireReauth(state) {
            state.requireReauth = true; // mark that reauth is required
        },
        clearRequireReauth(state) {
            state.requireReauth = false; // called after successful FaceAuth
        },

    },
});

export const { setUser, resetSession, requireReauth, clearRequireReauth } = sessionSlice.actions;
export default sessionSlice.reducer;
