import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const useSelectedTags = () => {
  const allTags = useSelector((state: RootState) => state.tags)

  const selectedTagSet = useSelector(
    (state: RootState) => state.global.selectedTagSet
  )

  const selectedTagIds = useMemo(
    () => [...Object.keys(selectedTagSet)],
    [selectedTagSet]
  )

  const selectedTags = useMemo(() => {
    const targetSelectTags = selectedTagIds.map((id) => allTags.itemById[id])

    if (targetSelectTags.length === 0) {
      return allTags.ids.map((id) => allTags.itemById[id])
    } else {
      return targetSelectTags
    }
  }, [selectedTagIds, allTags])

  return {
    ids: selectedTagIds,
    tags: selectedTags,
  }
}

export default useSelectedTags
