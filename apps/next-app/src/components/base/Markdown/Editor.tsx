import React from 'react'

export type EditorProps = {
  textareaRefCallback?: (element: HTMLTextAreaElement) => void
}

const Editor = (props: EditorProps): JSX.Element => {
  const { textareaRefCallback } = props

  return (
    <textarea
      ref={textareaRefCallback}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        width: '100%',
        height: '100%',
        outline: 'none',
      }}
    ></textarea>
  )
}

export default Editor
