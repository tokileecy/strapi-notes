import { configureStore } from '@reduxjs/toolkit'
import vedioReducer from './features/vedios/vedioSlice'

const store = configureStore({
  devTools: true,
  reducer: {
    vedios: vedioReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
