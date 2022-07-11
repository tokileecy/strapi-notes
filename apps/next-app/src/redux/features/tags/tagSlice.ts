import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tag } from '@/types'

export type State = {
  ids: string[]
  itemById: Record<string, Tag>
}

export const initialState: State = {
  ids: [],
  itemById: {},
}

export const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<State>) => {
      state.ids = action.payload.ids
      state.itemById = action.payload.itemById
    },
  },
})

export const { setTags } = tagSlice.actions

export default tagSlice.reducer
