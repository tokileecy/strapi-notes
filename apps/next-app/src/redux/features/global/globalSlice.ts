import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type State = {
  selectedTagSet: Record<string, boolean>
  selectedPath: string
}

export const initialState: State = {
  selectedTagSet: {},
  selectedPath: '',
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    addTags: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((tag) => {
        state.selectedTagSet[tag] = true
      })
    },
    removeTags: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((tag) => {
        if (state.selectedTagSet[tag]) {
          delete state.selectedTagSet[tag]
        }
      })
    },
    clearTags: (state) => {
      state.selectedTagSet = {}
    },
    selectPath: (state, action: PayloadAction<string>) => {
      state.selectedPath = action.payload
    },
  },
})

export const { addTags, removeTags, clearTags, selectPath } =
  globalSlice.actions

export default globalSlice.reducer
