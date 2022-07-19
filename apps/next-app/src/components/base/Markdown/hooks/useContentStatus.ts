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
    location: 'up' | 'down'
  }
}

export const initialContentStatus: ContentStatus = {
  actionHistory: [],
  ids: [],
  lineById: {},
  selectedRange: {
    start: -1,
    end: -1,
    location: 'up',
  },
}

const instanceOfActionFunc = <T>(object: any): object is (prev: T) => T => {
  if (typeof object === 'function') {
    return true
  }

  return false
}

export type SetContentStatusAction =
  | Partial<ContentStatus>
  | ((S: ContentStatus) => Partial<ContentStatus>)

const useContentStatus = () => {
  return useReducer(
    (prev: ContentStatus, value: SetContentStatusAction) => {
      let next

      if (instanceOfActionFunc<ContentStatus>(value)) {
        next = value(prev)
      } else {
        next = value
      }

      // if (process.env.NODE_ENV === 'development') {
      //   console.log('contentStatus updeate:', next, value)
      // }

      return {
        ...prev,
        ...next,
        actionHistory: [] as string[],
      }
    },
    {
      actionHistory: [],
      ids: [],
      lineById: {},
      selectedRange: {
        start: -1,
        end: -1,
        location: 'up',
      },
    }
  )
}

export default useContentStatus
