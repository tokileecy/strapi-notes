import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Post } from '@/types'

export type State = {
  ids: string[]
  itemById: Record<string, Post>
}

export const initialState: State = {
  ids: [],
  itemById: {},
}

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<State>) => {
      state.ids = action.payload.ids
      state.itemById = action.payload.itemById
    },
  },
})

export const { setPosts } = postSlice.actions

export default postSlice.reducer
