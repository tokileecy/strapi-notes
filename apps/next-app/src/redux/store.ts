import { configureStore } from '@reduxjs/toolkit'
import tagReducer from './features/tags/tagSlice'
import postReducer from './features/posts/postSlice'
import globalReducer from './features/global/globalSlice'
import authSlice from './features/auth/authSlice'

const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: {
    auth: authSlice,
    global: globalReducer,
    tags: tagReducer,
    posts: postReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
