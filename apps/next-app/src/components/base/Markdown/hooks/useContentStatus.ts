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
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('contentStatus updeate:', next.actionHistory, next)
      // }

      if (instanceOfActionFunc<ContentStatus>(value)) {
        return {
          ...prev,
          ...value(prev),
          actionHistory: [] as string[],
        }
      } else {
        return {
          ...prev,
          ...value,
          actionHistory: [] as string[],
        }
      }
    },
    null,
    () => {
      return {
        actionHistory: [],
        ids: [],
        lineById: {},
        selectedRange: {
          start: -1,
          end: -1,
        },
      }
    }
  )
}

export default useContentStatus
