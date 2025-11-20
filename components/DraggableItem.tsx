'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface DraggableItemProps {
  id: string;
  children: ReactNode;
  isDraggingEnabled: boolean;
}

export default function DraggableItem({ id, children, isDraggingEnabled }: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isDraggingEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!isDraggingEnabled) {
    return <div>{children}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-l-lg z-0"
        title="Drag to reorder"
      >
        <div className="text-gray-400 text-xl">⋮⋮</div>
      </div>
      
      {/* Content with left padding for drag handle */}
      <div className={isDraggingEnabled ? 'pl-8' : ''}>
        {children}
      </div>
    </div>
  );
}
