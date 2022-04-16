import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Category = {
  id: string
  attributes: {
    name: string
  }
}

export type State = {
  ids: string[]
  itemById: Record<string, Category>
}

export const initialState: State = {
  ids: [],
  itemById: {},
}

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<State>) => {
      state.ids = action.payload.ids
      state.itemById = action.payload.itemById
    },
  },
})

export const { setCategories } = categorySlice.actions

export default categorySlice.reducer
