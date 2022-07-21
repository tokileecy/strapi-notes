import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type State = {
  jwt?: string
  isAuth: boolean
}

export const initialState: State = {
  jwt: undefined,
  isAuth: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ jwt: string }>) => {
      state.jwt = action.payload.jwt
      state.isAuth = true
    },
    logout: (state) => {
      state.jwt = undefined
      state.isAuth = false
    },
  },
})

export const { setAuth, logout } = authSlice.actions

export default authSlice.reducer
