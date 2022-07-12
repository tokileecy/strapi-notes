import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type State = {
  jwt?: string
}

export const initialState: State = {
  jwt: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<State>) => {
      state.jwt = action.payload.jwt
    },
  },
})

export const { setAuth } = authSlice.actions

export default authSlice.reducer
