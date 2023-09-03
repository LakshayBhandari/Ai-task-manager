'use client'
import { useBoardStore } from '@/store/BoardStore'
import React from 'react'


const types=[
    {
        id:"todo",
        name:"Todo",
        description:"A new task to be completed",
        color:"bg-red-500"
    },
    {
        id:"inprogress",
        name:"In Progress",
        description:"A task that is currently bring worked on",
        color:"bg-yellow-500"
    },
    {
        id:"done",
        name:"Done",
        description:"A task that has been completed",
        color:"bg-green-500"
    }
]

function TaskTypeRadioGroup() {

    const [setNewTaskType,newTaskType] = useBoardStore((state)=>[
        state.setNewTaskType,
        state.newTaskType,
    ]);
  return (
    <div>TaskTypeRadioGroup</div>
  )
}

export default TaskTypeRadioGroup