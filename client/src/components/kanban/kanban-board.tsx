import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DroppableColumn } from './droppable-column';
import { TaskCard } from './draggable-task-card';
import { TaskFormAdvanced } from '../forms/task-form-advanced';
import { useTasks } from '@/hooks/use-tasks';
import { TaskWithDetails } from '@shared/schema';

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { tasks, updateTask } = useTasks();
  const [activeTask, setActiveTask] = useState<TaskWithDetails | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const columns = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'in-progress', title: 'Em Progresso' },
    { id: 'review', title: 'Em Revisão' },
    { id: 'done', title: 'Concluído' },
  ];

  const projectTasks = tasks?.filter(task => task.projectId === projectId) || [];

  const getTasksByStatus = (status: string) => {
    return projectTasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = projectTasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = projectTasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if we're dropping over a column
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      // Moving to a different column
      if (activeTask.status !== overColumn.id) {
        updateTask.mutate({
          id: activeTask.id as string,
          updates: { status: overColumn.id },
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = projectTasks.find(t => t.id === activeId);
    const overTask = projectTasks.find(t => t.id === overId);

    if (!activeTask) return;

    // If dropping over another task, we need to reorder
    if (overTask && activeTask.status === overTask.status) {
      const tasksInColumn = getTasksByStatus(activeTask.status);
      const activeIndex = tasksInColumn.findIndex(t => t.id === activeId);
      const overIndex = tasksInColumn.findIndex(t => t.id === overId);

      if (activeIndex !== overIndex) {
        const reorderedTasks = arrayMove(tasksInColumn, activeIndex, overIndex);
        
        // Update positions for all affected tasks
        reorderedTasks.forEach((task, index) => {
          updateTask.mutate({
            id: task.id,
            updates: { position: index },
          });
        });
      }
    }
  };

  const handleAddTask = (columnId: string) => {
    setSelectedColumn(columnId);
    setShowTaskForm(true);
  };

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onAddTask={() => handleAddTask(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {showTaskForm && (
        <TaskFormAdvanced
          projectId={projectId}
          onSuccess={() => setShowTaskForm(false)}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
}