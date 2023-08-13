import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '../features/blog/blogSlice';
import userReducer from '../features/user/userSlice';

export default configureStore({
    reducer: {
        blog: blogReducer,
        user: userReducer
    },
    middleware: getDefaultMiddleware =>
                    getDefaultMiddleware({
                    serializableCheck: false,
                    }),
})