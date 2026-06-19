'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface SortableItemProps {
  id: string;
  text: string;
  onRemove: () => void;
}

export function SortableItem({ id, text, onRemove }: SortableItemProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } =
    useSortable({ id });

  const style =
    {
      transform: CSS.Transform.toString(transform),
      transition
    };

  return (

    <div
    ref={setNodeRef}
    style={style}
    className="
    flex
    items-center
    justify-between
    bg-[#11111a]
    border
    border-white/10
    rounded-md
    p-2
    text-white/80
    text-sm
    "
    >

      <div
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
      >
        ☰
      </div>

      <span className="flex-1 ml-3">
        {text}
      </span>

      <button
      onClick={onRemove}
      className="
      text-rose-400
      text-xs
      ml-3
      "
      >
        ✕
      </button>

    </div>

  );
}
