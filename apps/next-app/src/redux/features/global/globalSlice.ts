import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type State = {
  selectedTags: Record<string, boolean>
  selectedCategory: string | undefined
}

export const initialState: State = {
  selectedTags: {},
  selectedCategory: undefined,
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
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    clearCategory: (state) => {
      state.selectedCategory = undefined
    },
  },
})

export const { addTags, removeTags, clearTags, setCategory, clearCategory } =
  globalSlice.actions

export default globalSlice.reducer
