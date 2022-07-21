import type { NextPage, GetServerSideProps } from 'next'
import EditorDemoPage from '@/components/pages/EditorDemoPage'
import HierarchyProvider from '@/providers/HierarchyProvider'

const EditorDemo: NextPage = () => {
  return (
    <HierarchyProvider>
      <EditorDemoPage />
    </HierarchyProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} }
}

export default EditorDemo
