import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Post = {
  'id': number
  'content': string
  'created_at': string
  'created_by_id': number
  'updated_by_id': number
  'locale': string
  'name': string
  'published_at': string
  'updated_at': string
  'tag_ids': number[]
}

export type State = {
  ids: number[]
  itemById: Record<number, Post>
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
