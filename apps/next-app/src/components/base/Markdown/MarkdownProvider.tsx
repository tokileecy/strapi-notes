import { createContext, ReactNode } from 'react'
import { initialContentStatus } from './hooks/useContentStatus'
import { MarkdownStatus } from './hooks/useMarkdown'

export type MarkdownContextValue = MarkdownStatus

const defaultMarkdownContextValue: MarkdownContextValue = {
  contentStatus: { ...initialContentStatus },
  markdownContentDetails: [],
  textareaRefCallback: () => null,
  lineContainerRefCallback: () => null,
  reset: () => null,
  commend: () => null,
}

export const MarkdownContext = createContext<MarkdownContextValue>(
  defaultMarkdownContextValue
)

const MarkdownProvider = (props: {
  children: ReactNode
  value: MarkdownStatus
}) => {
  const { children, value } = props

  return (
    <MarkdownContext.Provider value={value}>
      {children}
    </MarkdownContext.Provider>
  )
}

export default MarkdownProvider
