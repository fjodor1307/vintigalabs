import { useRef, useState } from 'react'

// Tiny HTML5 drag-and-drop helper for reorderable rows.
// Usage:
//   const drag = useRowDrag({ onReorder: (from, to) => productActions.reorderVariant(from, to) })
//   ...then spread drag.rowProps(index) on the row element and drag.handleProps(index) on the grip.

export function useRowDrag({ onReorder }: { onReorder: (from: number, to: number) => void }) {
  const fromIndex = useRef<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  function handleProps(index: number) {
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        fromIndex.current = index
        setDragging(true)
        e.dataTransfer.effectAllowed = 'move'
        // some browsers need a payload to start the drag
        try { e.dataTransfer.setData('text/plain', String(index)) } catch { /* noop */ }
      },
      onDragEnd: () => {
        fromIndex.current = null
        setOverIndex(null)
        setDragging(false)
      },
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
    }
  }

  function rowProps(index: number) {
    return {
      onDragOver: (e: React.DragEvent) => {
        if (fromIndex.current === null) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (overIndex !== index) setOverIndex(index)
      },
      onDragLeave: () => {
        if (overIndex === index) setOverIndex(null)
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        const from = fromIndex.current
        if (from === null || from === index) return
        onReorder(from, index)
        fromIndex.current = null
        setOverIndex(null)
        setDragging(false)
      },
    }
  }

  return { handleProps, rowProps, overIndex, dragging }
}
