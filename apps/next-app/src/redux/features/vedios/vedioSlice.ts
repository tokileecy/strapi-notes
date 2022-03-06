import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Vedio = {
  imgUrl: string
  userName: string
  name: string
  description: string
}

export type InitialState = {
  ids: string[]
  itemById: Record<string, Vedio>
}

export const initialState: InitialState = {
  ids: [],
  itemById: {},
}

export const vedioSlice = createSlice({
  name: 'vedios',
  initialState,
  reducers: {
    setVedios: (
      state,
      action: PayloadAction<{
        ids: string[]
        itemById: Record<string, Vedio>
      }>
    ) => {
      state.ids = action.payload.ids
      state.itemById = action.payload.itemById
    },
  },
})

export const { setVedios } = vedioSlice.actions

export default vedioSlice.reducer
