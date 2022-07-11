import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Post = {
  'id': string
  'content'?: string
  'created_at': string
  'created_by_id': number
  'updated_by_id': number
  'locale': string
  'path': string
  'name': string
  'published_at': string
  'updated_at': string
  'tag_ids': string[]
}

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
