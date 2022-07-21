import Box from '@mui/material/Box'
import Markdown from '@/components/base/Markdown'
import useMarkdown from '@/components/base/Markdown/hooks/useMarkdown'
import { useEffect } from 'react'
import Layout from '@/components/Layout'

const EditorDemo = (): JSX.Element => {
  const markdown = useMarkdown()

  useEffect(() => {
    markdown.reset({
      content: ` # Editor Demo \n\n* 功能開發中\n* Markdown 語法轉換使用 **react-markdown** 轉換後顯示\n* 實現部分功能和選取的功能\n* 功能上不完整有許多 Bug 還需調整。
    
    `,
    })
  }, [])

  return (
    <Layout headerText="Toki Notes (Dev)">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexGrow: 1,
          flexBasis: 0,
          p: 2,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            flexGrow: 1,
            p: 2,
            m: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(15, 108, 176, 0.24)',
          }}
        >
          <Markdown type="both" markdownStatus={markdown} />
        </Box>
      </Box>
    </Layout>
  )
}

export default EditorDemo
