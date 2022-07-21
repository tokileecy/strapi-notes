import Box from '@mui/material/Box'
import { Divider } from '@mui/material'
import BoldSvg from './images/bold.svg'
import ItalicSvg from './images/italic.svg'
import StrikeSvg from './images/strike.svg'
import HeaderSvg from './images/header.svg'
import CodeSvg from './images/code.svg'
import HTMLSvg from './images/html.svg'
import QuoteSvg from './images/quote.svg'
import ListBulletSvg from './images/list-bullet.svg'
import ListNumberSvg from './images/list-number.svg'
import CheckboxSvg from './images/checkbox.svg'
import HorizonSvg from './images/horizon.svg'
import ToolbarIconButton from './ToolbarIconButton'
import { EditorCommendEvent } from './hooks/useCommendHandler'

export interface ToolbarProps {
  commend?: (event: EditorCommendEvent) => void
}

const Toolbar = (props: ToolbarProps) => {
  const { commend } = props

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        border: '1px solid white',
        p: 1,
      }}
      data-type="tool-bar"
    >
      <ToolbarIconButton
        component={BoldSvg}
        onClick={() => {
          commend?.('bold')
        }}
      />
      <ToolbarIconButton
        component={ItalicSvg}
        onClick={() => {
          commend?.('italic')
        }}
      />
      <ToolbarIconButton
        component={StrikeSvg}
        onClick={() => {
          commend?.('strike')
        }}
      />

      <ToolbarIconButton
        component={HeaderSvg}
        onClick={() => {
          commend?.('header')
        }}
      />
      <ToolbarIconButton
        component={QuoteSvg}
        onClick={() => {
          commend?.('quote')
        }}
      />
      <ToolbarIconButton
        component={ListBulletSvg}
        onClick={() => {
          commend?.('list-bullet')
        }}
      />
      <ToolbarIconButton
        component={ListNumberSvg}
        onClick={() => {
          commend?.('list-number')
        }}
      />
      <ToolbarIconButton
        component={CodeSvg}
        onClick={() => {
          commend?.('code')
        }}
      />
      <ToolbarIconButton
        component={HorizonSvg}
        onClick={() => {
          commend?.('horizon')
        }}
      />
      <ToolbarIconButton
        component={CheckboxSvg}
        onClick={() => {
          commend?.('checkbox')
        }}
      />
      <Divider sx={{ borderColor: 'white' }} orientation="vertical" flexItem />
      <ToolbarIconButton
        component={HTMLSvg}
        onClick={() => {
          commend?.('html')
        }}
      />
    </Box>
  )
}

export default Toolbar
