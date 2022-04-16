import React from 'react'
import { filterXSS } from 'xss'
import MarkdownToJsx from 'markdown-to-jsx'

export type MarkdownProps = {
  children?: string
}

const Markdown = (props: MarkdownProps): JSX.Element => {
  const context = props.children?.replace('\\*', '&ast;') ?? ''

  return (
    <div>
      <MarkdownToJsx
        options={{
          namedCodesToUnicode: {
            ast: '\u002a',
          },
        }}
      >
        {filterXSS(context)}
      </MarkdownToJsx>
    </div>
  )
}

export default Markdown
