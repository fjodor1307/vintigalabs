import { Tag } from '@ds/shared/Tag'

interface TagPickerProps {
  tags: readonly string[]
  selected: string[]
  onToggle: (tag: string) => void
}

export function TagPicker({ tags, selected, onToggle }: TagPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag}
          pressed={selected.includes(tag)}
          onToggle={() => onToggle(tag)}
        >
          {tag}
        </Tag>
      ))}
    </div>
  )
}
