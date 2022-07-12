import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type State = {
  selectedTagSet: Record<string, boolean>
  selectedPath: string
  pathStatus: Record<
    string,
    {
      selected?: boolean
      isCreating?: boolean
    }
  >
}

export const initialState: State = {
  selectedTagSet: {},
  selectedPath: '/',
  pathStatus: {
    '/': {
      selected: true,
      isCreating: false,
    },
  },
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
      const prevSelectedPath = state.selectedPath

      state.selectedTagSet = {}
      state.selectedPath = action.payload

      if (!state.pathStatus[prevSelectedPath]) {
        state.pathStatus[prevSelectedPath] = {}
      }

      state.pathStatus[prevSelectedPath].selected = false
      state.pathStatus[prevSelectedPath].isCreating = false

      if (!state.pathStatus[action.payload]) {
        state.pathStatus[action.payload] = {}
      }

      state.pathStatus[action.payload].selected = true
    },
    creatingFile: (state) => {
      const path = state.selectedPath

      if (!state.pathStatus[path]) {
        state.pathStatus[path] = {}
      }

      state.pathStatus[path].isCreating = true
    },
    stopCreatingFile: (state) => {
      const path = state.selectedPath

      if (!state.pathStatus[path]) {
        state.pathStatus[path] = {}
      }

      state.pathStatus[path].isCreating = false
    },
  },
})

export const {
  addTags,
  removeTags,
  clearTags,
  selectPath,
  creatingFile,
  stopCreatingFile,
} = globalSlice.actions

export default globalSlice.reducer
