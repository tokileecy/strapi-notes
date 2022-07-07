import { configureStore } from '@reduxjs/toolkit'
import tagReducer from './features/tags/tagSlice'
import postReducer from './features/posts/postSlice'
import globalReducer from './features/global/globalSlice'

const store = configureStore({
  devTools: true,
  reducer: {
    global: globalReducer,
    tags: tagReducer,
    posts: postReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
