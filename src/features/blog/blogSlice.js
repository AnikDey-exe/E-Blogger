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
        addBlog: (state, action) => {
            state.data = [...state.data, {
                _id: action.payload._id,
                author: action.payload.author,
                blogId: action.payload.blogId,
                content: action.payload.content,
                date: action.payload.date,
                hashtagCategory: action.payload.hashtagCategory,
                likedBy: action.payload.likedBy,
                status: action.payload.status,
                thumbnail: action.payload.thumbnail,
                title: action.payload.title
            }]
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        updateEditedBlog: (state, action) => {
            state.data = [...state.data.map((item, i)=>{
                return item.blogId === action.payload.id ? 
                    {_id: item.id, author: item.author, blogId: item.blogId, content: action.payload.content, date: action.payload.date, hashtagCategory: action.payload.hashtagCategory, likedBy: item.likedBy, status: action.payload.status, thumbnail: action.payload.thumbnail, title: action.payload.title} 
                    : item
            })]
        },
        updateLikedBlog: (state, action) => {
            state.data = [...state.data.map((item, i)=>{
                return item.blogId === action.payload.id ? 
                    {_id: item.id, author: item.author, blogId: item.blogId, content: item.content, date: item.date, hashtagCategory: item.hashtagCategory, likedBy: [...item.likedBy, action.payload.email], status: item.status, thumbnail: item.thumbnail, title: item.title} 
                    : item
            })]
            // let idx = state.data.findIndex((item) => item.blogId === action.payload.id);
            // state.data[idx].likedBy = [...state.data[idx].likedBy, action.payload.email];
        },
        updateUnlikedBlog: (state, action) => {
            state.data = [...state.data.map((item, i)=>{
                return item.blogId === action.payload.id ? 
                    {_id: item.id, author: item.author, blogId: item.blogId, content: item.content, date: item.date, hashtagCategory: item.hashtagCategory, likedBy: [...item.likedBy.filter((item, i) => item !== action.payload.email)], status: item.status, thumbnail: item.thumbnail, title: item.title} 
                    : item
            })]
            // let idx = state.data.findIndex((item) => item.blogId === action.payload.id);
            // state.data[idx].likedBy = [...state.data[idx].likedBy, action.payload.email];
        }
    }
})

// actions are created for each reducer case
export const { setBlogs, addBlog, setStatus, setError, updateEditedBlog, updateLikedBlog, updateUnlikedBlog } = blogSlice.actions

export default blogSlice.reducer