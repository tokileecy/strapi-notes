import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type State = {
  selectedTagSet: Record<string, boolean>
  selectedPath: string
  selectedByPath: Record<string, boolean>
}

export const initialState: State = {
  selectedTagSet: {},
  selectedPath: '',
  selectedByPath: {},
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
      delete state.selectedByPath[state.selectedPath]
      state.selectedPath = action.payload
      state.selectedByPath[action.payload] = true
    },
  },
})

export const { addTags, removeTags, clearTags, selectPath } =
  globalSlice.actions

export default globalSlice.reducer
