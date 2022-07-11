import { useContext } from 'react'
import { HierarchyContext } from '@/providers/HierarchyProvider'

const useHierarchy = () => {
  return useContext(HierarchyContext)
}

export default useHierarchy
