import { createSlice } from "@reduxjs/toolkit";

// createSlice allows us to perform "mutating" updates to an immutable state
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {
        setUsers: (state, action) => {
            state.data = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

// actions are created for each reducer case
export const { setUsers, setStatus, setError } = userSlice.actions

export default userSlice.reducer