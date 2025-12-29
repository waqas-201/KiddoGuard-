import { configureStore } from '@reduxjs/toolkit'
import restrictionReducer from './features/restrictionSlice'
import sessionReducer from './features/sessionSlice'

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        restriction: restrictionReducer, // Add this line
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch