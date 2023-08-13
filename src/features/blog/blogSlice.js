import { createSlice } from "@reduxjs/toolkit";

// createSlice allows us to perform "mutating" updates to an immutable state
export const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {
        setBlogs: (state, action) => {
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
export const { setBlogs, setStatus, setError } = blogSlice.actions

export default blogSlice.reducer