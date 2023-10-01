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
        },
        updateFollowUser: (state, action) => {
            state.data = [...state.data.map((item, i) => {
                return item._id === action.payload.id ?
                    { _id: item._id, accountVisibility: item.accountVisibility, bio: item.bio, dateOption: item.dateOption, email: item.email, followers: [...item.followers, action.payload.email], handle: item.handle, profilePicture: item.profilePicture }
                    : item
            })]
        },
        updateUnfollowUser: (state, action) => {
            state.data = [...state.data.map((item, i) => {
                return item._id === action.payload.id ?
                    { _id: item._id, accountVisibility: item.accountVisibility, bio: item.bio, dateOption: item.dateOption, email: item.email, followers: [...item.followers.filter((item, i) => item !== action.payload.email)], handle: item.handle, profilePicture: item.profilePicture }
                    : item
            })]
        },
        updateUserProfilePicture: (state, action) => {
            state.data = [...state.data.map((item, i) => {
                return item._id === action.payload.id ?
                    { _id: item._id, accountVisibility: item.accountVisibility, bio: item.bio, dateOption: item.dateOption, email: item.email, followers: item.followers, handle: item.handle, profilePicture: action.payload.profilePicture }
                    : item
            })]
        },
        updateUser: (state, action) => {
            state.data = [...state.data.map((item, i) => {
                return item._id === action.payload.id ?
                    { _id: item._id, accountVisibility: item.accountVisibility, bio: action.payload.bio, dateOption: item.dateOption, email: item.email, followers: item.followers, handle: action.payload.handle, profilePicture: item.profilePicture }
                    : item
            })]
        },
        updateUserDateOption: (state, action) => {
            state.data = [...state.data.map((item, i) => {
                return item._id === action.payload.id ?
                    { _id: item._id, accountVisibility: item.accountVisibility, bio: item.bio, dateOption: action.payload.dateOption, email: item.email, followers: item.followers, handle: item.handle, profilePicture: item.profilePicture }
                    : item
            })]
        },
        updateUserAccountVisibility: (state, action) => {
            state.data = [...state.data.map((item, i) => {
                return item._id === action.payload.id ?
                    { _id: item._id, accountVisibility: action.payload.accountVisibility, bio: item.bio, dateOption: item.dateOption, email: item.email, followers: item.followers, handle: item.handle, profilePicture: item.profilePicture }
                    : item
            })]
        }
    }
})

// actions are created for each reducer case
export const { setUsers, setStatus, setError, updateFollowUser, updateUnfollowUser, updateUserProfilePicture, updateUser, updateUserDateOption, updateUserAccountVisibility } = userSlice.actions

export default userSlice.reducer