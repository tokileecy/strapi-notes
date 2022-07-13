import React from 'react'

export type EditorProps = {
  divRefCallback?: (element: HTMLDivElement) => void
}

const Editor = (props: EditorProps): JSX.Element => {
  const { divRefCallback } = props

  return (
    <div
      ref={divRefCallback}
      role="textbox"
      contentEditable="true"
      aria-multiline="true"
      aria-labelledby="txtboxMultilineLabel"
      aria-required="true"
      spellCheck="false"
      style={{
        outline: 'none',
      }}
    ></div>
  )
}

export default Editor
