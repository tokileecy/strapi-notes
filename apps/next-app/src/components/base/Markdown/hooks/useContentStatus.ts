import { useReducer } from 'react'

export interface LineState {
  text: string
  inputText: string
  start: number
  end: number
}

export interface ContentStatus {
  actionHistory: string[]
  ids: string[]
  lineById: Record<string, LineState>
  selectedRange: {
    start: number
    end: number
  }
}

export const initialContentStatus: ContentStatus = {
  actionHistory: [],
  ids: [],
  lineById: {},
  selectedRange: {
    start: -1,
    end: -1,
  },
}

const useContentStatus = () => {
  return useReducer(
    (prev: ContentStatus, next: Partial<ContentStatus>) => {
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('contentStatus updeate:', next.actionHistory, next)
      // }

      return {
        ...prev,
        ...next,
        actionHistory: [] as string[],
      }
    },
    {
      ...initialContentStatus,
    }
  )
}

export default useContentStatus
