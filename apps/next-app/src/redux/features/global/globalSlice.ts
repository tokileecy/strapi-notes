import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type State = {
  selectedTags: Record<string, boolean>
}

export const initialState: State = {
  selectedTags: {},
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    addTags: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((tag) => {
        state.selectedTags[tag] = true
      })
    },
    removeTags: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((tag) => {
        if (state.selectedTags[tag]) {
          delete state.selectedTags[tag]
        }
      })
    },
    clearTags: (state) => {
      state.selectedTags = {}
    },
  },
})

export const { addTags, removeTags, clearTags } = globalSlice.actions

export default globalSlice.reducer
