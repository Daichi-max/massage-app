'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Appointment } from '@/types/appointment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';
import { SortableAppointmentItem } from './SortableAppointmentItem';

interface DraggableAppointmentListProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  patients: Patient[];
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onReorder: (appointments: Appointment[]) => void;
}

export const DraggableAppointmentList = ({
  appointments,
  practitioners,
  patients,
  onEdit,
  onCancel,
  onReorder,
}: DraggableAppointmentListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = appointments.findIndex((appointment) => appointment.id === active.id);
      const newIndex = appointments.findIndex((appointment) => appointment.id === over.id);

      const newAppointments = arrayMove(appointments, oldIndex, newIndex);
      onReorder(newAppointments);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={appointments.map((appointment) => appointment.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {appointments.map((appointment) => (
            <SortableAppointmentItem
              key={appointment.id}
              appointment={appointment}
              practitioners={practitioners}
              patients={patients}
              onEdit={onEdit}
              onCancel={onCancel}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}; 