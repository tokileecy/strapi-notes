import { LineState } from '../../useMarkdown'

export interface FnProps {
  contentLineIds: string[]
  contentLineById: Record<string, LineState>
  selectedEndLineId: string
  lastSelectedLineIds: string[]
}
